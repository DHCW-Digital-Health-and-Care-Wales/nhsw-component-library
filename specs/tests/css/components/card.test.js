import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('card hover/focus states, chevron icon and actions header', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/cards/card";`);
  });

  it('title-link hover recolours to the maroon hover colour and drops the underline, instead of just thickening it', () => {
    const hover = block(css, '\\.nhsw-card__title-link:hover');
    expect(hover).toMatch(/color:\s*#7c2855/);
    expect(hover).toMatch(/text-decoration:\s*none/);
  });

  it('card border/shadow on title-link hover uses the secondary border colour, not the primary border colour', () => {
    const cardHover = block(css, '\\.nhsw-card:has\\(\\.nhsw-card__title-link:hover\\)');
    expect(cardHover).toMatch(/border-color:\s*#4c6272/);
    expect(cardHover).toMatch(/box-shadow:\s*0 4px 0 #4c6272/);
  });

  it('title-link focus highlights just the heading text with a yellow background, not the whole card', () => {
    expect(css).not.toMatch(/\.nhsw-card:focus-within/);
    const focus = block(css, '\\.nhsw-card__title-link:focus');
    expect(focus).toMatch(/outline:\s*none/);
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/color:\s*#0b0c0c/);
    expect(focus).toMatch(/text-decoration:\s*underline/);
    expect(focus).toMatch(/text-decoration-thickness:\s*3px/);
  });

  it('links inside a card body hover to the same maroon as the title-link', () => {
    const linkHover = block(css, '\\.nhsw-card \\.nhsw-link:hover');
    expect(linkHover).toMatch(/color:\s*#7c2855/);
  });

  it('chevron variant renders a filled circle badge (link blue, matching the icon-badge variant) with a white arrow glyph, not a thin border arrow', () => {
    const chevron = block(css, '\\.nhsw-card--chevron \\.nhsw-card__title-link::before');
    expect(chevron).toMatch(/border-radius:\s*50%/);
    expect(chevron).toMatch(/background-color:\s*#005aa8/);
    expect(chevron).toMatch(/color:\s*#ffffff/);
    expect(chevron).not.toMatch(/border-top:/);
  });

  it('header wraps the title and actions list on the same row, space-between', () => {
    const header = block(css, '\\.nhsw-card__header');
    expect(header).toMatch(/display:\s*flex/);
    expect(header).toMatch(/justify-content:\s*space-between/);
  });

  it('a title-only card (no description) centres the heading vertically', () => {
    const onlyChild = block(css, '\\.nhsw-card:has\\(> \\.nhsw-card__title:only-child\\)');
    expect(onlyChild).toMatch(/display:\s*flex/);
    expect(onlyChild).toMatch(/align-items:\s*center/);
    const onlyChildTitle = block(css, '\\.nhsw-card:has\\(> \\.nhsw-card__title:only-child\\) \\.nhsw-card__title');
    expect(onlyChildTitle).toMatch(/margin:\s*0\b/);
  });

  it('base card has a grey 1px border with a matching drop shadow', () => {
    const base = block(css, '\\.nhsw-card');
    expect(base).toMatch(/border:\s*1px solid #d8dde0/);
    expect(base).toMatch(/box-shadow:\s*0 4px 0 #d8dde0/);
  });

  it('preview panel has a grey 1px border', () => {
    const preview = block(css, '\\.nhsw-card__preview\\b');
    expect(preview).toMatch(/border:\s*1px solid #d8dde0/);
  });
});
