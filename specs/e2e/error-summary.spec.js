const { test, expect } = require('@playwright/test');

test.describe('Error summary', () => {
  test('error link moves focus to the relevant field', async ({ page }) => {
    await page.goto('/examples/error-summary-default.html');
    const link = page.locator('.nhsw-error-summary__link').first();
    const href = await link.getAttribute('href');
    const targetId = href.replace('#', '');

    await link.click();

    await expect(page.locator(`#${targetId}`)).toBeFocused();
  });
});
