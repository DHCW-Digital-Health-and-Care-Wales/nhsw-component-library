import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('back link hover/focus states', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/actions/back-link";`);
  });

  it('default state is link-blue', () => {
    const base = block(css, '\\.nhsw-back-link');
    expect(base).toMatch(/color:\s*#005aa8/);
  });

  it('hover recolours to #7c2855 and removes the underline', () => {
    const hover = block(css, '\\.nhsw-back-link:hover');
    expect(hover).toMatch(/color:\s*#7c2855/);
    expect(hover).toMatch(/text-decoration:\s*none/);
  });

  it('focus state is a tight yellow highlight with a dark underline and no separate outline', () => {
    const focus = block(css, '\\.nhsw-back-link:focus');
    expect(focus).toMatch(/outline:\s*none/);
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/color:\s*#212b32/);
    expect(focus).toMatch(/border-bottom:\s*max\(4px, 0\.25rem\) solid #212b32/);
  });

  it('on dark backgrounds, hover stays white with no underline', () => {
    const reverseHover = block(css, '\\.nhsw-back-link--reverse:hover');
    expect(reverseHover).toMatch(/color:\s*#ffffff/);
    expect(reverseHover).toMatch(/text-decoration:\s*none/);
  });

  it('on dark backgrounds, focus text is still dark (wins over a simultaneous hover)', () => {
    const reverseFocus = block(css, '\\.nhsw-back-link--reverse:focus');
    expect(reverseFocus).toMatch(/color:\s*#212b32/);
  });

  it('the button variant inherits its font family instead of falling back to the browser default button font', () => {
    const button = block(css, '\\.nhsw-back-link--button');
    expect(button).toMatch(/font-family:\s*inherit/);
  });
});
