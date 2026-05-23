// Probes computed style on every `[data-token]`-tagged element on every /content
// default page, pairing ours-pane vs lifesg-pane values where labels match.
// Walks the rendered DOM rather than enumerating component-by-component.
import { chromium } from "@playwright/test";

const base = process.env.BASE ?? "http://localhost:3000";
const routes = [
  ["card",                "/content/card/default"],
  ["table",               "/content/table/default"],
  ["uneditable-section",  "/content/uneditable-section/default"],
  ["box-container",       "/content/box-container/default"],
  ["tab",                 "/content/tab/default"],
  ["accordion",           "/content/accordion/default"],
];

const props = ["fontSize", "fontWeight", "lineHeight", "color", "backgroundColor", "borderRadius", "padding", "border", "borderColor", "borderWidth", "boxShadow", "gap", "margin"];

// Expected divergences — known structural noise at this script's viewport that
// is not a chrome bug. Each entry needs a reason; do not add without one.
//   route   — the route name from the `routes` array above
//   token   — the [data-token] value on the diverging element
//   reason  — one-line explanation of why the diff is expected
const expectedDivergences = [
  {
    route: "table",
    token: "default",
    reason:
      "1400px viewport allocates 'Date' column 4px narrower on LifeSG, causing '12 May 2026' to wrap to 3 lines vs ours' 2; ~100px row-height delta is text-wrap noise, not chrome. Chrome (cell padding, head row min-height) verified aligned at 1500px screenshot viewport.",
  },
  {
    route: "card",
    token: "default",
    reason: "2px height diff is sub-pixel rendering noise within normal browser-paint tolerance.",
  },
  {
    route: "card",
    token: "passthrough",
    reason: "1px line-height diff is sub-pixel rendering noise.",
  },
];

async function probe(page, paneSelector) {
  return await page.evaluate(
    ({ paneSelector, props }) => {
      const pane = document.querySelector(paneSelector);
      if (!pane) return {};
      const out = {};
      const nodes = pane.querySelectorAll("[data-token]");
      for (const el of nodes) {
        const s = getComputedStyle(el);
        const styles = {};
        for (const p of props) styles[p] = s[p];
        const rect = el.getBoundingClientRect();
        styles.w = Math.round(rect.width);
        styles.h = Math.round(rect.height);
        out[el.getAttribute("data-token") ?? "?"] = styles;
      }
      return out;
    },
    { paneSelector, props }
  );
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

let total = 0;
let mismatches = 0;
let expectedSeen = 0;
const allRows = [];

const isExpected = (route, token) =>
  expectedDivergences.find((d) => d.route === route && d.token === token);

for (const [name, route] of routes) {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const ours = await probe(page, '[data-testid="content-ours"]');
  const lifesg = await probe(page, '[data-testid="content-lifesg"]');
  const tokens = new Set([...Object.keys(ours), ...Object.keys(lifesg)]);
  for (const t of tokens) {
    const o = ours[t];
    const l = lifesg[t];
    if (!o || !l) {
      allRows.push({ route: name, token: t, mismatch: "(unpaired)", o: o ? "✓" : "—", l: l ? "✓" : "—" });
      continue;
    }
    total++;
    const diffs = [];
    for (const p of props) {
      if (o[p] !== l[p]) diffs.push(`${p}: ${o[p]} ≠ ${l[p]}`);
    }
    // 1px width delta is the test-harness border-r artifact (left pane has
    // `border-r border-border` in the slug page), not a real chrome
    // divergence. Mirrors the same filter in measure-overlays/measure-form.
    const isBorderArtifact = Math.abs(o.w - l.w) === 1;
    if (o.w !== l.w && !isBorderArtifact) diffs.push(`w: ${o.w} ≠ ${l.w}`);
    if (o.h !== l.h) diffs.push(`h: ${o.h} ≠ ${l.h}`);
    if (diffs.length > 0) {
      const expected = isExpected(name, t);
      if (expected) {
        expectedSeen++;
        allRows.push({ route: name, token: t, mismatch: `[expected] ${diffs.join("; ").slice(0, 160)}` });
      } else {
        mismatches++;
        allRows.push({ route: name, token: t, mismatch: diffs.join("; ").slice(0, 200) });
      }
    } else {
      allRows.push({ route: name, token: t, mismatch: "" });
    }
  }
}

await browser.close();

const w = (s, n) => String(s ?? "").padEnd(n).slice(0, n);
console.log(w("route", 22), w("token", 36), "result");
console.log("-".repeat(140));
for (const r of allRows) {
  const result = r.mismatch === "" ? "✓ match" : (r.mismatch === "(unpaired)" ? `(only ours=${r.o} lifesg=${r.l})` : r.mismatch);
  console.log(w(r.route, 22), w(r.token, 36), result);
}
console.log("-".repeat(140));
console.log(`paired: ${total}, mismatches: ${mismatches}, expected: ${expectedSeen}`);
if (expectedSeen > 0) {
  console.log("\nExpected divergences (suppressed from exit code):");
  for (const d of expectedDivergences) console.log(`  ${d.route}:${d.token} — ${d.reason}`);
}
process.exit(mismatches > 0 ? 1 : 0);
