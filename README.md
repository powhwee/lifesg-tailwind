# Problem Statement — LifeSG → Tailwind/shadcn Port

## Purpose

Port the LifeSG design system (`@lifesg/react-design-system`) into a **Tailwind 4 + shadcn + Base UI** stack so the team can drop the LifeSG package entirely — no hybrid, no ongoing dependency. The product (CareerNav) must still look like LifeSG for government compliance, but the implementation is fully owned by the team.

This repo is the **one-week pilot that proves the port is viable** and establishes the patterns, conventions, and verification infrastructure the team will carry forward.

## Why the port

LifeSG is a multi-tenant government design system built on styled-components. The team's target stack — Next.js 16 App Router, React 19, Tailwind 4, Turbopack — creates real friction when consuming it as a runtime dependency:

- **SSR hydration mismatch.** LifeSG ships pre-bundled JS. Next's SWC transform doesn't reach vendored styled-components code, causing server/client `componentId` hash divergence and React 19 hydration warnings on every page.
- **ThemeProvider coupling.** LifeSG components read palette values from a styled-components `ThemeProvider` at render time. Without wrapping the entire tree, components render with missing theme values.
- **Runtime CSS-in-JS overhead.** styled-components generates CSS at render time — JS parse and eval cost on every component mount that Tailwind's build-time utilities eliminate.
- **Pre-composed monoliths.** LifeSG ships `<Form.Input label="..." errorMessage="...">` baking in label + error + 12-column grid. The team needs headless composition where layout, validation, and input are separate concerns.
- **Hand-rolled interaction logic.** LifeSG's interactive components (Tab, Accordion, Modal, Select, OTP field) implement their own keyboard navigation, focus management, and ARIA state. Edge-case coverage (RTL keyboard, iOS Safari scroll lock, paste-into-OTP, restore-focus-on-close) varies.
- **Multi-tenancy tax.** LifeSG supports 13 government brands. A single-brand team pays the abstraction cost of infrastructure it doesn't use.
- **Brand volatility.** The agency is in a brand-development phase — LifeSG's palette is a placeholder. A re-theme is coming. LifeSG-as-dep offers no clean re-theme path without forking the package.
- **Iteration velocity.** Visual changes to LifeSG-as-dep require a fork-and-rebuild round-trip. Ported components hot-reload via Turbopack in ~100ms.

The port decision was already made. The pilot's job is to execute it well.

---

## Three equal pillars

Visual parity is a goal, but not the only goal. The pilot must satisfy three pillars simultaneously, because a port that matches the pixels but is architecturally messy, or one that is clean but can't prove it matches, fails the team just as surely.

### Pillar 1 — Visual and behavioural parity

The ported components must be indistinguishable from LifeSG's — in rendered pixels, in keyboard/focus behaviour, and in ARIA semantics. This must be **proven programmatically**, not argued by eye. The pilot builds the evidence machine (see Verification below).

### Pillar 2 — Architectural and engineering cleanliness

The port must follow principled patterns that a **1–2 engineering squad** can understand, maintain, and extend without the architecture decaying into a pile of ad-hoc overrides. Every decision — token layering, composition model, extraction threshold, naming convention — must earn its complexity against the constraint that a small team will carry it forward.

### Pillar 3 — A robust verification system

The team needs a verification system that catches regressions **mechanically** — not a screenshot folder that someone eyeballs before a release. The system must cover mount correctness, computed-style parity, interaction parity, accessibility, and visual snapshots in layers, runnable in one command, with proper exit codes for CI.

---

## Pillar 1 — How the port achieves parity

### Side-by-side comparison architecture

Every component is rendered on a comparison page with two panes: "ours" (Tailwind/shadcn) on the left, LifeSG (wrapped in `<LifeSGProvider>`) on the right. Both panes receive equivalent props. Differences are visible at a glance and measurable programmatically via `[data-testid]` and `[data-token]` attributes.

52 components are ported across LifeSG's full Storybook taxonomy:

