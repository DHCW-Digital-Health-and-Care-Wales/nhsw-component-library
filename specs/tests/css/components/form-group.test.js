import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('form group spacing and the error variant', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/form-group";`);
  });

  it('base group has 16px bottom margin, 24px from tablet', () => {
    const group = block(css, '\\.nhsw-form-group');
    expect(group).toMatch(/margin-bottom:\s*16px/);
    expect(css).toMatch(/@media \(min-width: 40\.0625em\)[\s\S]*?\.nhsw-form-group\s*\{[^}]*margin-bottom:\s*24px/);
  });

  it('--error variant adds a 4px red left border with matching padding', () => {
    const error = block(css, '\\.nhsw-form-group--error');
    expect(error).toMatch(/padding-left:\s*16px/);
    expect(error).toMatch(/border-left:\s*4px solid #d5281b/);
  });
});
