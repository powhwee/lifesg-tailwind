import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

await mkdir("/tmp/content-snaps", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto("http://localhost:3000/content/fullscreen-image-carousel/default", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

// Open ours
await page.getByRole("button", { name: /Open carousel \(ours\)/i }).click();
await page.waitForTimeout(800);
// Wait for image to load
await page.locator('[role="dialog"] img').first().waitFor();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/content-snaps/carousel-open.png", fullPage: false });
console.log("Snapped open");

// Test ArrowRight
const counterBefore = await page.locator('[role="dialog"]').first().textContent();
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(300);
const counterAfter = await page.locator('[role="dialog"]').first().textContent();
console.log("Before/After ArrowRight (1/3 → 2/3?):", counterBefore?.slice(0, 8), "→", counterAfter?.slice(0, 8));

// Click a thumbnail
await page.locator('[role="dialog"] button[aria-label="Go to item 3"]').click();
await page.waitForTimeout(300);
const counterAfterThumb = await page.locator('[role="dialog"]').first().textContent();
console.log("After clicking thumb 3 (3/3?):", counterAfterThumb?.slice(0, 8));

// Take zoomed screenshot
await page.locator('[role="dialog"] button[aria-label="Zoom in"]').click();
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/content-snaps/carousel-zoomed.png", fullPage: false });
console.log("Snapped zoomed");

// Escape
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
const dialog = await page.locator('[role="dialog"]').count();
console.log("After Escape, dialog count:", dialog);

await browser.close();
