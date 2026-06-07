# Implementation Plan — Porting, Auditing, and Storybook Polishing

This plan details the implementation strategy for the four follow-up tasks from the 2026-05-27 handover. Revised through two rounds of peer review (Gemini initial draft → Claude review → Gemini revision → Claude final review).

1. **Porting 6 more components** (`file-upload`, `file-download`, `singpass-button`, `predictive-text-input`, `popover-v2` including `popover-inline`).
2. **MDX Intro-Content Audit** across our 53 components vs LifeSG's canonical MDX files.
3. **Misleading Controls Panel Fix** for Storybook tour/variant stories.
4. **Draft Proposal Review** and alignment.

---

## User Review Required

> [!IMPORTANT]
> **Token Infrastructure (Parity Principle):**
> Every new component requires L3 CSS variables in its respective token stylesheet and `@theme inline` mappings in [globals.css](file:///Users/powhweee/coding/lifesg/src/app/globals.css) to generate Tailwind utilities.
> - [form-tokens.css](file:///Users/powhweee/coding/lifesg/src/app/form-tokens.css): Add `--file-upload-*`, `--file-download-*`, and `--predictive-text-input-*` tokens.
> - [selection-and-input-tokens.css](file:///Users/powhweee/coding/lifesg/src/app/selection-and-input-tokens.css): Add `--singpass-button-*` tokens.
> - [overlays-tokens.css](file:///Users/powhweee/coding/lifesg/src/app/overlays-tokens.css): Add `--popover-v2-*` tokens.
> - [globals.css](file:///Users/powhweee/coding/lifesg/src/app/globals.css): Map all new variables under the `@theme inline` block so they compile into first-class utility classes.
>
> Token names listed in §1 below are *illustrative examples*. The final set will be determined during implementation by inspecting LifeSG's actual styled-components CSS for each component. The pattern follows existing components (e.g. the `--button-*` block in [selection-and-input-tokens.css](file:///Users/powhweee/coding/lifesg/src/app/selection-and-input-tokens.css)).

> [!IMPORTANT]
> **External Dependencies for File Upload Reordering:**
> LifeSG uses `@dnd-kit/core` and `@dnd-kit/sortable` for the drag-and-drop file list sorting (confirmed via [custom-sensors.d.ts](file:///Users/powhweee/coding/lifesg/node_modules/@lifesg/react-design-system/file-upload/custom-sensors.d.ts) which extends `MouseSensor` and `KeyboardSensor` from `@dnd-kit/core`). To maintain functional parity, we will add `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` to the project's dependencies in `package.json`.
> *The user will need to run `npm install` after the file change.*

> [!IMPORTANT]
> **Popover V2 Naming — Compound Component Pattern:**
> [popover.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/popover.tsx) already exports `PopoverTrigger` (Base UI primitive, line 9). To avoid a naming collision, `popover-v2.tsx` will use the **compound component pattern** (consistent with `SingpassButton.Default`, `ModalV2.Card`, etc.):
> - `PopoverV2` — the root, also serves as the box component
> - `PopoverV2.Trigger` — the high-level trigger wrapper (hover/click, delays, zIndex)
> - `PopoverV2.Inline` — the text-link trigger with underline styles and info icon
>
> Consumers import from one module or the other, never both — matching LifeSG's pattern where `popover` and `popover-v2` are separate package exports.
>
> **Storybook:** `PopoverInline` is a sub-export of `popover-v2` in LifeSG. We will not create separate `popover-inline` story/MDX files. Both trigger and inline stories live inside `popover-v2.stories.tsx` and `popover-v2.mdx`.

> [!IMPORTANT]
> **Modal V1 Sub-Component Scope:**
> Handover logs flagged a sub-component gap (`Header`/`Body`/`Footer`) in the older [modal.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/modal.tsx). Upon inspection of LifeSG's published typings ([modal/index.d.ts](file:///Users/powhweee/coding/lifesg/node_modules/@lifesg/react-design-system/modal/index.d.ts)), we confirmed that LifeSG's actual Modal V1 only exports `Modal` and `Modal.Box`. To preserve 100% API parity, we will **leave `modal.tsx` as-is** (Box-only wrapper) and will not introduce non-existent sub-components.

> [!IMPORTANT]
> **Form Wrapper Decisions — Why PredictiveTextInput Gets One But FileUpload/FileDownload Don't:**
> - LifeSG's [Form namespace](file:///Users/powhweee/coding/lifesg/node_modules/@lifesg/react-design-system/form/index.d.ts) includes `Form.PredictiveTextInput` (line 24) but does **not** include `Form.FileUpload` or `Form.FileDownload`.
> - `FileUpload` and `FileDownload` already bundle their own `title`, `description`, and `errorMessage` props — they are self-contained form elements, not wrapped in LifeSG's `FormField`.
> - Therefore: we implement `<FormPredictiveTextInput>` (using our `<FormField>` wrapper) but drop `FormFileUpload` and `FormFileDownload`.

---

## Open Questions

> [!NOTE]
> **1. Singpass Logo Assets:**
> LifeSG fetches Singpass logo SVGs from remote URLs (`https://assets.life.gov.sg/react-design-system/img/singpass/singpass_{red,white}_filled.svg`), confirmed in [singpass-assets.d.ts](file:///Users/powhweee/coding/lifesg/node_modules/@lifesg/react-design-system/singpass-button/singpass-assets.d.ts). To ensure self-containment and offline robustness, we propose inlining the SVG path data directly as React components in `singpass-button.tsx`.
> *Are you aligned with this self-contained inline SVG approach?*

> [!NOTE]
> **2. Predictive-Text-Input Architecture:**
> Base UI does not ship a Combobox primitive. We commit to implementing `<PredictiveTextInput>` as a composition of our `<Input>` component with a floating Base UI `<Popover>` for the dropdown positioning, plus a custom debounced `fetchOptions` handler triggered after `minimumCharacters` are typed. Keyboard navigation (ArrowUp/Down, Enter, Escape) will be implemented manually following WAI-ARIA combobox patterns.
> *Does this composition approach align with your expectations?*

---

## Proposed Changes

### 1. Token Infrastructure & CSS Variables

> [!NOTE]
> Token names below are representative examples showing the *shape* of each block. The final exhaustive list will be derived during implementation by inspecting LifeSG's styled-components source for each component.

#### [MODIFY] [form-tokens.css](file:///Users/powhweee/coding/lifesg/src/app/form-tokens.css)
- Add Layer 3 tokens for `file-upload`, `file-download`, and `predictive-text-input`. Example shape:
  - `--file-upload-bg`, `--file-upload-border`, `--file-upload-border-drag`, `--file-upload-radius`, …
  - `--file-download-item-bg`, `--file-download-item-border`, `--file-download-icon`, …
  - `--predictive-text-input-popover-bg`, `--predictive-text-input-item-hover-bg`, …

#### [MODIFY] [selection-and-input-tokens.css](file:///Users/powhweee/coding/lifesg/src/app/selection-and-input-tokens.css)
- Add Layer 3 tokens for `singpass-button`. Example shape:
  - `--singpass-button-bg-red`, `--singpass-button-bg-red-hover`, `--singpass-button-bg-white`, `--singpass-button-bg-white-hover`
  - `--singpass-button-text-red`, `--singpass-button-text-white`, `--singpass-button-border-white`, …

#### [MODIFY] [overlays-tokens.css](file:///Users/powhweee/coding/lifesg/src/app/overlays-tokens.css)
- Add Layer 3 tokens for `popover-v2` (shared by both Trigger and Inline). Example shape:
  - `--popover-v2-bg`, `--popover-v2-border`, `--popover-v2-radius`, `--popover-v2-shadow`
  - `--popover-v2-inline-link-color`, `--popover-v2-inline-underline`, …

#### [MODIFY] [globals.css](file:///Users/powhweee/coding/lifesg/src/app/globals.css)
- Map all new Layer 3 variables in the `@theme inline` block, following the existing naming convention (e.g. `--color-singpass-button-bg-red: var(--singpass-button-bg-red)`).

---

### 2. Form Components (`file-upload`, `file-download`, `predictive-text-input`)

#### [MODIFY] [package.json](file:///Users/powhweee/coding/lifesg/package.json)
- Add `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` to dependencies.

#### [NEW] [file-upload.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/file-upload.tsx)
- Recreates `@lifesg/react-design-system/file-upload`.
- Implements:
  - Drag-and-drop dropzone using native `onDragOver`/`onDragLeave`/`onDrop` events, styled with Tailwind classes.
  - Dropzone visual styles: `bordered` and `no-border` (`styleType`).
  - File list displaying names, MIME types, sizes, upload progress bars, and error messages.
  - Image thumbnail rendering using `thumbnailImageDataUrl`.
  - Description editing for image files (controlled via `editableFileItems` and `fileDescriptionMaxLength`).
  - Drag-and-drop reordering of file list using `@dnd-kit/core` + `@dnd-kit/sortable` when `sortable` is enabled (matching LifeSG's custom `MouseSensor`/`KeyboardSensor` pattern).
- Exposes only the standalone `<FileUpload>` component (no Form wrapper — see rationale above).

#### [NEW] [file-upload.stories.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/file-upload.stories.tsx) & [file-upload.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/file-upload.mdx)
- Stories: Default, Bordered, NoBorder, WithFileItems, WithErrors, ReadOnly, EditableDescriptions, Sortable.
- MDX page: Overview, import snippet, per-variant prose, accessibility notes, `<Controls />`.

#### [NEW] [file-download.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/file-download.tsx)
- Recreates `@lifesg/react-design-system/file-download`.
- Renders lists of `FileItemDownloadProps` with title, description, size, MIME type indicator, thumbnail, and error overlays.
- Fires `onDownload` callback when an item is clicked.
- Exposes only the standalone `<FileDownload>` component (no Form wrapper).

#### [NEW] [file-download.stories.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/file-download.stories.tsx) & [file-download.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/file-download.mdx)
- Stories: Default, Bordered, NoBorder, WithErrors, NotReady.

#### [NEW] [predictive-text-input.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/predictive-text-input.tsx)
- Recreates `@lifesg/react-design-system/predictive-text-input`.
- Architecture: `Input` + Base UI `Popover` composition with a custom positioning layer.
- Features:
  - Generic `<T, V>` type parameters matching LifeSG's API.
  - Debounced async `fetchOptions` triggered after `minimumCharacters` are typed.
  - Options list rendering via `listExtractor` (returns `string` or `ListItemDisplayProps`).
  - Selected value display via `displayValueExtractor`.
  - ArrowUp/Down keyboard navigation, Enter-to-select, Escape-to-close.
  - `alignment`, `dropdownZIndex`, `dropdownRootNode`, `dropdownWidth` positioning props.
- Exposes `<PredictiveTextInput>` and `<FormPredictiveTextInput>` (wraps in `<FormField>`, matching LifeSG's `Form.PredictiveTextInput`).

#### [NEW] [predictive-text-input.stories.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/predictive-text-input.stories.tsx) & [predictive-text-input.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/predictive-text-input.mdx)
- Stories: Default (mock local list), AsyncFetch (simulated delay), CustomListItems, Disabled, ReadOnly.

#### [MODIFY] [registry.tsx](file:///Users/powhweee/coding/lifesg/src/components/form/registry.tsx) & [prose.tsx](file:///Users/powhweee/coding/lifesg/src/components/form/sections/prose.tsx)
- Add sidebar folder entries and intro prose for `file-upload`, `file-download`, and `predictive-text-input`.

#### [NEW] Comparative App Sections:
- [file-upload-default.tsx](file:///Users/powhweee/coding/lifesg/src/components/form/sections/file-upload-default.tsx)
- [file-download-default.tsx](file:///Users/powhweee/coding/lifesg/src/components/form/sections/file-download-default.tsx)
- [predictive-text-input-default.tsx](file:///Users/powhweee/coding/lifesg/src/components/form/sections/predictive-text-input-default.tsx)
- Side-by-side rendering panels comparing Ours vs LifeSG.
- Each section uses a **component-specific `data-testid`** (e.g. `data-testid="form-file-upload-ours"`, `data-testid="form-file-upload-lifesg"`) instead of the generic `form-ours` / `form-lifesg`, so parity tests can target the correct content.
- File-upload and download panels render pre-populated mock file arrays for deterministic visual snapshots.

---

### 3. Selection and Input Components (`singpass-button`)

#### [NEW] [singpass-button.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/singpass-button.tsx)
- Recreates `@lifesg/react-design-system/singpass-button`.
- Standard `<button>` wrapper implementing the official Singpass styling.
- Inlines the Singpass red-filled and white-filled SVG logo path data as React components.
- Compound component pattern: `SingpassButton.Default`, `SingpassButton.Small`, `SingpassButton.Large`.

#### [NEW] [singpass-button.stories.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/singpass-button.stories.tsx) & [singpass-button.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/singpass-button.mdx)
- Stories: DefaultRedFilled, DefaultWhiteFilled, SmallRedFilled, SmallWhiteFilled, LargeRedFilled, LargeWhiteFilled.

#### [MODIFY] [registry.tsx](file:///Users/powhweee/coding/lifesg/src/components/selection-and-input/registry.tsx) & [prose.tsx](file:///Users/powhweee/coding/lifesg/src/components/selection-and-input/sections/prose.tsx)
- Add sidebar entries and intro prose for `singpass-button`.

#### [NEW] [singpass-button-default.tsx](file:///Users/powhweee/coding/lifesg/src/components/selection-and-input/sections/singpass-button-default.tsx)
- Side-by-side pane with component-specific `data-testid="sni-singpass-button-ours"` / `data-testid="sni-singpass-button-lifesg"`.

---

### 4. Overlay Components (`popover-v2`)

#### [NEW] [popover-v2.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/popover-v2.tsx)
- Implements LifeSG's V2 Popover design using Base UI's popover primitives.
- Compound component exports:
  - `PopoverV2` — root + box component, enforces `maxHeight` and `overflow` controls.
  - `PopoverV2.Trigger` — high-level trigger wrapper with `trigger` (click/hover), `position`, `delay`, `zIndex`, `customOffset`, `enableFlip`, `enableResize`, `rootNode` props.
  - `PopoverV2.Inline` — link-styled trigger with `content`, `underlineStyle`, `underlineHoverStyle`, `icon` props.

#### [NEW] [popover-v2.stories.tsx](file:///Users/powhweee/coding/lifesg/src/components/ui/popover-v2.stories.tsx) & [popover-v2.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/popover-v2.mdx)
- Contains stories for both Trigger and Inline variants in a unified documentation set.
- Stories: ClickTrigger, HoverTrigger, CustomOffset, FlipBehavior, InlineDefault, InlineUnderlineDashed, InlineCustomIcon.

#### [MODIFY] [registry.tsx](file:///Users/powhweee/coding/lifesg/src/components/overlays/registry.tsx) & [prose.tsx](file:///Users/powhweee/coding/lifesg/src/components/overlays/sections/prose.tsx)
- Group `popover-v2` as a folder:
  - `popover-v2/introduction`
  - `popover-v2/default` (Ours vs LifeSG PopoverV2.Trigger comparison)
  - `popover-v2/inline` (Ours vs LifeSG PopoverV2.Inline comparison)

#### [NEW] Comparative App Sections:
- [popover-v2-default.tsx](file:///Users/powhweee/coding/lifesg/src/components/overlays/sections/popover-v2-default.tsx) — `data-testid="overlays-popover-v2-ours"` / `"overlays-popover-v2-lifesg"`
- [popover-inline-default.tsx](file:///Users/powhweee/coding/lifesg/src/components/overlays/sections/popover-inline-default.tsx) — `data-testid="overlays-popover-inline-ours"` / `"overlays-popover-inline-lifesg"`

---

### 5. Storybook Controls Polish

#### [MODIFY] Component Stories (`src/components/ui/*.stories.tsx`)
- Inspect all component stories (~37 files, ~80–100 story exports using `render: () =>` without args).
- Add `parameters: { controls: { disable: true } }` on each static variant story.

> [!WARNING]
> **Immediate Build Checkpoint:** Run `npm run build-storybook` immediately after completing this sweep and **before** starting any new component work (§2–§4). If any story has a malformed `parameters` object (missing comma, wrong nesting), the SB10 indexer will crash silently. Catching this early avoids debugging a build failure later when new stories are also in the mix.

---

### 6. MDX Intro-Content Audit (Pilot)

#### [MODIFY] Component MDX Files (`src/components/ui/*.mdx`)
- Fetch canonical LifeSG MDX via GitHub API, compare side-by-side, and port:
  - Missing `## Overview` headers
  - Per-variant explanatory prose (the "use this when…" / "set X if Y" sentences)
  - Accessibility code examples (e.g. `headingLevel` for Accordion)
- **Preserve** our Notes sections, `<Source>` import syntax, and `<Controls of={…}>` pattern.
- **Pilot Scope:** 5 components:
  - [accordion.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/accordion.mdx)
  - [button.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/button.mdx)
  - [input.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/input.mdx)
  - [modal-v2.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/modal-v2.mdx)
  - [calendar.mdx](file:///Users/powhweee/coding/lifesg/src/components/ui/calendar.mdx)

---

### 7. Proposal Review & Alignment

> [!NOTE]
> **Deferred until porting is complete.** The proposal references "50+ components" and an Appendix file structure that will change once the 6 new components are added. Updating now would require a second pass later. Instead, after all porting work (§2–§4) is done, perform a single proposal refresh:
> - Update component count and coverage claims
> - Add new token files to the Appendix structure
> - Verify all repository/Storybook URLs still resolve
> - Cross-reference the `Form.X convenience wrapper gap` section against the actual Form wrapper decisions made (PredictiveTextInput yes, FileUpload/FileDownload no)
> - Proofread code examples for accuracy against the final implementations

---

## Execution Order

The recommended execution sequence, with checkpoints:

1. **§5 — Controls sweep** (~37 files, mechanical)
2. **Checkpoint: `npm run build-storybook`** — verify indexer health
3. **§1 — Token infrastructure** (all token files + globals.css)
4. **§3 — SingpassButton** (simplest new component, validates the token workflow end-to-end)
5. **§2 — FileDownload** → **FileUpload** → **PredictiveTextInput** (increasing complexity)
6. **§4 — PopoverV2** (most complex, depends on understanding Base UI Popover well)
7. **§6 — MDX audit pilot** (5 components)
8. **§7 — Proposal refresh** (after all porting is complete)

---

## Verification Plan

### Automated Tests

#### Playwright Visual & Functional Parity Spec

Update [tests/parity.spec.ts](file:///Users/powhweee/coding/lifesg/tests/parity.spec.ts) to include the new routes with **component-specific test IDs**:

```typescript
// New entries for parity.spec.ts
{ name: "file-upload",           route: "/form/file-upload/default",                    panePrefix: "form-file-upload" },
{ name: "file-download",         route: "/form/file-download/default",                  panePrefix: "form-file-download" },
{ name: "predictive-text-input", route: "/form/predictive-text-input/default",           panePrefix: "form-predictive-text-input" },
{ name: "singpass-button",       route: "/selection-and-input/singpass-button/default",  panePrefix: "sni-singpass-button" },
{ name: "popover-v2",            route: "/overlays/popover-v2/default",                  panePrefix: "overlays-popover-v2" },
{ name: "popover-inline",        route: "/overlays/popover-v2/inline",                   panePrefix: "overlays-popover-inline" },
```

**Mock setup for deterministic snapshots:**
- File-upload/download comparison panes render static arrays of pre-populated `FileItemProps` / `FileItemDownloadProps` (no actual file I/O).
- PredictiveTextInput comparison pane uses a mock `fetchOptions` that returns a fixed array after a 0ms delay.

Run command:
```bash
npx playwright test --grep "file-upload|file-download|predictive-text-input|singpass-button|popover-v2|popover-inline"
```

#### Storybook Build Validation

Two build checkpoints:
1. **After §5 (controls sweep):** `npm run build-storybook` — catches malformed `parameters` before new work begins.
2. **After all new stories (§2–§4):** `npm run build-storybook` — validates the full index with new entries.

### Manual Verification

- Ask the user to run their build steps and start the local development servers.
- Navigate the local comparative preview app to inspect components side-by-side:
  - `/form/file-upload/default`
  - `/form/file-download/default`
  - `/form/predictive-text-input/default`
  - `/selection-and-input/singpass-button/default`
  - `/overlays/popover-v2/default`
  - `/overlays/popover-v2/inline`
- Open Storybook and confirm the Controls panel is disabled for static gallery stories.
