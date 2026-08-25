import { test, expect } from '@playwright/test';

test('traveler opens the passport and records a visit', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Open passport' }).click();

  await expect(page.getByRole('heading', { name: "Ava's Passport" })).toBeVisible();
  await page.getByLabel('Destination name').fill('Lisbon');
  await page.getByLabel('Country').fill('Portugal');
  await page.getByLabel('Visit date').fill('2026-08-25');
  await page.getByLabel('Notes').fill('Sunset walk');
  await page.getByRole('button', { name: 'Save Visit' }).click();

  await expect(page.getByRole('heading', { name: 'Lisbon' })).toBeVisible();
  await expect(page.getByText('Portugal')).toBeVisible();
  await page.screenshot({ path: 'test-results/primary-flow.png', fullPage: true });
});
