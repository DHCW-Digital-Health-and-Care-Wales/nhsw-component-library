const { test, expect } = require('@playwright/test');

test.describe('Card', () => {
  test('the whole card is clickable, not just the title', async ({ page }) => {
    await page.goto('/examples/card-basic.html');

    // The title link's ::after is stretched to fill the whole card (see
    // .nhsw-card__title-link::after in _card.scss), so a click anywhere in
    // the card body — not just on the visible title text — should hit the
    // link. Playwright's own actionability check already proves this: a
    // direct click on .nhsw-card__description is intercepted by the link.
    const hitElement = await page.locator('.nhsw-card__description').evaluate((el) => {
      const box = el.getBoundingClientRect();
      const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return top.closest('.nhsw-card__title-link') !== null;
    });
    expect(hitElement).toBe(true);

    const before = page.url();
    await page.locator('.nhsw-card__description').click({ force: true });
    expect(page.url()).toBe(`${before}#`);
  });
});
