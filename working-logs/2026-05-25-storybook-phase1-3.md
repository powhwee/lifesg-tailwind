# Storybook Phase 1–3 Handover — 2026-05-25

Supersedes the Phase 1 / Phase 2 / Phase 3 sections of
`2026-05-24-storybook-handover.md`. The component inventory + Phases 4-5
roadmap there is still authoritative.

**All work is uncommitted on `main`** — review then commit as preferred.

## TL;DR

- **Phase 1 done** — preview.ts cleaned up for SB10; 3 shared decorator
  components (`Stack`, `Row`, `LabeledControl`) in
  `src/components/storybook-common/`; 5 stories refactored to use them.
- **Phase 2 done** — `@storybook/addon-docs@10.4.1` installed and wired;
  Getting Started landing page + MDX docs pages for all 13 existing stories.
  All 14 docs pages render with zero errors.
- **Phase 3 started** — `.stories.tsx` added for `divider`, `label`, `icon`
  (no MDX for these — template is now established, easy to apply later).

## Phase 1 — Decorator infrastructure

### `.storybook/preview.ts` cleanup

SB10's `backgrounds` parameter shape changed from `values: [...]` to
`options: { ... }`. The existing config was also redundant: `.dark` class
overrides `--lifesg-bg` in `lifesg-tokens.css`, so the theme decorator
already drives body bg. **Removed `backgrounds` entirely** rather than
porting to the new shape.

### Shared decorators

`src/components/storybook-common/story-layout.tsx` (re-exported via
`./index.ts`):

```tsx
<Stack gap={4}>             // flex flex-col with default gap-4
  ...                        // gap ∈ {1, 2, 3, 4, 6, 8}
</Stack>

<Row gap={4}>                // flex items-center with default gap-4
  ...
</Row>

<LabeledControl              // [control] + [label] paired row
  htmlFor="id"
  control={<Checkbox id="id" />}
  labelClassName="text-muted-foreground"
>
  Label text
</LabeledControl>
```

Designed to match the 3 recurring patterns I found across the 13 stories:
- vertical stack of variants (~7 uses) → `Stack`
- horizontal row of variants (~2 uses) → `Row`
- control + label row (~11 uses, all checkbox/radio) → `LabeledControl`

### Refactored 5 stories

button, checkbox, radio-button, toggle, typography. The 8 stories without
explicit layout boxes (input, select, multi-select, accordion, tab, popover,
modal-v2, breadcrumb) didn't need changes. RadioGroup's own `className`
stays for semantic + flex coupling.

## Phase 2 — MDX coverage

### Critical SB10 quirk

In Storybook 10, an `.mdx` file with `<Meta of={Stories} />` **collides**
with `tags: ["autodocs"]` on the stories' meta. The indexer crashes:
> Error: You created a component docs page for 'X', but also tagged the
> CSF file with 'autodocs'. This is probably a mistake.

**Resolution:** when authoring MDX for a component, remove
`tags: ["autodocs"]` from the corresponding `.stories.tsx`. The MDX file
becomes the canonical docs page; autodocs is for stories without MDX.

I removed autodocs from all 13 component stories. Going forward: pick one
or the other.

### addon-docs installed

`@storybook/addon-docs@^10.2.10` (resolved to 10.4.1) installed as a dev
dep and added to `addons` in `main.ts`. SB10 split this out of core; without
it, MDX renders as plain markdown without `<Canvas>` / `<Controls>` etc.

### MDX template

Every component MDX follows this shape:

```mdx
import { Canvas, Controls, Meta, Source } from "@storybook/addon-docs/blocks";
import * as XStories from "./x.stories";

<Meta of={XStories} />

# ComponentName

One-paragraph description of what the component does.

## Import
<Source language="tsx" code={`import { X } from "@/components/ui/x";`} />

## Default
<Canvas of={XStories.Default} />

## Variants / States
<Canvas of={XStories.Variant1} />
...

## Props
<Controls of={XStories.Default} />

## Accessibility
- Notes...

## Notes
- Convention rationales, token references, deferred items, etc.
```

