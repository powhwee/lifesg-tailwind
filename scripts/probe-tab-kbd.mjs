import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/content/tab/default", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

for (const side of ["ours", "lifesg"]) {
  const tabs = await page.evaluate((s) => {
    const p = document.querySelector(s);
    if (!p) return [];
    return [...p.querySelectorAll('[role="tab"], button[type="button"]')].slice(0, 3).map((t) => ({
      role: t.getAttribute("role"),
      tabindex: t.getAttribute("tabindex"),
      ariaSelected: t.getAttribute("aria-selected"),
      text: t.textContent?.trim().slice(0, 25),
    }));
  }, `[data-testid="content-${side}"]`);
  console.log(side, tabs);

  // Try ArrowRight on whichever currently-selected tab and watch what happens
  const before = await page.evaluate((s) => {
    const p = document.querySelector(s);
    return [...(p?.querySelectorAll('[role="tab"], button[type="button"]') ?? [])].slice(0,3).map((t) => t.getAttribute("aria-selected"));
  }, `[data-testid="content-${side}"]`);
  const sel = page.locator(`[data-testid="content-${side}"] [aria-selected="true"], [data-testid="content-${side}"] button[type="button"]`).first();
  await sel.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  const after = await page.evaluate((s) => {
    const p = document.querySelector(s);
    return [...(p?.querySelectorAll('[role="tab"], button[type="button"]') ?? [])].slice(0,3).map((t) => t.getAttribute("aria-selected"));
  }, `[data-testid="content-${side}"]`);
  console.log(side, "before:", before, "after-ArrowRight:", after);
}
await browser.close();