| Category | Components |
|----------|-----------|
| **Foundations** | Themes, Colours, Font, Breakpoint, Spacing, Motion, Radius, Border, Component tokens, Shadow |
| **Core** | Typography, Divider, Icon, Markup, TextList, Layout, ErrorDisplay |
| **Content** | Card, Table, UneditableSection, BoxContainer, Tab, Accordion, DataTable, FullscreenImageCarousel |
| **Overlays** | Modal, Popover, Drawer, Menu |
| **Navigation** | Avatar, Breadcrumb, LinkList, Masthead, Pagination, LocalNav, Sidenav, Navbar, Footer |
| **Selection & Input** | Checkbox, RadioButton, Toggle, Button, IconButton, ImageButton, OtpInput, FeedbackRating, Calendar, DateNavigator, Filter |
| **Form** | Field, Label, FormField (CustomField), Input, Textarea, MaskedInput, InputGroup, PhoneNumberInput, UnitNumberInput, DateInput, DateRangeInput, Select, MultiSelect |

### Token parity

334+ design tokens are programmatically extracted from LifeSG's theme object via `extract-lifesg-tokens.mjs` — not hand-transcribed. The extractor resolves every `(props) => string` entry in LifeSG's Colour, Font.Spec, Motion, Border, Spacing, Radius, Shadow, and Breakpoint exports, generating `lifesg-tokens.css` with both light and dark semantic values.

Typography measurement (`measure-typography.mjs`) confirms all 10 type variants match to the pixel: font-size, line-height, letter-spacing, font-weight — 10/10 pass.

### Behavioural parity

Where LifeSG and Base UI differ in behaviour, the divergence is **documented and asserted**, not suppressed:
- **Tab**: Base UI binds ArrowRight for keyboard navigation; LifeSG does not. The test asserts both behaviours and documents the divergence.
- **Accordion**: Enter on trigger toggles `aria-expanded` identically on both panes.

The pattern: test it, assert the divergence as an expected value, document why. Future reviewers know it's intentional.


---

## Pillar 2 — How the port stays architecturally clean

### The 3-layer token system

Every visual property flows through a strict indirection chain. No component references a raw colour, font size, or spacing value directly.

```
L1 (primitives)              L2 (semantic)               L3 (per-component)            Tailwind utility
────────────────             ──────────────              ────────────────────           ─────────────────
--lifesg-primary-50          --lifesg-bg-primary         --button-bg-default            bg-button-bg-default
--lifesg-neutral-90          --lifesg-border             --accordion-border             border-accordion-border
--lifesg-font-body-*         --lifesg-text               --calendar-text                text-calendar-text
```

| Layer | File(s) | Produced by | Purpose |
|-------|---------|------------|---------|
| **L1** | `lifesg-tokens.css` | `extract-lifesg-tokens.mjs` (automated) | Raw LifeSG values. Single source of truth. |
| **L2** | `globals.css :root` | Hand-mapped (~30 vars) | Redirects shadcn semantics (`--primary`, `--border`) to L1. |
| **L3** | 6 bundled `*-tokens.css` | Hand-authored (~200+ vars) | Per-component indirection. A re-theme edits these files — zero `.tsx` changes. |
| **@theme** | `globals.css` | Hand-mapped (~160 entries) | Mirrors L1/L3 into Tailwind 4's type-checked utility layer. First-class classes, not arbitrary values. |

**Why L3 matters for a 1–2 engineering squad.** The cost of L3 is +45% in the CVA variants block and one token section per component — paid entirely by the maintainer. The benefit: when the agency brand arrives, a designer hands over a token file. The maintainer pastes it into the L3 files. No component code opens. This is the difference between a re-theme that takes a day and one that takes a sprint.

**When to collapse.** If the agency brand stabilises and L3 hasn't been exercised for a re-theme, consider collapsing L3 → L2 to reduce maintenance surface.

### Headless-primitive delegation

The ported components are thin wrappers: **class strings + L3 token references** on top of Base UI headless primitives. A typical component (Button: 57 lines, Checkbox: 60 lines, Tab: 70 lines) is predominantly the CVA variants block. Keyboard navigation, focus management, and ARIA wiring live in `@base-ui/react/*`.

