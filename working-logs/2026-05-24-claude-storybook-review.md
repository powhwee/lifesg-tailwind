# Claude's Storybook Review — May 24, 2026

## Context

Reviewed Gemini's initial Storybook implementation for the LifeSG Tailwind v4 port against the original LifeSG design system Storybook at https://designsystem.life.gov.sg/react/ and its GitHub source at https://github.com/LifeSG/react-design-system/tree/master/stories.

## Quick Fixes Identified & Applied

These were applied by Gemini Flash and verified by Gemini Pro in the same session:

1. **`docs.autodocs: "tag"` removed** from `.storybook/main.ts` — deprecated in Storybook 10, stories already use `tags: ["autodocs"]` directly.
2. **Button `argTypes.size.options`** — added missing `icon`, `icon-xs`, `icon-sm`, `icon-lg` variants to match `buttonVariants` in `button.tsx`. Gemini Pro also updated the `Sizes` render to visually show icon buttons.
3. **RadioButton `defaultChecked` conflict** — `States` story wrapped each radio in its own `RadioGroup` to avoid `defaultChecked` fighting with the group's `defaultValue`.
4. **Foundation controls hidden** — added `controls: { disable: true }` to all 8 foundation stories since they're static panels with no meaningful props.
5. **Taxonomy fixed** — changed `"Selection & Input"` → `"Selection and input"` across Button, Checkbox, RadioButton, Toggle to match original.
6. **Layout parity** — added `parameters: { layout: "fullscreen" }` to Tab and Breadcrumb stories to match original.

## Structural Gaps (Not Yet Addressed)

### 🔴 No MDX Documentation Pages
The original uses `.mdx` files as the primary documentation surface. Each component has:
- `button.mdx` — Overview, usage, accessibility, tokens
- `doc-elements.tsx` — Custom styled helpers for doc layout
- `props-table.tsx` — Custom props/API table
- `tokens-table.tsx` — Theming tokens reference

The ported Storybook has zero MDX pages; relies entirely on autodocs.

### 🔴 No Shared Decorator Components
Original uses `GridDecorator`, `FullWidthStoryDecorator`, `StackDecorator`, `StoryDecorator` from `stories/storybook-common/`. Ported uses inline Tailwind classes everywhere.

### 🟡 Story Pattern Difference
Original: "showcase all states in one render" per story.
Ported: separate named exports with args-based controls.
Both are valid; ported is more modern for SB10 but diverges from the original's at-a-glance visual comparison.

### 🔴 Coverage Gap
13 stories ported out of ~96 items in the original (excluding V2/Deprecated).
Components in `src/components/ui/` without stories: avatar, box-container, calendar, card, data-table, date-input, date-navigator, date-range-input, divider, drawer, error-display, feedback-rating, field, filter, footer, form-field, fullscreen-image-carousel, icon-button, icon, image-button, input-group, label, layout, link-list, local-nav, markup, masked-input, masthead, menu, modal, navbar, otp-input, pagination, phone-number-input, sidenav, table, text-list, textarea, uneditable-section, unit-number-input.

## Per-Component Notes

| Component | Taxonomy | Stories | Layout | Notes |
|-----------|----------|---------|--------|-------|
| Button | ✅ fixed | 8 separate vs 1 showcase | padded | API difference expected (CVA vs compound) |
| Accordion | ✅ | 2 stories | padded | Content differs (LifeSG text vs lorem) |
| ModalV2 | ✅ | Good match | padded | Close to original pattern |
| Checkbox | ✅ fixed | 5 separate vs 1 showcase | padded | No GridDecorator |
| Toggle | ✅ fixed | 6 separate vs 1 showcase | padded | No doc-elements |
| Tab | ✅ | 1 story | ✅ fixed to fullscreen | Simple divs vs custom ContentA/B/C/D |
| Breadcrumb | ✅ | 2 stories | ✅ fixed to fullscreen | `#` hrefs vs real URLs |
| Typography | ✅ | Cataloguing vs composition | padded | Different approach but valid |
| Select | ✅ | 4 stories | padded | Different API (expected) |
| RadioButton | ✅ fixed | 3 stories | padded | States fix applied |

## Recommendations (Prioritized)

1. **Content parity** — MDX docs or at minimum `parameters.docs.description` for existing 13 components
2. **Shared decorators** — `StoryDecorator`, `GridDecorator` to standardize layouts
3. **Component coverage** — stories for remaining ~40 ported components
4. **Foundations introductions** — MDX pages for each foundation topic
5. **Skip V2/Deprecated** — legacy content, not relevant to the port
