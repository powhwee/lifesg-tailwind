# Proposal: Tailwind CSS Port of LifeSG Design System

**From:** CareerNav Engineering Team
**To:** LifeSG Design System Team
**Date:** 27 May 2026
**Status:** Draft for Discussion

---

## Summary

Our team has built a working port of the LifeSG design system from `styled-components` to Tailwind CSS v4 + Base UI. This port covers 58 components with visual parity to the current LifeSG component library — including the recent batch of FileUpload, FileDownload, PredictiveTextInput, SingpassButton, PopoverV2, and PopoverInline. We are proposing this as a conversation starter — not a replacement directive — to explore whether this approach could benefit the broader LifeSG ecosystem.

**Live Storybook:** https://phapp-93b45.web.app
**Repository:** https://github.com/powhwee/lifesg-tailwind

---

## Why We Built This

Our team uses Next.js App Router for CareerNav. We encountered several friction points when integrating `@lifesg/react-design-system` v3.x:

1. **`'use client'` boundary inflation.** Every file that imports a LifeSG component must be marked as a Client Component because `styled-components` requires the browser runtime. This limits our ability to use React Server Components for static content like navbars, footers, and headings.

2. **Hydration mismatch warnings.** Next.js's SWC compiler and the vendored `styled-components` produce different `componentId` hashes, causing React hydration warnings in the browser console.

3. **Bundle size.** The `styled-components` runtime is shipped to the browser even for components that render static content.

These are not bugs in the LifeSG design system — they are architectural constraints of the `styled-components` library when used in a React Server Components environment.

---

## What the Port Preserves

The port is designed for **visual and behavioural parity**, not reimagination:

- **Same design tokens.** Colours, typography, spacing, and motion values are extracted from the LifeSG source and mapped to CSS custom properties using the same naming conventions.
- **Same component API patterns.** Developers use the same component names and similar prop interfaces. Form fields use a composable `Field` + `Input` pattern alongside LifeSG's familiar one-liner shape.
- **Same visual output.** Components render identically to their LifeSG counterparts. Verified via side-by-side comparison in Storybook.
- **Same accessibility patterns.** Interactive components (dialogs, selects, menus) use Base UI headless primitives from the MUI team, which provide focus management, keyboard navigation, and ARIA attributes.

---

## What Changes

### Token Architecture

| Layer | LifeSG v3.x | LifeSG v4 Alpha | Tailwind Port |
|-------|-------------|-----------------|---------------|
| **Primitives** | JS functions in ThemeProvider | CSS variables (`--fds-*`) | CSS variables (L1) |
| **Semantics** | JS functions reading `props.theme` | CSS variables | CSS variables (L2) |
| **Component** | Baked into `styled-components` templates | Baked into `styled-components` templates | CSS variables (L3) + Tailwind utility classes |
| **Runtime** | styled-components (JS → CSS at render time) | styled-components (JS → CSS at render time) | None (CSS resolved at build time) |

### Developer Experience

The total code a feature developer writes is roughly the same in both systems. The difference is in file organisation:

| Aspect | LifeSG v3.x / v4 | Tailwind Port |
|--------|-------------------|---------------|
| Root layout | Requires `'use client'` wrapper for ThemeProvider | Server Component (no provider needed) |
| Navbar / Footer | Must be in client component files | Can be Server Components (no JS shipped) |
| Form fields | `Form.Input` (1 component, label+input+error bundled) | `Field` + `Input` (2 components, composable) |
| `'use client'` scope | Typically covers the entire page | Covers only interactive components (forms, modals) |
| JS shipped to browser | React + styled-components runtime + all components | React + interactive component code only |

A detailed side-by-side code comparison is available in the repository at `working-logs/2026-05-27-nextjs-lifesg-vs-port-comparison.md`.

---

## AI Tooling Compatibility

An increasing number of development teams use AI-assisted tools (Lovable, Vercel v0, Cursor, Windsurf) for rapid prototyping and feature development. These tools generate Tailwind + React code by default.

