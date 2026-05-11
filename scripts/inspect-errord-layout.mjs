import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 2400 } });
await page.goto("http://localhost:3000/core/error-display/default");
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1200);

const result = await page.evaluate(() => {
  const dump = (tid) => {
    const pane = document.querySelector(`[data-testid="${tid}"]`);
    if (!pane) return null;
    const rows = Array.from(pane.querySelectorAll(":scope > div > div"));
    return rows.map((r, i) => {
      const label = r.querySelector("code[data-token]")?.getAttribute("data-token");
      const rect = r.getBoundingClientRect();
      const img = r.querySelector("img");
      const ir = img?.getBoundingClientRect();
      const section = r.querySelector("section");
      const sr = section?.getBoundingClientRect();
      return {
        i,
        label,
        rowH: Math.round(rect.height),
        rowTop: Math.round(rect.top),
        imgW: ir ? Math.round(ir.width) : null,
        imgH: ir ? Math.round(ir.height) : null,
        sectionPadTop: section ? parseFloat(getComputedStyle(section).paddingTop) : null,
        sectionPadBot: section ? parseFloat(getComputedStyle(section).paddingBottom) : null,
        sectionGap: section ? getComputedStyle(section).gap : null,
        sectionH: sr ? Math.round(sr.height) : null,
      };
    });
  };
  return { ours: dump("core-ours"), lifesg: dump("core-lifesg") };
});

console.log("OURS");
console.table(result.ours);
console.log("\nLIFESG");
console.table(result.lifesg);

await browser.close();
