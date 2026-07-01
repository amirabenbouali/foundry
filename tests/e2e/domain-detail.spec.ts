import { expect, test } from "@playwright/test";

test("domain detail shows ownership context", async ({ page }) => {
  await page.goto("/domains/telemetry-pipeline");

  await expect(page.getByRole("heading", { name: "Telemetry Pipeline" })).toBeVisible();
  await expect(page.getByText("Lena Ortiz")).toBeVisible();
  await expect(page.getByText("Rollout Notes")).toBeVisible();
  await expect(page.getByText("Alert Routing")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Engineering DNA" })).toBeVisible();
  await expect(page.getByText("Open Stewardship Work")).toBeVisible();
});
