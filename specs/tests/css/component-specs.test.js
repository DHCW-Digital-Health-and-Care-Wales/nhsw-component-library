import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, readCustomProperty } from '../support/compile-scss.js';

// Expected values below were read directly out of Figma component nodes for
// this design system:
// https://www.figma.com/design/RplwUuFizhzeH1ng7M0SMO/DHCW-Design-System-V2
// Each describe block cites the specific node(s) inspected. Checked 2026-08-11.
// This suite covers spacing/sizing/border/colour details for components not
// already exercised by figma-tokens.test.js (colours, type scale, button).

// Extracts the declaration block of the first rule whose selector matches
// `selectorRegex` at the start of a line (so e.g. `.foo::before` doesn't
// accidentally match a `.bar + .foo::before` combinator rule instead).
function block(css, selectorRegex) {
  const match = css.match(new RegExp(`^${selectorRegex}\\s*\\{([^}]*)\\}`, 'm'));
  return match ? match[1] : '';
}

describe('tag matches Figma Tag component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/tag";`);
  });

  it('base tag has 4px vertical / 8px horizontal padding and a 1px border', () => {
    const base = block(css, '\\.nhsw-tag');
    expect(base).toMatch(/padding:\s*4px 8px/);
    expect(base).toMatch(/border:\s*1px solid/);
  });

  it('blue variant matches Extended/blue-light background and blue-dark border+text', () => {
    const variant = block(css, '\\.nhsw-tag--blue');
    expect(variant).toMatch(/background-color:\s*#ccdff1/);
    expect(variant).toMatch(/border-color:\s*#004281/);
    expect(variant).toMatch(/color:\s*#004281/);
  });

  it('grey variant matches Figma swatch', () => {
    const variant = block(css, '\\.nhsw-tag--grey');
    expect(variant).toMatch(/background-color:\s*#dbe0e3/);
    expect(variant).toMatch(/border-color:\s*#354550/);
  });

  it('green variant matches Figma swatch', () => {
    const variant = block(css, '\\.nhsw-tag--green');
    expect(variant).toMatch(/background-color:\s*#cce5d8/);
    expect(variant).toMatch(/border-color:\s*#004c23/);
  });
});

describe('inset text matches Figma Inset text component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/inset-text";`);
  });

  it('has 24/24/24/32px padding (top/right/bottom/left)', () => {
    const base = block(css, '\\.nhsw-inset-text');
    expect(base).toMatch(/padding:\s*1\.5rem 1\.5rem 1\.5rem 2rem/);
  });

  it('has an 8px gold border-left', () => {
    const base = block(css, '\\.nhsw-inset-text');
    expect(base).toMatch(/border-left:\s*0\.5rem solid #aa8630/);
  });
});

describe('panel matches Figma Panel component (Small, Green variant)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/panel";`);
  });

  it('has 32px vertical / 40px horizontal padding', () => {
    const base = block(css, '\\.nhsw-panel');
    expect(base).toMatch(/padding:\s*32px 40px/);
  });

  it('background matches Figma green', () => {
    const base = block(css, '\\.nhsw-panel');
    expect(base).toMatch(/background-color:\s*#007f3b/);
  });
});

describe('notification banner matches Figma Attention banner (Important variant)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/callouts/notification-banner";`);
  });

  it('header background matches Extended/blue-dark, not the generic link-blue token', () => {
    const header = block(css, '\\.nhsw-notification-banner__header');
    expect(header).toMatch(/background-color:\s*#004281/);
  });

  it('border is a solid 6px line matching the header colour (blue by default, green for success)', () => {
    const base = block(css, '\\.nhsw-notification-banner');
    const success = block(css, '\\.nhsw-notification-banner--success');
    expect(base).toMatch(/border:\s*6px solid #004281/);
    expect(success).toMatch(/border-color:\s*#00703c/);
  });

  it('content and links break long unbroken strings (e.g. an email link) instead of overflowing the box', () => {
    const content = block(css, '\\.nhsw-notification-banner__content');
    expect(content).toMatch(/overflow-wrap:\s*break-word/);
    // The shared .nhsw-link class is display: inline-block. Its intrinsic
    // width is unaffected by overflow-wrap: break-word (per spec, only
    // `anywhere` reduces min-content sizing) — anywhere is required or the
    // link keeps its full unbroken width and overflows the banner instead.
    const link = block(css, '\\.nhsw-notification-banner__link');
    expect(link).toMatch(/overflow-wrap:\s*anywhere/);
  });

  it('content strips the trailing margin off its last child so the box is not bottom-heavy', () => {
    const contentLastChild = block(css, '\\.nhsw-notification-banner__content > :last-child');
    expect(contentLastChild).toMatch(/margin-bottom:\s*0/);
  });
});

describe('warning callout matches Figma Warning callout component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/callouts/warning-callout";`);
  });

  it('heading has a 10px icon/text gap and 8px vertical / 32px horizontal padding', () => {
    // The heading selector appears twice (once from the typography mixin,
    // once with its own layout rules) — the layout block is the one with `gap`.
    const headingBlocks = [...css.matchAll(/^\.nhsw-warning-callout__heading\s*\{([^}]*)\}/gm)].map((m) => m[1]);
    const layoutBlock = headingBlocks.find((b) => b.includes('gap')) ?? '';
    expect(layoutBlock).toMatch(/gap:\s*0\.625rem/);
    expect(layoutBlock).toMatch(/padding:\s*0\.5rem 2rem/);
  });

  it('content has 48px top / 32px sides / 32px bottom padding', () => {
    const content = block(css, '\\.nhsw-warning-callout__content');
    expect(content).toMatch(/padding:\s*3rem 2rem 2rem/);
  });

  it('heading background and content border use the Extended/yellow token (#ffeb3b)', () => {
    const headingBlocks = [...css.matchAll(/^\.nhsw-warning-callout__heading\s*\{([^}]*)\}/gm)].map((m) => m[1]);
    const layoutBlock = headingBlocks.find((b) => b.includes('background-color')) ?? '';
    const content = block(css, '\\.nhsw-warning-callout__content');
    expect(layoutBlock).toMatch(/background-color:\s*#ffeb3b/);
    expect(content).toMatch(/border:\s*1px solid #ffeb3b/);
  });

  it('content background matches Extended/yellow-light (#fff9c4)', () => {
    const content = block(css, '\\.nhsw-warning-callout__content');
    expect(content).toMatch(/background-color:\s*#fff9c4/);
  });

  it('important variant content border matches the light-grey token (#d8dde0), not navy', () => {
    const importantContent = block(css, '\\.nhsw-warning-callout--important \\.nhsw-warning-callout__content');
    expect(importantContent).toMatch(/border-color:\s*#d8dde0/);
  });
});

describe('warning text matches Figma Warning text component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/warning-text";`);
  });

  it('has a 12px gap between icon and text', () => {
    const base = block(css, '\\.nhsw-warning-text');
    expect(base).toMatch(/gap:\s*12px/);
  });
});

