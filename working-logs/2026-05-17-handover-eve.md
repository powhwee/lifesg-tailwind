# Handover — End of 2026-05-17 (eve) session

Supersedes `2026-05-17-handover-pm.md`. **Read this first.**

## TL;DR

1. **Completed Phase 0A** — relocated `data-token` markers from aggregate wrappers to per-widget containers across **all four component groups** (form, selection-and-input, overlays, navigation). Content + navigation were already correct; form (11 files), selection-and-input (11 files), and overlays (4 files) were fixed.
2. **Measurement now honest** — verify-all surfaces real per-widget divergences, not wrapper noise. Before: 18 undifferentiated `"default"` mismatches. After: 24 clean matches + 38 specific per-widget divergences with clear root-cause patterns.
3. **Sidenav component overhauled** — 7 structural fixes to match LifeSG reference: icon-only pill highlight, drawer behaviour, selected-state suppression, background scoping, and full tokenisation of all dimensions via L3 tokens + Tailwind `--spacing-*` / `--text-*` registration.

## Phase 0A: Token relocation summary

| Group | Files changed | Before | After |
|-------|--------------|--------|-------|
| Form | 11 | 11× `data-token="default"` on outer stack | 37 per-widget tokens (15 match ✓, 22 diverge) |
| Selection & Input | 11 | 11× `data-token="default"` on outer stack | 25 per-widget tokens (9 match ✓, 16 diverge) |
| Overlays | 4 | 4× `data-token="default"` on outer stack | Per-section tokens; drawer/menu marked `no-equivalent` |
| Content | 0 (already correct) | Per-variant tokens already on widget divs | No change |
| Navigation | 0 (already correct) | Per-variant tokens already on widget divs | No change |

**Pattern applied:** `data-token` moved from `<div className="flex flex-col gap-8" data-token="default">` (wraps all sections) to `<div className="mt-3" data-token="specific-name">` (wraps one component variant).

## Phase 0B: Content sub-element audit

All content files (accordion, box-container, card, tab, table, uneditable-section) were audited and confirmed **already correctly instrumented** at per-widget level. No changes needed.

## Sidenav component overhaul

### Structural changes to `src/components/ui/sidenav.tsx`

| Change | Before | After | Rationale |
|--------|--------|-------|-----------|
| Icon rail background | On outer `<div>` (bleeds everywhere) | On `<nav>` only | LifeSG: only icon column is tinted |
| Selected highlight | Full-width rectangle on button | Pill (`rounded-lg`) on icon span only | LifeSG: highlight scoped to icon area |
| Selected-state logic | `selected \|\| isOpen` (both show) | `isOpen \|\| (selected && !drawerIsOpen)` | LifeSG: opening drawer un-highlights other items |
| Drawer header | Title + X close button | Removed | LifeSG: drawer starts immediately with content |
| Chevron direction | Collapsed = `-rotate-90` | Expanded = `rotate-180` | LifeSG: upward chevron when expanded |
| Unused import | `X` from lucide | Removed | Cleanup after removing drawer header |

### Tokenisation — all dimensions now L3 tokens

Added to `src/app/navigation-tokens.css`:

```css
--sidenav-rail-width:   8.5rem;    /* 136px */
--sidenav-rail-pt:      0.5rem;    /* 8px  */
--sidenav-rail-pb:      1.5rem;    /* 24px */
--sidenav-pill-w:       3.25rem;   /* 52px */
--sidenav-pill-h:       1.75rem;   /* 28px */
--sidenav-label-size:   0.75rem;   /* 12px */
--sidenav-label-line:   1.25rem;   /* 20px */
--sidenav-icon-size:    1.5rem;    /* 24px */
```

Registered in `src/app/globals.css` as `--spacing-sidenav-*` and `--text-sidenav-label` for Tailwind utility access (follows avatar pattern: `w-sidenav-rail-width`, `text-sidenav-label`, etc.).

**All values sourced from `getComputedStyle` probe against LifeSG reference pane — not eyeballed.**

## Verify-all current state

```
RESULTS: 7 passed, 6 failed, 13 total
  smoke-content                    ✓ PASS
  smoke-navigation                 ✓ PASS
  smoke-form                       ✗ FAIL  ← pre-existing (phone-number-input %s warning)
  smoke-overlays                   ✗ FAIL  ← pre-existing (modal portal lifesgBody=false)
  smoke-selection-and-input        ✓ PASS
  measure-content                  ✗ FAIL  ← 12 mismatches, 3 expected
  measure-navigation               ✗ FAIL  ← navbar h:295≠286, footer h:346≠391
  measure-typography               ✓ PASS
  measure-form                     ✗ FAIL  ← 22 mismatches (per-widget, was 11 wrapper-level)
  measure-overlays                 ✓ PASS
  measure-selection-and-input      ✗ FAIL  ← 16 mismatches (per-widget, was 7 wrapper-level)
  behavioral-content               ✓ PASS
  screenshot-all                   ✓ PASS
```

Mismatch count went UP from the pm session — this is correct and expected. We're now measuring more things at a finer granularity. Previously 18 wrapper-level mismatches masked the real state. Now 38 per-widget mismatches give honest signal.

## Files changed this session

### Demo token relocation (26 files)
- `src/components/form/sections/` — 11 files (already done in prior truncated session)
- `src/components/selection-and-input/sections/` — 11 files (button, checkbox, radio-button, toggle, icon-button, image-button, otp-input, feedback-rating, date-navigator, calendar, filter)
- `src/components/overlays/sections/` — 4 files (modal, popover, drawer, menu)

### Component fix (1 file)
- `src/components/ui/sidenav.tsx` — structural overhaul

### Token files (2 files)
- `src/app/navigation-tokens.css` — 8 new sizing tokens added
- `src/app/globals.css` — 8 new `--spacing-*` / `--text-*` registrations

## Open decisions for next session

1. **Phase 1: Fix the root causes.** The 38 per-widget divergences collapse into a few systematic patterns:
   - Form wrapper spacing (+4px) and raw input height (+2px) — 22 of the 38
   - Selection-and-input: toggle (structural), calendar (width), filter (structural)
   - Content: accordion, box-container, tab heights
   - Navigation: navbar (+9px), footer (-45px)

2. **Sidenav visual verification.** The structural changes need a side-by-side screenshot check. Drawer interaction (clicking Calendar, Documents) should be tested manually.

3. **L5 screenshot refresh.** Multiple components changed — screenshots are stale.

## Pitfalls to remember

(Carried from pm + new.)

1–9: See pm handover.
10. **NEW: `data-token="default"` on a fixed-height container reports `✓ match` even when inner chrome diverges.** The sidenav's `h-[28rem]` harness box masked all differences. Per-widget tokens must be on the component itself, not the demo harness.
11. **NEW: Probe before fixing visually.** Use `getComputedStyle` probes to get exact measurements from both panes — don't eyeball dimensions. This session's sidenav started with an incorrect 5.5rem rail width that had to be reverted to 8.5rem after the probe showed LifeSG is actually 136px.

## Resume procedure

1. `git status` — check for uncommitted changes from this session.
2. `node scripts/verify-all.mjs` — expect `7 passed, 6 failed, 13 total`.
3. Visual check: open `http://localhost:3000/navigation/sidenav/default` — confirm icon pill highlight shape, background scoping, and drawer behavior.
4. Next priority: Phase 1 fixes starting with form root causes (wrapper spacing + input height).
