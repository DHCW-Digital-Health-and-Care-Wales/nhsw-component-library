const { test, expect } = require('@playwright/test');

test.describe('Small variant tap targets', () => {
  test('checkboxes --small input renders at the documented 24x24px', async ({ page }) => {
    await page.goto('/examples/checkboxes-small.html');
    const box = await page.locator('.nhsw-checkboxes__input').first().boundingBox();
    expect(box.width).toBe(24);
    expect(box.height).toBe(24);
  });

  test('radios --small input renders at the documented 24x24px', async ({ page }) => {
    await page.goto('/examples/radios-small.html');
    const box = await page.locator('.nhsw-radios__input').first().boundingBox();
    expect(box.width).toBe(24);
    expect(box.height).toBe(24);
  });
});
