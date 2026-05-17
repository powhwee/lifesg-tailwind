// One-shot probe for the L2 sweep findings of 2026-05-17.
// For each diverging route, walks the ours-pane and lifesg-pane subtrees and
// reports the chrome of the primary visible widget — height, font-size,
// border, padding — so the punch list cites concrete diffs, not just
// wrapper-height deltas.
//
// Not wired into verify-all. This is investigation scaffolding; delete if it
// outlives its purpose.
import { chromium } from "@playwright/test";

const base = process.env.BASE ?? "http://localhost:3000";

// Diverging routes from the L2 sweep, plus the testid prefix for that
// category's slug page.
const targets = [
  // form
  ["form", "custom-field"],
  ["form", "input"],
  ["form", "textarea"],
  ["form", "masked-input"],
  ["form", "input-group"],
  ["form", "phone-number-input"],
  ["form", "unit-number-input"],
  ["form", "date-input"],
  ["form", "date-range-input"],
  ["form", "select"],
  ["form", "multi-select"],
  // overlays
  ["overlays", "drawer"],
  ["overlays", "menu"],
  // selection-and-input
  ["selection-and-input", "checkbox"],
  ["selection-and-input", "toggle"],
  ["selection-and-input", "icon-button"],
  ["selection-and-input", "image-button"],
  ["selection-and-input", "otp-input"],
  ["selection-and-input", "feedback-rating"],
  ["selection-and-input", "date-navigator"],
  ["selection-and-input", "calendar"],
  ["selection-and-input", "filter"],
];

// CSS selectors for the "primary widget" element in each category. These
// are heuristics — for inputs we measure the first `<input>`; for buttons
// the first `<button>`, etc. Good enough for triage.
const widgetSelectors = {
  "form": "input, textarea, [role='combobox'], button",
  "overlays": "button, [role='dialog']",
  "selection-and-input": "input, button, [role='checkbox'], [role='switch'], [role='radio']",
};

async function probe(page, paneSelector, widgetSelector) {
  return await page.evaluate(
    ({ paneSelector, widgetSelector }) => {
      const pane = document.querySelector(paneSelector);
      if (!pane) return null;
      const widgets = pane.querySelectorAll(widgetSelector);
      const out = [];
      for (let i = 0; i < Math.min(widgets.length, 3); i++) {
        const el = widgets[i];
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        out.push({
          tag: el.tagName.toLowerCase(),
          type: el.getAttribute("type") ?? el.getAttribute("role") ?? "",
          w: Math.round(r.width),
          h: Math.round(r.height),
          fs: s.fontSize,
          fw: s.fontWeight,
          pad: s.padding,
          border: s.borderTop === s.borderBottom && s.borderTop === s.borderLeft && s.borderTop === s.borderRight
            ? s.borderTop
            : `T:${s.borderTop} R:${s.borderRight} B:${s.borderBottom} L:${s.borderLeft}`,
          radius: s.borderRadius,
        });
      }
      return out;
    },
    { paneSelector, widgetSelector }
  );
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const rows = [];

for (const [category, slug] of targets) {
  const route = `/${category}/${slug}/default`;
  const selector = widgetSelectors[category];
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const ours = await probe(page, `[data-testid="${category}-ours"]`, selector);
  const lifesg = await probe(page, `[data-testid="${category}-lifesg"]`, selector);
  const max = Math.max(ours?.length ?? 0, lifesg?.length ?? 0);
  for (let i = 0; i < max; i++) {
    rows.push({ route: `${category}/${slug}`, idx: i, side: "ours",   ...(ours?.[i] ?? {}) });
    rows.push({ route: `${category}/${slug}`, idx: i, side: "lifesg", ...(lifesg?.[i] ?? {}) });
  }
}

await browser.close();

console.log("\n## Per-widget chrome probe — first 3 widgets per route\n");
console.log("| route | idx | side | tag | h | w | fs | pad | border | radius |");
console.log("|---|---|---|---|---|---|---|---|---|---|");
for (const r of rows) {
  const cell = (v) => String(v ?? "").replace(/\|/g, "\\|").slice(0, 60);
  console.log(`| ${r.route} | ${r.idx} | ${r.side} | ${cell(r.tag)} | ${r.h ?? ""} | ${r.w ?? ""} | ${cell(r.fs)} | ${cell(r.pad)} | ${cell(r.border)} | ${cell(r.radius)} |`);
}
