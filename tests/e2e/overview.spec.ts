import { expect, test } from "@playwright/test";

test("overview shows operating-system modules", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Software ownership posture" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Systems Needing Attention" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "This Week's Engineering Focus" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Active Incidents" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent Rollout Activity" })).toBeVisible();
});
