import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('session row matches its list-item structure', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/session-row";`);
  });

  it('row has 16px vertical padding and a grey bottom border', () => {
    const row = block(css, '\\.nhsw-session-row');
    expect(row).toMatch(/padding:\s*16px 0/);
    expect(row).toMatch(/border-bottom:\s*1px solid #d8dde0/);
  });

  it('title is link-blue and bold', () => {
    const title = block(css, '\\.nhsw-session-row__title');
    expect(title).toMatch(/color:\s*#005aa8/);
    expect(title).toMatch(/font-weight:\s*700/);
  });

  it('meta and detail text use the secondary text token', () => {
    const meta = block(css, '\\.nhsw-session-row__meta');
    const detail = block(css, '\\.nhsw-session-row__detail');
    expect(meta).toMatch(/color:\s*#4c6272/);
    expect(detail).toMatch(/color:\s*#4c6272/);
  });

  it('badge has a grey background and bold text', () => {
    const badge = block(css, '\\.nhsw-session-row__badge');
    expect(badge).toMatch(/background-color:\s*#f0f4f5/);
    expect(badge).toMatch(/font-weight:\s*700/);
  });
});
