import { describe, it, expect } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('error-message margin-bottom reduced to 8px', () => {
  it('error-message margin-bottom is 8px', () => {
    const css = compileProbe(`@use "components/forms/error-message";`);
    const error = block(css, '\\.nhsw-error-message');
    expect(error).toMatch(/margin-bottom:\s*8px/);
  });

  it('error-message text is the red invalid colour', () => {
    const css = compileProbe(`@use "components/forms/error-message";`);
    const error = block(css, '\\.nhsw-error-message');
    expect(error).toMatch(/color:\s*#d5281b/);
  });
});
