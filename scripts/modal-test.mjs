import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto("http://localhost:3000/overlays/modal/default", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

// Click open
await page.getByRole("button", { name: /Open modal \(ours\)/i }).click();
await page.waitForTimeout(400);
let dialog = await page.locator('[role="dialog"]').count();
let focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
console.log("After open: dialog count =", dialog, "focused =", JSON.stringify(focused));

// Take screenshot of open state
await page.screenshot({ path: "/tmp/content-snaps/modal-open.png", fullPage: false });

// Test Escape
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
dialog = await page.locator('[role="dialog"]').count();
console.log("After Escape: dialog count =", dialog);

// Test outside-click (open then click the actual backdrop element)
await page.getByRole("button", { name: /Open modal \(ours\)/i }).click();
await page.waitForTimeout(400);
const clicked = await page.evaluate(() => {
  const portal = document.querySelector('[data-base-ui-portal]');
  if (!portal) return "no portal";
  const kids = portal.children;
  // First child should be the backdrop
  for (const k of kids) {
    const s = getComputedStyle(k);
    if (s.position === "fixed" && s.backgroundColor && s.backgroundColor !== "rgba(0, 0, 0, 0)") {
      k.click();
      return "clicked backdrop with bg " + s.backgroundColor;
    }
  }
  return "no match; kids: " + [...kids].map((k) => k.tagName + "." + k.className.slice(0,30)).join("|");
});
await page.waitForTimeout(400);
dialog = await page.locator('[role="dialog"]').count();
console.log("Backdrop click attempt:", clicked, "dialog count =", dialog);
await browser.close();

await browser.close();
