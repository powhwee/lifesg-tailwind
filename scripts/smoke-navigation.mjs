import { chromium } from "@playwright/test";

const base = process.env.BASE ?? "http://localhost:3000";
const routes = [
  "/navigation/introduction",
  "/navigation/avatar/default",
  "/navigation/breadcrumb/default",
  "/navigation/link-list/default",
  "/navigation/masthead/default",
  "/navigation/pagination/default",
  "/navigation/local-nav/default",
  "/navigation/sidenav/default",
  "/navigation/navbar/default",
  "/navigation/footer/default",
];

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();

const allErrors = [];
page.on("pageerror", (err) => allErrors.push({ kind: "pageerror", msg: err.message }));
// `underlineStyle` is a styled-components prop that leaks through LifeSG Navbar's
// internal Button onto a DOM element. Internal LifeSG bug, filter as known noise.
const LIFESG_NOISE = /underlineStyle|underlinestyle/i;
page.on("console", (msg) => {
  if (msg.type() === "error") {
    const text = msg.text();
    const args = msg.args();
    // Resolve "%s" placeholders in the format string with arg values for matching.
    Promise.all(args.slice(1).map((a) => a.jsonValue().catch(() => "")))
      .then((vals) => {
        let resolved = text;
        for (const v of vals) {
          resolved = resolved.replace("%s", String(v));
        }
        if (LIFESG_NOISE.test(resolved)) return;
        if (/Hydration|hydration/.test(resolved)) {
          allErrors.push({ kind: "hydration", msg: resolved });
          return;
        }
        allErrors.push({ kind: "console.error", msg: resolved });
      });
  }
});

let failed = 0;
for (const route of routes) {
  allErrors.length = 0;
  const isIntro = route.endsWith("/introduction");
  const resp = await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  if (!isIntro) {
    await page
      .locator('[data-testid="navigation-ours"]')
      .waitFor({ state: "visible", timeout: 10_000 })
      .catch(() => {});
    await page
      .locator('[data-testid="navigation-lifesg"]')
      .waitFor({ state: "visible", timeout: 10_000 })
      .catch(() => {});
  }
  await page.waitForTimeout(200);
  const status = resp?.status() ?? 0;
  const hasOurs = (await page.locator('[data-testid="navigation-ours"]').count()) > 0;
  const hasLifesg = (await page.locator('[data-testid="navigation-lifesg"]').count()) > 0;
  const lifesgRendered = hasLifesg
    ? (await page.locator('[data-testid="navigation-lifesg"] *').count()) > 5
    : null;
  const errs = [...allErrors];
  const ok = status === 200 && (route.endsWith("/introduction") || (hasOurs && hasLifesg && lifesgRendered));
  if (!ok || errs.length > 0) failed++;
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
process.exit(failed > 0 ? 1 : 0);
