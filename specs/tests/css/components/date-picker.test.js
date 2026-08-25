import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('date picker toggle, dialog and day states', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/date-picker";`);
  });

  it('toggle button is primary-blue with a fixed 44px width', () => {
    const toggle = block(css, '\\.nhsw-date-picker__toggle');
    expect(toggle).toMatch(/width:\s*44px/);
    expect(toggle).toMatch(/background-color:\s*#1b365d/);
    expect(toggle).toMatch(/border:\s*2px solid #4c6272/);
  });

  it('toggle hover darkens the background', () => {
    const hover = block(css, '\\.nhsw-date-picker__toggle:hover');
    expect(hover).toMatch(/background-color:\s*#1B2A49/i);
  });

  it('dialog has a dark 2px border and drop shadow', () => {
    const dialog = block(css, '\\.nhsw-date-picker__dialog');
    expect(dialog).toMatch(/border:\s*2px solid #212b32/);
    expect(dialog).toMatch(/box-shadow:/);
  });

  it('today is outlined and bold, pending selection is yellow-highlighted', () => {
    const today = block(css, '\\.nhsw-date-picker__day--today');
    const pending = block(css, '\\.nhsw-date-picker__day--pending');
    expect(today).toMatch(/border-color:\s*#212b32/);
    expect(today).toMatch(/font-weight:\s*700/);
    expect(pending).toMatch(/background-color:\s*#ffeb3b/);
    expect(pending).toMatch(/font-weight:\s*700/);
  });
});
