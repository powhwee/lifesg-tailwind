import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE ?? "http://localhost:3000";
const routes = [
  ["avatar",       "/navigation/avatar/default"],
  ["breadcrumb",   "/navigation/breadcrumb/default"],
  ["link-list",    "/navigation/link-list/default"],
  ["masthead",     "/navigation/masthead/default"],
  ["pagination",   "/navigation/pagination/default"],
  ["local-nav",    "/navigation/local-nav/default"],
  ["sidenav",      "/navigation/sidenav/default"],
  ["navbar",       "/navigation/navbar/default"],
  ["footer",       "/navigation/footer/default"],
];

await mkdir("/tmp/navigation-snaps", { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await ctx.newPage();

for (const [name, route] of routes) {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const out = `/tmp/navigation-snaps/${name}.png`;
  await page.screenshot({ path: out, fullPage: true });
  console.log(out);
}

await browser.close();