describe('date input matches Figma Date input component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/date-input";`);
  });

  it('has a 24px gap between day/month/year fields', () => {
    const base = block(css, '\\.nhsw-date-input');
    expect(base).toMatch(/gap:\s*0 1\.5rem/);
  });

  it('label sits 4px above its input', () => {
    const label = block(css, '\\.nhsw-date-input__label');
    expect(label).toMatch(/margin-bottom:\s*0\.25rem/);
  });
});

describe('checkboxes match Figma Checkboxes component (40x40px input square)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/checkboxes";`);
  });

  it('input hit target is 40x40px', () => {
    const input = block(css, '\\.nhsw-checkboxes__input');
    expect(input).toMatch(/width:\s*40px/);
    expect(input).toMatch(/height:\s*40px/);
  });

  it('visible box is 40x40px with a 2px border, square (no radius)', () => {
    const before = block(css, '\\.nhsw-checkboxes__label::before');
    expect(before).toMatch(/width:\s*40px/);
    expect(before).toMatch(/height:\s*40px/);
    expect(before).toMatch(/border:\s*2px solid #4c6272/);
    expect(before).toMatch(/border-radius:\s*0/);
  });
});

describe('radios match Figma Radios component (40x40px circle)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/radios";`);
  });

  it('input hit target is 40x40px', () => {
    const input = block(css, '\\.nhsw-radios__input');
    expect(input).toMatch(/width:\s*40px/);
    expect(input).toMatch(/height:\s*40px/);
  });

  it('visible circle is 40x40px with a 2px border and full radius', () => {
    const before = block(css, '\\.nhsw-radios__label::before');
    expect(before).toMatch(/width:\s*40px/);
    expect(before).toMatch(/height:\s*40px/);
    expect(before).toMatch(/border:\s*2px solid #4c6272/);
    expect(before).toMatch(/border-radius:\s*50%/);
  });
});