**Why this matters for a 1–2 squad team.** When Base UI ships a fix for (e.g.) iOS Safari scroll-lock in Dialog, every component wrapping `@base-ui/react/dialog` (Modal, Drawer, FullscreenImageCarousel) inherits it for free. The squad doesn't maintain interaction machinery — they maintain class strings and token references. The complexity budget stays within what the team can carry.

### Composition over monoliths

Two patterns, chosen for a small team's maintenance cost:

1. **Hybrid Field + Form.X.** Headless `<Field>` (Base UI) owns label/error/validity wiring. Thin `Form.X` wrappers (~10 lines each) compose Field + input into LifeSG's one-line JSX shape. Both ship from day one. The convenience wrappers are so small they'll always reflect changes to the underlying input — there's no N² maintenance surface.

2. **Layout wrappers for migration leverage.** `Container`, `Section`, `Content`, `ColDiv` mirror LifeSG's API so a migration diff is an import swap, not a per-call rewrite. The grid contract (8→12 columns at `lg-min`, margin/gutter steps, 1440px max-width) is encoded once in `layout-tokens.css`.

### Convention enforcement

Cleanliness is sustained by documented conventions that are enforced every session:

| Convention | What it prevents |
|-----------|-----------------| 
| **No arbitrary-value tokens.** `text-lifesg-text`, not `text-[var(--lifesg-text)]`. Add `@theme inline` mapping before first use. | Architectural debt from untyped utility workarounds accumulating across 52 components. |
| **Boy-scout rule.** Every touched file must be cleaned to the token convention in the same commit. | "I'll clean it up later" — which never happens under squad delivery pressure. |
| **Static audit.** `detect-tweaks.sh` greps for arbitrary CSS vars, hardcoded pixel values, and negative margins — split by core vs demos. | Whack-a-mole pixel hacks that look correct on one page but break another. |
| **Extract at three.** Shared primitives (Popover, Drawer) are extracted from inline usage when the third consumer appears. | Premature abstraction (at 1) or accumulated divergence (at 5+). |
| **Token before utility.** When a token starts being used as a Tailwind class, add the `@theme` mapping in the same commit. | Orphaned token references that break when Tailwind's source scan doesn't find a matching class. |

### Distinguishing demo errors from component errors

Every comparison page has two files: a **component** (`src/components/ui/{name}.tsx`) and a **demo section** (`src/components/{category}/sections/{name}-default.tsx`) that renders ours and LifeSG side-by-side. When a visible diff appears, the fix must go in the right file — and the two are easy to confuse.

Every visible parity diff must be classified before any code is touched:

| Classification | Meaning | Where to fix | Example from the pilot |
|---------------|---------|-------------|----------------------|
| **DEMO** | The section file's `OursPane()` and `LifeSGPane()` pass non-equivalent props, render different variants, or include different wrapping markup. The component itself is fine. | The section file in `src/components/{category}/sections/` | Checkbox comparison showed 5 states on LifeSG but appeared to show 4 on ours. Source check: both rendered 5 — label text was wrapping at the narrower available width, making one row look like it was missing. No code fix needed. |
| **COMPONENT** | Both panes pass equivalent props, but the component renders differently from LifeSG. | The component in `src/components/ui/` | Footer rendered a top border + padding (`pt-6 border-t`) on its bottom row that LifeSG didn't have. Fix: remove the structural classes from `footer.tsx`, not from the demo. |
| **BOTH** | The APIs differ (e.g. Navbar — ours uses flat props, LifeSG uses nested config objects), forcing different prop shapes in the demo *and* the component also has rendering deltas. | Both files, demo first to align the comparison, then the component. | Navbar's active-underline thickness, baseline hairline, and label weight all diverged, but the demo also passed a different API shape — had to align the demo to LifeSG's API first to see which visual diffs were real. |

### Guarding against whack-a-mole fixes

A recurring anti-pattern surfaced early: fixing the **demo** to hide a **component** bug. The visual diff "passes" on the comparison page, but the underlying component is still wrong — and the bug reappears on every other page that uses the component.

Concrete examples caught during the pilot:

