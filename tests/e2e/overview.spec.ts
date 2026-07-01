import { expect, test } from "@playwright/test";

test("overview shows operating-system modules", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Engineering operating picture" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "System DNA" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Systems Needing Attention" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "This Week's Engineering Judgement" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Active Incidents" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recent Rollout Activity" })).toBeVisible();
});
