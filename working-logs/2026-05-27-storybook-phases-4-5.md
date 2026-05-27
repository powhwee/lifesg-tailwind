# Storybook Phases 4 + 5 Working Log — 2026-05-27

Single-session push that closed the storybook handover roadmap.
Picks up from `2026-05-25-storybook-phase1-3.md`.

All commits on `main`, none pushed. 28 commits ahead of `origin/main`
at end of session.

## TL;DR

- **Phase 4 done** — 23 high-complexity components shipped in 7 batches
  (A–G). Each ships paired `.stories.tsx` + `.mdx`.
- **Phase 5 done** — Foundations sidebar now has paired prose + visual
  panel for every concern (Border, Breakpoint, Colours, Font, Motion,
  Radius, Shadow, Spacing) plus Introduction and Themes.
- **Infrastructure fixes** — next/font wired into Storybook preview
  (was rendering serif), top-level sidebar order pinned to LifeSG's
  canonical sequence, remark-gfm wired into MDX (tables were silently
  rendering as literal pipes).
- **Pattern established** — `.system.stories.tsx` file-naming convention
  for components with both visual tour + API examples (layout,
  typography, divider only).

## Phase 4 — high-complexity components (7 batches, 23 components)

Each batch verified against `storybook build` static output via
playwright probe (docs page renders, story-required selector present,
zero console errors). Probes were throwaway — created, ran, deleted
within their batch.

| Batch | Commit | Components | Stories | Notes |
|-------|--------|------------|---------|-------|
| A | `1b1351e` | input-group, masked-input, phone-number-input, unit-number-input, otp-input | 33 | Form input variants — share `--input-*` shell tokens |
| B | `4b2813f` | pagination, error-display, footer | 21 | Simple chrome — error-display has 11 built-in types |
| C | `ba2aa9a` | drawer, menu, modal (v1) | 20 | Overlays rendered open via `defaultOpen` so canvas shows content |
| D | `9cd7024` | masthead, navbar, sidenav, local-nav, link-list | 18 | Nav chrome; uses `layout: "fullscreen"` |
| E | `7185120` | fullscreen-image-carousel, filter | 11 | Image carousel keyboard-nav; filter on Base UI Accordion |
| F | `d31ce6d` | calendar, date-input, date-range-input, date-navigator | 28 | Highest complexity — react-day-picker; all controlled |
| G | `f9e54e8` | data-table | 9 | Single biggest component — sort/select/action-bar/loading/empty |

## Phase 5 — Foundations (1 commit + 1 dedup + 1 re-pair)

Three iterations because I missed pre-existing infrastructure:

### Initial mistake (`6e62331`)
Added 6 MDX foundation pages without checking that commit `58f6a59`
(May 24) had already shipped 8 stories under
`src/components/foundations/{border,breakpoint,colours,font,motion,radius,shadow,spacing}.stories.tsx`
backed by visual panels in `sections/*.tsx`. Result: duplicate sidebar
entries (Foundations/Colours/LifeSG from my MDX vs Foundations/Colours
from existing story, etc.).

### Dedup (`8043260`)
Deleted my 4 duplicate MDXs (Colours, Spacing, Radius, Shadow) and the
unused `swatches.tsx` helper. Kept Introduction + Themes/Introduction
MDX (no existing equivalents). Added
`themes-dark-mode.stories.tsx` wrapping the existing
`sections/themes-dark-mode.tsx` panel.

### Re-pair (`9692a2c`)
User pointed out the dedup dropped good developer-onboarding prose.
Restored: every existing foundation story now has a paired `.mdx`
with `<Meta of={…Stories} />` that:
- Imports the existing visual story
- Embeds the panel via `<Canvas of={Stories.Default} />`
- Provides the prose context (L1/L2/L3 explanation, when to use
  raw vs semantic, scale-gap warnings, component aliases, etc.)

This matches the Phase 2 component pattern — MDX for prose, stories
for canvases. 8 new MDX files added; covers Border, Breakpoint,
Colours, Font, Motion, Radius, Shadow, Spacing.

## Infrastructure fixes (4 commits)

### System-tour file split (`6dcf3de`, `8cf7753`)
After confusion over "why is our `FlexLayout` story different from
LifeSG's", established the pattern: components with both a visual
system tour AND API examples get two files —
`<comp>.stories.tsx` + `<comp>.system.stories.tsx` with title
`<Category>/<Comp>/System Tour`. Audited LifeSG's index.json — only 3
components have this shape: **layout**, **typography**, **divider**.

System-tour stories carry `parameters.docs.source.code` overrides so
"Show code" displays the canonical API snippet, not the demo
wash plumbing.

