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
