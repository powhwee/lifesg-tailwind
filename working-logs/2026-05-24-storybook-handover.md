# Storybook Handover — May 24, 2026

> **Update 2026-05-25:** Phases 1, 2, and the first 3 stories of Phase 3
> are done. See `2026-05-25-storybook-phase1-3.md` for the work record,
> decision log, SB10 quirks, and the MDX template. The remaining Phase 3
> coverage (14 simple components) + Phase 4 (high-complexity) + Phase 5
> (foundations polish) stay open; the component inventory + roadmap
> below is still authoritative for those.

## Current State

Storybook v10.4.1 is set up and running on this Next.js 16 + Tailwind v4 + Base UI project. Config lives in `.storybook/main.ts` and `.storybook/preview.ts`.

### What exists now

**13 component stories** (colocated in `src/components/ui/`):
- Selection and input: `button`, `checkbox`, `radio-button`, `toggle`
- Content: `accordion`, `tab`
- Core: `typography`
- Overlays: `modal-v2`, `popover`
- Form: `input`, `select`, `multi-select`
- Navigation: `breadcrumb`

**8 foundation stories** (in `src/components/foundations/`):
- `colours`, `font`, `breakpoint`, `spacing`, `motion`, `radius`, `border`, `shadow`
- Each renders a static panel from `sections/` — controls are disabled.

### What was fixed today

1. Removed deprecated `docs: { autodocs: "tag" }` from `main.ts`
2. Added missing icon size variants to Button argTypes + Sizes render
3. Fixed RadioButton States story (isolated each state into own RadioGroup)
4. Disabled empty controls panel on all 8 foundation stories
5. Fixed taxonomy: `"Selection & Input"` → `"Selection and input"` on 4 stories
6. Added `layout: "fullscreen"` to Tab and Breadcrumb stories

### Known open issues

- `preview.ts` has `parameters.backgrounds` with `default`/`values` syntax — may be deprecated in SB10. Needs verification. The `withThemeByClassName` decorator handles dark mode separately, so backgrounds config might be redundant.
- No MDX documentation pages at all
- No shared layout decorators — all story layouts use inline Tailwind classes
- Only 13/~50 ported components have stories

---

## Component Inventory

### Components WITH stories (13)

| File | Story Title | Notes |
|------|-------------|-------|
| `button.tsx` | Selection and input/Button | 8 stories + icon sizes |
| `checkbox.tsx` | Selection and input/Checkbox | 5 stories |
| `radio-button.tsx` | Selection and input/RadioButton | 3 stories, States fixed |
| `toggle.tsx` | Selection and input/Toggle | 6 stories |
| `accordion.tsx` | Content/Accordion | 2 stories |
| `tab.tsx` | Content/Tab | 1 story, fullscreen layout |
| `typography.tsx` | Core/Typography | 5 stories |
| `modal-v2.tsx` | Overlays/ModalV2 | Interactive trigger |
| `popover.tsx` | Overlays/Popover | Placement demos |
| `input.tsx` | Form/Input | 4 stories |
| `select.tsx` | Form/Select | 4 stories |
| `multi-select.tsx` | Form/MultiSelect | 3 stories |
| `breadcrumb.tsx` | Navigation/Breadcrumb | 2 stories, fullscreen layout |

### Components WITHOUT stories (41)

**Core** (5):
`divider.tsx`, `error-display.tsx`, `icon.tsx`, `layout.tsx`, `markup.tsx`

**Content** (5):
`box-container.tsx`, `card.tsx`, `data-table.tsx`, `fullscreen-image-carousel.tsx`, `table.tsx`

**Navigation** (7):
`avatar.tsx`, `footer.tsx`, `link-list.tsx`, `local-nav.tsx`, `masthead.tsx`, `navbar.tsx`, `pagination.tsx`, `sidenav.tsx`

**Selection and input** (6):
`calendar.tsx`, `date-navigator.tsx`, `feedback-rating.tsx`, `icon-button.tsx`, `image-button.tsx`, `otp-input.tsx`

**Overlays** (3):
`drawer.tsx`, `menu.tsx`, `modal.tsx`

**Form** (13):
`date-input.tsx`, `date-range-input.tsx`, `field.tsx`, `filter.tsx`, `form-field.tsx`, `input-group.tsx`, `label.tsx`, `masked-input.tsx`, `phone-number-input.tsx`, `textarea.tsx`, `text-list.tsx`, `uneditable-section.tsx`, `unit-number-input.tsx`

> [!NOTE]
> Some components in the original Storybook (`Slider`, `TimeRangePicker`, `Timepicker`, `RangeSlider`, `HistogramSlider`, `SelectHistogram`, `NestedSelect`, `NestedMultiSelect`, `OtpVerification`, `PredictiveTextInput`, `RangeSelect`, `E-Signature`) do NOT have corresponding files in `src/components/ui/` — they haven't been ported yet and should NOT get stories.

---

## Roadmap

### Phase 1: Decorator Infrastructure + Config Cleanup
*Estimated: 1 session*

**1a. Verify & fix `preview.ts`**
- Check if `parameters.backgrounds` with `default`/`values` syntax works in SB10 or needs updating. The SB10 API may use a different shape.
- The `withThemeByClassName` decorator already handles dark/light — consider whether backgrounds config is even needed.

