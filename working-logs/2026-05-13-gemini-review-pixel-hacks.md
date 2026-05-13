# Gemini Review: Arbitrary Pixel Values in Tailwind

**Date:** 2026-05-13
**Context:** Evaluating whether arbitrary pixel values (e.g., `w-[327px]`, `mt-[14px]`) in Tailwind classes should universally be considered "whack-a-mole" hacks.

## The Verdict on Arbitrary Pixels

Not *every* single instance of an arbitrary pixel value is a hack, but as a general rule of thumb for layout and spacing: **Yes, arbitrary pixel values are usually a red flag in Tailwind.**

Here is the nuance of when it's a hack vs. when it's acceptable:

### 🔴 The Hacks (Whack-a-mole)
If you see things like `mt-[14px]`, `w-[327px]`, or `pl-[11px]`, that is almost always a developer nudging an element to exactly match a screenshot or Figma file without respecting the underlying design system. 
*   **Why it's bad:** It breaks the math of your spacing grid (which is usually base-4 or base-8). If the spacing system changes later, these hardcoded pixels won't scale naturally, making responsive design much harder to maintain.

### 🟢 The Acceptable Exceptions
There are a few scenarios where using arbitrary pixel values is completely fine and often necessary:
1.  **Micro-adjustments & Lines:** Things like `h-[1px]` or `w-[2px]` are completely normal for drawing dividers, borders, or custom UI lines where the relative `rem` scale doesn't make sense. (Though Tailwind provides standard utilities like `w-px` and `h-px` out of the box for exactly this).
2.  **Absolute Container Constraints:** Using an arbitrary pixel constraint on a structural wrapper like `max-w-[1200px]` or `min-h-[400px]` is acceptable if you have a rigid external requirement that doesn't fit standard breakpoints.
3.  **Third-Party Integration:** If you are wrapping a third-party library (like an iframe, a canvas element, or a specific graphic) that demands exact pixel dimensions to avoid breaking.

**TL;DR Summary:** 
If a developer uses `[px]` for margins, padding, or gaps to nudge text or buttons around, it's a "whack-a-mole" hack. If they use it for exact constraints on structural containers or 1px lines, it is usually acceptable architecture.
