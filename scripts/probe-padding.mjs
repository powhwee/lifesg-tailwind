import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/content/card/default", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
// Hunt for the LifeSG card by looking inside the lifesg pane for a div with padding or border-radius
const probes = await page.evaluate(() => {
  const pane = document.querySelector('[data-testid="content-lifesg"]');
  if (!pane) return [];
  const all = Array.from(pane.querySelectorAll('div'));
  return all.map((el) => {
    const s = getComputedStyle(el);
    return { tag: el.tagName, cls: el.className.toString().slice(0,40), padding: s.padding, br: s.borderRadius, border: s.border, bs: s.boxShadow, bg: s.backgroundColor };
  }).filter((p) => p.padding !== "0px" || p.br !== "0px" || p.bs !== "none");
});
console.log("CARD-LIFESG-CANDIDATES:");
for (const p of probes.slice(0, 5)) console.log(JSON.stringify(p));
await browser.close();
