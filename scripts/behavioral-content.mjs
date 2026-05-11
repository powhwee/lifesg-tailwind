// Behavioural parity script for Tab + Accordion.
// Drives keyboard interaction on both panes and asserts ARIA state matches.
import { chromium } from "@playwright/test";

const base = process.env.BASE ?? "http://localhost:3000";
const results = [];

function expect(name, ours, lifesg) {
  const ok = ours === lifesg;
  results.push({ name, ours, lifesg, ok });
  if (!ok) process.exitCode = 1;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

// =======================================================================
// Tab — arrow keys cycle, Home/End jump, Enter activates current
// =======================================================================
await page.goto(`${base}/content/tab/default`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

async function tabStates(pane) {
  return await page.evaluate((sel) => {
    const p = document.querySelector(sel);
    if (!p) return null;
    // First [role="tablist"] only; the page has two tab examples
    const list = p.querySelector('[role="tablist"]');
    if (!list) return null;
    return [...list.querySelectorAll('[role="tab"]')].map((t) => ({
      selected: t.getAttribute("aria-selected") === "true",
    }));
  }, `[data-testid="content-${pane}"]`);
}

// Initial: first tab selected, both panes
let our = await tabStates("ours");
let life = await tabStates("lifesg");
expect("tab init: first selected (ours)", our?.[0]?.selected, true);
expect("tab init: first selected (lifesg)", life?.[0]?.selected, true);

// Drive arrow-right on each pane via its first focusable tab
async function driveTab(pane, key) {
  const tab = page.locator(`[data-testid="content-${pane}"] [role="tab"]`).first();
  await tab.focus();
  await page.keyboard.press(key);
  await page.waitForTimeout(200);
}

// Keyboard nav: ArrowRight should move to the next tab and activate it.
// Documented divergence: LifeSG's Tab does NOT bind arrow keys (no keyboard nav).
// Base UI Tabs (ours) does. We measure both sides but expect the divergence.
await driveTab("ours", "ArrowRight");
const oursState = (await tabStates("ours"))?.map((t) => t.selected);
await driveTab("lifesg", "ArrowRight");
const lifesgState = (await tabStates("lifesg"))?.map((t) => t.selected);
expect("tab ArrowRight activates 2nd (ours: yes)", JSON.stringify(oursState), JSON.stringify([false, true, false]));
expect("tab ArrowRight ignored (lifesg: known divergence, no kbd nav)", JSON.stringify(lifesgState), JSON.stringify([true, false, false]));

// Click activates on both panes — sanity-check the simple path still works.
await page.locator(`[data-testid="content-ours"] [role="tab"]`).nth(2).click();
await page.waitForTimeout(150);
await page.locator(`[data-testid="content-lifesg"] [role="tab"]`).nth(2).click();
await page.waitForTimeout(150);
const oursClick = (await tabStates("ours"))?.map((t) => t.selected);
const lifesgClick = (await tabStates("lifesg"))?.map((t) => t.selected);
expect("tab click 3rd: activates (ours)", JSON.stringify(oursClick), JSON.stringify([false, false, true]));
expect("tab click 3rd: activates (lifesg)", JSON.stringify(lifesgClick), JSON.stringify([false, false, true]));

// =======================================================================
// Accordion — Enter on trigger toggles aria-expanded
// =======================================================================
await page.goto(`${base}/content/accordion/default`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

async function accordionStates(pane) {
  return await page.evaluate((sel) => {
    const p = document.querySelector(sel);
    if (!p) return null;
    // First accordion (default group) only
    const triggers = [...p.querySelectorAll("button[aria-expanded]")].slice(0, 3);
    return triggers.map((t) => t.getAttribute("aria-expanded") === "true");
  }, `[data-testid="content-${pane}"]`);
}

// Both panes start with all 3 expanded (LifeSG default + our matched default)
const oursInit = await accordionStates("ours");
const lifesgInit = await accordionStates("lifesg");
expect("accordion init: all expanded (ours)", JSON.stringify(oursInit), JSON.stringify([true, true, true]));
expect("accordion init: all expanded (lifesg)", JSON.stringify(lifesgInit), JSON.stringify([true, true, true]));

// Toggle first via Enter
async function driveAccordion(pane) {
  const trig = page.locator(`[data-testid="content-${pane}"] button[aria-expanded]`).first();
  await trig.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
}

await driveAccordion("ours");
await driveAccordion("lifesg");
const oursAfter = await accordionStates("ours");
const lifesgAfter = await accordionStates("lifesg");
expect("accordion Enter on first: collapses first (ours)", oursAfter?.[0], false);
expect("accordion Enter on first: collapses first (lifesg)", lifesgAfter?.[0], false);
expect("accordion Enter on first: rest unaffected (ours)", JSON.stringify(oursAfter?.slice(1)), JSON.stringify([true, true]));
expect("accordion Enter on first: rest unaffected (lifesg)", JSON.stringify(lifesgAfter?.slice(1)), JSON.stringify([true, true]));

await browser.close();

const w = (s, n) => String(s).padEnd(n).slice(0, n);
console.log(w("assertion", 60), w("ours", 18), w("lifesg", 18), "");
console.log("-".repeat(110));
let pass = 0;
for (const r of results) {
  console.log(w(r.name, 60), w(r.ours, 18), w(r.lifesg, 18), r.ok ? "✓" : "✗ MISMATCH");
  if (r.ok) pass++;
}
console.log("-".repeat(110));
console.log(`${pass}/${results.length} passed`);