| Aspect | LifeSG (styled-components) | Tailwind Port |
|--------|---------------------------|---------------|
| Default output format | Not supported — must translate | Native match |
| Token mapping | Manual — AI has no training data on `--fds-*` | Refinement only — swap generic classes for L3 tokens |
| Component patterns | Must convert from Radix/shadcn patterns | Similar patterns (Base UI ≈ Radix) |

With the Tailwind port, AI-generated code requires **refinement** (swapping generic tokens for design system tokens). With `styled-components`, it requires **translation** (rewriting the styling approach entirely).

### Mapping a Vibe-Coded Page to the Design System

Consider a developer who uses Lovable or Vercel v0 to generate a confirmation modal. The AI outputs standard Tailwind + React:

```tsx
// AI-generated output (Lovable / v0)
function ConfirmModal({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/50" />
      <DialogContent className="bg-white rounded-xl p-8 w-[640px] shadow-xl">
        <h2 className="text-lg font-semibold">Confirm Submission</h2>
        <p className="text-gray-600 mt-2">Submit your application?</p>
        <div className="flex gap-4 justify-end mt-6">
          <button className="px-4 py-2 border rounded-lg" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={onConfirm}>Confirm</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Mapping to the Tailwind port** — the developer swaps generic classes for L3 tokens and uses the design system components:

```tsx
// After mapping to Tailwind port
import { ModalV2 } from "@/components/ui/modal-v2";
import { Button } from "@/components/ui/button";

function ConfirmModal({ open, onClose, onConfirm }) {
  return (
    <ModalV2 show={open} onOverlayClick={onClose}>
      <ModalV2.Card>
        <ModalV2.CloseButton onClick={onClose} />
        <ModalV2.Content>
          <h2 className="text-lg font-semibold">Confirm Submission</h2>
          <p className="text-lifesg-text-secondary mt-2">Submit your application?</p>
        </ModalV2.Content>
        <ModalV2.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </ModalV2.Footer>
      </ModalV2.Card>
    </ModalV2>
  );
}
```

The structure remains the same. The developer:
1. Replaces `Dialog` with `ModalV2` (same component pattern — open/close props, overlay, content)
2. Replaces generic colour classes (`bg-blue-600`, `text-gray-600`) with design system tokens (`text-lifesg-text-secondary`)
3. Replaces raw `<button>` with `<Button>` (gains LifeSG styling, focus states, loading patterns)
4. Replaces the manual `<div className="flex gap-4 ...">` footer with `<ModalV2.Footer>` (layout handled by the component)

**Mapping to LifeSG v3.x / v4** — the developer must rewrite the styling approach entirely:

```tsx
// After mapping to LifeSG
"use client"; // Required — styled-components needs browser runtime

import { Modal } from "@lifesg/react-design-system/modal";
import { Button } from "@lifesg/react-design-system/button";
import { Text } from "@lifesg/react-design-system/text";

