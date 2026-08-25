import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('site footer matches Figma Footer component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/site/footer";`);
  });

  it('footer background is white, not grey — grey is only the surrounding page backdrop', () => {
    const footer = block(css, '\\.nhsw-site-footer\\b');
    expect(footer).toMatch(/background-color:\s*#ffffff/);
    expect(footer).toMatch(/border-top:\s*0\.25rem solid #005eb8/);
  });

  it('container has 30px vertical / 40px horizontal padding', () => {
    const container = block(css, '\\.nhsw-site-footer__container');
    expect(container).toMatch(/padding:\s*1\.875rem 2\.5rem/);
  });

  it('the --stacked container modifier switches to a block layout, so links/licence/copyright each get their own full-width row', () => {
    const stacked = block(css, '\\.nhsw-site-footer__container--stacked');
    expect(stacked).toMatch(/display:\s*block/);
  });

  it('the open-licence row pairs a bordered OGL-style badge with description text, matching the copyright/org text convention', () => {
    const licence = block(css, '\\.nhsw-site-footer__licence\\b');
    expect(licence).toMatch(/display:\s*flex/);
    const badge = block(css, '\\.nhsw-site-footer__licence-badge');
    expect(badge).toMatch(/border:\s*1px solid #212b32/);
    expect(badge).toMatch(/font-weight:\s*700/);
  });

  it('licence text and version use the secondary (grey) text colour', () => {
    const licenceText = block(css, '\\.nhsw-site-footer__licence-text');
    expect(licenceText).toMatch(/color:\s*#4c6272/);
    const version = block(css, '\\.nhsw-site-footer__version');
    expect(version).toMatch(/color:\s*#4c6272/);
  });

  it('nav row has a grey bottom border', () => {
    const nav = block(css, '\\.nhsw-site-footer__nav\\b');
    expect(nav).toMatch(/border-bottom:\s*1px solid #d8dde0/);
  });
});
