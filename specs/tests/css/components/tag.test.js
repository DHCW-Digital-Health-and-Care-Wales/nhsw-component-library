import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

// Expected values read directly out of Figma component nodes for this design
// system: https://www.figma.com/design/RplwUuFizhzeH1ng7M0SMO/DHCW-Design-System-V2

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

describe('tag centres multi-line text and can be grouped with no gap between two tags', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/tag";`);
  });

  it('tag text is centre-aligned, so a stat tag\'s two lines line up', () => {
    const base = block(css, '\\.nhsw-tag');
    expect(base).toMatch(/text-align:\s*center/);
  });

  it('a tag-group removes the border between its first and second tag so they sit flush', () => {
    const firstChild = block(css, '\\.nhsw-tag-group \\.nhsw-tag:first-child');
    expect(firstChild).toMatch(/border-right:\s*none/);
  });
});
