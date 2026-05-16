# Claude Review: Verification Suite — Strengths & Suggested Improvements

**Date:** 2026-05-15
**Scope:** All 27 files in `scripts/`, plus `tests/compare-button.spec.ts` and `playwright.config.ts`

---

## Current Architecture

The suite has organically grown into four layers:

| Layer | Scripts | Purpose |
|-------|---------|---------|
| **Smoke tests** | `smoke-content.mjs`, `smoke-navigation.mjs` | HTTP 200, pane mounting, hydration errors |
| **Measurement probes** | `measure.mjs`, `measure-content.mjs`, `measure-typography.mjs`, `probe-*.mjs` | `getComputedStyle` parity between ours vs LifeSG |
| **Behavioral tests** | `behavioral-content.mjs`, `carousel-test.mjs`, `modal-test.mjs`, `probe-tab-kbd.mjs` | Keyboard nav, ARIA state, open/close lifecycle |
| **Snapshots** | `screenshot-all.mjs`, `snap-*.mjs` | Full-page PNGs for visual review |
| **Static analysis** | `detect-tweaks.sh` | Grep for arbitrary values in source |
| **Infrastructure** | `extract-lifesg-tokens.mjs` | Token extraction from legacy package |
| **Formal Playwright tests** | `tests/compare-button.spec.ts` | Proper `test()` with assertions + axe a11y |

---

## What's Working Well

1. **The `data-testid` / `data-token` convention** is excellent. Every comparison page tags its panes (`content-ours`, `content-lifesg`) and individual specimens (`data-token="HeadingXXL"`), giving probes deterministic anchor points.

2. **`measure-content.mjs` is the crown jewel.** It pairs every `data-token` element across both panes, diffs 7 CSS properties + width/height, and reports mismatches in a single table. This is the kind of script that catches real regressions.

3. **`behavioral-content.mjs` documents known divergences.** The comment "LifeSG Tab does NOT bind arrow keys — known divergence" is exactly the right approach: test it, assert the divergence, and move on instead of papering over it.

4. **`extract-lifesg-tokens.mjs` is production-grade.** Programmatically resolving every `(props) => string` entry from the LifeSG theme object and generating a CSS file is far more reliable than manually transcribing token values.

---

## Suggested Improvements

### 1. Unify the runner — no single entry point

**Problem:** There is no way to run "all verification" in one command. Each script is invoked individually (`node scripts/smoke-content.mjs`), and they don't share a consistent exit-code contract. `smoke-navigation.mjs` sets `process.exit(failed > 0 ? 1 : 0)`, but `smoke-content.mjs` doesn't exit with a code at all.

**Suggestion:** Add a `scripts/verify-all.mjs` (or an npm script `"verify": "..."`) that runs smoke → measure → behavioral in sequence, propagating exit codes. This would let CI or a pre-push hook gate on "does the port still match?"

### 2. Hardcoded URLs and inconsistent port usage

**Problem:** Most scripts use `process.env.BASE ?? "http://localhost:3000"`, which is good. But `measure.mjs` hardcodes `http://localhost:3001` and targets `/compare/button` (a route structure that may be stale — the rest of the suite uses `/content/*/default`). The formal Playwright config uses port `3100`.

**Suggestion:** Standardize on `process.env.BASE ?? "http://localhost:3000"` everywhere. `measure.mjs` appears to be an early prototype that was superseded by `measure-content.mjs` — consider marking it as deprecated or removing it.

### 3. Snapshot output goes to `/tmp/` — ephemeral and invisible

**Problem:** `snap-content.mjs`, `snap-navigation.mjs`, `snap-content-dark.mjs`, and `snap-one.mjs` all write to `/tmp/content-snaps/` or `/tmp/navigation-snaps/`. These are wiped on reboot and aren't committed to the repo.

**Suggestion:** Write to `screenshots/` (which is already gitignored or committed as needed) for consistency with `screenshot-all.mjs`. Alternatively, use a project-local directory like `scripts/.output/` so the snapshots survive reboots and are discoverable.

### 4. The formal Playwright test suite is a skeleton

**Problem:** `tests/compare-button.spec.ts` is the only formal test. It covers rendering, visual snapshot, and axe accessibility — a great template. But it targets `/compare/button`, a route that appears to be from an earlier phase (the current comparison pages are at `/{category}/{component}/default`).

**Suggestion:** Either update this spec to target the current route structure, or generate specs for high-priority components using the same pattern (render + snapshot + axe). Even 5-6 specs covering the major categories (button, input, select, table, accordion, modal) would provide a durable CI safety net that the ad-hoc scripts can't.

### 5. No timeout/retry on `waitForTimeout`

**Problem:** Every script uses `await page.waitForTimeout(800)` (or 500, 1000, 1200) as a fixed sleep to wait for styled-components injection and client hydration. On a cold start or under CPU load, this can be insufficient, causing false mismatches.

**Suggestion:** Where possible, replace fixed sleeps with deterministic waits:
```js
// Instead of:
await page.waitForTimeout(800);

// Use:
await page.locator('[data-testid="content-ours"]').waitFor({ state: 'visible' });
await page.locator('[data-testid="content-lifesg"]').waitFor({ state: 'visible' });
```
The fixed timeout can remain as a final fallback (e.g., 300ms after the locator resolves) to account for styled-components paint, but the primary wait should be event-driven.

### 6. `modal-test.mjs` has a double `browser.close()`

**Problem:** Lines 44 and 46 both call `await browser.close()`. The second call will throw (or silently fail) because the browser is already closed.

**Suggestion:** Remove the duplicate on line 46.

### 7. Missing coverage for forms and overlays

**Problem:** The smoke and measure scripts cover `content/*` and `navigation/*` thoroughly, but `form/*`, `overlays/*`, and `selection-and-input/*` categories have no dedicated smoke or measure scripts. The screenshot suite covers them visually, but there is no programmatic `getComputedStyle` verification for these categories.

**Suggestion:** Extend the pattern from `smoke-content.mjs` / `measure-content.mjs` to cover forms and selection-and-input. These components (inputs, selects, checkboxes) tend to have the most subtle parity issues around padding, border-radius, and focus ring colors.

### 8. `detect-tweaks.sh` false positives

**Problem:** The arbitrary-value grep (`\b[pmwh]t?b?l?r?[xy]?-\[[0-9]+(px|rem|em|%)\]`) correctly flags `min-h-[6rem]` but also catches legitimate structural constraints like `min-w-[10rem]` on dropdown popups. It also doesn't distinguish between `src/components/ui/` (core library — should be clean) and `src/components/*/sections/` (demos — acceptable).

**Suggestion:** Split the output into two buckets: "core components" (`src/components/ui/`) and "demos/pages" (`src/components/*/sections/`, `src/app/`). Only gate CI on the core bucket.

---

## Summary

The verification suite is remarkably effective for its organic growth pattern. The highest-impact improvements would be:

1. **A unified runner** with proper exit codes (enables CI)
2. **Deterministic waits** instead of fixed sleeps (eliminates flakiness)
3. **Extend measure coverage** to forms and overlays (the categories with the most parity risk)