### next/font in Storybook preview (`1ff21fa`)
`src/app/layout.tsx` uses `next/font/google` to bind Open Sans on
`<html>`. `RootLayout` doesn't render in Storybook iframes, so the
font variable stayed unset and stories fell back to serif. Mirrored
the call in `.storybook/preview.ts` with a decorator that applies the
classNames to `documentElement`.

### Top-level sidebar order (`70f708a`)
Sidebar was rendering in load-discovery order. Pulled LifeSG's
`storySort.order` from their public `preview.ts` on GitHub, filtered
to our 8 top-level groups, pinned them in our preview:

```
Getting Started → Foundations → Core → Content → Navigation →
Selection and input → Overlays → Form
```

Sub-groups + stories still sort alphabetically inside each level.

### remark-gfm for MDX tables (`7d4d03d`)
SB10 ships MDX 3 which doesn't enable GFM extensions by default. Pipe
table syntax was rendering as literal `|`-separated text — ~10 MDX
files affected (Foundations Introduction "Token layers", Typography
"Scale reference", Layout "Override scopes", ErrorDisplay variant
matrix, etc.). Installed `remark-gfm`, wired it into addon-docs via
the new addon-config-object shape in `main.ts`.

## Memories added (4)

- `coldiv-default-span` — `<ColDiv>` defaults to `1 / -1` span when no
  `*Cols` prop is set; bare siblings overlap as full-width rows
- `storybook-font-init` — Storybook preview must mirror app layout's
  `next/font` calls or iframes render serif
- `storybook-system-tour-pattern` — file-naming convention for the
  API + System Tour split
- `mdx-curly-braces-escape` — `{name}` in MDX prose parses as JSX
  expression; wrap in inline backticks to escape
- `storybook-mdx-gfm` — SB10 MDX 3 needs `remark-gfm` for tables
  to render

## Final state numbers

- **Stories** — 53 components covered, every UI primitive in
  `src/components/ui/` has paired `.stories.tsx` + `.mdx`
- **Foundations** — 8 paired story+MDX + Introduction + Themes
  (Introduction MDX + Dark Mode story)
- **System tours** — 3 components (layout, typography, divider)
- **Total entries** — 347 in `index.json` (vs ~250 at session start)

## Commits this session (in order)

```
1b1351e  feat: storybook Phase 4A — input-group, masked-input, …
4b2813f  feat: storybook Phase 4B — pagination, error-display, footer
ba2aa9a  feat: storybook Phase 4C — drawer, menu, modal (v1)
9cd7024  feat: storybook Phase 4D — masthead, navbar, sidenav, local-nav, link-list
7185120  feat: storybook Phase 4E — fullscreen-image-carousel, filter
d31ce6d  feat: storybook Phase 4F — calendar, date-input, date-range-input, date-navigator
f9e54e8  feat: storybook Phase 4G — data-table (Phase 4 complete)
6e62331  feat: storybook Phase 5 — Foundations tours (Phase 5 complete)
70f708a  chore(storybook): align top-level sidebar order with LifeSG canonical
8043260  fix(storybook): de-duplicate Foundations — drop MDX that shadows pre-existing stories
7d4d03d  fix(storybook): enable GFM tables in MDX via remark-gfm
9692a2c  docs(storybook): pair every Foundations story with developer-onboarding MDX

(Plus earlier this session, pre-Phase 4:)
869bd2c  chore: storybook 10 cleanup + shared decorator infra
61e50b5  feat: storybook MDX docs for 13 components + addon-docs wired
149bde3  feat: storybook stories for divider, label, icon
6e4cb3e  feat: storybook MDX docs for divider, label, icon
bb1fab4  feat: storybook stories + MDX for field, form-field, textarea, feedback-rating
fcc3030  feat: storybook stories + MDX for card, avatar, icon-button, image-button
9d7a256  feat: storybook stories + MDX for markup, layout, text-list, box-container, table, uneditable-section
f620133  docs: mark Phase 3 complete in 2026-05-24 storybook handover
784b44f  feat: storybook layout — add LifeSG-style system-tour stories
6dcf3de  refactor(storybook): split Layout into API + System Tour files
1ff21fa  fix(storybook): load Open Sans + Geist Mono in preview so stories match the app
8cf7753  refactor(storybook): split Typography + Divider into API + System Tour files
```

## What's NOT in scope this session

- Pushing to `origin/main`
- Additional component porting (6 new components queued for next
  session — see handover)
- Cross-check of every component MDX's prose quality against LifeSG's
  canonical intros (queued — see handover)
