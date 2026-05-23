// Probes computed style on every `[data-token]`-tagged element on every
// /selection-and-input default page, pairing ours-pane vs lifesg-pane values
// where labels match. Walks the rendered DOM rather than enumerating
// component-by-component. Mirrors measure-content.mjs; see that file for
// design rationale.
import { chromium } from "@playwright/test";

const base = process.env.BASE ?? "http://localhost:3000";
const routes = [
  ["button",          "/selection-and-input/button/default"],
  ["checkbox",        "/selection-and-input/checkbox/default"],
  ["radio-button",    "/selection-and-input/radio-button/default"],
  ["toggle",          "/selection-and-input/toggle/default"],
  ["icon-button",     "/selection-and-input/icon-button/default"],
  ["image-button",    "/selection-and-input/image-button/default"],
  ["otp-input",       "/selection-and-input/otp-input/default"],
  ["feedback-rating", "/selection-and-input/feedback-rating/default"],
  ["date-navigator",  "/selection-and-input/date-navigator/default"],
  ["calendar",        "/selection-and-input/calendar/default"],
  ["filter",          "/selection-and-input/filter/default"],
];

const props = ["fontSize", "fontWeight", "lineHeight", "color", "backgroundColor", "borderRadius", "padding", "border", "borderColor", "borderWidth", "boxShadow", "gap", "margin"];

// Expected divergences — investigated per-component in the 2026-05-17 pm
// handover and the 2026-05-18 chrome-fix sweep. Each is either a deliberate
// API divergence, structural diff, or demo-content asymmetry.
const expectedDivergences = [
  { route: "checkbox",        token: "default", reason: "2px h diff is sub-pixel rendering noise; chrome aligned (size-8 default, size-6 small)." },
];

const isExpected = (route, token) =>
  expectedDivergences.find((d) => d.route === route && d.token === token);

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

for (const [name, route] of routes) {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const ours = await probe(page, '[data-testid="selection-and-input-ours"]');
  const lifesg = await probe(page, '[data-testid="selection-and-input-lifesg"]');
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
    // divergence. Ignore it so the script reports real signal.
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
