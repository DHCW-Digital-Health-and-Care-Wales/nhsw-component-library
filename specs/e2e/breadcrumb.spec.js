const { test, expect } = require('@playwright/test');

test.describe('Breadcrumb', () => {
  test('current page is not a link', async ({ page }) => {
    await page.goto('/actions/breadcrumb.html');
    const current = page.locator('.nhsw-breadcrumb__current').first();
    await expect(current).toHaveJSProperty('tagName', 'SPAN');
    await expect(current).toHaveAttribute('aria-current', 'page');
  });
});
