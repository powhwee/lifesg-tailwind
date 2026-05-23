# Parity Principle

> Match the language, not the layout.

This document captures the project's stance on visual parity with `@lifesg/react-design-system`. It exists because earlier work drifted into chasing pixel-perfect matches — which forced wrong fixes (e.g. stretching our calendar to 656px because LifeSG's outlier was) and missed the actual goal.

## The goal

A developer coming from LifeSG should pick up this codebase and feel "this is the same language" — without expecting pixel-perfect visual replication.

That means matching the **mental model + vocabulary**, not the rendered output.

| Layer | Match LifeSG? | Why |
|---|---|---|
| Component API (props, variants, naming) | Yes | `<Calendar variant="single" styleType="bordered">` is the same in their head |
| L2 tokens (`--lifesg-bg`, `--lifesg-font-body-size-md`, `BodyBL`, etc.) | Yes | Same vocabulary |
| L3 component tokens (`--filter-header-py`, `--calendar-min-width`) | Yes | Same anatomy — header / row / icon |
| Visual recognition (the thing looks like a LifeSG widget) | Yes | Identifiable as the same concept |
| **Pixel measurements** (font 16 vs 18, padding 12 vs 16, w 288 vs 182) | **No** | Defaults can tune for shadcn convention |
| **Internal density / opinionated layout** | **No** | Default tightness/looseness is our call |

## The 3-knob model

Components ship with **opinionated LifeSG-like defaults**, but every value is tokenized so consumers can override at three scopes.

### Default — what ships in the component

```tsx
// src/components/ui/breadcrumb.tsx
<nav className="my-nav-block-spacing text-breadcrumb-text ...">
```

```css
/* src/app/navigation-tokens.css */
--nav-block-spacing: 1.5rem;   /* 24px */
```

Every `<Breadcrumb />` rendered anywhere has 24px breathing room by default. LifeSG-like, no effort.

### Knob 1: per-call override (audience: page author)

```tsx
<Breadcrumb links={...} className="my-2" />
```

`my-2` wins over `my-nav-block-spacing` via tailwind-merge. Only this instance is affected.

### Knob 2: L3 token global retune (audience: design-system maintainer)

```css
/* src/app/navigation-tokens.css — one edit */
--nav-block-spacing: 2rem;
```

Every breadcrumb in the app retunes to 32px. No component change, no page change.

### Knob 3: app-level scope override (audience: micro-frontend / themed subtree)

```tsx
<div style={{ "--nav-block-spacing": "3rem" }}>
  <Breadcrumb links={...} />
  <LinkList links={...} />
</div>
```

CSS custom properties cascade. Inside this subtree the token resolves to `3rem`; elsewhere it stays at the global default. Lets you ship one component with multiple personalities.

## When to deliberately diverge

The principle is "default to LifeSG-like" — but not slavishly. Override when LifeSG is **genuinely the outlier vs the broader design-system world**:

| Component | Decision | Reason |
|---|---|---|
| **Calendar** | Ours 336px wide, LifeSG 656px | LifeSG's inline calendar is 2× wider than every modern compact-calendar convention (react-day-picker, MUI, shadcn). Genuine outlier. |

Any "we deliberately don't match LifeSG" decision needs an entry here with a one-line reason. Without it, future maintainers (and future me) will keep chasing the divergence as a defect.

## Convention: components carry internal margin

Tied to the parity principle but worth stating outright: navigation components in this project carry their own internal vertical breathing room (LifeSG style), not shadcn's "consumer adds margin" default. Implemented via shared `--nav-block-spacing` token. See `[[nav-spacing-convention]]` memory.

Other categories (form, content, S&I, overlays) follow the same convention — opinionated LifeSG-like defaults, tokenized, overridable at three scopes.

## Convention: component header typography

