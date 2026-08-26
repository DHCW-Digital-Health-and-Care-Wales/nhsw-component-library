import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('details summary hover matches the maroon hover colour used elsewhere', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/details";`);
  });

  it('summary hover recolours to #7c2855, not the blue link-hover colour', () => {
    const hover = block(css, '\\.nhsw-details__summary:hover');
    expect(hover).toMatch(/color:\s*#7c2855/);
  });
});

describe('details disclosure matches its summary/text structure', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/details";`);
  });

  it('base text is 1rem, growing to 1.1875rem at tablet', () => {
    const details = block(css, '\\.nhsw-details');
    expect(details).toMatch(/font-size:\s*1rem/);
    expect(css).toMatch(/@media \(min-width: 40\.0625em\)[\s\S]*?\.nhsw-details\s*\{[^}]*font-size:\s*1\.1875rem/);
  });

  it('summary is link-blue and recolours to the visited token on hover', () => {
    const summary = block(css, '\\.nhsw-details__summary');
    const summaryHover = block(css, '\\.nhsw-details__summary:hover');
    expect(summary).toMatch(/color:\s*#005aa8/);
    expect(summaryHover).toMatch(/color:\s*#7c2855/);
  });

  it('expanded text panel has a grey left border and indent', () => {
    const text = block(css, '\\.nhsw-details__text');
    expect(text).toMatch(/border-left:\s*4px solid #d8dde0/);
    expect(text).toMatch(/padding-left:\s*20px/);
  });

  it('summary focus is a yellow highlight with a dark bottom edge', () => {
    const focus = block(css, '\\.nhsw-details__summary:focus');
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/box-shadow:\s*0 -2px #ffeb3b, 0 4px #212b32/);
  });
});
