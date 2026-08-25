import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('side nav heading label (used above a grouped set of links, e.g. "Setup")', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/site/side-nav";`);
  });

  it('is bold, dark text, sitting above the link list', () => {
    const heading = block(css, '\\.nhsw-side-nav__heading');
    expect(heading).toMatch(/font-weight:\s*700/);
    expect(heading).toMatch(/color:\s*#212b32/);
  });
});