LifeSG treats "the title at the top of a widget" as heading-prominent: HeadingSM (22/28/bold) for primary headers like BoxContainer header, Accordion title, Card title, Modal title; HeadingXS (18/26/bold) for compact contexts like Table head cells. Shadcn-style minimal `text-base` titles do not feel like LifeSG.

Two shared L3 tokens in `src/app/core-tokens.css` capture this:

```css
--component-header-size:         var(--lifesg-font-heading-size-sm);    /* 22px */
--component-header-lh:           var(--lifesg-font-heading-lh-sm);      /* 28px */
--component-header-weight:       var(--lifesg-font-weight-bold);

--component-header-compact-size: var(--lifesg-font-heading-size-xs);    /* 18px */
--component-header-compact-lh:   var(--lifesg-font-heading-lh-xs);      /* 26px */
```

Registered as `--text-component-header`, `--leading-component-header`, `--text-component-header-compact`, `--leading-component-header-compact` in `@theme inline`.

**How to apply**: any "widget title at the top of a component" should use:
```tsx
className="text-component-header leading-component-header font-bold"
```
or the `-compact` variants for tighter contexts. **Never reach for raw `text-lg` / `text-xl` on a component header** — that creates the inconsistency we just fixed.

**Currently applied** (2026-05-23 sweep): BoxContainer header, Card title, Accordion title (+ section title bar), Filter header, Table head cell, DataTable head cell. Modal/Drawer titles use base-ui primitives and are styled by consumers.

See `[[component-header-convention]]` memory.

## Convention: component body typography

Parallel to the header convention. Body text inside components (Accordion panel, Card body/description, Filter checkbox label, UneditableSection k/v, etc.) uses two shared tokens:

```css
--component-body-size:           var(--lifesg-font-body-size-md);    /* 16px */
--component-body-lh:             var(--lifesg-font-body-lh-md);      /* 24px */

--component-body-compact-size:   var(--lifesg-font-body-size-sm);    /* 14px */
--component-body-compact-lh:     var(--lifesg-font-body-lh-sm);      /* 26px */
```

**How to apply**:
- Primary body text: `text-component-body leading-component-body`
- Compact/secondary text (descriptions, captions, link-list items): `text-component-body-compact leading-component-body-compact`

**Why this beats Tailwind's `text-sm`**: Tailwind's `text-sm` is 14/20 (14px font, 20px line-height). LifeSG's BodySM is 14/26. Same font-size, different vertical rhythm. Using `text-sm` looks cramped vs LifeSG. The compact token gets the right 26px line-height.

**Currently applied** (2026-05-23 sweep): Accordion panel (primary/compact via small), Card body (primary) + Card description (compact), Filter checkbox label (compact), UneditableSection label/value (primary) + description (compact).

See `[[component-body-convention]]` memory.

## Implications for the verification system

`measure-*` scripts report computed-style divergences between ours and LifeSG. With this principle:

- A `[expected] h: 188 ≠ 246` line in a measure-* report is **not a defect** by default. Triage each into:
  - **TUNE-TO-LIFESG** — defaults should match LifeSG within reason; fix the component
  - **OUTLIER-REJECTED** — LifeSG is the outlier vs broader convention; allowlist with explicit "outlier" reason (like calendar)
  - **DEMO-STATE-DIFF** — same component, different demo content/state; allowlist with demo reason
  - **NOISE** — sub-pixel, text-wrap, browser line-height; allowlist as noise

- Allowlist entries are first-class citizens, not consolation prizes. They document the divergence reason so future devs don't re-chase it.

- Driving allowlist count to 0 is the WRONG goal. Driving "match the language" is the right goal — divergences with documented reasons are fine.

## See also

- `[[nav-spacing-convention]]` — applies the principle to navigation external spacing
- `[[visual-parity-workflow]]` — procedure for classifying any visible diff before fixing
- `[[token-convention]]` — every L3 token must be mapped in `@theme inline` before being used as utility
- `[[tailwind-merge-font-size]]` — keep classGroups in sync with `--text-*` tokens