function ConfirmModal({ open, onClose, onConfirm }) {
  return (
    <Modal.Default
      show={open}
      title="Confirm Submission"
      onClose={onClose}
    >
      <Modal.Default.Body>
        <Text.Body>Submit your application?</Text.Body>
      </Modal.Default.Body>
      <Modal.Default.Footer>
        <Button.Secondary onClick={onClose}>Cancel</Button.Secondary>
        <Button.Default onClick={onConfirm}>Confirm</Button.Default>
      </Modal.Default.Footer>
    </Modal.Default>
  );
}
```

The developer must:
1. Add `"use client"` — the file cannot be a Server Component
2. Replace all Tailwind classes — none of the AI-generated styling is usable
3. Replace `Dialog` with `Modal.Default` — different API (`show` vs `open`, compound sub-components vs props)
4. Replace `<button>` with `Button.Default` / `Button.Secondary` — different variant pattern (separate components vs variant prop)
5. Replace `<h2>` and `<p>` with `Text.H2` / `Text.Body` — LifeSG text components use styled-components internally

### Why This Matters: Mixing AI-Generated Layout with Design System Components

The individual component swap (e.g. `<button>` → `<Button>`) looks similar in both approaches. The practical difference appears when the developer wants to **keep the AI-generated layout code** alongside design system components.

AI tools generate pages with Tailwind layout classes — `flex`, `gap-6`, `p-8`, `max-w-4xl`, etc. Consider a dashboard page generated by Lovable:

```tsx
// AI-generated page layout
<div className="flex gap-6 p-8 max-w-4xl mx-auto">
  <aside className="w-64 border-r pr-4">
    <nav className="flex flex-col gap-2">
      <a href="/jobs" className="text-sm font-medium">Jobs</a>
      <a href="/profile" className="text-sm font-medium">Profile</a>
    </nav>
  </aside>
  <main className="flex-1">
    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
    <p className="text-gray-600 mb-6">Welcome back</p>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Search Jobs</label>
      <input className="border rounded-lg px-3 py-2 w-full" placeholder="e.g. Software Engineer" />
    </div>
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Search</button>
  </main>
</div>
```

**With the Tailwind port**, the developer keeps the layout code as-is and swaps only the design system elements:

```tsx
// Tailwind port — layout code is kept, components are swapped
<div className="flex gap-6 p-8 max-w-4xl mx-auto">
  <aside className="w-64 border-r pr-4">
    <nav className="flex flex-col gap-2">
      <a href="/jobs" className="text-sm font-medium">Jobs</a>
      <a href="/profile" className="text-sm font-medium">Profile</a>
    </nav>
  </aside>
  <main className="flex-1">
    <Typography as="h1" variant="heading-lg">Dashboard</Typography>
    <Typography as="p" variant="body">Welcome back</Typography>
    <div className="mb-4">
      <Field label="Search Jobs">
        <Input placeholder="e.g. Software Engineer" />
      </Field>
    </div>
    <Button>Search</Button>
  </main>
</div>
```

The AI's `<label>` + `<input>` becomes `<Field>` + `<Input>`. Field handles the label text, the label-to-input accessibility wiring, and error messages. Input handles the text box styling. The surrounding layout (`flex gap-6 p-8 max-w-4xl mx-auto`) works unchanged because everything uses Tailwind.

**With LifeSG v3.x / v4**, the Tailwind layout classes have no effect because LifeSG components do not use Tailwind. The developer must replace the layout too:

```tsx
// LifeSG — layout must also be rewritten
"use client";

<Layout.Content>
  <Layout.Section>
    {/* The sidebar layout from the AI is gone —
        LifeSG's Layout system uses a different grid model.
        The developer must learn and use LifeSG's layout API
        instead of the AI-generated flex layout. */}
    <Text.H1>Dashboard</Text.H1>
    <Text.Body>Welcome back</Text.Body>
    <Form.Input label="Search Jobs" placeholder="e.g. Software Engineer" />
    <Button.Default>Search</Button.Default>
  </Layout.Section>
