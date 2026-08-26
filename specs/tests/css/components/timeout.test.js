import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('timeout modal dialog styling', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/timeout-modal";`);
  });

  it('dialog has a max-width, 24px padding and a grey border', () => {
    const modal = block(css, '\\.nhsw-timeout-modal');
    expect(modal).toMatch(/max-width:\s*25rem/);
    expect(modal).toMatch(/padding:\s*24px/);
    expect(modal).toMatch(/border:\s*1px solid #d8dde0/);
  });

  it('backdrop is a translucent dark overlay', () => {
    const backdrop = block(css, '\\.nhsw-timeout-modal::backdrop');
    expect(backdrop).toMatch(/background-color:\s*rgba\(11,\s*12,\s*12,\s*0\.6\)/);
  });

  it('title and text have their own bottom margins', () => {
    const title = block(css, '\\.nhsw-timeout-modal__title');
    const text = block(css, '\\.nhsw-timeout-modal__text');
    expect(title).toMatch(/margin:\s*0 0 8px/);
    expect(text).toMatch(/margin:\s*0 0 16px/);
  });
});
