// Snap a single named route. usage: NAME=data-table ROUTE=/content/data-table/default node scripts/snap-one.mjs
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE ?? "http://localhost:3000";
const name = process.env.NAME ?? "snap";
const route = process.env.ROUTE ?? "/";

await mkdir("/tmp/content-snaps", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1100 } });
await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const out = `/tmp/content-snaps/${name}.png`;
await page.screenshot({ path: out, fullPage: true });
console.log(out);
await browser.close();
