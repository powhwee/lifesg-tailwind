# Six-component port + MDX audit pilot — 2026-06-07

Single overnight session that executed the four follow-ups queued in
`2026-05-27-handover.md`. Picks up from there.

Started 36 commits ahead of `origin/main`, ended at 36 commits ahead
(9 new commits added this session, the prior 28 unrelated to this work).
None pushed.

## TL;DR

- **6 new components ported** — singpass-button, file-download, file-upload,
  predictive-text-input, popover-v2, popover-inline. Each ships paired
  `.stories.tsx` + `.mdx` plus a side-by-side comparative section in the
  local preview app.
- **§5 Controls-panel sweep** — 156 story exports across 37 files now
  have `parameters: { controls: { disable: true } }`. Variant / tour
  stories no longer pretend the Controls panel is interactive.
- **§6 MDX audit pilot** — 5 components (accordion, button, input,
  modal-v2, calendar) got the `## Overview` + per-variant prose treatment.
  Gap confirmed consistent and mechanical across the audit.
- **§7 Proposal refresh** — component count 50+ → 58, Appendix structure
  + Form.X gap row updated to reflect actual ship decisions.
- **Unblocking change** — `tsconfig.json` excludes `working-logs/` and
  `scripts/` so reference `.tsx` dumps don't break `next build`.

## Decisions made under ambiguity

The implementation plan flagged two open questions. The user was away
overnight with "proceed without asking", so I committed to the
plan-recommended approach for both:

1. **Singpass logo SVG** — inlined path data as React components in
   `singpass-button.tsx` (not fetched from `assets.life.gov.sg`).
   Offline-robust, no extra network request, no external dependency.
2. **PredictiveTextInput composition** — `<Input>` + absolutely-positioned
   dropdown sibling with manual ARIA combobox keyboard handling. Did NOT
   use Base UI's `Popover` for the dropdown — combobox is the standard
   pattern and avoids wiring a hidden trigger.

Decisions on the plan's "User Review Required" boxes matched the plan's
stated approach: token names derived during impl, `@dnd-kit` deps added,
Modal V1 left alone, `FormPredictiveTextInput` ships but no
`FormFileUpload` / `FormFileDownload`.

## §5 — Controls sweep (1 commit)

| Commit | Files | Stories touched |
|--------|-------|-----------------|
| `5b0588a` | 37 `.stories.tsx` | 156 exports |

Wrote `scripts/disable-controls-on-noargs.mjs` — an idempotent codemod
with a brace-aware JS/TSX tokenizer that:
- Finds every `export const X: Story = {…}` or
  `export const X: StoryObj<typeof Y> = {…}`
- Checks if the body uses `render: () =>` (no-args render)
- If yes and `controls.disable: true` isn't already present, either
  prepends a fresh `parameters: { controls: { disable: true } },` or
  merges `controls: { disable: true }` into an existing top-level
  `parameters` block (handles single-line `parameters: { layout: …}` and
  multi-line `parameters: { docs: { source: { … } } }`)

Iterated on the regex once — initial pattern only matched `: Story = {`
and missed `: StoryObj<typeof OrderedList> = {` in `text-list.stories.tsx`
plus the `CompositeFormField` and `FormFieldWithError` form stories. The
codemod is idempotent, so re-running across all 37 files caught the 3
missed exports without re-touching the 153 already updated.

Codemod retained at `scripts/disable-controls-on-noargs.mjs` for the
next time this pattern surfaces.

## §1 — Token infrastructure (1 commit)

| Commit | Where |
|--------|-------|
| `2038c41` | form-tokens.css, selection-and-input-tokens.css, overlays-tokens.css, globals.css |

Token values were sourced from LifeSG's upstream styled-components by
fetching their GitHub raw blobs (`gh api …/contents/<path>` for
discovery, then `raw.githubusercontent.com/master/src/<comp>/...style.tsx`
for the actual CSS). For the six components:

- **singpass-button** — brand-red hex `#f4333d` / hover `#b0262d`, white
  border `#c8c9cc` (not from the LifeSG palette — Singpass-brand colours).
  Sizes 40 / 48 / 64 px (small / default / large). Logo height 24 px
  (small / default) and 40 px (large).
- **file-container** (shared) — dashed 2px border (`Border.width-040`),
  8px corner radius (`Radius.sm`), 32px padding (20px horizontal on mobile).
  Reused by file-upload + file-download.
- **file-upload** — overlay primary-subtler bg, 64px cloud-up icon,
  10rem fixed button width on desktop, per-row tokens for progress bar,
  drag-active background.
- **file-download** — per-row item tokens (bg, border, hover, action color).
- **predictive-text-input** — dropdown surface tokens reused from popover
  shadow pattern; item hover / active backgrounds.
- **popover-v2** — 8px card radius, 24px Card padding, 480px max-width,
  16px floating offset, mobile ModalV2 takeover padding (3.5 / 1.25 /
  2.5rem).
- **popover-inline** — primary text colour, semibold weight, 4px icon gap.

Every new variable is mirrored in `globals.css` `@theme inline` so it
generates a first-class Tailwind utility (e.g. `bg-singpass-button-bg-red`,
`rounded-popover-v2`).

## §3 — SingpassButton (1 commit)

| Commit | Files |
|--------|-------|
| `a69b1e8` | singpass-button.{tsx,stories.tsx,mdx} + comparative section + registry + prose + tsconfig.json |

- Compound `SingpassButton.Default` / `.Small` / `.Large`, two styleType
  variants (`red-filled`, `white-filled`).
- Inlined SVG wordmark: same vector artwork for both variants, only fills
  swap. Three path-data consts in the same file. On red bg all paths are
  white; on white bg the "sing pass" word is brand red, the "Singpass"
  word is black, the dot/squiggle accent is black.
- aria-label default `"Log in with Singpass"`; logo is `aria-hidden`.

`tsconfig.json` exclude: pre-existing `working-logs/reference/lifesg-provider-wrapper.tsx`
was breaking `next build`'s TypeScript pass with a non-existent
`LifeSGProvider` import. Excluding `working-logs/` + `scripts/` from
`tsconfig.json` mirrors the `@source not` directives already in
`globals.css` and unblocks the build. Committed alongside singpass-button.

## §2 — FileDownload (1 commit)

| Commit | Files |
|--------|-------|
| `459b585` | file-download.{tsx,stories.tsx,mdx} + comparative section + registry + prose |

- Single component + internal `FileListCard` row.
- Mirrors LifeSG's `FileItemDownloadProps`: id, name, mimeType, size,
  filePath, thumbnailImageDataUrl, ready, errorMessage.
- Per row: 48 px thumbnail (image MIME) or generic file icon; name +
  MIME / size meta; circular download button that flips to a `Loader2`
  spinner during `onDownload` and swaps the row border to red on error.
- Items can be pre-marked with `errorMessage` for server-side failures.
- `ready: false` disables the button and shows a "Not ready" label.

Deliberately not wrapped in `<FormField>` — mirrors LifeSG's API
(no `Form.FileDownload`).

## §2 — FileUpload (1 commit)

| Commit | Files |
|--------|-------|
| `9775733` | file-upload.{tsx,stories.tsx,mdx} + comparative section + registry + prose + package.json + globals.css |

- Native HTML5 drag-drop dropzone with a drag-counter to dedupe child-element
  enters/leaves (the classic React drag-and-drop foot-gun).
- Sortable rows via `@dnd-kit/core` `MouseSensor` + `KeyboardSensor` and
  `@dnd-kit/sortable` `verticalListSortingStrategy`. Drag handle
  (`GripVertical`) on each row when `sortable` is set.
- Editable image descriptions: `Pencil` icon → inline textarea with
  optional `fileDescriptionMaxLength` counter. Enter saves, Escape cancels.