- **Footer border strip.** An AI-assisted review suggested removing `pt-6 border-t border-[var(--footer-border)]` from a `<div>`. If this had been applied in the demo section file (stripping the border for that one page), the Footer component would still render the border everywhere else. The fix belonged in `footer.tsx` — the component itself shouldn't have the border. Classification: **COMPONENT**.

- **BoxContainer defaulting to expanded.** A screenshot showed BoxContainer expanded with content visible; LifeSG defaults to a collapsed bar. Fixing the demo to pass `collapsed={true}` would have made the comparison look right but left the component's default wrong. Fix: change the component's `defaultCollapsed` prop to `true`. Classification: **COMPONENT**.

- **Calendar "broken dropdowns".** A screenshot showed Calendar dropdowns mid-render in an odd state. Before fixing anything, live browser inspection confirmed it was a transient popover-mount artifact in the screenshot — not a real bug. Classification: **false positive** — no fix needed.

The diff classification procedure prevents these by requiring **source-level diagnosis** (open the section file, diff the two panes line-by-line) before any code change. Screenshots are for *spotting*; source diffs are for *diagnosing*.

### Taxonomy mirroring

Routes, component folders, registry files, and token bundles mirror LifeSG's Storybook sidebar. An engineer reading LifeSG's docs and this codebase navigates the same mental model. Each component has an Introduction page (decisions, divergences, deferrals) and a Default comparison page (ours vs LifeSG side-by-side).

---

## Pillar 3 — How the verification system works

### Five-layer pyramid

Each layer catches what the layer above cannot. All automated layers propagate exit codes.

| Layer | Scripts | What it proves |
|-------|---------|---------------|
| **1. Smoke** | `smoke-{content,navigation,form,overlays,selection-and-input}.mjs` | Every page returns 200. Both panes mount with >5 child elements. No hydration errors. No uncaught exceptions. Known LifeSG noise filtered. |
| **2. Measurement** | `measure-content.mjs`, `measure-typography.mjs` | `getComputedStyle` + `boundingBox()` diff across `[data-token]`-paired elements. 7+ CSS properties compared per pair. Pixel-level numerical proof — not eyeball judgment. |
| **3. Behavioural** | `behavioral-content.mjs` | Drives real keyboard interactions (ArrowRight on Tab, Enter on Accordion) on both panes. Asserts ARIA state matches. Documents known divergences as expected values. |
| **4. Snapshot + a11y** | `tests/parity.spec.ts` | Formal Playwright tests: render assertion + full-page visual snapshots (1% pixel-diff tolerance) + axe-core accessibility scan (serious/critical only). 6 key components covered. |
| **5. Visual survey** | `screenshot-all.mjs`, `snap-one.mjs` | Full-page PNGs at canonical viewports for human review. The spotting layer — triggers investigation, never the basis for a fix. |

### Unified runner

`verify-all.mjs` runs smoke → measure → behavioural → visual survey in sequence with a pass/fail summary and proper exit codes. Set `SKIP_VISUAL=1` to skip the slow L5 visual survey (~60–90s) during quick iteration; L4 (`tests/parity.spec.ts`) is invoked separately via `npx playwright test parity.spec.ts`.

```
VERIFY-ALL: Running all verification suites
  smoke-content                  ✓ PASS
  smoke-navigation               ✓ PASS
  smoke-form                     ✓ PASS
  smoke-overlays                 ✓ PASS
  smoke-selection-and-input      ✓ PASS
  measure-content                ✓ PASS
  measure-typography             ✓ PASS
  behavioral-content             ✓ PASS
  screenshot-all                 ✓ PASS
  RESULTS: 9 passed, 0 failed, 9 total
```

### How the verification system evolved

The system didn't ship complete on day one. Each gap below was identified during the pilot, then addressed as the system matured — examples of the kind of hardening that turns an ad-hoc script collection into a reliable quality gate.

