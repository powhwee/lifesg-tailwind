import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 2400 } });
await page.goto("http://localhost:3000/core/error-display/default");
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1200);

const result = await page.evaluate(() => {
  const sides = ["core-ours", "core-lifesg"];
  return sides.map((tid) => {
    const pane = document.querySelector(`[data-testid="${tid}"]`);
    if (!pane) return { tid, error: "no pane" };
    const labels = Array.from(pane.querySelectorAll("code[data-token]"))
      .map((c) => c.getAttribute("data-token"));
    const imgs = Array.from(pane.querySelectorAll("img")).map((img) => ({
      src: img.src.slice(0, 90),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      visible: img.getBoundingClientRect().width > 0 && img.getBoundingClientRect().height > 0,
    }));
    const ourSlots = Array.from(pane.querySelectorAll('[data-slot="error-display-illustration"]')).map((d, i) => {
      const r = d.getBoundingClientRect();
      const svg = d.querySelector("svg");
      const sr = svg?.getBoundingClientRect();
      const cs = svg ? getComputedStyle(svg) : null;
      return {
        idx: i,
        discW: r.width, discH: r.height,
        discBg: getComputedStyle(d).backgroundColor,
        svgW: sr?.width, svgH: sr?.height,
        svgColor: cs?.color,
        svgFill: cs?.fill,
        svgStroke: cs?.stroke,
      };
    });
    return { tid, labels, imgCount: imgs.length, imgs, ourSlots };
  });
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