- Inline per-row progress bar (`role="progressbar"`), inline error,
  delete button. Top-of-list warning alert, bottom error alert.
- Upload button is our `<Button variant="secondary" size="sm">` with the
  10 rem fixed width on desktop / full-width on mobile.

Dependencies added (and `npm install`'d): `@dnd-kit/core@^6.3.1`,
`@dnd-kit/sortable@^10.0.0`, `@dnd-kit/utilities@^3.2.2`.

Globals.css extension: added `--color-lifesg-bg-warning*` and
`--color-lifesg-icon-warning` utilities for the warning/error alerts.

## §2 — PredictiveTextInput (1 commit)

| Commit | Files |
|--------|-------|
| `98c89e7` | predictive-text-input.{tsx,stories.tsx,mdx} + comparative section + registry + prose |

- Generic `<T, V>` shape matching LifeSG's surface.
- 250 ms debounce on `fetchOptions(input)` after the user types
  `minimumCharacters` (default 3).
- Manual ARIA combobox: `role="combobox"`, `aria-expanded`,
  `aria-controls`, `aria-haspopup="listbox"`, `aria-autocomplete="list"`,
  `aria-activedescendant`.
- Keyboard: ArrowUp / ArrowDown navigate, Enter selects, Escape closes.
  Outside-click closes via document `mousedown` listener.
- Dropdown surface positioned absolutely below the input, width
  defaults to match input, can be overridden via `dropdownWidth`.
- Error path: if `fetchOptions` throws, dropdown shows
  "Could not load suggestions" + inline "Try again" button.

`FormPredictiveTextInput` in the same file wraps the input in
`<FormField>` — mirrors `FormInput` and LifeSG's `Form.PredictiveTextInput`.

Storybook typing kink: the component is generic, so `Meta<typeof
PredictiveTextInput>` infers `T = unknown` and rejects `(s: string) => s`
argTypes. Solved by casting to concrete `<string, string>` /
`<ListItemDisplayProps, string>` shapes in the stories file. Pattern
worth remembering for future generic-component stories.

## §4 — PopoverV2 + PopoverInline (1 commit)

| Commit | Files |
|--------|-------|
| `21fd2e5` | popover-v2.{tsx,stories.tsx,mdx} + two comparative sections + registry + prose |

Single `popover-v2.tsx` file with three exports composed via
`Object.assign(PopoverV2Root, { Trigger, Inline })`:

- **PopoverV2** — the card root. Applies padding / radius / shadow tokens.
  Use inside a `popoverContent` prop when you need more than a string.
- **PopoverV2.Trigger** — wraps Base UI's `Popover.Root` + `Trigger` +
  `Positioner` + `Popup`. Click trigger uses Base UI's built-in open
  behaviour; hover trigger is layered on top via manual `onMouseEnter` /
  `onMouseLeave` timers with `delay.open` / `delay.close` (default 500ms
  close). Position parser splits LifeSG's `"top-start"` into Base UI's
  `side="top"` + `align="start"`.
- **PopoverV2.Inline** — a link-styled span wrapped in `PopoverV2.Trigger`.
  `role="button"`, `aria-haspopup="dialog"`. Underline state controlled
  by `underlineStyle` / `underlineHoverStyle` (default / underline /
  underline-dashed). Trailing icon defaults to lucide `Info`.

Two comparative sections — the plan called for one folder with three
leaves (introduction / default = Trigger / inline = Inline). LifeSG ships
the trigger wrapper as `PopoverTrigger` (not `PopoverV2Trigger`) — caught
this on the first build, took ~30 s to fix.

Deferred (documented in MDX + prose):
- enableResize auto-sizing to remaining viewport height
- Mobile ModalV2 takeover on < sm viewports
- rootNode portal targeting (falls back to `document.body`)

## §6 — MDX audit pilot (1 commit)

| Commit | Files |
|--------|-------|
| `85c8ab4` | accordion.mdx, button.mdx, input.mdx, modal-v2.mdx, calendar.mdx + tests/parity.spec.ts |

Fetched LifeSG's canonical MDXs for the 5 pilot components. Identified
the recurring gap: LifeSG opens every MDX with a `## Overview` header and
one-sentence purpose statement; ours opened with an unlabeled paragraph.
And LifeSG's per-variant canvases sit beneath a one-sentence
"use this when…" / "set X if Y" framing prose; ours often had just a
header + canvas.

Ports:
- **accordion.mdx** — Overview, prose on Default and SmallVariant, plus
  a heading-hierarchy a11y code example bridging the gap left by us not
  shipping a `headingLevel` prop. (We ask consumers to wrap `title` in
  the heading element they need.)
- **button.mdx** — Overview, usage prose per variant (Outline / Secondary /
  Ghost / Destructive / Link).
- **input.mdx** — Overview, usage prose per state (Clearable / Disabled /
  Read-only / Error).
- **modal-v2.mdx** — Overview (one-sentence opening sourced from LifeSG's
  canonical phrasing).
- **calendar.mdx** — Overview, usage prose per variant (Bordered / Multi /
  MultiWithLimit / WithMinMax / WithDisabledDates).

Preserved as-is: our `<Source/>` import block (vs LifeSG's raw fenced
code), `<Controls of=>` (vs LifeSG's `<PropsTable/>`), our Notes sections
(implementation context LifeSG doesn't ship).

**Pilot conclusion**: gap is consistent + mechanical. Recommended next
step: sweep the remaining ~48 component MDXs with the same shape — ~5 min
per component, ~4 hours total, no decisions required mid-sweep. Confidence
high that this is purely additive work that can land in one batch.

`tests/parity.spec.ts` extended with 6 new routes alongside this commit
(component-specific `panePrefix`es: `sni-singpass-button`,
`form-file-upload`, `form-file-download`, `form-predictive-text-input`,
`overlays-popover-v2`, `overlays-popover-inline`).

## §7 — Proposal refresh (1 commit)

Bundled into the final docs commit (`0679a99`). Three changes:
- Component count 50+ → **58** in two places
- Form.X risk-assessment row rewritten to reflect actual decisions
  (FormPredictiveTextInput shipped; FileUpload / FileDownload deliberately
  wrapper-less to match LifeSG's surface)
- Appendix repository structure updated to list every token file
  (`selection-and-input-tokens.css` and `content-tokens.css` were
  missing from the prior version) and the new components

## Build checkpoints

`npm run build` + `npm run build-storybook` ran green after each of the
8 component-shipping commits. No intermediate broken state.

## Verification status

| Check | Status | Notes |
|-------|--------|-------|
| `npm run build` | green | Every component commit |
| `npm run build-storybook` | green | Every component commit |
| `npx playwright test` | blocked | Pre-existing `divider.tsx` issue under Turbopack dev (see follow-ups) |

### Playwright suite blocker

`next dev` (Turbopack) fails to parse `src/components/ui/divider.tsx`'s
`border-t-[length:var(--_divider-thickness)]` arbitrary Tailwind value:

```
./src/app/globals.css:1237:27
.border-t-\[length\:var\(\.\.\.\)\] {
  border-top-width: var(...);
                        ^-- Unexpected token Delim('.')
```

This was already a warning under `next build` (preserved in the
production CSS pipeline output) and is now a hard error under Turbopack
dev. **Production build is unaffected** — `next build` completes and
the prerendered routes are valid. Playwright's `webServer.command` is
`next dev`, so the suite can't bring the app up.

Two-line fix in `divider.tsx`: swap
`border-t-[length:var(--_divider-thickness)]` for
`style={{ borderTopWidth: 'var(--_divider-thickness)' }}` (same treatment
for the matching `border-t-[color:var(--_divider-color)]`). Left
untouched to keep tonight's work scoped to the implementation plan.

## Conventions established this session

| Convention | Where | Rationale |
|------------|-------|-----------|
| `parameters: { controls: { disable: true } }` on every story whose `render` takes no args | `src/components/ui/*.stories.tsx` | Misleading-controls-panel finding from the prior handover |
| Component-specific `data-testid` inside side-by-side panes | `<div data-testid="form-file-upload-ours">` etc. | Plan §verification — keeps each comparison panel addressable by Playwright |
| Compound `Object.assign(Root, { Trigger, Inline, … })` for new compound components | popover-v2.tsx, singpass-button.tsx | Mirrors LifeSG's `SingpassButton.Default` / `ModalV2.Card` shape |
| FileUpload / FileDownload ship **without** FormField wrappers | (no `FormFileUpload` etc.) | LifeSG's `Form` namespace doesn't expose them; self-contained surfaces |
| Inline SVG path data for brand assets that LifeSG fetches from a CDN | `singpass-button.tsx` `singpassLogoPath` consts | Offline-robust, no external dependency on `assets.life.gov.sg` |
| Generic Storybook component stories cast to concrete `<T, V>` shapes | `predictive-text-input.stories.tsx` | Storybook can't infer argTypes from a `<T = unknown>` component |

## Final state numbers

- **Components ported**: 58 (up from 52)
- **Stories**: 53+6 = 59 component MDXs
- **Comparative sections**: 33 in selection-and-input + form + overlays
  registries
- **Storybook index.json entries**: not measured this session; expect
  ~380 (up from 347)
- **Commits ahead of `origin/main`**: 36 (28 prior + 9 this session,
  all unpushed)
- **Dependencies added**: 3 (`@dnd-kit/*`)

## Commits this session (in order)

```
5b0588a  fix(storybook): disable Controls panel on no-args render stories
2038c41  feat(tokens): add L3 tokens for 6 new components
a69b1e8  feat(singpass-button): port LifeSGs official Singpass CTA
459b585  feat(file-download): port LifeSGs FileDownload list
9775733  feat(file-upload): port LifeSGs FileUpload with sortable + editable
98c89e7  feat(predictive-text-input): port LifeSGs async combobox
21fd2e5  feat(popover-v2): port LifeSGs v2 popover with Trigger + Inline
85c8ab4  docs(storybook): MDX audit pilot — port per-variant prose for 5 components
0679a99  docs: proposal refresh + 2026-06-07 handover + checked-in plan
```

9 atomic commits, each leaving `npm run build` + `npm run build-storybook`
green.

## What's NOT in scope this session

- **Pushing to `origin/main`** — same as the prior handover; carried forward.
- **MDX audit sweep of the remaining ~48 components** — pilot confirmed
  the shape; sweep is mechanical, queued for a follow-up.
- **Visual parity tuning** — token values are LifeSG-source-correct
  numerically but haven't been pixel-compared against the LifeSG reference
  panes. Walk-through queued for the next session.
- **Divider.tsx fix to unblock Playwright** — documented in handover
  with a two-line workaround.
- **`react-dropzone`** — FileUpload uses native HTML5 drag-drop instead.
  Adds one fewer dependency; trade-off is we don't pick up
  react-dropzone's accept / capture polish for free.
- **Popover V2 deferred features** — enableResize, mobile ModalV2
  takeover, rootNode portal targeting. Documented in MDX + prose.
- **PredictiveTextInput deferred features** — dropdownRootNode portal
  targeting, substring-match highlighting in option labels.

## File references

- Implementation plan executed: `working-logs/2026-05-27-implementation-plan.md`
- Previous handover: `working-logs/2026-05-27-handover.md`
- Tonight's handover: `working-logs/2026-06-07-handover.md`
- Reusable codemod: `scripts/disable-controls-on-noargs.mjs`
- Proposal (refreshed): `working-logs/2026-05-27-proposal-tailwind-port.md`
