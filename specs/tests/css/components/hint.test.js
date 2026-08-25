import { describe, it, expect } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('hint margin-bottom reduced to 8px', () => {
  it('hint margin-bottom is 8px', () => {
    const css = compileProbe(`@use "components/forms/hint";`);
    const hint = block(css, '\\.nhsw-hint');
    expect(hint).toMatch(/margin-bottom:\s*8px/);
  });
});
