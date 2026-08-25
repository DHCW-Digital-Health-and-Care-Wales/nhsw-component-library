import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

// Expected values read directly out of Figma component nodes for this design
// system: https://www.figma.com/design/RplwUuFizhzeH1ng7M0SMO/DHCW-Design-System-V2

describe('inset text matches Figma Inset text component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/inset-text";`);
  });

  it('has 24/24/24/32px padding (top/right/bottom/left)', () => {
    const base = block(css, '\\.nhsw-inset-text');
    expect(base).toMatch(/padding:\s*1\.5rem 1\.5rem 1\.5rem 2rem/);
  });

  it('has an 8px gold border-left', () => {
    const base = block(css, '\\.nhsw-inset-text');
    expect(base).toMatch(/border-left:\s*0\.5rem solid #aa8630/);
  });
});
