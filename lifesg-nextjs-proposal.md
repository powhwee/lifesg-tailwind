# LifeSG + Next.js + Tailwind — Discussion Doc

**Audience:** us two, ahead of the architecture call.
**Goal:** agree on how we use LifeSG in the new stack without painting ourselves into a corner.

## Context

- Project requires the [LifeSG React Design System](https://github.com/LifeSG/react-design-system) (`@lifesg/react-design-system`, latest v3.3.0).
- Stack we want: Next.js (App Router) + Tailwind.
- LifeSG is built on styled-components v6 and ships its own theme/tokens via a CSS file from `assets.life.gov.sg`.
- Your proposal: keep LifeSG, accept the friction. I'm aligned on the "keep LifeSG" part — the question is *how* we integrate it so the friction stays contained.

## Where we agree

- LifeSG is non-negotiable for branded / compliance components (NRIC input, address picker, button styling, anything carrying SG gov identity).
- Rebuilding those from scratch is wasted effort and a compliance risk.
- We'll be on App Router and Tailwind regardless.

## The friction worth talking through

Three concrete things, none fatal, all worth a decision:

1. **Two styling systems in one app.** styled-components (LifeSG) + Tailwind (us). Bundle gets bigger, theme tokens live in two places, and Tailwind utilities can't reach inside LifeSG components.
2. **RSC boundary.** Anything wrapping a LifeSG component is a client component. Pages can still be server components, but the leaves are client. Acceptable for a form-heavy app — worth naming explicitly so we don't fight it later.
3. **SSR setup tax.** styled-components needs a `StyledComponentsRegistry` in App Router or we get FOUC. One-time cost.

## What I'm proposing

Use LifeSG, but put it behind a thin local namespace so the rest of the codebase doesn't know it exists. This is mostly a discipline choice, not extra code — and it's cheap to do up front, expensive to retrofit.

### 1. Local UI namespace

```
src/
  components/
    ui/                     <-- only files allowed to import @lifesg/*
      Button.tsx
      FormField.tsx
      NricInput.tsx
      index.ts
    layout/                 <-- Tailwind, server components OK
    marketing/              <-- Tailwind, server components OK
  app/
    layout.tsx              <-- StyledComponentsRegistry wired here
```

- App code imports from `@/components/ui` only.
- Add an ESLint rule banning `@lifesg/*` imports outside `src/components/ui/`.
- The wrappers can be one-line re-exports — they're not adding logic, just a seam.

**Why bother if we're keeping LifeSG?** Two reasons:

- If we ever need to swap, replace, or augment a component, we touch one file instead of grepping the whole repo. (Concrete recent example: if LifeSG ships a breaking change in a component we use heavily, the wrapper absorbs it.)
- Prop API hygiene — we can expose only the props we actually use, instead of leaking LifeSG's full surface area into our app code.

### 2. Token extraction into Tailwind

Pull LifeSG's colors, spacing, and type scale into `tailwind.config.ts` as CSS variables, sourced from the LifeSG theme. Then Tailwind utilities (`bg-primary`, `text-base`, `p-4`) match LifeSG's visual language — the gaps between LifeSG components stop looking like a different product.

Open question: do we extract upfront, or lazily as we hit needs? I lean lazy — extract a token when we first reach for it in Tailwind.

### 3. Division of labor

- **LifeSG**: branded / interactive / compliance components.
- **Tailwind + local components**: layout, spacing, custom UI, anything LifeSG doesn't ship.
- **Do not** try to restyle LifeSG internals with Tailwind classes. That fight is unwinnable; styled-components win the specificity war and we'll just produce brittle CSS. Tailwind owns the gaps *between* LifeSG components, not their innards.

### 4. RSC: be deliberate, not defensive

- Pages and layouts: server components by default.
- Wrappers in `@/components/ui`: `"use client"` at the top.
- Pass server data into client islands as serialized props; pass mutations in as Server Actions. Both work fine across the boundary.
- Non-LifeSG content surfaces (marketing pages, dashboards with read-only data) stay fully server-rendered.

This is just App Router's intended "server shell, client islands" model. We're not running it in a degraded mode.

## Open questions for our discussion

1. **Audit first?** Should we list the LifeSG components we actually expect to use before we set up the wrapper layer, or wrap on demand as we build features? I lean on-demand to avoid speculative scaffolding.
2. **Theme customization.** Are we using the LifeSG theme as-shipped, or do we need to customize? Affects token-extraction strategy.
3. **What about LifeSG layout primitives?** They ship some (e.g. `Layout`, `Container`). I'd argue we use Tailwind for layout and only reach for LifeSG when the component is actually branded. Disagreements?
4. **Storybook?** LifeSG has its own Storybook. Do we run our own for the wrappers + local components, or rely on theirs? I'd run our own — it's our prop API the team will read.
5. **Escape hatch.** If we hit a LifeSG component that's missing a feature we need, our default move: extend the wrapper, not fork LifeSG. Agreed?

## Decision

If we agree on the above, the only actual upfront work is:

- `StyledComponentsRegistry` in `app/layout.tsx` (one file).
- ESLint rule for the import boundary (one config line).
- Folder convention (`src/components/ui/`) documented in README.

Everything else is incremental — wrappers and tokens added as we hit them. No big bang.

Happy to iterate on any of this before we commit.
