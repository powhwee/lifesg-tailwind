# Handover — End of 2026-05-17 (pm) session

Supersedes `2026-05-17-handover.md` (am session). **Read this first.** This session ran in two phases — the first did the L2 expansion + triage; the second did concrete chrome-level fixes after user gave the green light to apply.

## TL;DR

1. Built out L2 measure coverage for form/overlays/selection-and-input — the gap flagged in the am handover. Verify-all now covers 11 suites / 33 L2 routes (was 8 / 7).
2. Initial L2 sweep surfaced 22 real chrome divergences. Triage revealed dominant patterns (form input chrome misnamed BodyMD vs BodyBL, several selection-and-input components off-by-one on the size scale).
3. **User reframed pilot → "full complete port"**, authorised fixes across all ported components.
4. Applied chrome-level fixes: input font-size token, checkbox size, icon-button size, image-button image inset, calendar day-cell height, OTP cell dimensions.
5. Discovered + worked around two silent Tailwind 4 / tailwind-merge bugs that had been hiding the input font-size mismatch.

Two open am-handover items closed:
- ✓ "Decide on building out L2 coverage" — scripts built, wired, running.
- ✓ Deploy backlog — user ran `firebase deploy` manually mid-session. GitHub auto-deploy declined (saved as project memory; will stop surfacing).

## Commits this session

```
62e2824  Add L2 measure scripts for form/overlays/selection-and-input
d934d4f  Filter 1px wrapper-width artifact from new measure scripts
9abf02e  Add probe-l2-divergences.mjs for chrome-level triage
88d0c48  Document L2 expansion findings + pm handover (initial)
ae941cd  Fix input font-size: map to LifeSG BodyBL (18px), not BodyMD (16px)
6904b74  Align checkbox, icon-button, image-button to LifeSG chrome
9987a9e  Align calendar day-cell + weekday height to LifeSG (h-9 → h-10)
62b113f  Resize OTP input cells to LifeSG dimensions (72×48, 4px radius)
[next]   Update this handover + pilot-findings
```

## Verify-all current state

```
RESULTS: 5 passed, 6 failed, 11 total
  smoke-content                    ✓ PASS
  smoke-navigation                 ✓ PASS
  smoke-form                       ✗ FAIL  ← pre-existing (phone-number-input %s warning)
  smoke-overlays                   ✗ FAIL  ← pre-existing (modal portal lifesgBody=false)
  smoke-selection-and-input        ✓ PASS
  measure-content                  ✗ FAIL  ← known table row-height (am handover)
  measure-typography               ✓ PASS
  measure-form                     ✗ FAIL  ← residual demo asymmetry; chrome largely aligned
  measure-overlays                 ✗ FAIL  ← drawer, menu (still uninvestigated)
  measure-selection-and-input      ✗ FAIL  ← down from 9 to 8 mismatches; rest are structural
  behavioral-content               ✓ PASS
```

Same passed/failed count as start-of-session, but the meaning shifted: failures now point at real, *bounded* remaining work rather than systematic root-cause bugs.

## What was fixed (chrome-level)

### Input font-size — root cause was a wrong token mapping + Tailwind 4 bug stack

`--input-font-size` was set to `1rem` (16px, "LifeSG BodyMD" per the comment). LifeSG actually renders inputs at **BodyBL (1.125rem / 18px)** — BodyMD is the *compact secondary* body scale, not the baseline. Re-pointed `--input-font-size` and `--input-line-height` to `--lifesg-font-body-{size,lh}-baseline` per `src/app/lifesg-tokens.css:240-244`.

**Two silent bugs blocked the fix from taking effect** (both worth knowing about for future):

1. **Tailwind 4 utility-name collision.** `text-input` (intended as font-size utility) collided with shadcn's bare `--input` color token. Tailwind 4 emitted `.text-input { color: var(--input) }` — the font-size mapping vanished. **Renamed to `text-input-size` in globals.css + 9 consumer files** (`src/components/ui/{input,textarea,select,multi-select,date-input,date-range-input,input-group,unit-number-input,phone-number-input}.tsx`).

2. **tailwind-merge stripped the renamed class.** twMerge groups all `text-*` classes as colors by default; whenever `text-input-size` (our font-size) and `text-input-text` (color) appeared on the same element, twMerge kept the color and *threw away* the font-size. **Extended tailwind-merge in `src/lib/utils.ts`** to register `text-input-size` as font-size.

Net: form inputs now render at 18px across input, textarea, select, phone-number-input, unit-number-input, date-input, date-range-input. Typecheck clean. Smoke unchanged.

### Per-component chrome alignments

