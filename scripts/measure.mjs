import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3001/compare/button");
await page.waitForLoadState("networkidle");

const measure = async (testid, name) => {
  const el = page.getByTestId(testid).getByRole("button", { name });
  const box = await el.boundingBox();
  const styles = await el.evaluate((node) => {
    const s = getComputedStyle(node);
    return {
      fs: s.fontSize, lh: s.lineHeight, fw: s.fontWeight,
      ff: s.fontFamily, ls: s.letterSpacing,
    };
  });
  return { w: box?.width.toFixed(1), h: box?.height.toFixed(1), ...styles };
};

const cases = ["Primary", "Secondary", "Ghost", "Link", "Destructive", "Disabled"];
const rows = [];
for (const name of cases) {
  rows.push({ case: name, ...(await measure("compare-shadcn", name)), side: "ours" });
  rows.push({ case: name, ...(await measure("compare-lifesg", name)), side: "lifesg" });
}
console.table(rows);

await browser.close();