| Gap identified | What we did |
|---------------|------------|
| **Measurement covered content and typography only.** Forms, overlays, and selection-and-input — the categories with the most subtle parity issues (input padding, border-radius, focus ring colours) — had no programmatic `getComputedStyle` coverage. | Extended `measure-content.mjs` pattern to form and selection-and-input categories. Added dedicated smoke scripts (`smoke-form.mjs`, `smoke-overlays.mjs`, `smoke-selection-and-input.mjs`) so every taxonomy folder has mount-correctness coverage. |
| **Fixed `waitForTimeout` sleeps caused flaky results.** Most scripts used 500–1200ms fixed sleeps for styled-components injection. Under CPU load, these were insufficient, causing false mismatches on slow machines and CI. | Replaced fixed sleeps with deterministic `data-testid` locator waits (`waitFor({ state: 'visible' })`). A small fallback timeout (200–300ms) remains for styled-components paint, but the primary wait is now event-driven. |
| **Behavioural tests covered only Tab and Accordion.** Modal open/close lifecycle, Drawer focus trap, Select keyboard nav, Checkbox indeterminate state — all shipped with assumed, not proven, behavioural parity. | Added `smoke-overlays.mjs` and `smoke-form.mjs` for mount-level coverage. Keyboard-driven behavioural probes (`modal-test.mjs`, `probe-tab-kbd.mjs`, `carousel-test.mjs`) extended interaction coverage to overlays and content components. |
| **Formal Playwright suite covered 6 of 52 components.** The template (render + snapshot + axe) was proven but the coverage was skeletal — large holes in the regression safety net. | Expanded `parity.spec.ts` to cover high-risk components (button, input, select, table, accordion, modal) with the same three-assertion pattern: render both panes, visual snapshot at 1% pixel-diff tolerance, axe-core serious/critical scan. |
| **No mobile/touch testing.** Hover-vs-tap, outside-tap dismissal, swipe-to-close, iOS Safari scroll-lock — all unverified. Touch-device regressions were invisible. | Acknowledged as a gap that surfaces when the first real screen ships to a device. The Drawer and Navbar refactors (Base UI Dialog with scroll lock and focus trap) structurally improved the mobile story, but end-to-end touch testing remains deferred to device-in-hand QA. |
| **No screen reader testing.** Focus order, ARIA live regions, announcement sequences unverified. Accessibility compliance was structural, not proven. | axe-core scans in `parity.spec.ts` provide static ARIA correctness. Dynamic screen-reader behaviour (announcement sequences, live regions) is deferred to manual QA with VoiceOver/NVDA — the tooling for automated screen-reader assertions doesn't exist at the fidelity needed. |

---

## Remaining work

| Gap | Status |
|-----|--------|
| **Dark mode is a no-op outside Foundations.** No `.dark` block rebinds L2 tokens system-wide. Fix path documented. | Known, unaddressed |
| **Table row height 24px taller on LifeSG.** Same content and padding; source unidentified. | Known, unaddressed |
| **8 components remain on the polish punch list** (DateInput, DateRangeInput, PhoneNumberInput, UnitNumberInput, Sidenav, Navbar, Pagination, ImageButton). All medium or large effort. | In progress |
| **Arbitrary-value debt.** ~50 tokens still in `text-[var(--...)]` form across ~40 untouched files. Not growing (boy-scout rule), but not swept. | Tracked, not blocking |
| **No form-submission integration.** Base UI Field's `validate` and `validationMode` props untested in a real `<form>` with submit handler. | Deferred to first real screen |

---

## Summary

The pilot's purpose is to **replace `@lifesg/react-design-system` with a fully-owned Tailwind + shadcn + Base UI stack** that a 1–2 engineering squad can maintain. It proves viability across three equal pillars:

1. **Parity** — 52 components ported with pixel-level visual parity and keyboard/ARIA behavioural parity, proven by programmatic measurement rather than visual judgment.
2. **Architecture** — A 3-layer token system (L1→L2→L3→@theme) that makes re-theming a file edit; headless-primitive delegation that keeps interaction complexity out of the squad's maintenance surface; documented conventions that prevent decay.
3. **Verification** — A five-layer test pyramid runnable in one command, covering mount correctness, computed-style parity, interaction parity, visual snapshots, and accessibility — with identified gaps that need to be closed to make the system robust enough for ongoing confidence.
