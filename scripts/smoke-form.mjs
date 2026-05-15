import { chromium } from "@playwright/test";

const base = process.env.BASE ?? "http://localhost:3000";
const routes = [
  "/form/introduction",
  "/form/input/default",
  "/form/textarea/default",
  "/form/masked-input/default",
  "/form/input-group/default",
  "/form/phone-number-input/default",
  "/form/unit-number-input/default",
  "/form/date-input/default",
  "/form/date-range-input/default",
  "/form/select/default",
  "/form/multi-select/default",
  "/form/custom-field/default",
];

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

const allErrors = [];
page.on("pageerror", (err) => allErrors.push({ kind: "pageerror", msg: err.message }));
page.on("console", (msg) => {
  if (msg.type() === "error") {
    const text = msg.text();
    if (/Hydration|hydration/.test(text)) {
      allErrors.push({ kind: "hydration", msg: text });
      return;
    }
    allErrors.push({ kind: "console.error", msg: text });
  }
});

let failed = 0;
for (const route of routes) {
  allErrors.length = 0;
  const isIntro = route.endsWith("/introduction");
  const resp = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  if (!isIntro) {
    await page
      .locator('[data-testid="form-ours"]')
      .waitFor({ state: "visible", timeout: 10_000 })
      .catch(() => {});
    await page
      .locator('[data-testid="form-lifesg"]')
      .waitFor({ state: "visible", timeout: 10_000 })
      .catch(() => {});
  }
  await page.waitForTimeout(200);
  const status = resp?.status() ?? 0;
  const hasOurs = (await page.locator('[data-testid="form-ours"]').count()) > 0;
  const hasLifesg = (await page.locator('[data-testid="form-lifesg"]').count()) > 0;
  const lifesgRendered = hasLifesg
    ? (await page.locator('[data-testid="form-lifesg"] *').count()) > 5
    : null;
  const errs = [...allErrors];
  const ok = status === 200 && (route.endsWith("/introduction") || (hasOurs && hasLifesg && lifesgRendered));
  if (!ok || errs.length > 0) failed++;
  console.log(
    `${route.padEnd(44)} ${status} ours=${hasOurs} lifesg=${hasLifesg} lifesgBody=${lifesgRendered} errs=${errs.length}`
  );
  if (errs.length > 0) {
    for (const e of errs.slice(0, 3)) {
      console.log(`  [${e.kind}] ${e.msg.slice(0, 200)}`);
    }
  }
}

await browser.close();
process.exit(failed > 0 ? 1 : 0);
