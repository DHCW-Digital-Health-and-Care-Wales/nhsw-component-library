import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

// Expected values read directly out of Figma component nodes for this design
// system: https://www.figma.com/design/RplwUuFizhzeH1ng7M0SMO/DHCW-Design-System-V2

describe('date input matches Figma Date input component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/date-input";`);
  });

  it('has a 24px gap between day/month/year fields', () => {
    const base = block(css, '\\.nhsw-date-input');
    expect(base).toMatch(/gap:\s*0 1\.5rem/);
  });

  it('label sits 4px above its input', () => {
    const label = block(css, '\\.nhsw-date-input__label');
    expect(label).toMatch(/margin-bottom:\s*0\.25rem/);
  });
});