**1b. Create shared decorators in `src/components/storybook-common/`**
- `StoryDecorator` — standard padding + optional border for component isolation
- `GridDecorator` — CSS grid for showing multiple variants side-by-side (replaces inline `flex gap-4` everywhere)
- `FullWidthStoryDecorator` — full-bleed wrapper (Tab, Breadcrumb, Masthead already use `layout: "fullscreen"` but may need inner padding reset)

These should be simple Tailwind-styled React components, NOT Storybook decorators (the original uses them as render wrappers inside story functions, not via the `decorators` array).

**1c. Refactor existing 13 stories** to use shared decorators instead of inline classes.

### Phase 2: MDX Spike + Getting Started Page
*Estimated: 1 session*

> [!IMPORTANT]
> **Do a spike first.** MDX support changed between Storybook 8 and 10. Before committing to writing 13+ MDX files, create ONE test MDX file (e.g., for Button), confirm it renders properly with `<Canvas>` embeds, and document any SB10-specific quirks.

**2a. MDX spike**
- Create `src/components/ui/button.mdx` with:
  - `import * as ButtonStories from './button.stories'`
  - `<Canvas of={ButtonStories.Default} />`
  - Basic Overview + import path section
- Verify it appears in the Storybook sidebar and renders correctly.

**2b. Getting Started / Installation page**
- Create `src/components/getting-started.mdx` (or similar)
- Simple page: package name, install command, basic usage, link to Tailwind v4 setup
- This is an easy win and matches the original's landing page.

**2c. MDX template**
Once the spike works, establish a standard template:
```
## Overview
Import path, basic usage code block

## Variants / States
<Canvas> embeds for each story

## Props
Auto-generated or manual props table

## Accessibility
Notes from original where applicable
```

**2d. Write MDX for existing 13 components**

### Phase 3: Component Coverage — Low Complexity
*Estimated: 1–2 sessions*

Add stories for simpler components that are mostly presentational:

| Component | Category | Complexity | Status |
|-----------|----------|------------|--------|
| `divider` | Core | Trivial — just horizontal/vertical | ✅ 2026-05-25 (stories only, no MDX yet) |
| `label` | Form | Trivial — text with optional required indicator | ✅ 2026-05-25 (stories only, no MDX yet) |
| `icon` | Core | Low — render a few icons | ✅ 2026-05-25 (stories only, no MDX yet) |
| `card` | Content | Low — container with slots | pending |
| `avatar` | Navigation | Low — image/initials circle | pending |
| `icon-button` | Selection and input | Low — button with icon | pending |
| `image-button` | Selection and input | Low — button with image | pending |
| `markup` | Core | Low — HTML renderer | pending |
| `layout` | Core | Low — container with max-width | pending |
| `field` | Form | Low — form field wrapper | pending |
| `form-field` | Form | Low — label + error | pending |
| `box-container` | Content | Low — styled container | pending |
| `table` | Content | Low — basic table | pending |
| `textarea` | Form | Low — multiline input | pending |
| `feedback-rating` | Selection and input | Low — star/emoji rating | pending |
| `text-list` | Core (or Form) | Low — ordered/unordered list | pending |
| `uneditable-section` | Content (or Form) | Low — readonly display | pending |

### Phase 4: Component Coverage — High Complexity
*Estimated: 2–3 sessions*

These components have significant interactivity, internal state, or complex APIs:

| Component | Category | Notes |
|-----------|----------|-------|
| `drawer` | Overlays | Needs open/close trigger like Modal |
| `menu` | Overlays | Dropdown with items |
| `modal` | Overlays | Legacy modal (v1) — decide if worth documenting |
| `data-table` | Content | Complex — sorting, pagination, column config |
| `fullscreen-image-carousel` | Content | Needs sample images |
| `calendar` | Selection and input | Complex interactive calendar |
| `date-navigator` | Selection and input | Month/year navigator |
| `date-input` | Form | Date picker with validation |
| `date-range-input` | Form | Two date pickers |
| `filter` | Selection and input | Multi-section filter panel |
| `input-group` | Form | Composed input with addons |
| `masked-input` | Form | Input with format mask |
| `phone-number-input` | Form | Country code + number |
| `unit-number-input` | Form | Singapore unit number format |
| `otp-input` | Selection and input | Multi-digit code input |
| `masthead` | Navigation | Full header with logo, nav, actions |
| `navbar` | Navigation | Top navigation bar |
| `footer` | Navigation | Site footer |
| `sidenav` | Navigation | Side navigation panel |
| `local-nav` | Navigation | Sub-navigation |
| `link-list` | Navigation | List of links |
| `pagination` | Navigation | Page navigation |

### Phase 5: Foundations Polish
*Estimated: 0.5 session*

- Add "Component tokens" foundation story (exists in original, missing in port)
- Add "Themes" story if `sections/themes-dark-mode.tsx` already exists (it does)
- Consider MDX introduction pages for each foundation topic

---

## Key References

- **Original Storybook**: https://designsystem.life.gov.sg/react/index.html
- **Original source**: https://github.com/LifeSG/react-design-system/tree/master/stories
- **Claude's detailed review**: `working-logs/2026-05-24-claude-storybook-review.md`
- **Storybook config**: `.storybook/main.ts`, `.storybook/preview.ts`
- **Foundation sections**: `src/components/foundations/sections/`
- **Git tag before storybook**: `pilot-pre-storybook`
