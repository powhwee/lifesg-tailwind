// Toggle `.dark` on documentElement before navigating, screenshot each Content page.
// LifeSG's pane stays light (LifeSGProvider is hardcoded to LifeSGTheme.light); the
// audit is one-sided — does ours look sane under dark?
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE ?? "http://localhost:3000";
const routes = [
  ["card",                "/content/card/default"],
  ["table",               "/content/table/default"],
  ["uneditable-section",  "/content/uneditable-section/default"],
  ["box-container",       "/content/box-container/default"],
  ["tab",                 "/content/tab/default"],
  ["accordion",           "/content/accordion/default"],
];

await mkdir("/tmp/content-snaps-dark", { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

for (const [name, route] of routes) {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  // Apply .dark after Next has set its className on <html>
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.waitForTimeout(800);
  const out = `/tmp/content-snaps-dark/${name}.png`;
  await page.screenshot({ path: out, fullPage: true });
  console.log(out);
}

await browser.close();
