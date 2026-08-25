import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('bottom nav is fixed to the viewport and hidden from tablet up', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/site/bottom-nav";`);
  });

  it('bar is fixed to the bottom with a gold top border', () => {
    const nav = block(css, '\\.nhsw-bottom-nav');
    expect(nav).toMatch(/position:\s*fixed/);
    expect(nav).toMatch(/bottom:\s*0/);
    expect(nav).toMatch(/border-top:\s*3px solid #aa8630/);
  });

  it('bar is hidden from the tablet breakpoint up', () => {
    expect(css).toMatch(/@media \(min-width: 40\.0625em\)[\s\S]*?\.nhsw-bottom-nav\s*\{[^}]*display:\s*none/);
  });

  it('current link gets a link-blue top border', () => {
    const current = block(css, '\\.nhsw-bottom-nav__link--current');
    expect(current).toMatch(/border-top:\s*3px solid #005aa8/);
    expect(current).toMatch(/color:\s*#005aa8/);
  });

  it('nhsw-has-bottom-nav adds bottom padding to the main wrapper on mobile only', () => {
    expect(css).toMatch(/@media \(max-width: 40rem\)[\s\S]*?\.nhsw-has-bottom-nav \.nhsw-main-wrapper\s*\{[^}]*padding-bottom:\s*5rem/);
  });
});
