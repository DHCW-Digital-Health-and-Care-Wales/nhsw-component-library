import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('grid row/column/container gutters and breakpoint widths', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/layout/grid";`);
  });

  it('grid row cancels the gutter with negative margins', () => {
    const row = block(css, '\\.nhsw-grid-row');
    expect(row).toMatch(/margin-left:\s*-16px/);
    expect(row).toMatch(/margin-right:\s*-16px/);
  });

  it('grid columns pad by the gutter and are full-width below desktop', () => {
    const columns = block(css, '\\.nhsw-grid-column-full,\\s*\\n?\\.nhsw-grid-column-one-half,\\s*\\n?\\.nhsw-grid-column-one-third,\\s*\\n?\\.nhsw-grid-column-two-thirds,\\s*\\n?\\.nhsw-grid-column-one-quarter,\\s*\\n?\\.nhsw-grid-column-three-quarters');
    expect(columns).toMatch(/padding-left:\s*16px/);
    expect(columns).toMatch(/padding-right:\s*16px/);
    expect(columns).toMatch(/width:\s*100%/);
  });

  it('one-third and one-half columns resolve to their fractional widths at desktop', () => {
    expect(css).toMatch(/@media \(min-width: 48\.0625em\)[\s\S]*?\.nhsw-grid-column-one-half\s*\{[^}]*width:\s*50%/);
    expect(css).toMatch(/\.nhsw-grid-column-one-third\s*\{[^}]*width:\s*33\.3333%/);
  });

  it('fluid container pads 16px mobile, 32px desktop', () => {
    const fluid = block(css, '\\.nhsw-fluid-container');
    expect(fluid).toMatch(/padding-left:\s*16px/);
    expect(css).toMatch(/@media \(min-width: 48\.0625em\)[\s\S]*?\.nhsw-fluid-container\s*\{[^}]*padding-left:\s*32px/);
  });

  it('page body has the light grey backdrop colour', () => {
    const body = block(css, 'body');
    expect(body).toMatch(/background-color:\s*#f0f4f5/);
  });
});
