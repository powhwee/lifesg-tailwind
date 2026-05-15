import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type ParitySpec = {
  name: string;
  route: string;
  panePrefix: string;
};

const specs: ParitySpec[] = [
  { name: "button", route: "/selection-and-input/button/default", panePrefix: "selection-and-input" },
  { name: "input", route: "/form/input/default", panePrefix: "form" },
  { name: "select", route: "/form/select/default", panePrefix: "form" },
  { name: "table", route: "/content/table/default", panePrefix: "content" },
  { name: "accordion", route: "/content/accordion/default", panePrefix: "content" },
  { name: "modal", route: "/overlays/modal/default", panePrefix: "overlays" },
];

for (const spec of specs) {
  test.describe(`${spec.name} parity`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(spec.route);
      await page.locator(`[data-testid="${spec.panePrefix}-ours"]`).waitFor({ state: "visible" });
      await page.locator(`[data-testid="${spec.panePrefix}-lifesg"]`).waitFor({ state: "visible" });
    });

    test("renders both panes", async ({ page }) => {
      const ours = page.getByTestId(`${spec.panePrefix}-ours`);
      const lifesg = page.getByTestId(`${spec.panePrefix}-lifesg`);
      await expect(ours).toBeVisible();
      await expect(lifesg).toBeVisible();
      expect(await ours.locator("*").count()).toBeGreaterThan(0);
      expect(await lifesg.locator("*").count()).toBeGreaterThan(0);
    });

    test("visual snapshot — full page", async ({ page }) => {
      await page.waitForLoadState("networkidle");
      // Fallback paint window for styled-components stylesheet injection — kept
      // small and intentional, not as a replacement for event waits.
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot(`${spec.name}-comparison.png`, { fullPage: true });
    });

    test("a11y — no serious/critical violations on the ours pane", async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .include(`[data-testid="${spec.panePrefix}-ours"]`)
        .analyze();
      // Moderate-impact rules (e.g. landmark-is-unique across multiple demo
      // instances on the same page) are noise in a side-by-side comparison.
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      );
      expect(blocking).toEqual([]);
    });
  });
}