### Files created

- `src/components/getting-started.mdx` — sidebar landing page with stack,
  import patterns, taxonomy, parity principle summary, convention table.
- `src/components/ui/{button,checkbox,radio-button,toggle,accordion,tab,typography,modal-v2,popover,input,select,multi-select,breadcrumb}.mdx`
  — 13 docs pages, each verified to render with `h1≥1` / `len>500` / `errs=0`.

### Verification

```
getting-started--docs                              h1=1 len=15868 errs=0 ✓
selection-and-input-button--docs                   h1=1 len=38144 errs=0 ✓
selection-and-input-checkbox--docs                 h1=1 len=37182 errs=0 ✓
selection-and-input-radiobutton--docs              h1=1 len=29253 errs=0 ✓
selection-and-input-toggle--docs                   h1=1 len=33097 errs=0 ✓
content-accordion--docs                            h1=1 len=25265 errs=0 ✓
content-tab--docs                                  h1=1 len=18103 errs=0 ✓
core-typography--docs                              h1=3 len=27181 errs=0 ✓
overlays-modalv2--docs                             h1=1 len=25416 errs=0 ✓
overlays-popover--docs                             h1=1 len=17115 errs=0 ✓
form-input--docs                                   h1=1 len=29797 errs=0 ✓
form-select--docs                                  h1=1 len=24948 errs=0 ✓
form-multiselect--docs                             h1=1 len=25022 errs=0 ✓
navigation-breadcrumb--docs                        h1=1 len=20005 errs=0 ✓
```

(Typography shows `h1=3` because `<Canvas>` embeds render real
`<Typography variant="heading-xxl">` elements which map to `<h1>` semantics.
Not a bug.)

## Phase 3 — Stories opened

`.stories.tsx` for 3 simple components added; **no MDX yet** for these (the
template is established; consider adding when scope is right). These join
the 13 existing stories as additional component coverage.

| Component | Stories |
|---|---|
| `divider` | Default, Dashed, Thickness, CustomColor |
| `label` | Default, Disabled, WithRequiredMark, States |
| `icon` | Default, Sizes, Tones, Gallery |

All 12 stories verified to render with zero errors.

## What's NOT in scope this session

Phase 3 was originally framed as "add stories for ~17 low-complexity
components." I shipped 3 to leave a clean checkpoint rather than rush. The
remaining 14 from the 2026-05-24 storybook handover Phase 3 table can be
picked up as discrete batches:

> card, avatar, icon-button, image-button, markup, layout, field,
> form-field, box-container, table, textarea, feedback-rating, text-list,
> uneditable-section

Phase 4 (high-complexity: drawer, menu, modal, data-table, calendar,
date-input, dates, masthead, navbar, footer, sidenav, local-nav, link-list,
pagination, otp-input, etc.) untouched.

Phase 5 (foundations polish — Component tokens story, Themes story, etc.)
untouched.

## Verification

- **TypeScript**: clean (`tsc --noEmit` → 0 errors)
- **Storybook static build**: clean (`npx storybook build` → success)
- **MDX docs pages**: 14/14 render
- **Phase 3 stories**: 12/12 render

`verify-all` not re-run — this work is Storybook-only and doesn't touch
the `src/app/` LifeSG demo pages.

## File-by-file diff summary

