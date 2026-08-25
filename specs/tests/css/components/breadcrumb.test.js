import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('breadcrumb link hover/focus states', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/navigation/breadcrumb";`);
  });

  it('link hover recolours to #7c2855 and removes the underline', () => {
    const hover = block(css, '\\.nhsw-breadcrumb__link:hover');
    expect(hover).toMatch(/color:\s*#7c2855/);
    expect(hover).toMatch(/text-decoration:\s*none/);
  });

  it('link focus state is a tight yellow highlight with a dark underline and no separate outline', () => {
    const focus = block(css, '\\.nhsw-breadcrumb__link:focus');
    expect(focus).toMatch(/outline:\s*none/);
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/border-bottom:\s*max\(4px, 0\.25rem\) solid #212b32/);
  });

  it('on dark backgrounds, hover stays white with no underline', () => {
    const reverseHover = block(css, '\\.nhsw-breadcrumb--reverse \\.nhsw-breadcrumb__link:hover');
    expect(reverseHover).toMatch(/color:\s*#ffffff/);
    expect(reverseHover).toMatch(/text-decoration:\s*none/);
  });

  it('on dark backgrounds, focus matches the default focus treatment', () => {
    const reverseFocus = block(css, '\\.nhsw-breadcrumb--reverse \\.nhsw-breadcrumb__link:focus');
    expect(reverseFocus).toMatch(/outline:\s*none/);
    expect(reverseFocus).toMatch(/background-color:\s*#ffeb3b/);
    expect(reverseFocus).toMatch(/border-bottom:\s*max\(4px, 0\.25rem\) solid #212b32/);
  });

  it('separator is CSS-generated content, not a real character in the text', () => {
    const separator = block(css, '\\.nhsw-breadcrumb__list-item:not\\(:last-child\\)::after');
    expect(separator).toMatch(/content:\s*"›"/);
  });
});
