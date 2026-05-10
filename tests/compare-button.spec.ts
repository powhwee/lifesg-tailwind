import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Button comparison", () => {
  test("renders both shadcn and LifeSG buttons", async ({ page }) => {
    await page.goto("/compare/button");
    await expect(page.getByTestId("compare-shadcn")).toBeVisible();
    await expect(page.getByTestId("compare-lifesg")).toBeVisible();
    await expect(page.getByTestId("compare-shadcn").getByRole("button", { name: "Primary" })).toBeVisible();
    await expect(page.getByTestId("compare-lifesg").getByRole("button", { name: "Primary" })).toBeVisible();
  });

  test("visual snapshot — full page", async ({ page }) => {
    await page.goto("/compare/button");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("button-comparison.png", { fullPage: true });
  });

  test("a11y — no violations on either side", async ({ page }) => {
    await page.goto("/compare/button");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
