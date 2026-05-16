import { chromium } from "@playwright/test";

const PORT = process.env.PORT ?? "3000";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
await page.goto(`http://localhost:${PORT}/core/typography/default`);
await page.waitForLoadState("networkidle");

const tokens = [
  "HeadingXXL","HeadingXL","HeadingLG","HeadingMD","HeadingSM","HeadingXS",
  "BodyBL","BodyMD","BodySM","BodyXS",
];

const measure = async (testid, label) => {
  const el = page.getByTestId(testid).locator(`[data-token="${label}"]`).first().locator(":scope > *").first();
  if (!(await el.count())) return { fs: "—", lh: "—", ls: "—", fw: "—" };
  const styles = await el.evaluate((node) => {
    const s = getComputedStyle(node);
    return { fs: s.fontSize, lh: s.lineHeight, ls: s.letterSpacing, fw: s.fontWeight };
  });
  return styles;
};

const rows = [];
let mismatches = 0;
for (const t of tokens) {
  const ours = await measure("core-ours", t);
  const lifesg = await measure("core-lifesg", t);
  const isMatch = ours.fs === lifesg.fs && ours.lh === lifesg.lh;
  if (!isMatch) mismatches++;
  const match = isMatch ? "✓" : "✗";
  rows.push({ token: t, side: "ours", ...ours });
  rows.push({ token: t, side: "lifesg", ...lifesg });
  rows.push({ token: `${t} match`, side: match, fs: "", lh: "", ls: "", fw: "" });
}
console.table(rows);
console.log(`mismatches: ${mismatches} / ${tokens.length}`);

await browser.close();
process.exit(mismatches > 0 ? 1 : 0);
