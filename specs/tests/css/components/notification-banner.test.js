import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

// Expected values read directly out of Figma component nodes for this design
// system: https://www.figma.com/design/RplwUuFizhzeH1ng7M0SMO/DHCW-Design-System-V2

describe('notification banner matches Figma Attention banner (Important variant)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/callouts/notification-banner";`);
  });

  it('header background matches Extended/blue-dark, not the generic link-blue token', () => {
    const header = block(css, '\\.nhsw-notification-banner__header');
    expect(header).toMatch(/background-color:\s*#004281/);
  });

  it('border is a solid 6px line matching the header colour (blue by default, green for success)', () => {
    const base = block(css, '\\.nhsw-notification-banner');
    const success = block(css, '\\.nhsw-notification-banner--success');
    expect(base).toMatch(/border:\s*6px solid #004281/);
    expect(success).toMatch(/border-color:\s*#00703c/);
  });

  it('content and links break long unbroken strings (e.g. an email link) instead of overflowing the box', () => {
    const content = block(css, '\\.nhsw-notification-banner__content');
    expect(content).toMatch(/overflow-wrap:\s*break-word/);
    // The shared .nhsw-link class is display: inline-block. Its intrinsic
    // width is unaffected by overflow-wrap: break-word (per spec, only
    // `anywhere` reduces min-content sizing) — anywhere is required or the
    // link keeps its full unbroken width and overflows the banner instead.
    const link = block(css, '\\.nhsw-notification-banner__link');
    expect(link).toMatch(/overflow-wrap:\s*anywhere/);
  });

  it('content strips the trailing margin off its last child so the box is not bottom-heavy', () => {
    const contentLastChild = block(css, '\\.nhsw-notification-banner__content > :last-child');
    expect(contentLastChild).toMatch(/margin-bottom:\s*0/);
  });

  it('banner body and title colours', () => {
    const base = block(css, '\\.nhsw-notification-banner');
    expect(base).toMatch(/background-color:\s*#ffffff/);
    const title = block(css, '\\.nhsw-notification-banner__title');
    expect(title).toMatch(/color:\s*#ffffff/);
    const link = block(css, '\\.nhsw-notification-banner__link');
    expect(link).toMatch(/color:\s*#005aa8/);
  });
});
