import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
});

const checks = [];

async function checkRoute(path, expectedTokens) {
  await page.goto(`http://localhost:3000${path}`);
  await page.waitForLoadState("networkidle");
  /* Give the client-only LifeSGProvider time to mount. */
  await page.waitForTimeout(800);

  const ours = await page.locator('[data-testid="core-ours"]').textContent();
  const lifesg = await page.locator('[data-testid="core-lifesg"]').textContent();
  const oursHasContent = (ours ?? "").trim().length > 100;
  const lifesgHasContent = (lifesg ?? "").trim().length > 100;

  const tokens = await Promise.all(
    expectedTokens.map(async (t) => {
      /* Match via the `data-token` attribute equality, evaluated in the page so
       * we don't have to escape selectors for the embedded quote characters. */
      const count = await page.evaluate(
        (val) => document.querySelectorAll(`[data-token]`).length === 0
          ? 0
          : Array.from(document.querySelectorAll("[data-token]"))
              .filter((el) => el.getAttribute("data-token") === val).length,
        t
      );
      return [t, count];
    })
  );
  checks.push({
    path,
    oursMounted: oursHasContent,
    lifesgMounted: lifesgHasContent,
    oursChars: (ours ?? "").length,
    lifesgChars: (lifesg ?? "").length,
    tokens: Object.fromEntries(tokens),
  });
}

await checkRoute("/core/layout/default", [
  "Container type=grid (8/12 cols)",
  "Container type=flex",
  "Section + Content (nested)",
  "stretch (no max-width)",
  "Layout.Container type=grid",
  "Layout.Container type=flex",
  "Layout.Section + Layout.Content",
]);

await checkRoute("/core/error-display/default", [
  "type=\"404\"",
  "type=\"500\"",
  "type=\"no-item-found\"",
  "type=\"maintenance\"",
  "type=\"logout\"",
  "imageOnly",
  "title + description override",
]);

console.log(JSON.stringify({ checks, errors }, null, 2));
await browser.close();
