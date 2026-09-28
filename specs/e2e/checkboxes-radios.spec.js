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

test.describe('Fieldset legend spacing', () => {
  test('legend sits flush against a following hint (0px gap)', async ({ page }) => {
    await page.goto('/examples/checkboxes-hints.html');
    const gap = await page.evaluate(() => {
      const legend = document.querySelector('.nhsw-fieldset__legend');
      const hint = document.querySelector('.nhsw-hint');
      return hint.getBoundingClientRect().top - legend.getBoundingClientRect().bottom;
    });
    expect(gap).toBe(0);
  });

  test('legend gets a 16px gap before the checkboxes when there is no hint', async ({ page }) => {
    await page.goto('/examples/checkboxes-hints.html');
    await page.evaluate(() => document.querySelector('#conditions-hint').remove());

    const gap = await page.evaluate(() => {
      const legend = document.querySelector('.nhsw-fieldset__legend');
      const checkboxes = document.querySelector('.nhsw-checkboxes');
      return checkboxes.getBoundingClientRect().top - legend.getBoundingClientRect().bottom;
    });
    expect(gap).toBe(16);
  });
});

test.describe('Item spacing stays 6px regardless of the shared label spacing rule', () => {
  test('checkboxes items are spaced 6px apart, not inflated by the label’s own margin', async ({ page }) => {
    await page.goto('/examples/checkboxes-hints.html');
    const items = page.locator('.nhsw-checkboxes__item');
    const [box1, box2] = await Promise.all([items.nth(0).boundingBox(), items.nth(1).boundingBox()]);
    expect(box2.y - (box1.y + box1.height)).toBe(6);
  });

  test('radios items are spaced 6px apart, not inflated by the label’s own margin', async ({ page }) => {
    await page.goto('/examples/radios-hints.html');
    const items = page.locator('.nhsw-radios__item');
    const [box1, box2] = await Promise.all([items.nth(0).boundingBox(), items.nth(1).boundingBox()]);
    expect(box2.y - (box1.y + box1.height)).toBe(6);
  });
});

test.describe('Conditional reveal alignment', () => {
  test('checkboxes conditional content left-aligns with the item label, not the checkbox square', async ({ page }) => {
    await page.goto('/examples/checkboxes-conditional.html');
    await page.locator('#cb-contact2-1').check({ force: true });

    const label = page.locator('.nhsw-checkboxes__item').first().locator('.nhsw-checkboxes__label');
    const conditionalLabel = page.locator('.nhsw-checkboxes__conditional').first().locator('.nhsw-label');

    const [labelBox, conditionalLabelBox] = await Promise.all([label.boundingBox(), conditionalLabel.boundingBox()]);
    expect(conditionalLabelBox.x).toBe(labelBox.x);
  });

  test('conditional field label is the same font weight as the checkbox label', async ({ page }) => {
    await page.goto('/examples/checkboxes-conditional.html');
    await page.locator('#cb-contact2-1').check({ force: true });

    const label = page.locator('.nhsw-checkboxes__item').first().locator('.nhsw-checkboxes__label');
    const conditionalLabel = page.locator('.nhsw-checkboxes__conditional').first().locator('.nhsw-label');

    const [labelWeight, conditionalLabelWeight] = await Promise.all([
      label.evaluate((el) => getComputedStyle(el).fontWeight),
      conditionalLabel.evaluate((el) => getComputedStyle(el).fontWeight),
    ]);
    expect(conditionalLabelWeight).toBe(labelWeight);
  });
});
