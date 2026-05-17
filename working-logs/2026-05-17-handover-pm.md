# Handover — End of 2026-05-17 (pm) session

Supersedes `2026-05-17-handover.md` (am session). **Read this first.** The am handover documented the verify-all honesty fix and listed 4 open decisions; the pm session closed two of them and opened a much larger one (form input token strategy).

## TL;DR

Built out L2 measure coverage for form/overlays/selection-and-input — the gap explicitly flagged in the am handover as "the highest-leverage missing piece." Wrapper-level signal turned out loud enough to skip the Stage 2 marker work: **22 real chrome divergences surfaced across 17 routes**, falling into 3 root-cause buckets. No component fixes applied (project history says these are deliberate token choices; flagged for user).

Two open am-handover items now closed:
- ✓ "Decide on building out L2 coverage" — scripts built, wired, running honestly. Verify-all now covers 11 suites (was 8).
- ✓ Deploy backlog — user ran `firebase deploy` manually mid-session. GitHub auto-deploy declined (saved as project memory; will stop surfacing).

## What changed this session

```
62e2824  Add L2 measure scripts for form/overlays/selection-and-input
d934d4f  Filter 1px wrapper-width artifact from new measure scripts
9abf02e  Add probe-l2-divergences.mjs for chrome-level triage
[next]   This handover + pilot-findings entry
```

## Verify-all current state

```
RESULTS: 5 passed, 6 failed, 11 total
  smoke-content                    ✓ PASS
  smoke-navigation                 ✓ PASS
  smoke-form                       ✗ FAIL  ← pre-existing
  smoke-overlays                   ✗ FAIL  ← pre-existing
  smoke-selection-and-input        ✓ PASS
  measure-content                  ✗ FAIL  ← known table row-height (am handover)
  measure-typography               ✓ PASS
  measure-form                     ✗ FAIL  ← NEW: 11/11 routes, all share input-token root cause
  measure-overlays                 ✗ FAIL  ← NEW: 2/4 (drawer, menu) — needs investigation
  measure-selection-and-input      ✗ FAIL  ← NEW: 9/11 routes, per-component
  behavioral-content               ✓ PASS
```

3 of the 6 failures are pre-existing; the 3 new ones are the L2-expansion signal. None are regressions caused by this session's code.

## The big finding: form input chrome diverges systematically

`scripts/probe-l2-divergences.mjs` confirmed that across all 11 form routes, our `<input>` chrome differs by 4 token-level deltas:

| Property | Ours | LifeSG | Token (`src/app/form-tokens.css`) |
|---|---|---|---|
| `font-size` | 16px | 18px | `--input-font-size: 1rem` (commented `/* — LifeSG BodyMD */`) |
| `padding-x` | 12px | 16px | `--input-padding-x: 0.75rem` |
| `height` | 48px | 46px | `--input-height: 3rem` |
| `border-radius` | 4px | 0px | `--input-radius: 0.25rem` |

The comment on `--input-font-size` describes deliberate intent (use BodyMD = match body text). Empirically LifeSG inputs render at 18px, not BodyMD. So the intent is well-reasoned (typographic consistency) but diverges from observed LifeSG.

**This is your call**, not mine to make autonomously. Three reasonable directions:

1. **Align to LifeSG**: change the 4 token values (one file, ~4 lines). All 11 form measure failures should collapse to 0. Will shift ~22 L5 screenshots and probably need L4 baseline re-snapping.
2. **Keep ours, allowlist in measure-form**: codifies the divergence as an expected one. Same trap pattern as the table — fine if it's an explicit accepted design call.
3. **Hybrid**: align the most visible (padding, radius) and keep ours for the more debatable (font-size) — gives best visual parity while preserving the BodyMD typographic principle.

## Per-category punch list (from probe)

### Form (11/11) — single root cause

All 11 routes diverge because of the input-chrome token deltas above. Likely cascade: fix the 4 tokens, most of these collapse. Confirmed via probe; not separate bugs.

Edge: textarea also has `padding-y: 8px vs 12px` — would need a textarea-specific token tweak.

### Overlays (2/4) — needs deeper investigation

- **drawer** h: 308 ≠ 238 (70px taller in ours). Probe couldn't find LifeSG widgets in the on-page wrapper — likely renders trigger or layout differently than expected.
- **menu** h: 184 ≠ 238 (54px shorter in ours). Same probe blind spot.
- **modal** ✓ match after 1px filter.
- **popover** ✓ match.

