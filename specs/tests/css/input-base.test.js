import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../support/compile-scss.js';

// Covers foundations/_input-base.scss, the shared mixin included by input,
// select, textarea and date-input — kept as one probe (rather than split
// across each component's own file) so it stays clear this is testing the
// shared foundation cascading correctly, not a coincidence across components.

describe('shared input focus/hover: no hover border change, focus border is thicker and near-black', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/input"; @use "components/forms/select"; @use "components/forms/textarea";`);
  });

  it('input and select have no :hover rule at all (the border-darkening hover was removed)', () => {
    expect(css).not.toMatch(/\.nhsw-input:hover/);
    expect(css).not.toMatch(/\.nhsw-select:hover/);
  });

  it('input focus uses a thicker, near-black border alongside the yellow ring', () => {
    const focus = block(css, '\\.nhsw-input:focus');
    expect(focus).toMatch(/border-color:\s*#212b32/);
    expect(focus).toMatch(/border-width:\s*4px/);
  });

  it('select focus uses a thicker, near-black border alongside the yellow ring', () => {
    const focus = block(css, '\\.nhsw-select:focus');
    expect(focus).toMatch(/border-color:\s*#212b32/);
    expect(focus).toMatch(/border-width:\s*4px/);
  });

  it('textarea focus uses the same thicker, near-black border via the shared input-base mixin', () => {
    const focus = block(css, '\\.nhsw-textarea:focus');
    expect(focus).toMatch(/border-color:\s*#212b32/);
    expect(focus).toMatch(/border-width:\s*4px/);
  });
});