```
Modified (configuration):
  .gitignore                                      # /storybook-static/ added
  .storybook/main.ts                              # @storybook/addon-docs registered
  .storybook/preview.ts                           # backgrounds config removed (SB10 shape change + redundancy)
  package.json                                    # +@storybook/addon-docs devDep
  package-lock.json                               # ditto

Modified (13 stories — autodocs tag removed; 5 refactored for decorators):
  src/components/ui/accordion.stories.tsx         # autodocs tag removed
  src/components/ui/breadcrumb.stories.tsx        # ditto
  src/components/ui/button.stories.tsx            # ditto + Sizes refactored (Stack/Row)
  src/components/ui/checkbox.stories.tsx          # ditto + States refactored (Stack/LabeledControl)
  src/components/ui/input.stories.tsx             # ditto
  src/components/ui/modal-v2.stories.tsx          # ditto
  src/components/ui/multi-select.stories.tsx      # ditto
  src/components/ui/popover.stories.tsx           # ditto
  src/components/ui/radio-button.stories.tsx      # ditto + Default/SmallSize/States refactored
  src/components/ui/select.stories.tsx            # ditto
  src/components/ui/tab.stories.tsx               # ditto
  src/components/ui/toggle.stories.tsx            # ditto + ToggleGroup refactored
  src/components/ui/typography.stories.tsx        # ditto + Headings/Body/Weights refactored

New (decorators):
  src/components/storybook-common/story-layout.tsx
  src/components/storybook-common/index.ts

New (MDX docs — 14 files):
  src/components/getting-started.mdx
  src/components/ui/{button,checkbox,radio-button,toggle,accordion,
                     tab,typography,modal-v2,popover,input,select,
                     multi-select,breadcrumb}.mdx

New (Phase 3 stories):
  src/components/ui/divider.stories.tsx
  src/components/ui/label.stories.tsx
  src/components/ui/icon.stories.tsx
```

## Decisions log

1. **Drop `backgrounds` config rather than port to SB10 shape.** Theme
   decorator already drives body bg via `.dark` class overriding
   `--lifesg-bg` in `lifesg-tokens.css`. Backgrounds was redundant.

2. **Three shared decorator components, not four.** The 2026-05-24
   handover suggested `StoryDecorator` (padding/border isolation),
   `GridDecorator`, `FullWidthStoryDecorator`. I went with `Stack` / `Row`
   / `LabeledControl` instead — matched the actual recurring patterns in
   the 13 existing stories. `StoryDecorator` would have been speculative
   (no story currently isolates with a border); `FullWidthStoryDecorator`
   is redundant with Storybook's native `layout: "fullscreen"` parameter.

3. **One docs source per component — MDX, not autodocs.** SB10 forces a
   choice. MDX is more controllable (prose + grouped Canvas + Source
   blocks). Autodocs removed from all 13.

4. **No MDX for Phase 3 stories yet.** Three new components have stories
   but no MDX. Faster cycle for getting coverage breadth; MDX template
   is documented and easy to apply later.

5. **Probe script lifecycle.** Used a single throwaway probe
   (`.check-stories-tmp.mjs` / `.check-mdx-tmp.mjs`) for each
   verification batch — created, ran, deleted within the same session.
   No permanent test infra added; the existing
   `scripts/verify-all.mjs` already covers the LifeSG demo pages.

## Resume procedure

1. `git status` → expect dirty working tree (this session's work).
2. Review the diff, then commit in logical chunks:
   - `chore: storybook v10 — backgrounds config cleanup + decorator infra`
   - `feat: storybook MDX docs for 13 existing component stories`
   - `feat: storybook stories for divider, label, icon`
3. Continue Phase 3 if desired — 14 simple components remain.
4. Phase 4 (high-complexity components) is a larger commitment; map
   complexity per component first.

## Open issues / pitfalls reinforced

- **Don't mix `tags: ["autodocs"]` with `.mdx` + `<Meta of={Stories} />`.**
  The indexer aborts; Storybook can't start. Catch via `storybook build`
  before merging — runtime-only errors are silent until then.
- **Storybook build is HMR-sensitive.** When I changed `tags: [...]` in a
  stories file while Storybook was running, the dev server died from a
  stale-state indexing error rather than recompiling. Required a clean
  restart.
- **MDX import path is `@storybook/addon-docs/blocks`** (not
  `@storybook/blocks` like SB 8 or `@storybook/addon-docs` like an
  intuition would suggest). The `/blocks` suffix is mandatory.

## One-line summary

> SB10 setup hardened — preview.ts cleaned, shared decorators landed, MDX
> docs (with addon-docs added) shipped for 13 existing components plus a
> Getting Started landing page, and 3 new component stories opened Phase 3.
> 0 errors across all 14 docs + 12 new story pages. All uncommitted.
