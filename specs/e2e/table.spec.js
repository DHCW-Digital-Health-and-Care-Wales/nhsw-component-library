const { test, expect } = require('@playwright/test');

test.describe('Table captions', () => {
  const fixtures = [
    'table-basic.html',
    'table-caption.html',
    'table-numeric.html',
    'table-missing-data.html',
    'table-responsive.html',
  ];

  for (const fixture of fixtures) {
    test(`${fixture} has a visible, non-empty caption`, async ({ page }) => {
      await page.goto(`/examples/${fixture}`);
      const caption = page.locator('table caption, .nhsw-table-responsive caption').first();
      await expect(caption).toBeVisible();
      const text = (await caption.textContent()).trim();
      expect(text.length).toBeGreaterThan(0);
    });
  }
});
