# Styling readability — Tailwind/shadcn vs alternatives

**Context:** during the pilot scaffold, the tech lead noticed that the customised `Button` component had long Tailwind class strings and asked whether the convention is harder to read than alternatives. This doc captures the honest answer for later revisit.

## What looks scary

Three things in `src/components/ui/button.tsx` triggered the concern:

1. **Long single-line class strings.** The base classes for the button are one ~600-character string of utility classes:

   ```
   "group/button inline-flex shrink-0 items-center justify-center rounded-md
   border border-transparent bg-clip-padding text-base font-semibold
   whitespace-nowrap transition-all outline-none select-none
   focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
   active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none
   disabled:bg-[var(--lifesg-bg-disabled)] disabled:text-[var(--lifesg-text-disabled)]
   disabled:border-transparent ..."
   ```

2. **Arbitrary value syntax.** `disabled:bg-[var(--lifesg-bg-disabled)]` looks alien.

3. **Stacked modifiers.** `aria-invalid:ring-3 aria-invalid:ring-destructive/20` reads as line noise on first encounter.

## What's actually fine once you read Tailwind fluently

- Each token is one-to-one with a CSS property. `bg-primary` → `background-color: var(--primary)`. `disabled:` → `&:disabled`. The terseness is the cost; the consistency is the payoff.
- **There's no name to invent.** No `.button-primary-disabled-hover-with-icon`. The class string IS the description. New variants don't require naming-committee discussions.
- `disabled:bg-[var(--lifesg-bg-disabled)]` translates to "when this element is `:disabled`, set background-color to the CSS variable `--lifesg-bg-disabled`." Verbose but unambiguous.
- One file per component contains all styling + behavior. Easy to grep, easy to fork.

## Compared to the LifeSG alternative

LifeSG's button directory in `node_modules/@lifesg/react-design-system/button/` has 8 files:

```
button.tsx
button.style.ts
button-helper.ts
types.ts
index.ts
... etc
```

Their styling lives in `button.style.ts`, written in styled-components syntax — also long, also conditional, also referencing tokens. The total lines of code are *more* than our shadcn version, just split across more files. Different shape of complexity, not less complexity.

That's the honest tradeoff:

|                        | Tailwind/shadcn (ours)                                 | styled-components (LifeSG)                          |
| ---------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| Lines per component    | Higher density per line, fewer total lines             | Lower density per line, more total lines + files    |
| Naming overhead        | None — utilities are the names                         | High — every variant needs a styled name            |
| Token references       | `bg-primary` or `bg-[var(--lifesg-x)]`                 | `${({theme}) => Colour.bg.primary({theme})}`        |
| Editor experience      | Long lines unless wrapped/sorted                       | Multi-line CSS templates, but JS interpolation noise |
| Skimming a component   | Slow first time, fast once fluent                      | Slow either way — split across files                |
| Onboarding cost        | ~1 week of Tailwind acclimation                        | Familiar to anyone who has used CSS-in-JS           |

## Mitigations available if we keep shadcn

None of these make it short. They make it skimmable.

1. **Add `prettier-plugin-tailwindcss`** — auto-sorts classes into a canonical order (layout → spacing → typography → color → state). Long lines become scannable.
2. **Break the CVA call across multiple lines**, one logical group per line, instead of one big string.
3. **Pull the long base class string into a named const** with comment-separated clusters (focus, disabled, aria-invalid).

Example after these mitigations applied:

```ts
const buttonBase = [
  // layout
  "group/button inline-flex shrink-0 items-center justify-center",
  // typography
  "text-base font-semibold whitespace-nowrap",
  // shape
  "rounded-md border border-transparent bg-clip-padding",
  // motion
  "transition-all outline-none select-none active:not-aria-[haspopup]:translate-y-px",
  // focus
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  // disabled (LifeSG-flavored grey, not opacity-fade)
  "disabled:pointer-events-none disabled:border-transparent",
  "disabled:bg-[var(--lifesg-bg-disabled)] disabled:text-[var(--lifesg-text-disabled)]",
  // aria-invalid
  "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
].join(" ");
```

That reads as a list of concerns instead of a wall of text.

## Verdict

- For an engineer who reads shadcn projects regularly, the current style is normal.
- For an engineer who doesn't, there's about a week of acclimation.
- If the team strongly prefers a different model (CSS modules, vanilla-extract, even staying on styled-components like LifeSG), shadcn doesn't force the Tailwind convention — you can override per-component. But that gives up shadcn's biggest selling point: copy-paste-and-customise from the registry, where everything assumes Tailwind.

## Decision points to revisit

1. After the engineer has built one component themselves: do they find it readable?
2. After 5 components: does the codebase feel maintainable to skim, or does it feel write-only?
3. If the answer to either is "no," apply the mitigations above. If still "no" after that, the team is telling you that Tailwind isn't the right styling layer for them — and that's a legitimate signal worth listening to, not pushing through.
