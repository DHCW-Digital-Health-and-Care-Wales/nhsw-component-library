import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('numbered pagination: underline is default, hover removes it (not the other way round)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/pagination";`);
  });

  it('page number links are underlined by default and lose the underline on hover', () => {
    const base = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__number-link');
    expect(base).toMatch(/text-decoration:\s*underline/);
    const hover = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__number-link:hover');
    expect(hover).toMatch(/text-decoration:\s*none/);
  });

  it('previous/next links are underlined by default and lose the underline on hover', () => {
    const base = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__previous,\\n\\.nhsw-pagination--numbered \\.nhsw-pagination__next');
    expect(base).toMatch(/text-decoration:\s*underline/);
    const hover = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__previous:hover,\\n\\.nhsw-pagination--numbered \\.nhsw-pagination__next:hover');
    expect(hover).toMatch(/text-decoration:\s*none/);
  });
});
