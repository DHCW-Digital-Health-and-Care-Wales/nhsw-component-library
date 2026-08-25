const { test, expect } = require('@playwright/test');

test.describe('Date input', () => {
  test('fields identify their purpose for autofill (1.3.5)', async ({ page }) => {
    await page.goto('/examples/date-input-default.html');
    await expect(page.locator('#dob-day')).toHaveAttribute('autocomplete', 'bday-day');
    await expect(page.locator('#dob-month')).toHaveAttribute('autocomplete', 'bday-month');
    await expect(page.locator('#dob-year')).toHaveAttribute('autocomplete', 'bday-year');
  });

  test('tabbing moves day, then month, then year', async ({ page }) => {
    await page.goto('/examples/date-input-default.html');
    await page.locator('#dob-day').focus();
    await expect(page.locator('#dob-day')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#dob-month')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.locator('#dob-year')).toBeFocused();
  });
});
