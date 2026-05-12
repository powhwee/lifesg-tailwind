import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

console.log(`Connecting to server at ${BASE_URL}...`);

const browser = await chromium.launch();
const page = await browser.newPage();

try {
  await page.goto(BASE_URL);
} catch (e) {
  console.error("Could not connect to Next.js on port 3000. Make sure it's running.");
  process.exit(1);
}

const links = await page.$$eval("a", els => els.map(a => a.getAttribute("href")));
const comparisonLinks = links.filter(href => href && (href.endsWith("/default") || href.includes("/compare/")));

if (!comparisonLinks.includes("/compare/button")) {
  comparisonLinks.push("/compare/button");
}

const uniqueLinks = [...new Set(comparisonLinks)];
console.log(`Found ${uniqueLinks.length} comparison pages.`);

if (!fs.existsSync("screenshots")) {
  fs.mkdirSync("screenshots");
}

for (const link of uniqueLinks) {
  console.log(`Taking screenshot for ${link}...`);
  await page.goto(`${BASE_URL}${link}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000); // Give it a bit of extra time for styled-components to inject
  
  const name = link.replace(/^\//, "").replace(/\//g, "_") + ".png";
  await page.screenshot({ path: path.join("screenshots", name), fullPage: true });
}

await browser.close();
console.log("Done.");
process.exit(0);