</Layout.Content>
```

The AI-generated sidebar layout (`flex`, `gap-6`, `w-64`, `border-r`) cannot be used. The developer must discard it and rebuild the layout using LifeSG's `Layout.Content` / `Layout.Section` components or write a separate CSS file. The form field uses LifeSG's `Form.Input` which bundles the label and input into a single component.

**In short:** with the Tailwind port, the developer keeps the AI-generated structure and swaps individual components. With LifeSG, the developer keeps the component logic but must rewrite both the styling and the layout.

### Gradual On-Ramp vs All-or-Nothing Rewrite

This creates a staged workflow where each stage produces a working page:

| Stage | What the developer does | Time | Page status |
|-------|------------------------|------|-------------|
| **1. AI generates** | Lovable/v0 produces a page with generic Tailwind + plain HTML | Seconds | Working, generic styling |
| **2. Swap components** | Replace `<button>` with `<Button>`, `<input>` with `<Field>` + `<Input>`. Layout code stays as-is. | Minutes | Working, LifeSG components with generic layout |
| **3. Refine tokens** | Replace `bg-blue-600` with `bg-button-bg-default`, `gap-6` with component-specific L3 spacing. | When time allows | Working, fully on-brand |

The developer can ship at Stage 2 and return to Stage 3 later. Every stage produces a functional, styled page.

With LifeSG v3.x / v4, this staged approach is not possible. The developer cannot mix AI-generated Tailwind layout with LifeSG components — the layout must be rewritten using LifeSG's Layout API before the page works correctly. The transition is from Stage 1 directly to a full rewrite, and the page is not usable until the rewrite is complete.

---


## What We Are Not Proposing

To be clear about scope:

- **We are not proposing deprecating the current LifeSG design system.** The existing system serves 13 government brands across dozens of applications. A migration of that scale requires careful planning that is beyond the scope of this proposal.

- **We are not proposing that Tailwind is objectively better than styled-components.** The LifeSG team made reasonable architectural choices given their constraints (multi-brand support, backwards compatibility, team familiarity). Those constraints still apply to many consuming teams.

- **We are not proposing a fork.** We want to contribute back to the ecosystem, not fragment it.

---

## What We Are Proposing

### Option A: Evaluate as a Parallel Distribution

Publish the Tailwind port as an alternative package (e.g., `@lifesg/react-design-system-tw`) for teams that use Next.js App Router or other React Server Components frameworks. The existing `styled-components` package continues unchanged for teams that don't need this.

**Effort:** Low for the LifeSG team. The port is already built and maintained by our team. The LifeSG team's role would be reviewing and accepting the package into the LifeSG org for distribution.

### Option B: Adopt as the v5 Direction

Use the Tailwind architecture as the foundation for the next major version of the design system. This would involve:
- Validating the token architecture against all 13 brand specifications
- Migrating the component test suite
- Publishing a migration guide for consuming teams
- Running both packages in parallel during the transition period

**Effort:** Significant, but aligned with the broader industry direction (React Server Components, zero-runtime CSS, AI tooling ecosystem).

### Option C: Knowledge Exchange

If neither A nor B is appropriate at this time, we propose a knowledge exchange session where we share our findings and the LifeSG team shares their v4 roadmap. This would help both teams understand the constraints and opportunities without committing to any architectural changes.

---

## Proposed Maintenance Model

If Option A or B is adopted, the maintenance responsibility would be split as follows:

### What LifeSG maintains (central)

| Layer | What | Example |
|-------|------|---------|
| L1 tokens | Brand primitives — colours, spacing scale, font sizes | `--color-brand-50: #6633FF` |
| L2 tokens | Semantic mappings — what "primary", "error", "disabled" mean per brand | `--lifesg-primary: var(--color-brand-50)` |
| L3 tokens | Component defaults — how much padding a modal has, how rounded a button is | `--modal-v2-card-width: 40rem` |
| Components | Button, Input, Field, Modal, Select, etc. | Published as npm package or CLI scaffold |
| Storybook | Visual reference and documentation | Hosted centrally |

### What each project team maintains (per-project)

| Layer | What | Example |
|-------|------|---------|
| L3 overrides | Project-specific adjustments to component defaults | `--modal-v2-card-width: 50rem` (wider for this app) |
| Agency brand | Override L1/L2 tokens for a different agency | `--lifesg-primary: var(--color-agency-blue)` |
| Application pages | Layout, routing, data fetching, business logic | `src/app/jobs/[id]/apply/page.tsx` |
| Feature components | Application-specific components built from design system primitives | A job application form composing Field + Input + Select + Button |

### How overrides work

A project team receives LifeSG's defaults and overrides only what is different for their application. No forking required:

```css
/* project-overrides.css — loaded after the LifeSG package CSS */
:root {
  /* This agency uses a wider modal */
  --modal-v2-card-width: 50rem;

  /* This agency has a different primary brand colour */
  --lifesg-primary: #1a5276;

  /* This project uses tighter form field spacing */
  --field-gap: 0.5rem;
}
```

Everything not overridden uses LifeSG's defaults. When LifeSG updates a component or token, the project inherits the update automatically — the override file only contains the project's deviations.

### Comparison with the current model

| Aspect | Current (styled-components) | Proposed (Tailwind port) |
|--------|----------------------------|--------------------------|
| How tokens are overridden | Pass a custom `theme` object to `<LifeSGProvider theme={...}>` at runtime | Override CSS variables in a static CSS file at build time |
| When overrides take effect | At render time (React re-renders when theme changes) | At build time (CSS cascade, no runtime cost) |
| What project teams can customise | Any value in the theme object | Any CSS variable (same scope, different mechanism) |
| Risk of breaking changes | Theme object shape changes require code updates | CSS variable renames require CSS updates (same risk, different format) |

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Visual regression | The port includes a Storybook with 58 components for side-by-side comparison plus a Playwright parity spec running per-component visual snapshots. A visual regression test suite is already in place. |
| Token drift | L1 tokens are extracted from LifeSG source via a script (`extract-lifesg-tokens.mjs`). Re-extraction keeps them in sync. |
| Base UI stability | Base UI is maintained by the MUI team (Material UI). It is actively developed and used in production by large organisations. |
| Tailwind v4 maturity | Tailwind v4 reached stable release. The v3→v4 migration path is documented and straightforward. |
| Team familiarity | Tailwind CSS is the most widely adopted CSS framework in the React ecosystem. Training overhead is minimal for most teams. |
| Form.X convenience gap | The port ships `Field` + raw input for full composability, and adds a `FormInput`-style one-liner wrapper alongside every form field that LifeSG ships a `Form.X` for (most recently `FormPredictiveTextInput`). FileUpload and FileDownload deliberately stay without a `<FormField>` wrapper — they bundle their own title / description and are self-contained surfaces, matching LifeSG's decision not to expose `Form.FileUpload` / `Form.FileDownload`. |

---

## Next Steps

We welcome feedback on this proposal and are available to:

1. **Demo the Storybook** in a 30-minute session, walking through component parity and the token architecture
2. **Share the repository** for the LifeSG team to review at their own pace
3. **Discuss Option A / B / C** based on the team's current v4 roadmap and priorities

---

## Appendix: Repository Structure

```
src/
  app/
    lifesg-tokens.css         # L1 — extracted from LifeSG source
    core-tokens.css           # L2/L3 — button, card, accordion, etc.
    form-tokens.css           # L2/L3 — field, input, file-upload, file-download, predictive-text-input, etc.
    overlays-tokens.css       # L2/L3 — modal, modal-v2, drawer, popover, popover-v2, popover-inline, etc.
    navigation-tokens.css     # L2/L3 — navbar, footer, sidenav, etc.
    selection-and-input-tokens.css  # L2/L3 — button, checkbox, radio, toggle, singpass-button, etc.
    content-tokens.css        # L2/L3 — text-list, table, divider, etc.
    globals.css               # Tailwind @theme mappings (every L1/L3 token mirrored as a utility class)
  components/
    ui/                       # 58 component files (each paired with .stories.tsx + .mdx)
    foundations/              # Colour, typography, spacing, motion stories
  lib/
    utils.ts                  # cn() utility (clsx + tailwind-merge)
```

## Appendix: Documents Produced During This Analysis

| Document | Description |
|----------|-------------|
| `working-logs/2026-05-27-design-system-review.md` | Architectural comparison of LifeSG v4 alpha vs the Tailwind port |
| `working-logs/2026-05-27-nextjs-lifesg-vs-port-comparison.md` | Full code comparison — Next.js App Router with LifeSG v3.x/v4 vs the port |
| `working-logs/2026-05-27-form-comparison.html` | Side-by-side HTML visualisation of developer code |
