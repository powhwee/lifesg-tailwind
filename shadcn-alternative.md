# Alternative: shadcn/ui Instead of LifeSG

**Audience:** us two, alongside the LifeSG proposal.
**Goal:** make the case that we can move *faster* than the LifeSG-as-dep path, with no upstream support risk, and prove it with a one-week pilot before committing.

## What I'm hearing from you

- LifeSG-as-dep is the fastest *start* — components exist, accessibility is solved, visual decisions are made.
- Building from scratch is weeks of work and we'd be reinventing accessibility, focus traps, keyboard navigation, etc.
- We're a small team. Maintenance burden of an in-house library is real.

These concerns are valid. They'd kill any "let's hand-roll our own design system" proposal. But shadcn/ui is not that — and I think once we look at it concretely, the speed argument flips.

## Reframe: shadcn isn't "from scratch"

[shadcn/ui](https://ui.shadcn.com) is a curated set of components built on [Radix UI](https://www.radix-ui.com) primitives + Tailwind. The model:

- Components live in **your repo**, copied in via CLI (`npx shadcn add button`).
- Radix handles the hard parts: focus traps, ARIA, keyboard nav, portal management. Battle-tested in production by GitHub, Linear, Vercel, et al.
- Tailwind handles styling. Variants via [CVA](https://cva.style).
- No npm dependency to upgrade. No styled-components. RSC-compatible by default.

**You're not building components from scratch — you're starting with components that already work, then customizing.** Closer to the LifeSG fork plan than to a hand-roll, but without the 6–12 weeks of porting.

## Concern-by-concern

| Engineer's concern             | shadcn's answer                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Slow start                     | `npx shadcn add button input form dialog` — 30 seconds. Productive same day.                                                         |
| Accessibility is hard          | Radix primitives are the gold standard. Better a11y baseline than most hand-rolled libs, including LifeSG in some areas.             |
| We'll bikeshed visual choices  | We borrow LifeSG's design tokens (colors, spacing, type) into `tailwind.config.ts`. Visual decisions inherited, no bikeshedding.     |
| Maintenance burden             | Same as forking LifeSG — we own the code either way. shadcn has a larger ecosystem of patterns to copy from.                          |
| Visual quality lag             | shadcn's defaults are production-grade. Linear, Cal.com, Resend, dub.co, Supabase dashboard all use it.                              |
| Branded components don't exist | NRIC input, address picker, agency masthead — we'd build these in *any* approach, since LifeSG's are SG-gov flavored, not our agency. |

## The pilot: prove it in one week

I propose we don't commit either way until we see a working artifact. One week, one engineer (or pair), produces:

### Storybook with side-by-side parity

A live Storybook deployed to a preview URL, showing the same components rendered two ways:

- **Left**: shadcn-based component (our build).
- **Right**: LifeSG component, installed as dep, rendered as ground truth.

Components in the pilot — chosen as a representative cross-section:

1. **Button** — primitive, all variants (primary, secondary, destructive, disabled, loading).
2. **Input + FormField** — form composition with label, error, helper text.
3. **Dialog/Modal** — portal, focus trap, escape behavior.
4. **DatePicker** — complex interaction, keyboard nav, locale.
5. **Masthead/Header** — agency-branded layout component (custom-built; proves we can do branded UI).

### Tests proving parity

For each component:

- **Visual regression** via Chromatic or Playwright `toHaveScreenshot()`. Pixel-level diff vs LifeSG.
- **Accessibility** via `@axe-core/playwright`. Both versions tested; ours must match or beat LifeSG's a11y score.
- **Interaction** via Storybook `play` functions or Vitest browser mode. Keyboard nav, focus, escape, validation.

### Token extraction

`tailwind.config.ts` populated with LifeSG colors, spacing, type scale, radii pulled from their theme file. Demonstrates we can inherit their visual language without inheriting their code.

## What the pilot proves

- **Speed**: 5 components in a week, with tests, side-by-side. If we can do this for 5, we can do it for the project's full surface area in 3–4 weeks part-time, vs. 6–12 weeks for a LifeSG fork.
- **Quality**: visual + a11y tests provide objective evidence, not opinion.
- **Risk**: if the pilot reveals shadcn doesn't cover something we need, we know in week 1, not month 3. We fall back to LifeSG-as-dep with no real cost.

## Decision gate

End of pilot week, we look at the Storybook together and answer:

1. Does it look right?
2. Do the tests pass (visual + a11y + interaction)?
3. Are there components shadcn/Radix doesn't cover that we'd need to hand-roll? How many?

If the answers are good → we adopt shadcn for the project, drop the LifeSG dependency, ship the pilot's components as the foundation.

If the answers are bad → we fall back to the LifeSG-as-dep proposal. We've lost one week, gained certainty.

## Why this is worth a week

We're starting a project that will live for years. The cost of picking wrong:

- LifeSG-as-dep, then they archive the repo or pivot the API → painful migration under deadline pressure.
- LifeSG fork → 6–12 weeks of porting before we ship features.
- shadcn that doesn't fit → 1 week of pilot work that we can throw away.

The pilot is the cheapest way to de-risk the decision. Worst case: 1 engineer-week. Best case: we ship faster *and* avoid the support-risk dependency.

## What I need from you

- Agreement to run the pilot.
- Pairing on which 5 components to include (the list above is a starting point).
- 30 minutes at the end of the week to review the Storybook together and decide.

Happy to be wrong about this. The pilot is designed so we find out.
