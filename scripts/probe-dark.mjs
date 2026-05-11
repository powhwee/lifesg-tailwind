import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.addInitScript(() => { document.documentElement.classList.add("dark"); });
await page.goto("http://localhost:3000/content/card/default", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const out = await page.evaluate(() => {
  const html = document.documentElement;
  const bgVar = getComputedStyle(html).getPropertyValue("--lifesg-bg").trim();
  const textVar = getComputedStyle(html).getPropertyValue("--lifesg-text").trim();
  const cardBg = getComputedStyle(html).getPropertyValue("--card-bg").trim();
  return { classes: html.className, bgVar, textVar, cardBg };
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
