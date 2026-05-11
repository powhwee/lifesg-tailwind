import { chromium } from "@playwright/test";

const base = process.env.BASE ?? "http://localhost:3000";
const routes = [
  "/content/introduction",
  "/content/card/default",
  "/content/table/default",
  "/content/uneditable-section/default",
  "/content/box-container/default",
  "/content/tab/default",
  "/content/accordion/default",
];

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

const allErrors = [];
page.on("pageerror", (err) => allErrors.push({ kind: "pageerror", msg: err.message }));
page.on("console", (msg) => {
  if (msg.type() === "error") {
    const text = msg.text();
    // Filter known dev-only noise: React-19 Strict-mode reflow warnings
    if (/Hydration|hydration/.test(text)) {
      allErrors.push({ kind: "hydration", msg: text });
      return;
    }
    allErrors.push({ kind: "console.error", msg: text });
  }
});

for (const route of routes) {
  allErrors.length = 0;
  const resp = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  // Give client components a beat to mount + hydrate (LifeSGProvider is client-only)
  await page.waitForTimeout(500);
  const status = resp?.status() ?? 0;
  const hasOurs = (await page.locator('[data-testid="content-ours"]').count()) > 0;
  const hasLifesg = (await page.locator('[data-testid="content-lifesg"]').count()) > 0;
  const lifesgRendered = hasLifesg
    ? (await page.locator('[data-testid="content-lifesg"] *').count()) > 5
    : null;
  const errs = [...allErrors];
  console.log(
    `${route.padEnd(40)} ${status} ours=${hasOurs} lifesg=${hasLifesg} lifesgBody=${lifesgRendered} errs=${errs.length}`
  );
  if (errs.length > 0) {
    for (const e of errs.slice(0, 3)) {
      console.log(`  [${e.kind}] ${e.msg.slice(0, 200)}`);
    }
  }
}

await browser.close();
