# Gemini Review: The Automated Verification Suite

**Date:** 2026-05-15
**Context:** Reviewing the 27 scripts located in the `scripts/` directory, used to enforce visual parity, detect regressions, and audit the Tailwind port of the LifeSG design system.

## Overview

This is an incredibly robust, multi-layered verification ecosystem. Instead of relying purely on pixel-based visual diffs (which are notoriously flaky) or human "eyeballing," this suite programmatically proves that the new Tailwind implementation calculates out to the exact same math in the browser as the legacy `styled-components` implementation.

The suite can be broken down into four distinct categories:

### 1. The "Ground Truth" DOM Probes (`measure-*.mjs`, `probe-*.mjs`)
*Examples: `measure-content.mjs`, `measure-typography.mjs`, `probe-padding.mjs`*

This is the most impressive part of the suite. These scripts use Playwright to load the side-by-side comparison pages, locate the new component (`ours-pane`) and the legacy component (`lifesg-pane`), and run a deep `getComputedStyle()` comparison. 
They mathematically compare the final browser rendering engines outputs for:
- `width`, `height` (via `getBoundingClientRect`)
- `fontSize`, `fontWeight`, `color`
- `padding`, `margin`, `borderRadius`

If the Tailwind spacing differs by even 1 pixel from the legacy styled-component, these scripts generate a detailed `mismatch` report (e.g., `w: 120 ≠ 121`). This completely eliminates "whack-a-mole" guessing.

### 2. Component Smoke Tests (`smoke-*.mjs`)
*Examples: `smoke-content.mjs`, `smoke-navigation.mjs`*

These ensure the port doesn't break React or Next.js fundamentals. They crawl the library routes looking specifically for:
- HTTP 200 statuses
- Component mounting success (checking if `[data-testid]` exists)
- React Hydration errors (`console.error` listeners)
These guarantee that the refactor hasn't accidentally introduced client-side crashes or SSR hydration mismatches.

### 3. Layout Topology Verification (`verify-*.mjs`, `inspect-*.mjs`)
*Examples: `verify-layout-errordisplay.mjs`*

Instead of checking computed styles, these scripts check DOM topology. They inject scripts to ensure the exact number of `[data-token]` attributes mount correctly. This validates that structural layout components (like grids or nested flex containers) haven't silently dropped children during the port.

### 4. Snapshot & Linting (`screenshot-all.mjs`, `detect-tweaks.sh`)
- The snapshot scripts crawl the local server and generate a pure visual library of regressions for LLMs (or humans) to review side-by-side.
- The `detect-tweaks.sh` script acts as a static analysis linter, catching developers who cheat the system by injecting arbitrary pixel values instead of using the Tailwind scale.

## Conclusion
This is a masterclass in how to port a design system safely. By combining structural DOM topology checks, React smoke tests, pure static analysis, and programmatic `getComputedStyle` diffs, the team has built a safety net that practically guarantees 1:1 parity without human error.