| Component | What | Where |
|---|---|---|
| checkbox | size-6 → size-8 (24→32px default), size-5 → size-6 (20→24px small). Inner icon scaled. | `ui/checkbox.tsx` |
| icon-button | size-14/20/10 → size-12/16/10 (default 56→48, large 80→64). Inner SVG scaled. | `ui/icon-button.tsx` |
| image-button | image was `absolute inset-0 size-full` (fullbleed) → `absolute inset-y-6 inset-x-4 object-contain` (insets per LifeSG's 24px/16px button padding) | `ui/image-button.tsx` |
| calendar | day-cell + weekday row: `h-9` → `h-10` (36→40px) | `ui/calendar.tsx` |
| OTP cells | `size-14 rounded-lg` (56×56, 8px radius) → tokenised `w-otp-cell-width h-otp-cell-height rounded-otp-cell` (72×48, 4px radius) | `ui/otp-input.tsx` + tokens added in `selection-and-input-tokens.css` + `globals.css` |

## What wasn't fixed (deferred for next session, with rationale)

### Form residual diffs (measure-form still 11/11)

After the font fix, form widget chrome is **visually aligned** (both panes render inputs at 48px total: ours via 48px input direct, LifeSG via 46px input + 2px wrapper border; structural difference, same visible result). The remaining wrapper-height diffs (4-38px per route) are **demo-content asymmetry**, not chrome bugs:

- `custom-field` 38px diff — demo uses raw `<input>` with hardcoded styles, not our `Input` component
- Other routes 4-20px — different label structure between `<FormInput>` and `<Form.Input>`, slightly different description text height

These need Stage 2 markers (data-token on actual widgets, not wrappers) to give useful per-widget L2 signal. Skipped because: (a) wrapper-level diff isn't the real signal here, and (b) the chrome itself already matches once you drill in.

### Overlays drawer + menu (unchanged from am)

- drawer h: 308 ≠ 238 (70px taller in ours)
- menu h: 184 ≠ 238 (54px shorter in ours)

Probe couldn't find LifeSG widgets in the on-page wrapper (heuristic likely picks wrong elements — LifeSG triggers may render in portals). Both diverge in opposite directions, so probably distinct issues. Not safe to fix without DOM-structure-aware investigation.

### Selection-and-input remaining (8/11 — was 9)

| Route | h diff | Investigated? | Next step |
|---|---|---|---|
| checkbox | -2px | yes | demo noise, basically aligned |
| toggle | -24px | yes — different DOM | deliberate divergence per 2026-05-12 memo ("LifeSG's Toggle is not a switch"). Skip. |
| image-button | -6px | yes | aspect-square enforces 103×103; LifeSG isn't square (103×106). Separate decision. |
| otp-input | -90px | yes | cell chrome aligned; residual is demo/action-button gap spacing |
| feedback-rating | +24px | partial | different DOM structures, needs deeper look |
| date-navigator | -18px | yes | center-display button is 40px tall in ours, 28px in LifeSG. Padding refactor needed; not single-token. |
| calendar | -104px | partial | day cells aligned to 40px; residual is header/grid padding |
| filter | -86px | no | different chip chrome; needs deeper look |

## Two new Tailwind 4 pitfalls to remember

1. **Custom `--text-X` tokens collide with shadcn's bare color tokens.** If shadcn has `--X` color and you add `--text-X` font-size, Tailwind emits only the color rule and silently drops the font-size. Rename to `--text-X-size` (or anything that doesn't match a color name).

2. **tailwind-merge groups all `text-*` as color and dedupes.** Custom font-size classes named `text-*` get stripped when paired with any `text-{color}` class. Register them in `extendTailwindMerge` (`src/lib/utils.ts`).

Both were the root cause of the input font-size never applying — the token was right, the utility was right, but the chain silently failed. Worth a comment in any new `text-*` utility we define.

## Open decisions for you (carried + new)

Carried from am:
- Table row-height mismatch — leave failing / allowlist / fix?
- Soften README §Summary on parity claim? (Now even more relevant — README's "pixel-level visual parity" claim is partly true now after this session's fixes, but the L2 measure still fails on demo asymmetry.)

New from pm:
- **Re-baseline L4 visual snapshots + L5 screenshots.** Multiple chrome changes have shifted rendering for: input (font-size up), checkbox (size up), icon-button (size down), image-button (image inset), calendar (day-cell), otp-input (cell shape). The L4 parity.spec.ts snapshots and screenshots/*.png will diff against current render. Re-snapping is a deliberate act — needs your decision on visual direction.
- **Stage 2 markers for form** — needed if you want measure-form to give useful per-widget signal instead of catching demo asymmetry. Adding `data-token` to actual widgets in each demo wrapper.
- **The deeper selection-and-input divergences** (toggle, feedback-rating, filter, drawer, menu) — accept investigation for next session, or scope down ambition?

## Things working well (don't break)

- `verify-all` is honest. Failures point at real, bounded work.
- `scripts/probe-l2-divergences.mjs` is the right tool for any new divergence — point it at a route and get per-widget chrome side-by-side.
- Token rename pattern (`--text-input-size`) plus the tailwind-merge extension is reusable for any new font-size utility.
- 1px-width filter in measure scripts is documented inline.

## Pitfalls to remember

(Carried + new.)

1. **Tailwind 4 + Turbopack content-scan cache** — see 2026-05-15.
2. **Root `.md` files are Tailwind sources.** See 2026-05-16.
3. **Next 16 blocks a second `next dev`.** Playwright reuses port 3000.
4. **Probe before fixing the obvious.**
5. **Distinguish parity from regression in test naming** (from am).
6. **Slug-page `border-r` asymmetry causes 1px width diff** (from initial pm).
7. **NEW: `--text-X` tokens collide with bare `--X` color tokens.** See above.
8. **NEW: tailwind-merge strips custom `text-*` font-size classes.** See above.
9. **NEW: When L2 surfaces many divergences in one category, suspect shared root causes** (this session's lesson — 4 form chrome properties traced to one wrong token mapping, but ALSO the visible chrome already matched once we probed; not all wrapper diffs were chrome bugs).

## Resume procedure

1. `git status` should be clean, `main` on HEAD of this handover commit.
2. `SKIP_VISUAL=1 node scripts/verify-all.mjs` — expect `5 passed, 6 failed`.
3. To inspect any divergence: `node scripts/probe-l2-divergences.mjs | tail -200`.
4. Decide on L4/L5 re-baselining first — likely the next blocker because visual snapshots are now stale across multiple components.
