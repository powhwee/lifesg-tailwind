// One-off probe for the selection-and-input audit (2026-05-24 session).
// Measures key elements in both ours + lifesg panes across every S&I default route.
//
// Run: node scripts/probe-sni-audit.mjs > working-logs/2026-05-24-sni-probe.txt
import { chromium } from "@playwright/test";

const base = "http://localhost:3000";

// route → { selectors: { label: selectorWithinPane (relative to a pane root) } }
const routes = {
  "checkbox": {
    path: "/selection-and-input/checkbox/default",
    selectors: {
      "default-indicator":  "[data-token=\"default-size\"] >>> input[type=checkbox] + *, [data-token=\"default-size\"] [data-slot=checkbox], [data-token=\"default-size\"] [class*='Container']:not(span):not(label)",
      "small-indicator":    "[data-token=\"small-size\"] [data-slot=checkbox], [data-token=\"small-size\"] [class*='Container']",
    },
  },
  "radio-button": {
    path: "/selection-and-input/radio-button/default",
    selectors: {
      "default-indicator":  "[data-token=\"grouped\"] [data-slot=radio], [data-token=\"grouped\"] [class*='Container']",
      "small-indicator":    "[data-token=\"small-size\"] [data-slot=radio], [data-token=\"small-size\"] [class*='Container']",
    },
  },
  "toggle": {
    path: "/selection-and-input/toggle/default",
    selectors: {
      "checkbox-card":  "[data-token=\"checkbox\"] > label, [data-token=\"checkbox\"] > div:first-of-type",
      "radio-card":     "[data-token=\"radio\"] > label, [data-token=\"radio\"] > div:first-of-type",
    },
  },
  "image-button": {
    path: "/selection-and-input/image-button/default",
    selectors: {
      "selectable":  "[data-token=\"selectable\"] > button:first-of-type, [data-token=\"selectable\"] > div:first-of-type > button",
    },
  },
  "otp-input": {
    path: "/selection-and-input/otp-input/default",
    selectors: {
      "cell":  "[data-token=\"basic\"] input:not([type=hidden])",
    },
  },
  "feedback-rating": {
    path: "/selection-and-input/feedback-rating/default",
    selectors: {
      "basic-root":   "[data-token=\"basic\"] > div",
      "basic-img":    "[data-token=\"basic\"] img",
      "basic-star":   "[data-token=\"basic\"] button[role=radio], [data-token=\"basic\"] [aria-label*='star' i] svg",
      "basic-button": "[data-token=\"basic\"] button[type='submit'], [data-token=\"basic\"] button:not([role])",
    },
  },
  "filter": {
    path: "/selection-and-input/filter/default",
    selectors: {
      "filter-aside":  "[data-token=\"filter\"] > aside, [data-token=\"filter\"] > section, [data-token=\"filter\"] > div",
      "filter-title":  "[data-token=\"filter\"] h2",
    },
  },
  "date-navigator": {
    path: "/selection-and-input/date-navigator/default",
    selectors: {
      "container":  "[data-token=\"day-view\"] > div:first-of-type, [data-token=\"day-view\"] > section",
      "arrow":      "[data-token=\"day-view\"] button[aria-label*='previous' i], [data-token=\"day-view\"] button[aria-label*='back' i]",
    },
  },
};

async function probe(page, paneSelector, selectors) {
  return await page.evaluate(({ paneSelector, selectors }) => {
    const pane = document.querySelector(paneSelector);
    if (!pane) return { __error: `pane not found: ${paneSelector}` };
    const out = {};
    for (const [label, sel] of Object.entries(selectors)) {
      let el = null;
      // Try each comma-separated selector until one matches
      for (const s of sel.split(/,(?![^[]*\])/).map((x) => x.trim())) {
        try { el = pane.querySelector(s); if (el) break; } catch {}
      }
      if (!el) { out[label] = { __error: "not found" }; continue; }
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      out[label] = {
        tag: el.tagName.toLowerCase(),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        fontWeight: cs.fontWeight,
        padding: cs.padding,
        gap: cs.gap,
        borderRadius: cs.borderRadius,
        flexDirection: cs.flexDirection,
      };
    }
    return out;
  }, { paneSelector, selectors });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const KEYS = ["tag", "w", "h", "padding", "gap", "fontSize", "lineHeight", "fontWeight", "borderRadius", "flexDirection"];

for (const [name, { path, selectors }] of Object.entries(routes)) {
  console.log(`\n=== ${name}  (${path}) ===`);
  try {
    await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(600);
  } catch (e) {
    console.log(`  ERR loading: ${e.message}`);
    continue;
  }

  const paneSelectors = {
    ours:   `[data-testid="selection-and-input-ours"]`,
    lifesg: `[data-testid="selection-and-input-lifesg"]`,
  };
  const data = {};
  for (const p of ["ours", "lifesg"]) data[p] = await probe(page, paneSelectors[p], selectors);

  for (const label of Object.keys(selectors)) {
    console.log(`  ${label}:`);
    for (const p of ["ours", "lifesg"]) {
      const v = data[p][label] ?? { __error: "no data" };
      if (v.__error) { console.log(`    ${p.padEnd(7)} ${v.__error}`); continue; }
      const compact = KEYS.map((k) => `${k}=${v[k]}`).join("  ");
      console.log(`    ${p.padEnd(7)} ${compact}`);
    }
  }
}

await browser.close();
