import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('buttons: new warning-outline variant, link variant fixes, group layout, outline shadow fix', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/actions/button"; @use "components/actions/button-group";`);
  });

  it('warning-outline is a small, red-bordered button reusing the existing delete-red tokens', () => {
    const base = block(css, '\\.nhsw-button--warning-outline');
    expect(base).toMatch(/color:\s*#d5281b/);
    expect(base).toMatch(/border-color:\s*#d5281b/);
    const hover = block(css, '\\.nhsw-button--warning-outline:not\\(:disabled\\):not\\(:focus\\):hover');
    expect(hover).toMatch(/color:\s*#902419/);
  });

  it('outline button box-shadow uses the secondary border colour, not the exceptional-button brown', () => {
    const outline = block(css, '\\.nhsw-button--outline');
    expect(outline).toMatch(/box-shadow:\s*0 2px 0 #4c6272/);
  });

  it('link variant is regular weight, square-cornered, and drops its underline on hover on a dark background', () => {
    const base = block(css, '\\.nhsw-button--link');
    expect(base).toMatch(/border-radius:\s*0/);
    expect(base).toMatch(/font-weight:\s*400/);
    const reverseHover = block(css, '\\.nhsw-button--link\\.nhsw-button--reverse:not\\(:disabled\\):not\\(:focus\\):hover');
    expect(reverseHover).toMatch(/text-decoration:\s*none/);
  });

  it('link variant underline thickness matches the action link component', () => {
    const base = block(css, '\\.nhsw-button--link');
    expect(base).toMatch(/text-decoration-thickness:\s*2px/);
    expect(base).toMatch(/text-underline-offset:\s*0\.12em/);
  });

  it('button group stays in a row and wraps at any screen size, and its buttons are not forced full-width', () => {
    const group = block(css, '\\.nhsw-button-group');
    expect(group).toMatch(/flex-direction:\s*row/);
    expect(group).toMatch(/flex-wrap:\s*wrap/);
    const groupButton = block(css, '\\.nhsw-button-group \\.nhsw-button');
    expect(groupButton).toMatch(/width:\s*auto/);
  });
});

describe('button spacing matches Figma Button/Default > Primary/Default', () => {
  // Read directly out of the Figma source of truth for this design system:
  // https://www.figma.com/design/RplwUuFizhzeH1ng7M0SMO/DHCW-Design-System-V2
  // Selected the Button/Default > Primary/Default node and read its Layout
  // panel (padding, radius). Checked 2026-08-11.
  let buttonCss = '';

  beforeAll(() => {
    buttonCss = compileProbe(`
      @use "foundations/button-base" as b;
      .probe { @include b.nhsw-button-base; }
    `);
  });

  it('has 12px vertical / 16px horizontal padding', () => {
    expect(buttonCss).toMatch(/padding:\s*12px 16px/);
  });

  it('has a 4px corner radius', () => {
    expect(buttonCss).toMatch(/border-radius:\s*4px/);
  });

  it('has a 12px gap between icon and label (Button/Icon > Icon - Discard or cancel > Default)', () => {
    // No icon+text button is wired up anywhere in the docs yet, so this gap
    // is currently dormant, but it must be correct for whenever one is built.
    expect(buttonCss).toMatch(/gap:\s*12px/);
  });

  it('focus state suppresses the default browser outline in favour of the custom yellow/box-shadow treatment', () => {
    // Without this, the browser's default UA focus ring shows up alongside
    // the custom focus style — most visible as a stray pale ring around
    // background-less variants like --link sitting on a dark background.
    const focusBlock = buttonCss.match(/:focus:not\(:active\)\s*\{([^}]*)\}/);
    expect(focusBlock && focusBlock[1]).toMatch(/outline:\s*none/);
  });
});
