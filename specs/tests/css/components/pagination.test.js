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

describe('pagination colour coverage (Figma tokens)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/pagination";`);
  });

  it('block has a light-grey top divider', () => {
    const base = block(css, '\\.nhsw-pagination');
    expect(base).toMatch(/border-top:\s*1px solid #d8dde0/);
  });

  it('legacy prev/next link is link-blue, recolours on hover, and inherits into its icon', () => {
    const base = block(css, '\\.nhsw-pagination__link');
    expect(base).toMatch(/color:\s*#005aa8/);

    const hover = block(css, '\\.nhsw-pagination__link:hover');
    expect(hover).toMatch(/color:\s*#7c2855/);
    const hoverIcon = block(css, '\\.nhsw-pagination__link:hover \\.nhsw-icon');
    expect(hoverIcon).toMatch(/fill:\s*#7c2855/);

    const focus = block(css, '\\.nhsw-pagination__link:focus');
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/box-shadow:\s*0 -2px #ffeb3b, 0 4px #212b32/);

    const visitedIcon = block(css, '\\.nhsw-pagination__link:visited \\.nhsw-icon');
    expect(visitedIcon).toMatch(/fill:\s*#7c2855/);
    const visitedHoverIcon = block(css, '\\.nhsw-pagination__link:visited:hover \\.nhsw-icon');
    expect(visitedHoverIcon).toMatch(/fill:\s*#7c2855/);
  });

  it('numbered previous/next colour, hover and focus states', () => {
    const base = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__previous,\\n\\.nhsw-pagination--numbered \\.nhsw-pagination__next');
    expect(base).toMatch(/color:\s*#005aa8/);

    const hover = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__previous:hover,\\n\\.nhsw-pagination--numbered \\.nhsw-pagination__next:hover');
    expect(hover).toMatch(/background-color:\s*#f0f4f5/);
    expect(hover).toMatch(/color:\s*#7c2855/);

    const focus = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__previous:focus,\\n\\.nhsw-pagination--numbered \\.nhsw-pagination__next:focus');
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/box-shadow:\s*0 -2px #ffeb3b, 0 4px #212b32/);
  });

  it('ellipsis item is muted grey text', () => {
    const ellipsis = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__item--ellipsis');
    expect(ellipsis).toMatch(/color:\s*#4c6272/);
  });

  it('numbered page link colour, hover and focus states', () => {
    const base = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__number-link');
    expect(base).toMatch(/color:\s*#005aa8/);

    const hover = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__number-link:hover');
    expect(hover).toMatch(/background-color:\s*#f0f4f5/);
    expect(hover).toMatch(/color:\s*#7c2855/);

    const focus = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__number-link:focus');
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/box-shadow:\s*0 -2px #ffeb3b, 0 4px #212b32/);
  });

  it('current page number is filled link-blue with white text, including on hover', () => {
    const current = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__item--current \\.nhsw-pagination__number-link');
    expect(current).toMatch(/background-color:\s*#005aa8/);
    expect(current).toMatch(/color:\s*#ffffff/);

    const currentHover = block(css, '\\.nhsw-pagination--numbered \\.nhsw-pagination__item--current \\.nhsw-pagination__number-link:hover');
    expect(currentHover).toMatch(/background-color:\s*#005aa8/);
    expect(currentHover).toMatch(/color:\s*#ffffff/);
  });
});
