import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('table matches Figma Table component (Desktop/Tablet cell)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/table";`);
  });

  it('header row has a 2px border-bottom', () => {
    const headRow = block(css, '\\.nhsw-table__head th');
    expect(headRow).toMatch(/border-bottom:\s*2px solid #d8dde0/);
  });

  it('cell/header padding is 12px top and bottom from tablet up', () => {
    expect(css).toMatch(/padding-top:\s*12px/);
    expect(css).toMatch(/padding-bottom:\s*12px/);
  });
});

describe('table has no row hover colour, and the responsive variant treats row headers like data cells', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/table";`);
  });

  it('rows have no hover background, in the basic table or the responsive variant', () => {
    expect(css).not.toMatch(/__row\s*\{\s*\n\s*&:hover/);
    expect(css).not.toMatch(/\.nhsw-table__row:hover/);
  });

  it('responsive table applies the label/value flex layout to row headers (th[scope=row]) as well as td', () => {
    const cell = block(css, '\\.nhsw-table-responsive \\.nhsw-table__body td,\\n\\.nhsw-table-responsive \\.nhsw-table__body th\\[scope=row\\]');
    expect(cell).toMatch(/border-bottom:\s*1px solid #d8dde0/);
  });
});
