const { test, expect } = require('@playwright/test');

test.describe('Inputs do not resize on focus', () => {
  const cases = [
    { name: 'text input', url: '/examples/input-hint.html', selector: '.nhsw-input' },
    { name: 'select', url: '/examples/select-hint.html', selector: '.nhsw-select' },
    { name: 'textarea', url: '/examples/textarea-default.html', selector: '.nhsw-textarea' },
    { name: 'date input segment', url: '/examples/date-input-default.html', selector: '.nhsw-date-input .nhsw-input' },
  ];

  for (const { name, url, selector } of cases) {
    test(`${name} keeps the same bounding box before and after focus`, async ({ page }) => {
      await page.goto(url);
      const field = page.locator(selector).first();

      const before = await field.boundingBox();
      await field.focus();
      const after = await field.boundingBox();

      expect(after.width).toBe(before.width);
      expect(after.height).toBe(before.height);
      expect(after.x).toBe(before.x);
      expect(after.y).toBe(before.y);
    });
  }
});
