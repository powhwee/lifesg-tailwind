#!/usr/bin/env node
// L5 — Visual survey. Refresh every PNG in `screenshots/` by snapping the
// route inferred from its filename. The "spotting layer" in the verification
// pyramid (see README §Pillar 3) — produces files for human review, never
// the basis for an automated fix.
//
// Pass/fail: exits 1 if any page fails to return HTTP 200 (route gone, build
// broken). Pixel-level diffs between successive runs are expected (calendar
// "today" markers, PNG encoder drift) and are NOT failures here — that's
// what `tests/parity.spec.ts` is for at the 6 covered components.
//
// Usage:
//   node scripts/screenshot-all.mjs
//   BASE=http://localhost:3000 node scripts/screenshot-all.mjs
//
// Filename convention: {category}_{component}_{variant}.png
//   → route: /{category}/{component}/{variant}
//
// To add coverage, drop a placeholder PNG in screenshots/ with the right
// name; this script will overwrite it on next run.
import { chromium } from "@playwright/test";
import { readdirSync, existsSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const SCREENSHOTS_DIR = "screenshots";
const VIEWPORT = { width: 1500, height: 1100 };
const PAINT_WAIT_MS = 800; // styled-components inject delay

function fileToRoute(file) {
  if (file === "compare_button.png") return null; // legacy comparison page, no route
  const name = file.replace(/\.png$/, "");
  const parts = name.split("_");
  if (parts.length !== 3) return null;
  return `/${parts[0]}/${parts[1]}/${parts[2]}`;
}

if (!existsSync(SCREENSHOTS_DIR)) mkdirSync(SCREENSHOTS_DIR);

const files = readdirSync(SCREENSHOTS_DIR).filter((f) => f.endsWith(".png")).sort();
console.log(`Snapping ${files.length} routes to ${SCREENSHOTS_DIR}/ at ${VIEWPORT.width}×${VIEWPORT.height}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: VIEWPORT });
const page = await ctx.newPage();

const failed = [];
const skipped = [];
let okCount = 0;

for (const file of files) {
  const route = fileToRoute(file);
  if (!route) { skipped.push(file); continue; }
  try {
    const resp = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    const status = resp?.status() ?? 0;
    if (status !== 200) {
      failed.push({ file, route, reason: `http ${status}` });
      continue;
    }
    await page.waitForTimeout(PAINT_WAIT_MS);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/${file}`, fullPage: true });
    okCount++;
  } catch (e) {
    failed.push({ file, route, reason: e.message.slice(0, 80) });
  }
}
await browser.close();

console.log(`  ${okCount} ok, ${skipped.length} skipped, ${failed.length} failed`);
for (const f of failed) console.log(`    FAIL ${f.file} ← ${f.route}: ${f.reason}`);

process.exit(failed.length > 0 ? 1 : 0);
