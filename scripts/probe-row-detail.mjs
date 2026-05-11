import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto("http://localhost:3000/content/table/default", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
for (const side of ["ours", "lifesg"]) {
  const info = await page.evaluate((sel) => {
    const pane = document.querySelector(sel);
    if (!pane) return null;
    const tr = pane.querySelector("tbody tr");
    if (!tr) return null;
    const tds = [...tr.querySelectorAll("td")].map((td) => {
      const s = getComputedStyle(td);
      const inner = td.firstChild;
      return {
        text: td.textContent?.trim().slice(0,15),
        rect: { w: Math.round(td.getBoundingClientRect().width), h: Math.round(td.getBoundingClientRect().height) },
        verticalAlign: s.verticalAlign,
        textHeight: inner instanceof Element ? Math.round(inner.getBoundingClientRect().height) : null,
      };
    });
    const trStyle = getComputedStyle(tr);
    return { tdCount: tds.length, tds, trBorder: trStyle.border, trMinH: trStyle.minHeight };
  }, `[data-testid="content-${side}"]`);
  console.log(side, JSON.stringify(info, null, 2));
}
await browser.close();