Not safe to fix without inspecting the actual DOM structure side-by-side. The two diverge in opposite directions which is itself a signal — probably distinct issues, not a shared root.

### Selection-and-input (9/11) — per-component

| Route | Wrapper h diff | Probe observation |
|---|---|---|
| checkbox | -6px | ours 24px checkbox vs lifesg 32px (lifesg is bigger) |
| toggle | -24px | structural — probe returned strange shape; needs DOM inspection |
| icon-button | +24px | **ours 56px vs lifesg 48px** — ours is bigger (opposite direction!) |
| image-button | -6px | ours has `padding: 0` vs lifesg `24px 16px` — major chrome gap |
| otp-input | -74px | ours 56×56 cells, lifesg 46×73 — different size strategy |
| feedback-rating | +24px | ours has `border-radius: 33554432px` (max-int hack) vs lifesg standard |
| date-navigator | -18px | inner button 28px vs 40px height diff |
| calendar | -160px | **day-cell 28×28 vs 42×42** — LifeSG cells are 50% bigger; biggest single divergence |
| filter | -86px | filter chip button 20×35 vs 42×83 — major chrome gap |
| button | ✓ match | |
| radio-button | ✓ match | |

Note: icon-button and feedback-rating diverge in the *opposite* direction (ours is bigger / has weirder values). Worth fixing those first if you do anything here — they suggest ours has bugs, not just intentional divergence.

## What I deliberately did NOT do

- **No component fixes.** Per the 2026-05-12 "deliberate divergences" pattern in pilot-findings, token changes affecting many components need your design call. I documented but didn't act.
- **No allowlists.** Same trap as the table mismatch (am handover) — silencing the signal is the wrong default. Leave failing until you decide.
- **No Stage 2 marker work.** Original plan included adding fine-grained `data-token` markers to all 24 demo files. Skipped — wrapper-level signal turned out specific enough to localise the patterns via the probe. Add markers only if/when fixing, to verify the fix worked.
- **No README §Summary edit.** Same reason as am handover — that's a pitch-level decision.

## Open questions for you (carried + new)

Carried from am:
- Table row-height mismatch — leave failing / allowlist / fix?
- Soften README §Summary on parity claim?

New from pm:
- **Form input token strategy** — align to LifeSG (option 1) / keep ours + allowlist (option 2) / hybrid (option 3)?
- **Overlays drawer + menu** — accept investigation as next-session work?
- **Selection-and-input punch list** — fix the "opposite direction" ones (icon-button, feedback-rating) as obvious bugs first, then prioritise the rest?

## Things working well

- `verify-all` is now genuinely covering 11 suites across 33 L2 routes. The dashboard tells the truth and is the gate it claimed to be.
- The probe script (`scripts/probe-l2-divergences.mjs`) makes it cheap to characterise any new divergence — point it at a route and get per-widget chrome side-by-side.
- 1px-width filter in the new measure scripts is documented inline and won't drift.

## Pitfalls to remember

(Carried from prior handovers — still relevant.)

1. **Tailwind 4 + Turbopack content-scan cache** — see 2026-05-15.
2. **Root `.md` files are Tailwind sources.** See 2026-05-16.
3. **Next 16 blocks a second `next dev`.** Playwright reuses port 3000.
4. **Probe before fixing the obvious.** Today's L2 sweep added a new variant of this: **suspect shared root causes before treating many divergences as independent bugs** (all 11 form mismatches collapsed to 4 tokens).
5. **Carried from am:** distinguish "parity" from "regression" in test naming.
6. **New (pm): the harness slug-page asymmetrically applies `border-r border-border` to the left pane only.** This causes 1px width artifacts in any measure that probes a column-filling wrapper. Filter handles it for the new scripts but if you write more measures, account for it — or fix the slug pages to use `grid-cols-[1fr_1px_1fr]` with a divider element (would invalidate L4 baselines + L5 screenshots; multi-file change).

## Resume procedure

1. `git status` should be clean and `main` on HEAD of this handover commit.
2. `SKIP_VISUAL=1 node scripts/verify-all.mjs` — expect `5 passed, 6 failed`. If different, something drifted.
3. To inspect any specific divergence: `node scripts/probe-l2-divergences.mjs | tail -200` (full output is ~120 rows).
4. Decide on the form-input-token question first — biggest blast radius, simplest fix if you go option 1.
