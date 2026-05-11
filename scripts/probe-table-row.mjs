import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto("http://localhost:3000/content/table/default", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
for (const side of ["ours", "lifesg"]) {
  const rows = await page.evaluate((sel) => {
    const pane = document.querySelector(sel);
    if (!pane) return [];
    return [...pane.querySelectorAll("tbody tr")].map((tr) => tr.getBoundingClientRect().height);
  }, `[data-testid="content-${side}"]`);
  const td = await page.locator(`[data-testid="content-${side}"] tbody td`).first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { padding: s.padding, fontSize: s.fontSize, lineHeight: s.lineHeight };
  });
  console.log(side, "rows:", rows.map((r) => Math.round(r)).join(","), "td:", JSON.stringify(td));
}
await browser.close();
