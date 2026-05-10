# Pilot findings — running log

A live record of things we learn during the pilot. New findings get appended.

## 2026-05-10 — Visual parity is provable, not guessable

### What happened

Building the Button comparison, the screenshot suggested ours was "a little smaller" than LifeSG even after sizing/padding/font tweaks. We were going by eye. Wrong tool.

Used Playwright's `getComputedStyle` + `boundingBox()` (see `scripts/measure.mjs`) to read both sides programmatically. Result for all six Button variants:

| Variant     | Ours        | LifeSG      |
| ----------- | ----------- | ----------- |
| Primary     | 102.9 × 48  | 102.9 × 48  |
| Secondary   | 124.7 × 48  | 124.7 × 48  |
| Ghost       | 85.4 × 48   | 85.4 × 48   |
| Link        | 70.5 × 48   | 70.5 × 48   |
| Destructive | 133.7 × 48  | 133.7 × 48  |
| Disabled    | 109.2 × 48  | 109.2 × 48  |

Pixel-identical bounding boxes. Same `font-size` (18px), `font-weight` (600), `font-family` (Open Sans). Only computed-style differences were:

- **line-height**: ours 28px (Tailwind's `text-lg` default), LifeSG's 26px (`1.625rem`).
- **font-family fallback chain**: next/font appends `"Open Sans Fallback"` for FOIT prevention; LifeSG just declares `"Open Sans"`. Identical once the font loads.

Fixed the line-height with `leading-[1.625rem]` on the base classes.

### Why this matters for the pilot

1. **Stop arguing about pixels by eye.** The pilot's whole premise is that we can answer "can shadcn match LifeSG?" with evidence, not opinion. `scripts/measure.mjs` is the evidence machine — keep using it for every component.
2. **The "feels smaller" perception was real but misleading.** A 2px line-height difference shifts the text baseline, which changes how the button reads visually even though dimensions are identical. Worth knowing for design conversations later.
3. **Visual parity is achievable to the pixel.** This is a useful proof point for the engineer: with the right tokens and ~20 lines of CVA tweaks, shadcn can render identically to LifeSG. The interesting question for the rest of the pilot is no longer "can it match" but "what's the cost when LifeSG does something behavioral that Radix/Base UI doesn't?"

### Reusable artifacts left behind

- `scripts/measure.mjs` — point at any `/compare/[component]` route, prints a table of dimensions + computed styles for every named element on both sides. Extend the `cases` array for new components.
- `disabled:bg-[var(--lifesg-bg-disabled)]` pattern — when shadcn's "fade the variant" convention diverges from the design system's "always-grey-when-disabled" convention, override explicitly via the LifeSG semantic token. Keeps the source of truth in `lifesg-tokens.css`.

### Things still to verify

- This was Button — the simplest possible component. The next ones (Dialog, DatePicker) will surface real behavioral divergences (focus management, keyboard nav, escape handling). Pixel parity is a necessary but not sufficient signal.
- Open Sans is a peer-loaded font when using LifeSG-as-dep; LifeSG components don't bundle it. If we'd gone the LifeSG-as-dep path, we'd have had to remember to load it ourselves anyway. Calling that out so it doesn't come up later as a surprise.

## 2026-05-10 — Hot-reload velocity

Each Button tweak (sizing, padding, border, font, line-height) was a one-line change in `src/components/ui/button.tsx`, visible in the browser within 100ms via Turbopack hot reload. End-to-end iteration loop felt closer to live design than to code review. Worth flagging when comparing to the LifeSG-as-dep path, where every visual change is a fork-and-rebuild round-trip.
