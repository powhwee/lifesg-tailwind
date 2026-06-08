# Visual parity walk-through — 6 new components

Inspection of the side-by-side comparison panes captured by tonight's
Playwright run. Snapshots live at
`tests/parity.spec.ts-snapshots/<component>-comparison-chromium-darwin.png`.

Classification follows the parity-principle workflow:
**DEFECT** (ours diverges from LifeSG and shouldn't) ·
**ours-is-better** (ours diverges and we prefer ours) ·
**demo-state** (diff is from the comparative pane setup, not the component) ·
**structural** (intentional architectural difference) ·
**noise** (sub-pixel font hinting, etc.)

---

## SingpassButton — clean

Visually identical across all six size/style combinations and the
disabled state. Inlined SVG wordmark matches the LifeSG remote-fetched
SVG. **No diffs to fix.**

---

## FileDownload — 3 defects, 1 ours-is-better

| Diff | Class | Notes |
|------|-------|-------|
| Title `Reference documents` renders **bold** in ours, **regular** in LifeSG | DEFECT | The `Title` text-style currently uses `component-header` (22/28 bold). LifeSG uses `BodyBL` (18/26 regular). Drop the `font-bold` class on the title `<p>`. |
| Size meta lives on a second line under the file name in ours; LifeSG right-aligns size on the same row | DEFECT | Row layout: `[icon] [name + meta-stacked-below] [action]`. LifeSG is `[icon] [name] [size right-aligned] [action]`. Restructure the row. |
| Item background is white in ours, light grey (#F1F1F4 ish) in LifeSG | DEFECT | LifeSG `file-list-card` adds a subtle background to the row card. Add a tinted bg token (`--file-download-item-bg` swap to `lifesg-bg-strong` or similar). |
| Size format `340.0 KB` / `1.4 MB` vs LifeSG `340 KB` / `1 MB` | ours-is-better | LifeSG rounds aggressively (drops the decimal); ours keeps it. Decimal is more honest for the user. |

---

## FileUpload — 4 defects, 1 ours-is-better

| Diff | Class | Notes |
|------|-------|-------|
| Same title-weight, size-on-right, and item-bg diffs as FileDownload | DEFECT | These three rows share the dropzone+list chrome. Fix once in both components (the per-item tokens are separate but the same pattern). |
| PDF row shows a generic upload icon in ours; LifeSG renders a large red `PDF` badge | DEFECT | LifeSG's `file-list-item` reads the extension off `name` (or MIME) and picks a per-type SVG. Ours has only one fallback icon. Worth a small `<FileTypeIcon>` helper that maps `pdf|doc|jpg|…` to a coloured badge. |
| `description` field on an item ("Front side") not rendered in ours | DEFECT | I declared the prop on `FileItemProps` but didn't render it in `FileItemRow`. Add a `{description && …}` line under the name/meta block. |
| File-name truncation — LifeSG truncates aggressively to `"Pho … jpg"` / `"Phot … IC.jpg"`; ours wraps with `truncate` (single ellipsis) | ours-is-better | LifeSG's middle-truncate produces unreadable filenames in narrow rows. Our `truncate` reads cleanly. Keep ours. |

---

## PredictiveTextInput — 0 defects (closed state)

The closed input field matches LifeSG visually. The one diff is that our
"inside FormField" demo shows the description `"Singapore HDB region"`;
LifeSG's `Form.PredictiveTextInput` doesn't accept a description prop so
it just doesn't render. **Demo-state**, not a defect.

> Note: the dropdown surface (open state, item rows, loading / error
> rows) isn't captured in this baseline. Walk through it manually before
> shipping — type `Bukit` in the standalone field and confirm row hover
> bg, active item bg, and item font size match the LifeSG dropdown.

---

## PopoverV2 — 1 demo-state

| Diff | Class | Notes |
|------|-------|-------|
| Our triggers render inside `<Button variant="outline">` (rounded bordered chrome); LifeSG renders inside plain unstyled `<button>` | demo-state | The comparative section at `src/components/overlays/sections/popover-v2-default.tsx` uses our `<Button>` on the ours side but bare `<button>` on the LifeSG side. Either drop our `<Button>` (so both look bare) or add a styled `<button>` wrapper on the LifeSG side. The PopoverV2.Trigger component itself does not enforce a trigger style. |

The popover surface itself can't be captured by the static snapshot
(it requires a click/hover). Manually verify:
- Card padding (24 px), radius (8 px), shadow intensity
- Floating offset (16 px gap from trigger)
- Position behaviour (top / bottom / start / end)

---

## PopoverInline — 1 defect, 1 ambiguous

| Diff | Class | Notes |
|------|-------|-------|
| Ours renders a default trailing Info icon when `icon` prop is omitted; LifeSG renders **no** trailing icon | DEFECT | I added `const trailingIcon = icon ?? <Info … />` as a "helpful default". LifeSG's source only renders the icon when `icon` is explicitly passed. Drop the fallback; let consumers opt in. |
| LifeSG appears to underline the default state ("household income", "dependents"); ours does not | needs confirmation | LifeSG's source `getTextStyle("default")` returns `undefined` (no text-decoration), so the underline shouldn't render — but the captured screenshot shows it. Could be a global link-style cascade in their demo, or a styled-components reset. Worth opening their canonical popover-inline Storybook story to confirm before "fixing" ours. |

---

## Recommended fix batch

Priority 1 (matching defects, low risk):
1. Drop bold on FileDownload + FileUpload title `<p>` — class change only
2. Remove the default `<Info>` icon from PopoverInline when `icon` is undefined
3. Restructure FileDownload + FileUpload row to put size on the right
4. Render `description` field in FileUpload row
5. Add tinted item background to both file-list rows

Priority 2 (per-type icons):
6. `<FileTypeIcon>` helper (PDF / image / spreadsheet / doc / generic).
   New file, ~50 lines.

Priority 3 (demo-state cleanup):
7. Align the trigger element style between the two sides of the
   popover-v2 comparative pane

Items 1–5 are roughly two hours; #6 is another hour. #7 is 10 minutes.

After the fix batch, re-run `npx playwright test --update-snapshots` to
refresh the parity baselines.

## Open questions for triage

- **LifeSG underlines the default popover-inline state** — is this
  intentional (i.e. should `default` mean "underlined link style"), or
  is it incidental styling that bled in from their demo wrap? Affects
  the "default" case in `underlineClass` in
  `src/components/ui/popover-v2.tsx`.
- **File row backgrounds** — LifeSG's tint is subtle. Should we map it
  to `--lifesg-bg-strong` (which is `#F1F1F4` ish) or introduce a
  dedicated `--file-row-bg` token? `bg-strong` reuses an existing token;
  a dedicated token is more parity-principle-correct if the file rows
  ever want to diverge from other strong-bg surfaces.
