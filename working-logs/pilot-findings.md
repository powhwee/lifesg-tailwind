# Pilot findings — running log

A live record of things we learn during the pilot. New findings get appended.

## 2026-05-10 — Visual parity is provable, not guessable

### What happened

Building the Button comparison, the screenshot suggested ours was "a little smaller" than LifeSG even after sizing/padding/font tweaks. We were going by eye. Wrong tool.

Used Playwright's `getComputedStyle` + `boundingBox()` (see `scripts/measure.mjs`) to read both sides programmatically. Result for all six Button variants:

| Variant     | Ours        | LifeSG      |
| ----------- | ----------- | ----------- |
| Primary     | 102.9 × 48  | 102.9 × 48  |
| Secondary   | 124.7 × 48  | 124.7 × 48  |
| Ghost       | 85.4 × 48   | 85.4 × 48   |
| Link        | 70.5 × 48   | 70.5 × 48   |
| Destructive | 133.7 × 48  | 133.7 × 48  |
| Disabled    | 109.2 × 48  | 109.2 × 48  |

Pixel-identical bounding boxes. Same `font-size` (18px), `font-weight` (600), `font-family` (Open Sans). Only computed-style differences were:

- **line-height**: ours 28px (Tailwind's `text-lg` default), LifeSG's 26px (`1.625rem`).
- **font-family fallback chain**: next/font appends `"Open Sans Fallback"` for FOIT prevention; LifeSG just declares `"Open Sans"`. Identical once the font loads.

Fixed the line-height with `leading-[1.625rem]` on the base classes.

### Why this matters for the pilot

1. **Stop arguing about pixels by eye.** The pilot's whole premise is that we can answer "can shadcn match LifeSG?" with evidence, not opinion. `scripts/measure.mjs` is the evidence machine — keep using it for every component.
2. **The "feels smaller" perception was real but misleading.** A 2px line-height difference shifts the text baseline, which changes how the button reads visually even though dimensions are identical. Worth knowing for design conversations later.
3. **Visual parity is achievable to the pixel.** This is a useful proof point for the engineer: with the right tokens and ~20 lines of CVA tweaks, shadcn can render identically to LifeSG. The interesting question for the rest of the pilot is no longer "can it match" but "what's the cost when LifeSG does something behavioral that Radix/Base UI doesn't?"

### Reusable artifacts left behind

- `scripts/measure.mjs` — point at any `/compare/[component]` route, prints a table of dimensions + computed styles for every named element on both sides. Extend the `cases` array for new components.
- `disabled:bg-[var(--lifesg-bg-disabled)]` pattern — when shadcn's "fade the variant" convention diverges from the design system's "always-grey-when-disabled" convention, override explicitly via the LifeSG semantic token. Keeps the source of truth in `lifesg-tokens.css`.

### Things still to verify

- This was Button — the simplest possible component. The next ones (Dialog, DatePicker) will surface real behavioral divergences (focus management, keyboard nav, escape handling). Pixel parity is a necessary but not sufficient signal.
- Open Sans is a peer-loaded font when using LifeSG-as-dep; LifeSG components don't bundle it. If we'd gone the LifeSG-as-dep path, we'd have had to remember to load it ourselves anyway. Calling that out so it doesn't come up later as a surprise.

## 2026-05-11 — Adopt Layer-3 component tokens

### Question

Mirroring LifeSG's Storybook taxonomy (Foundations → Core → Content → Navigation) forced a token-architecture decision. LifeSG's Foundations include three layers:

- **L1** — primitives (`--lifesg-brand-50: #BF3431`)
- **L2** — semantic (`--lifesg-bg-primary`, `--lifesg-text-disabled`)
- **L3** — per-component (`--button-bg-default`, `--button-ring-focus`)

shadcn convention ships only L1 + L2; components reference `bg-primary` directly via Tailwind's theme mapping. Do we add L3?

### What we did to evaluate

Built a parallel L3 Button (`button-l3.tsx` + `button-tokens.css`) alongside the existing L2 Button. Verified:

- **Visual parity**: `getComputedStyle` + bounding boxes — pixel-identical to L2 and to LifeSG across all six variants.
- **Consumer-side cost**: rendered both implementations behind the same JSX at `/consumer-demo`. Differ by a single character in the import path; every other line is identical.

### Findings

|                          | L2 (was current)              | L3 (now canonical)            |
| ------------------------ | ----------------------------- | ----------------------------- |
| `button.tsx` line count  | 55                            | 55                            |
| `cva` variants block     | 1152 chars                    | 1676 chars (+45%)             |
| Per-component CSS file   | —                             | `button-tokens.css`, ~25 tokens |
| Visual output            | Identical                     | Identical                     |
| Consumer JSX             | `<Button variant="secondary">Cancel</Button>` | Identical |

**The L3 cost is entirely paid by the design-system maintainer.** Feature engineers writing pages never see it.

### Decision

**Adopt Layer 3 as the default for design-system components**, effective immediately. `button.tsx` is now L3; `button-l3.tsx` removed.

Reasoning:

1. We're in a **brand-development phase** — LifeSG is a placeholder while UX tweaks toward the agency's identity. A re-theme without code changes is highly likely in the next few months. L3 lets a designer hand us a token file; we paste it in.
2. LifeSG's "Component tokens" Foundations entry maps 1:1 to our `<component>-tokens.css` files. Engineers coming from LifeSG's docs find the same mental model.
3. The cost is concentrated on the ~30 DS components (~1 maintainer's surface area). The benefit — theming optionality — accrues to everyone.

### Convention

- Each design-system component has a sibling `src/app/<component>-tokens.css` declaring its Layer-3 tokens. (May consolidate into one file at 5+ components — TBD.)
- Class strings reference **only Layer-3 tokens** for visual properties: `bg`, `text`, `border`, `ring`, `outline`. Layout/sizing utilities (`h-12`, `gap-2`) stay as ordinary Tailwind.
- Tailwind alpha shorthand (`bg-primary/10`) does not work on arbitrary CSS vars. For hover/focus variants either:
  - precompute with `color-mix(in srgb, var(--*) X%, transparent)` in the token file, **or**
  - reach for a LifeSG semantic that already encodes the alpha (`--lifesg-bg-primary-hover`).
- Apply L3 **from the start** when implementing a new component. Don't retrofit existing components on a cadence — wait until you'd otherwise be editing them.

### When to revisit

Trigger: agency brand stabilizes (palette + type locked). Re-evaluate then — if the L3 indirection hasn't been exercised, consider collapsing L3 → L2 to reduce maintenance surface. Until then, the optionality earns its keep.

### Artifacts

- `src/components/ui/button.tsx` — L3-first canonical Button.
- `src/app/button-tokens.css` — Layer-3 token file. New `<component>-tokens.css` files follow this shape.

---

## 2026-05-10 — Hot-reload velocity

Each Button tweak (sizing, padding, border, font, line-height) was a one-line change in `src/components/ui/button.tsx`, visible in the browser within 100ms via Turbopack hot reload. End-to-end iteration loop felt closer to live design than to code review. Worth flagging when comparing to the LifeSG-as-dep path, where every visual change is a fork-and-rebuild round-trip.

---

## 2026-05-11 — Port LifeSG Core (Typography, Divider, Icon, Markup, TextList)

### Scope

Mirrored LifeSG's Storybook **Core** taxonomy for five of seven components: Typography, Divider, Icon, Markup, TextList. Each lives under `/core/[component]/{introduction,default}` with the same side-by-side pattern as Foundations (ours-pane vs `LifeSGProvider`-wrapped reference). Layout and ErrorDisplay deferred — see "Things still to verify".

### Token parity (Typography)

`scripts/measure-typography.mjs` walks the 10 typography variants and reads `getComputedStyle` on both panes:

| Variant     | font-size | line-height | letter-spacing | font-weight | Match |
| ----------- | --------- | ----------- | -------------- | ----------- | ----- |
| HeadingXXL  | 48px      | 56px        | -0.56px        | 600         | ✓     |
| HeadingXL   | 40px      | 48px        | -0.32px        | 600         | ✓     |
| HeadingLG   | 32px      | 40px        | -0.32px        | 600         | ✓     |
| HeadingMD   | 26px      | 36px        | normal         | 600         | ✓     |
| HeadingSM   | 22px      | 28px        | normal         | 600         | ✓     |
| HeadingXS   | 18px      | 26px        | normal         | 600         | ✓     |
| BodyBL      | 18px      | 26px        | normal         | 400         | ✓     |
| BodyMD      | 16px      | 24px        | 0.144px        | 400         | ✓     |
| BodySM      | 14px      | 26px        | 0.128px        | 400         | ✓     |
| BodyXS      | 12px      | 20px        | 0.128px        | 400         | ✓     |

10/10 pass. The L3-token approach proven on Button generalises cleanly: `typography-tokens.css` does ~40 redirects to L2, the component class strings reference only L3 names. Visual divergence under future re-themes is one token-file edit away.

### Component-level findings, briefest form

**Typography — single component, polymorphic.** LifeSG ships ~14 namespaced exports (`Typography.HeadingXXL`, `Typography.BodyBL`, etc.); we ship one `<Typography variant="heading-xxl">` plus an `as` prop for semantic element overrides. JSX is one line longer per use; the upside is a single import and a single type. Migration tip: a codemod is straightforward (`Typography.HeadingXXL` → `<Typography variant="heading-xxl">`).

**Divider — dropped grid coupling.** LifeSG's `<Divider>` extends `ColProps` and takes `xxsCols`/.../`desktopCols` + `layoutType="flex"|"grid"`. Our `<Divider>` is a styled `<hr>` with `thickness` / `lineStyle` / `color`. The grid responsibility moves to the parent (Tailwind's `col-span-N`). Cost: any migrated LifeSG Divider with `lgCols={6}` needs the wrapper to take `col-span-6 lg:col-span-N` instead. Benefit: Divider is no longer load-bearing for the grid system, so the grid system can be changed (or removed) without rewriting Divider.

**Icon — different library, larger catalogue.** Lucide (~1300 icons) vs `@lifesg/react-icons` (~233). `<Icon>` is a thin wrapper that accepts any `SVGComponent` via `as`, then applies tone + size variants from L3 tokens. Two concrete divergences when porting LifeSG screens:

  1. **Naming.** Lucide has done its "noun-adjective → adjective-noun" rebrand (`AlertCircle` → `CircleAlert`, `CheckCircle` → `CircleCheck`, `Filter` → `Funnel`, `Home` → `House`). LifeSG keeps the older convention (`HouseIcon`, `EnvelopeIcon`, `MagnifierIcon`). A search/replace table belongs in the migration guide.
  2. **Stroke weight.** Lucide is Feather-derived with 2px strokes; LifeSG icons are slightly heavier. Visible at 16px and smaller. Worth a design call before flipping; if it's a problem, `<Icon as={LifeSGIcon}>` works — `@lifesg/react-icons` icons satisfy `ComponentType<SVGProps<SVGSVGElement>>`.

**Markup — hand-rolled, not `prose`.** `@tailwindcss/typography` is the obvious alternative. Skipped because (a) its theme keys aren't keyed off LifeSG's scale (we'd re-map every `--tw-prose-*`), (b) it has no clean "set the body baseline" knob, which is exactly LifeSG's `baseTextSize` prop, and (c) adding the plugin is a third opinion to keep in sync. `markup-tokens.css` is ~60 lines — cheaper than the plugin to maintain.

**TextList — native first, manual fallback.** Browser `list-style` covers `disc`/`circle`/`square` and `decimal`/`lower-alpha`/`lower-roman` with default `.` separator. We render labels manually only when `bulletType` is a `ReactNode` (icon-as-bullet) or `counterSeparator !== "."` or `reversed`. The manual `counterLabel(n, type)` helper covers `lower-alpha` (with overflow into `aa`, `ab`...) and `lower-roman`.

### Styled-components SSR mismatch on LifeSG pages (surfaced + fixed)

Building TextList surfaced a console error on every page that renders a LifeSG styled-component: a React-19 hydration mismatch where the server's `componentId` hash (e.g. `sc-fubEtJ`) differs from the client's (e.g. `sc-gsTDHW`). The same warning had been firing on `/compare/button` since the Button work shipped — we just hadn't noticed.

**Root cause.** LifeSG ships pre-bundled JS to `node_modules`. Next's SWC `compiler.styledComponents: true` transform only runs on first-party source; it doesn't reach vendored code. Without that transform, styled-components generates `componentId` from call-site location, which differs between the SSR bundle (Node) and CSR bundle (browser). Cross-bundle, the same `styled.button` declaration ends up with two different IDs.

**Affected before fix:** `/compare/button`, `/core/divider/default`, `/core/markup/default`, `/core/text-list/default`. (Surprisingly, `/core/typography/default` was clean — likely because LifeSG's Typography components are defined as `styled(TypographyBase)`, an HOC chain that shares a common base whose componentId resolves to the same hash on both sides. Didn't dig further.)

**Fix.** Gated `LifeSGProvider` to mount client-only with a `useEffect` flag (`useState(false)` → `setMounted(true)` in effect). SSR no longer tries to render the LifeSG subtree, so there's nothing to mismatch. Cost: a brief blank flash on first paint of any LifeSG pane. Acceptable for a parity-comparison tool; would not be acceptable for a production app where LifeSG is in the critical path.

**If we ever ship LifeSG components in production** (e.g. as an interim during agency rebrand), the proper fix is to either (a) pre-process LifeSG's bundle with `babel-plugin-styled-components` during the install/build step, or (b) drop styled-components for any component we actually consume by re-implementing in shadcn — which is the pilot's whole point anyway.

### Surprises worth flagging

- **LifeSG TextList exports as a namespace**, not separately. Use `import { TextList } from "@lifesg/react-design-system/text-list"` then `TextList.Ul` / `TextList.Ol`. Tripped on this — the type defs mention `OrderedList` / `UnorderedList` but those are internal.
- **LifeSG TextList `size` prop accepts typography-scale names**, not size aliases: `"body-md" | "body-sm" | "body-xs" | "body-baseline"`. Not `"default" | "small" | "xsmall"`.
- **Lucide v1.14 (installed)** has the post-rebrand names. Our `package.json` carat `^1.14.0` should be considered pinned — a major bump could rename icons again.
- **Tailwind v4 arbitrary-value tokens**: `font-[var(--x)]` is ambiguous (family vs weight). Use the arbitrary-property escape: `[font-family:var(--x)]`, `[font-weight:var(--x)]`. Spent ~3 minutes confused before settling on this.

### Things still to verify

- **Layout** (Container, Section, ColDiv, 12-col grid). The Divider decision deliberately delegated grid behaviour to the parent — Layout is the parent. Open question: do we re-implement LifeSG's grid contract, or just expose Tailwind's grid utilities and call it a day? Worth a separate finding.
- **ErrorDisplay**. Closer to an app-shell template (404, 500, no-results illustrations) than to a primitive — needs design buy-in on the agency's error-page visual language before we can port faithfully.
- **Dark mode for Core components.** Typography, Divider, Icon all reference tokens that re-bind under `.dark`. Hasn't been audited. Likely fine for Typography (text on bg), needs a look for Icon tones.
- **Long-form CMS content stress test.** `Markup`'s heading-cadence + list-spacing + blockquote rendering has only been tested with the synthetic example on the comparison page. Real CMS output from a Drupal/WordPress export would surface edge cases (tables, definition lists, mixed list nesting).

### Artifacts

- `src/components/ui/{typography,divider,icon,markup,text-list}.tsx` — L3-tokened implementations.
- `src/app/{typography,divider,icon,markup}-tokens.css` — L3 token files. (TextList borrows from Typography's; it has no unique tokens.)
- `src/app/core/[...slug]/page.tsx` + `src/app/core/layout.tsx` + `src/components/core/registry.tsx` — taxonomy-mirrored routes.
- `scripts/measure-typography.mjs` — extends the `measure.mjs` pattern from Button to type tokens. Run with `PORT=3000 node scripts/measure-typography.mjs`.

## 2026-05-11 — Port LifeSG Foundations

### Scope

Mirrored LifeSG's Storybook Foundations taxonomy at `/foundations`. 21 routes across 11 folders (Introduction, Themes, Colours, Font, Breakpoint, Spacing, Motion, Radius, Border, Component tokens, Shadow), each rendered side-by-side: extracted CSS vars on the left, live LifeSG resolver on the right.

### What was easy

Five of seven non-colour categories shipped with `Colour`'s exact shape: `(props) => string`. Motion, Border (widths), Spacing, Radius, Shadow all needed only ~4 lines added to `scripts/extract-lifesg-tokens.mjs` to flow into `lifesg-tokens.css` with namespaced CSS-var prefixes. Total: 207 colour + 127 non-colour tokens extracted in one script run.

### What was special

**Font.** The top-level `Font` export returns styled-components template arrays (`["\n font-family: ", null, ";\n …", null, …]`), not strings — the `null` slots are interpolation placeholders evaluated by styled-components at render. Calling the resolver outside a styled-components context gives back an unusable array. Solution: switched to `Font.Spec`, an adjacent export of the same package that resolves to plain strings (`"3rem"`, `"600"`, `"Open Sans"`). 43 tokens covering size / line-height / letter-spacing / weight / family for headings, body, and form labels.

**Breakpoint.** Values are raw numbers (`768`), not CSS strings. Required a separate code path in the extractor that appends `px` to threshold values but leaves column counts unitless. Also: CSS variables can't be used inside `@media` query conditions in any browser — the breakpoint tokens are for documentation and JS consumption, not for `@media (min-width: var(--lifesg-breakpoint-md-min))`.

**Naming collision.** `Font.Spec` includes a key `font-family`. Under our `font-` namespace prefix this would have become `--lifesg-font-font-family`. Added a small dup-prefix strip in the extractor → `--lifesg-font-family`.

### What we deliberately diverged on

**13 product brands.** LifeSG's Foundations/Colours folder ships sub-pages for LifeSG, BookingSG, CCube, MyLegacy, OneService, PA, SupportGoWhere, A11yPlayground, IMDA, RBS, SPF, SGW Digital Lobby, SMGS — one per government-product theme. Same for Font (10 brand variants). Reasonable for a multi-tenant gov design system; pointless for an agency picking one brand. We mirror only the LifeSG brand. When the agency brand stabilises, the agency's palette + type spec replaces LifeSG's; no folder structure changes needed.

**Theme provider mechanism.** LifeSG uses a styled-components `ThemeProvider` to swap palettes at render. We use CSS `:root` + `.dark` class. Functionally equivalent for our needs but means the dark-mode toggle on `/foundations/themes/dark-mode` only affects the ours-pane — the LifeSG pane is wrapped in `LifeSGProvider` which is fixed to `LifeSGTheme.light`. This is honest about the divergence rather than papered over.

### Architectural artifacts

- `scripts/extract-lifesg-tokens.mjs` — now covers all 8 token groups (Colour, Font.Spec, Motion, Border, Spacing, Radius, Shadow, Breakpoint).
- `src/components/foundations/registry.tsx` — tree-shaped registry (folders + leaves) backing the catch-all route at `src/app/foundations/[...slug]/page.tsx`. Lookup map for direct path → leaf, plus folder-URL → first-child redirect.
- `src/app/foundations/layout.tsx` — sidebar uses native `<details>` for folder collapse (zero client JS) with rotating chevron via `group-open:rotate-90`.
- Per-section files in `src/components/foundations/sections/` — each exports `OursPane` + `LifeSGPane` reading from the same data shape, differing only in source (CSS var vs. LifeSG resolver). Renderer is bespoke per section (no shared primitives folder — visual shapes don't overlap enough to share).

### Findings worth keeping

1. **Token-layer parity is cheap when the upstream cooperates.** Five of seven categories were extractable with no special handling. The two that weren't — Font and Breakpoint — exposed real type/runtime mismatches between styled-components-flavored APIs and CSS variables. These are LifeSG-specific quirks; a different design system might not have them. Document them when porting.
2. **Mirror the taxonomy depth, not the multi-tenancy.** LifeSG's 13-brand structure is the cost of being a shared platform. A single-brand consumer mirroring it 1:1 ships 80% empty pages. Faithful depth (folder → Introduction + Default) without faithful breadth (one brand only) is the right trade-off.
3. **`measure.mjs` extension is the next step.** Each token row has a `data-token` attribute on both panes. Extending `scripts/measure.mjs` to assert `getComputedStyle` equality across `[data-token="X"]` pairs would give us the same numerical parity proof that the Button comparison gave us — but for every token, automatically. Defer until we have a real divergence to catch.
4. **The pilot's claim is now provable up two layers.** Button proved component parity (pixel-identical at the rendered DOM). Foundations proves token parity (resolved values match). Together: if a future component reads only from these tokens, parity should be inferable rather than measured.

### Things still to verify

- We haven't tested the dark-mode story end-to-end with the rest of the app. The `.dark` class works on `/foundations/themes/dark-mode` but Button hasn't been audited in dark.
- Tailwind 4 `@theme` only loads a subset of our tokens (colours, radius). Spacing/font sizes still flow through Tailwind's defaults — utilities like `gap-2`, `text-lg` aren't pinned to LifeSG's scale. If we want `gap-2` to mean LifeSG's `--lifesg-spacing-8`, that's a separate Tailwind config exercise.

## 2026-05-11 — Port LifeSG Layout and ErrorDisplay

### Scope

Two Core entries that didn't fit the simple "tokens + class strings" shape: **Layout** (4 primitives, a 12-column grid contract) and **ErrorDisplay** (a 19-type app-shell template with raster illustrations).

### Layout — kept the wrapper, dropped the styled-components dependency

Tailwind's `grid-cols-12` + `col-span-N` cover the same ground as LifeSG's `Layout.ColDiv` in fewer characters when you're building from scratch. We still ship `Section` / `Container` / `Content` / `ColDiv` for two reasons:

1. **Migration cost.** Mirroring the prop surface (`type="flex|flex-column|grid"` defaulting to `flex`, `xxsCols`...`xxlCols` accepting either `number` or `[start, end)` tuples) means a LifeSG screen migrates with an import swap. Without the wrapper, every `<Layout.ColDiv lgCols={[1, 5]}>` needs a per-call rewrite.
2. **Single source of truth for breakpoints.** The 8-col → 12-col flip at `lg-min`, the margin/gutter step (24→48px outer, 16→32px gutter), and the 1440px max-width are encoded once in `layout-tokens.css`. Pages don't need to know.

Two divergences worth noting:

- **No `ThemeProvider` dependency.** LifeSG's `ColDiv` reads `theme.maxColumns` at render. Ours reads breakpoints from `layout-tokens.css` directly — keeps Layout usable without wrapping the tree.
- **Range typing relaxed.** LifeSG types `BreakpointSpan` as a literal `Range<Max>` per breakpoint, so the type system enforces `xxsCols` (8 max) can't take `9`. Ours accepts `number | [number, number | -1]` — runtime-clamped at the CSS layer, not exhaustively typed. `-1` is the "to end" sentinel from LifeSG (`[3, -1]` means cols 3 through max).

The exclusive-end convention surprises Tailwind muscle memory: `[1, 5]` spans cols 1–4, not 1–5. Matches LifeSG, breaks Tailwind expectations. Documented on the Layout introduction page.

### ErrorDisplay — three illustration paths, one honest caveat

LifeSG's ErrorDisplay ships 19 built-in `type`s (`400`...`504`, `maintenance`, `no-item-found`, `logout`, `inactivity`, etc.) with a per-type title, description, and PNG illustration served from `assets.life.gov.sg/react-design-system/img/error/<type>.png`. Mirrored all 19 types verbatim (titles, descriptions, dynamic `renderDescription` for `maintenance` + `inactivity` countdowns).

Illustrations were the real decision. Three paths:

1. **Default** — proxy LifeSG's CDN with `@2x` / `@3x` srcset. Visual parity in the comparison, zero asset pipeline today. `CDN_BASE` constant is the swap point.
2. **Override** — `img={{ src, srcSet, width, height, alt }}` matches LifeSG's prop shape for one-off illustrations.
3. **Fallback** — `img={null}` renders a Lucide-icon-on-disc in the type's semantic tone (red errors, orange warnings, green success). Sane for offline / SSR-without-network / storybook.

**Honest caveat documented on the introduction page**: pointing at `assets.life.gov.sg` in production for non-LifeSG properties is borrowed branding. Treat the CDN default as a pilot-only convenience. The override and fallback exist for the same reason.

### Findings

1. **A wrapper that looks redundant can still earn its keep through migration leverage.** Layout doesn't add anything Tailwind grid can't express. It earns its keep by making the LifeSG → ours diff a one-line import change instead of a per-call rewrite. We'd revisit if the agency picks a different grid contract.
2. **For raster assets, ship three paths.** Default (proxy), override (per-page), fallback (offline). Decoupling means we don't block the port on the agency's illustration set being designed, and the fallback gives us a clean offline story for free.
3. **`[start, end)` exclusive-end is a load-bearing convention to call out.** It's the kind of off-by-one a Tailwind-fluent reader will get wrong on first read. Worth a line in the migration guide and a comment in `layout.tsx` if anyone ever questions why we didn't use inclusive bounds.

### Things still to verify

- Layout is exercised by every component below it in the next batch — if a Container/Section/ColDiv divergence surfaces, it'll surface there. Hasn't yet.
- The fallback Lucide-icon-on-disc was matched to LifeSG's tone semantics by eye, not by `getComputedStyle` — fine because it's an offline-only path that doesn't need pixel parity.
- **Long-form content + Layout interaction.** A page combining `Markup` + `Layout.ColDiv` with `xxsCols=12 lgCols=[3,11]` hasn't been built. Will surface any prose-readability decisions Layout makes implicitly.

### Artifacts

- `src/components/ui/{layout,error-display}.tsx`
- `src/app/{layout,error-display}-tokens.css`
- `src/components/core/sections/{layout,errordisplay}-default.tsx` + matching `prose.tsx` entries
- `scripts/{inspect-errord-layout,inspect-errordisplay-imgs,inspect-layout-grid,verify-layout-errordisplay}.mjs` — diagnostic probes; kept rather than deleted in case the divergences re-emerge.

## 2026-05-12 — Port LifeSG Content, Overlays, Navigation

### Scope

Three taxonomy folders, 17 components in one batch:

- **Content** (8): Card, Table, UneditableSection, BoxContainer, Tab, Accordion, DataTable, FullscreenImageCarousel.
- **Overlays** (1): Modal — required by the carousel and by every Form component downstream.
- **Navigation** (8 of 10): Avatar, Breadcrumb, LinkList, Masthead, Pagination, LocalNav, Sidenav, Navbar, Footer. Language Switcher dropped (agency is English-monolingual). Drawer not ported as a standalone — Navbar inlines it, matching LifeSG's private internal.

Same `[ours-pane | LifeSG-pane]` shape as Foundations / Core. Each component has an `Introduction` prose page documenting kept/dropped/diverged decisions, plus a `Default` page for visual comparison.

### Behavioural parity is the new bar

Up through Core, the pilot's "can shadcn match LifeSG?" question was visual. This batch is the first where keyboard, focus, and ARIA semantics matter more than pixels. Components that exercise it: **Tab** (arrow keys cycle, automatic activation, animated indicator), **Accordion** (Enter/Space toggle, ARIA disclosure), **Modal** (focus trap, restore-on-close, scroll lock, Escape, outside click), **DataTable** (Checkbox indeterminate state, `aria-sort`), **LocalNav** (`IntersectionObserver` scroll-spy + sticky offset), **Sidenav** (drawer open/close + focus management), **FullscreenImageCarousel** (Modal-mounted, ArrowLeft/Right cycling, zoom toggle).

Verified Tab keyboard nav with `scripts/probe-tab-kbd.mjs` — both panes show `tabindex="0"` on the active tab, `tabindex="-1"` on the rest, and ArrowRight correctly shifts `aria-selected` on both. Identical behaviour, different libraries (Base UI vs LifeSG's hand-rolled).

The pattern: **Base UI primitives carry the load**. `@base-ui/react/{tabs,accordion,collapsible,dialog,checkbox}` provided focus + keyboard + ARIA for free across this batch. LifeSG's hand-rolled equivalents took the same amount of code to wrap; the difference is Base UI handles the edge cases (RTL keyboard, restore-on-close to the right element, scroll-locked iOS Safari) that LifeSG's implementation doesn't always.

### Deliberate divergences worth pinning down

- **Tab** — drops `fadeColor` / overflow-fade flourish; `overflow-x-auto` on the wrapper is enough.
- **Accordion** — drops imperative refs (`expand()` / `collapse()` on `AccordionItem`). Base UI's controlled `value` pattern is the replacement. **Migration cost**: any LifeSG code using these refs needs a state-lift rewrite. Worth a callout in the migration guide.
- **DataTable** — defers `enableStickyHeader` (LifeSG uses a scroll-watching observer) until a real screen exercises it. Empty-view supports plain `ReactNode` via `emptyView`; the structured `ErrorDisplayAttributes` prop-passthrough is one adapter away.
- **UneditableSection** — defers masking entirely (`maskState`/`maskLoadingState`/`maskRange`/`maskRegex` + toggle UI). Separate sub-feature that needs its own design pass.
- **FullscreenImageCarousel** — zoom is a 1× / 1.5× toggle, not LifeSG's continuous magnifier with pan. No swipe gestures. Pointer + keyboard work today.
- **Modal** — drops `rootComponentId` (target a non-`document.body` portal container). Base UI defaults to body; can wrap `Dialog.Portal container={ref}` if a screen needs it.
- **Breadcrumb** — drops `fadeColor` / `fadePosition` overflow flourish (parent uses `overflow-x-auto`).
- **Navbar** + **Footer** — explicitly **skeletal**. Visual shell + desktop/mobile switch only. The brand-pinned bits (download-button helper, action-button typing, `showDownloadAddon`/`showResourceAddon` cross-product addons) are dropped pending agency branding. Marked as such in the prose so nobody mistakes them for production-ready.

### Surprises worth flagging

- **Footer was server-only by accident.** The original port shipped with `"use client"` because it was copy-shaped from Navbar. The component has no hooks, handlers, or state — pure server-renderable. Dropped the directive (`src/components/ui/footer.tsx:1`). Small bundle / hydration win and an honest signal of where the client/server boundary actually is.
- **Base UI `@base-ui/react` vs `@base-ui/react-components`.** The package layout has stabilised since the batch we used in Button — current installs ship a flatter import surface (`@base-ui/react/dialog` instead of `…/react-components/dialog`). The whole batch uses the new path. If older shadcn examples import differently, prefer the path that matches what's installed.
- **Pagination's window-and-ellipsis is non-trivial to match exactly.** First / last / current ± 1 / ellipsis-fill — easy to describe, easy to get off-by-one. Mirrored LifeSG's algorithm verbatim by reading their source rather than reinventing. The button count matches at any `(activePage, totalItems, pageSize)` triple.
- **Sidenav inlines its drawer, matching LifeSG.** Tempting to extract Drawer as a separate Overlays primitive (filter panels, settings sheets would reuse it). Held off until a second consumer appears — premature factor otherwise.

### Outstanding parity issues — documented, not fixed

Two real divergences surfaced and weren't resolved before the commit landed. Probe scripts capture them so we can re-test after a fix lands.

**1. Table row height (24px taller on LifeSG).** Same content, same cell padding (`20px 16px`), same `<tr>` computed styles, no wrapper element inside `<td>`. All five LifeSG cells in row 1 are uniformly 113px; ours are uniformly 89px. Source of the 24px is somewhere we haven't isolated — possibly `<table>` border-spacing, possibly a `<tbody>` rule, possibly a styled-components-injected stylesheet not visible via element-level inspection. `scripts/probe-{table-row,row-detail}.mjs` pin the measurement. Visual impact: LifeSG tables look airier; ours look denser. Decide before any production use whether to match LifeSG (add row breathing room to `table-tokens.css`) or assert that ours is the correct density.

**2. Dark mode is currently a no-op outside Foundations.** `globals.css:31` declares `@custom-variant dark (&:is(.dark *))`, but the consumed tokens (`--background → var(--lifesg-bg)` etc.) are only defined under `:root`. There is no `.dark { … }` block re-binding `--lifesg-bg` to a dark value. Adding the `dark` class to `<html>` therefore changes nothing — `--lifesg-bg` stays `#fff`, and so does `--card-bg`, `--background`, etc. Verified with `scripts/probe-dark.mjs`. Foundations' `/foundations/themes/dark-mode` route works only because that page swaps individual tokens locally for demo; the system-wide dark mode plumbing was never wired. Fix path: either add a `.dark` block to `lifesg-tokens.css` (rebind L2 tokens to dark equivalents from the LifeSG dark theme) or to `globals.css` (override the L1 → L2 chain). The L2 fix is cleaner — every L3 token inherits.

### Findings

1. **Behavioural parity favours headless-primitive libraries.** Six of this batch's components (Tab, Accordion, BoxContainer, Modal, DataTable's checkbox, LocalNav's collapsible variant) sit on Base UI primitives. The wrapper code is class strings + token references. The interaction surface is delegated to a library whose explicit job is keyboard / focus / ARIA. This is the real cost-of-ownership argument for shadcn over LifeSG-as-dep — we don't maintain the disclosure machinery.
2. **L3-tokens-per-component is now load-bearing.** This batch added 18 `<component>-tokens.css` files (one per component). At 18 files the consolidation question from the Foundations entry ("may consolidate at 5+ components") is overdue — but the per-file shape has worked fine for editing and review, so deferring. Revisit if the import list in `globals.css` becomes unwieldy or if a re-theme exercise benefits from fewer files.
3. **"Skeletal" is an honest port state.** Navbar and Footer are 60% of LifeSG's prop surface. The prose pages say so explicitly. The alternative — hand-waving over the missing 40% — would have made these look production-ready when they aren't.
4. **One commit, three folders, eighteen components is a viable batch size for this kind of port** — provided each component is small, each gets its own `Introduction` + `Default` page, and the harder ones (DataTable, FullscreenImageCarousel, Sidenav) are interleaved with quick wins (Avatar, Breadcrumb, LinkList) so the diff doesn't feel like one slog.

### Things still to verify

- **The two outstanding parity issues above** (table row height, dark mode no-op). Both are real and currently undocumented anywhere except this entry. If the pilot conclusion will reference visual parity, both need to be addressed or scoped out explicitly.
- **DataTable sticky header** — deferred. First real screen with a tall data table will surface whether the deferral was right.
- **Mobile UX of Navbar drawer + Sidenav drawer** — both ship today but haven't been touch-device tested. Hover-vs-tap states and outside-tap dismissal are the obvious risks.
- **Focus order across LocalNav + page sections** — scroll-spy + anchor links + focus restoration is the kind of triple where a subtle bug bites accessibility audits. Hasn't been tested with a screen reader.
- **FullscreenImageCarousel + custom-render slides (PDF/iframe)** — the prop shape supports it, no real consumer has exercised it.

### Artifacts

- `src/components/ui/{accordion,avatar,box-container,breadcrumb,card,data-table,footer,fullscreen-image-carousel,link-list,local-nav,masthead,modal,navbar,pagination,sidenav,tab,table,uneditable-section}.tsx`
- `src/app/{accordion,avatar,box-container,breadcrumb,card,data-table,footer,fullscreen-image-carousel,link-list,local-nav,masthead,modal,navbar,pagination,sidenav,tab,table,uneditable-section}-tokens.css`
- `src/app/{content,navigation,overlays}/[...slug]/page.tsx` + `layout.tsx` per folder; `src/components/{content,navigation,overlays}/registry.tsx` lists the per-folder taxonomy.
- `scripts/{measure,smoke,snap}-{content,navigation}.mjs`, `scripts/behavioral-content.mjs`, `scripts/{carousel,modal}-test.mjs` — measurement + behavioural probes.
- `scripts/probe-{dark,padding,row-detail,tab-kbd,table-row}.mjs` — diagnostic probes for the outstanding parity issues. Kept rather than deleted; small, no dependencies, useful for re-measuring after a fix.
- `Dockerfile` + `.dockerignore` — added in this commit. Out of scope for this entry; flagged here so it's not surprising in the diff.

## 2026-05-12 — Port LifeSG Selection and Input

### Scope

Eleven components in five sub-batches mirroring LifeSG's Storybook **Selection and Input** taxonomy:

- **Selection primitives (3)**: Checkbox, RadioButton, Toggle.
- **Button family (3)**: Button (slotted in from the original Button port), IconButton, ImageButton.
- **Specialty inputs (2)**: OtpInput, FeedbackRating.
- **Date (2)**: DateNavigator, Calendar.
- **Filter (1)**: sidebar mode + checkbox item type.

Excluded from this batch:
- **Time-slot family** (Schedule, TimeSlotBar, TimeSlotBarWeek, TimeSlotWeekView, TimeTable) — five components in a focused follow-up batch.
- **SingpassButton** — Singapore-government-platform-specific OAuth, dropped same as Language Switcher.

Five commits, one per sub-batch (`26e8821`, `73488fd`, `d8688aa`, `4f0961d`, `0984148`), then this findings entry.

### The taxonomy lesson — package layout ≠ Storybook layout

Initial scoping went sideways because we built the candidate list by reading `node_modules/@lifesg/react-design-system/*/` and grouping by what *looked* like "selection / input shapes" — text inputs, selects, sliders. That's the JavaScript package boundary. LifeSG's Storybook organises by **user-flow purpose** ("things that capture user choice or input"), which is a broader and more pragmatic grouping that sweeps in Calendar, FileDownload/Upload, FeedbackRating, the Schedule / TimeSlot family, and IconButton / ImageButton — components that share *no implementation shape* but live in the same mental category for someone designing a screen.

The text inputs we initially listed (Input, InputTextarea, InputSelect, etc.) live in a different Storybook category — likely "Form" or "Form Field" — that we haven't audited yet. **Mirror the taxonomy by reading the user-facing sidebar, not the package directory.** Update the migration guide accordingly.

### LifeSG's "Toggle" is not a switch

This was the biggest individual surprise of the batch and would have been a quiet bug if we'd just mapped `Toggle → @base-ui/react/switch` based on the name. LifeSG's `Toggle` is a **labelled selection card**: a bordered tile with a checkbox, radio, or yes/no indicator inside, plus an optional sub-label and an optional collapsible composite section. Closer to what other systems call "TileSelect" or "OptionCard". `type="checkbox" | "radio" | "yes" | "no"` selects which indicator appears.

Our port wraps Checkbox / RadioButton (built earlier in the same sub-batch) with a styled label container. Worth noting: shadcn's own `Toggle` is a third thing again — a toolbar toggle button (pressed/unpressed), like in a rich-text editor toolbar. **Three components, three different meanings of "toggle".** The migration guide needs a clear glossary line.

### Behavioural-parity story keeps holding

Continuing the pattern from the Content / Overlays / Navigation batch — Base UI primitives carried the load on every component that has real interaction:

- **Checkbox** → `@base-ui/react/checkbox` (indeterminate, focus, keyboard).
- **RadioButton** + **RadioGroup** → `@base-ui/react/radio` + `radio-group` (Arrow-key cycling, focus traversal).
- **Toggle** → wraps the above two for `type="checkbox|radio"`; hand-rolled disc indicator for `yes|no`.
- **OtpInput** → `@base-ui/react/otp-field` (auto-focus progression, paste-to-fill, backspace-to-previous, `autocomplete="one-time-code"` for SMS autofill on iOS / Android).
- **DateNavigator** dropdown → `@base-ui/react/popover` (portal, focus trap, escape, outside-click).
- **Filter** sections → `@base-ui/react/accordion` (per-section disclosure, ARIA, keyboard).

The wrapper code in each is class strings + L3 token references. The wins compound — every component that needed disclosure / collapse / portal / form-association behaviour reached for an existing Base UI part instead of hand-rolling. **The library is no longer a curiosity; it's load-bearing infrastructure for the pilot's parity claim.**

### New external dependency: react-day-picker (+ date-fns)

Calendar is the first port in the pilot to require a third-party library beyond Base UI / Lucide. Added `react-day-picker@10` and `date-fns@4`. Reasoning:

- **Calendar grid is genuinely complex** — month view, navigation, weekday header, leap years, locale-aware first-day-of-week, keyboard nav. Hand-rolling is a multi-day project; `react-day-picker` is the canonical shadcn pick and we were going to use it eventually.
- **Footprint is small** — `date-fns` is tree-shakeable; `react-day-picker` is ~30KB minified. Not free, but appropriate cost.
- **L3 styling cleanly applies** — `react-day-picker`'s `classNames` prop accepts Tailwind class strings per part, so `calendar-tokens.css` redirects flow through unchanged.

If a future audit wants to drop react-day-picker, the Calendar wrapper is ~150 lines and could be re-implemented from scratch — but the cost / benefit doesn't favour it today.

### Package-shape gotchas worth saving

- **Base UI OTP field is in their preview namespace** as of 1.4.1. The export is `OTPFieldPreview` (not `OTPField` or `OtpField`). Aliased on import. Worth re-checking when bumping `@base-ui/react`.
- **Lucide icons use post-rebrand names**, LifeSG icons keep older convention. Bit us on `Cog → Gear` (LifeSG ships `GearIcon`, not `CogIcon`). The icon-naming search/replace table flagged in the Core entry is a real artifact, not theoretical.
- **LifeSG Button has a namespaced shape** (`Button.Default`, `Button.Small`, `Button.Large`) not a single `Button` with a size prop. Mirroring that on the comparison page needs `<LifeSGButton.Default styleType="secondary">`, not the more obvious `<LifeSGButton variant="secondary">`.
- **Heredoc + apostrophes burned ~30 seconds.** Multi-line commit message with `LifeSG's` in body — bash heredoc through `cat <<'EOF'` inside a `$(...)` works, but quoting it through `git commit -m "..."` doesn't. Solution: write to `/tmp/commit-msg.txt` and `git commit -F`. Worth keeping in muscle memory for future longer commits.

### Deliberate divergences

Compiled across the batch — these are intentional choices, not bugs:

| Component       | Divergence                                                                                   | Reason                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Checkbox        | `error` via `aria-invalid` instead of an `error` prop                                        | LifeSG handles error via FormField wrapper; `aria-invalid` is the standard a11y pattern |
| RadioButton     | Same as Checkbox                                                                             | Same                                                                                    |
| Toggle          | Indicator visible by default (LifeSG hides until checked / hover)                            | Discoverability — easier to scan a list of options                                      |
| Toggle          | `compositeSection` renders inline when checked (LifeSG ships a collapsible "Show more")      | Simpler; collapsible variant deferred                                                   |
| ImageButton     | Selected state shows a checkmark badge in the top-right corner                               | Redundant a11y signal beyond the border colour change                                   |
| Calendar        | 2-letter weekday labels (LifeSG: 3-letter)                                                   | Matches `react-day-picker` default; trivially flippable                                 |
| Calendar        | No month / year dropdown (arrow-only navigation)                                             | Caption-only nav is the `react-day-picker` default; add `captionLayout` if needed       |
| DateNavigator   | More compact layout with icon + date in a single small bordered container                    | Tighter visual; LifeSG's wider trigger feels app-shell-shaped                            |
| FeedbackRating  | Lucide `Star` icon (LifeSG ships custom blue-outlined star SVGs)                             | Standard rating-control look; brand stars are an agency decision                        |
| Filter          | Sidebar mode only (no `Filter.Modal` mobile variant yet)                                     | Mobile UX awaits agency decision; modal mode shares ~80% of the surface                 |
| Filter          | `Filter.Checkbox` only (no `.Radio` / `.Toggle` / `.Search`)                                 | Defer until first real consumer needs them                                               |

### What was deferred

Worth listing in one place so the next batch knows what's load-bearing for "production" and what isn't:

- **Toggle**: `removable`/`onRemove`, `compositeSection.collapsible`, `childrenMaxLines` truncation, `useContentWidth`.
- **OtpInput**: imperative `ref.startCooldown()`.
- **Calendar**: deprecated `onSelect` alias (use `onChange`), year-only / month-only views.
- **DateNavigator**: `dropdownRootNode` (custom portal container).
- **Filter**: modal mode, all non-Checkbox item types, nested options, `labelExtractor` / `valueExtractor` exercised in tests.
- **Filter.Item**: `initialExpanded` is accepted for API parity but no-op (Base UI Accordion controls open-state at Root level via `defaultValue`; need to either pass through to Root or move to a context-driven registration).

### Things still to verify

- **Form-component integration.** Every component in this batch will eventually be used inside a Form with field-level error display, field-level help text, and field-level focus management. The next batch (Form / Inputs) will exercise this. None of these have been wired into a `<Field>` parent yet.
- **Mobile experience.** Toggle's `childrenMaxLines`, Filter's modal mode, DateNavigator's dropdownRootNode, Calendar's mobile-friendly month/year-jump — all unverified on touch devices.
- **Calendar keyboard nav.** `react-day-picker` says it provides Arrow / Home / End / PageUp / PageDown; we haven't smoke-tested.
- **OtpInput SMS autofill.** `autocomplete="one-time-code"` is set by Base UI's OTPField. Real SMS-with-OTP test needs an actual phone, which we'll only get when a real screen exists.
- **DateNavigator + Calendar timezone behaviour.** Both use `YYYY-MM-DD` strings to dodge timezone gotchas, but that hasn't been verified across SG / UTC / non-SG locales. Needs a test before any production use that involves backend-stored dates.
- **L3 token file count is now 30** in `globals.css` import block. The "consolidate at 5+" question from the Foundations entry is genuinely overdue. Worth a small refactor pass — combine into category-bundled files (`selection-and-input-tokens.css`, `content-tokens.css`, etc.) — when no other batch is in flight.

### Findings

1. **Read the user-facing taxonomy, not the package layout.** This batch started with the wrong list because we inferred groupings from the file system. LifeSG's Storybook category puts Calendar next to Checkbox because both are "the user picks something" — perfectly sensible from a screen-design perspective, surprising from a JS-engineer perspective. Future batches: open the live LifeSG Storybook sidebar first.
2. **Component names lie.** LifeSG `Toggle` ≠ shadcn `Toggle` ≠ Base UI `Switch`. All three are distinct components in distinct mental categories. The migration guide needs a *concept-to-component* mapping line, not just an *API-to-API* mapping table.
3. **Headless primitives are the load-bearing decision.** Six of eleven components in this batch reached for a Base UI primitive for the interaction surface. The wrapper code is small. The cost-of-ownership delta vs LifeSG-as-dep is roughly: we wrap a primitive whose full-time job is keyboard / focus / ARIA, vs we adopt a styled-components library where every interaction was hand-rolled by a single team in their spare time. The primitive library wins on edge-case coverage (RTL, restore-on-close, scroll-locked iOS Safari, paste-into-OTP, etc.).
4. **The "skeletal" port pattern continues to be honest.** Filter shipped as sidebar-mode-only with the "what's deferred" list explicit on the introduction page. Same for Toggle's `compositeSection` / `removable` / `childrenMaxLines` deferrals. **Better to ship 60% of a component with a public deferral list than ship 100% with hidden bugs in the 40% you didn't actually exercise.**
5. **Package-shape drift is real.** Base UI's OTP field is in a `Preview` namespace that won't survive their next stable. The migration cost when these stabilise will be ~10 lines per consumer file. Worth a `// TODO(base-ui-stable):` comment on each preview-namespace import, but not worth blocking on.

### Artifacts

- `src/components/ui/{checkbox,radio-button,toggle,icon-button,image-button,otp-input,feedback-rating,calendar,date-navigator,filter}.tsx` — 10 new components, plus the existing `button.tsx` slotted in.
- `src/app/{checkbox,radio-button,toggle,icon-button,image-button,otp-input,feedback-rating,calendar,date-navigator,filter}-tokens.css` — 10 new L3 token files.
- `src/app/selection-and-input/[...slug]/page.tsx` + `layout.tsx`, `src/components/selection-and-input/registry.tsx`, `src/components/selection-and-input/sections/prose.tsx` + 11 default sections.
- New runtime dependencies in `package.json`: `react-day-picker@10`, `date-fns@4`.
- Linked from the home page (`src/app/page.tsx`).
