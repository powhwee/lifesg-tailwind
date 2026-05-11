import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/core/layout/default");
await page.waitForLoadState("networkidle");
await page.waitForTimeout(800);

/* Both panes share the same row labels, so grab the first matching Container
 * in each pane. */
async function inspectFirstContainer(testid) {
  return page.evaluate((tid) => {
    const pane = document.querySelector(`[data-testid="${tid}"]`);
    if (!pane) return null;
    /* For ours: data-slot="layout-container". For LifeSG: it's a styled-component
     * <div> — grab the first div *inside the first Row that is not the label code*. */
    const ours = pane.querySelector('[data-slot="layout-container"]');
    if (ours) {
      const cs = getComputedStyle(ours);
      return {
        side: "ours",
        display: cs.display,
        gridTemplateColumns: cs.gridTemplateColumns,
        columnGap: cs.columnGap,
        rowGap: cs.rowGap,
        width: ours.getBoundingClientRect().width,
        children: Array.from(ours.children).map((c) => {
          const ccs = getComputedStyle(c);
          return {
            slot: c.getAttribute("data-slot"),
            gridColumn: ccs.gridColumn,
            width: c.getBoundingClientRect().width,
            top: c.getBoundingClientRect().top,
          };
        }),
      };
    }
    /* LifeSG: walk to the first cell of the first Row, then dive into its first child div. */
    const rows = pane.querySelectorAll(".flex.flex-col > div.flex.flex-col");
    const firstRow = rows[0];
    if (!firstRow) return null;
    const candidate = firstRow.querySelector("div.w-full > div");
    if (!candidate) return null;
    const cs = getComputedStyle(candidate);
    return {
      side: "lifesg",
      tag: candidate.tagName,
      className: candidate.className,
      display: cs.display,
      gridTemplateColumns: cs.gridTemplateColumns,
      flexWrap: cs.flexWrap,
      columnGap: cs.columnGap,
      rowGap: cs.rowGap,
      width: candidate.getBoundingClientRect().width,
      children: Array.from(candidate.children).map((c) => {
        const ccs = getComputedStyle(c);
        return {
          tag: c.tagName,
          className: c.className?.slice(0, 80),
          gridColumn: ccs.gridColumn,
          width: c.getBoundingClientRect().width,
          top: c.getBoundingClientRect().top,
        };
      }),
    };
  }, testid);
}

const ours = await inspectFirstContainer("core-ours");
const lifesg = await inspectFirstContainer("core-lifesg");
console.log(JSON.stringify({ ours, lifesg }, null, 2));

await browser.close();
