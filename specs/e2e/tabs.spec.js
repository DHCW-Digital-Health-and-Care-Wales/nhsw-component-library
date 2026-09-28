const { test, expect } = require('@playwright/test');

test.describe('Tabs focus state', () => {
  test('the active (selected) tab still shows an underline when focused', async ({ page }) => {
    await page.goto('/examples/tabs-default.html');

    const selectedTab = page.locator('#demo-tab-day');
    await expect(selectedTab).toHaveClass(/nhsw-tabs__tab--selected/);
    await selectedTab.focus();

    const text = selectedTab.locator('.nhsw-tabs__tab-text');
    const style = await text.evaluate((el) => {
      const s = getComputedStyle(el);
      return { line: s.textDecorationLine, thickness: s.textDecorationThickness };
    });
    expect(style.line).toBe('underline');
    expect(style.thickness).toBe('3px');
  });

  test('an unselected tab also shows an underline when focused', async ({ page }) => {
    await page.goto('/examples/tabs-default.html');

    const tab = page.locator('#demo-tab-week');
    await tab.focus();

    const text = tab.locator('.nhsw-tabs__tab-text');
    const style = await text.evaluate((el) => {
      const s = getComputedStyle(el);
      return { line: s.textDecorationLine, thickness: s.textDecorationThickness };
    });
    expect(style.line).toBe('underline');
    expect(style.thickness).toBe('3px');
  });
});

test.describe('Tabs count badge variant', () => {
  test('renders a visible count badge alongside the tab label', async ({ page }) => {
    await page.goto('/examples/tabs-count.html');

    const tab = page.locator('#demo-tab-day');
    const badge = tab.locator('.nhsw-tag');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('112');
    await expect(tab.locator('.nhsw-tabs__tab-text')).toHaveText('Past day');
  });
});
