import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('fieldset legend margin: a heading class combined onto the legend does not override its tighter spacing', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/fieldset";`);
  });

  it('legend + nhsw-h2 keeps margin-bottom at 0', () => {
    const compound = block(css, '\\.nhsw-fieldset__legend\\.nhsw-h2');
    expect(compound).toMatch(/margin-bottom:\s*0/);
  });

  it('legend + nhsw-h2 gets a 16px margin-bottom when no hint follows it', () => {
    const noHint = block(css, '\\.nhsw-fieldset__legend\\.nhsw-h2:not\\(:has\\(\\+ \\.nhsw-hint\\)\\)');
    expect(noHint).toMatch(/margin-bottom:\s*16px/);
  });
});
