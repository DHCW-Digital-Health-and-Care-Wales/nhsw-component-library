const { test, expect } = require('@playwright/test');

test.describe('Button group', () => {
  test('wraps sensibly on a narrow screen, without overlapping or overflowing', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/examples/button-grouping.html');

    const buttons = page.locator('.nhsw-button-group .nhsw-button');
    await expect(buttons).toHaveCount(2);

    const first = await buttons.nth(0).boundingBox();
    const second = await buttons.nth(1).boundingBox();

    for (const box of [first, second]) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(375);
    }

    const overlapsVertically = first.y < second.y + second.height && second.y < first.y + first.height;
    const overlapsHorizontally = first.x < second.x + second.width && second.x < first.x + first.width;
    expect(overlapsVertically && overlapsHorizontally).toBe(false);
  });

  test('tabbing between buttons shows the pinned yellow focus outline', async ({ page }) => {
    await page.goto('/examples/button-grouping.html');
    await page.keyboard.press('Tab'); // header brand link
    await page.keyboard.press('Tab'); // first button in the group
    const button = page.locator('.nhsw-button-group .nhsw-button').first();
    await expect(button).toBeFocused();

    const colours = await button.evaluate((el) => {
      const style = getComputedStyle(el);
      return { background: style.backgroundColor, color: style.color };
    });
    expect(colours.background).toBe('rgb(255, 235, 59)');
    expect(colours.color).toBe('rgb(33, 43, 50)');
  });
});
