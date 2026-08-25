import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('label grows to 19px at tablet, matching hint/error-message', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/label";`);
  });

  it('base label (no size modifier) is 19px from the tablet breakpoint up', () => {
    expect(css).toMatch(/@media \(min-width: 40\.0625em\)[\s\S]*?\.nhsw-label\s*\{[^}]*font-size:\s*1\.1875rem/);
  });

  it('the xl label variant (used as a page-heading-style question) has a 16px margin-bottom, not the base 4px', () => {
    const xl = block(css, '\\.nhsw-label--xl');
    expect(xl).toMatch(/margin-bottom:\s*16px/);
  });
});
