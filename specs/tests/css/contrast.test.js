import { describe, it, expect } from 'vitest';
import { contrastRatio } from '../support/contrast.js';

// WCAG 2.2 SC 1.4.3 requires a 4.5:1 contrast ratio for normal-weight text
// (none of the pairs below qualify for the relaxed 3:1 "large text" threshold).
// Every hex value here is already pinned by its own component's CSS-compilation
// test (tag.test.js, panel.test.js, warning-text.test.js, action-link.test.js) —
// this suite only adds the WCAG contrast-ratio calculation on top of those
// already-verified colour pairs.
const AA_NORMAL_TEXT = 4.5;

describe('tag variants meet WCAG AA contrast (1.4.3)', () => {
  const variants = {
    'default (navy bg, white text)': ['#183154', '#ffffff'],
    white: ['#ffffff', '#212b32'],
    grey: ['#dbe0e3', '#354550'],
    green: ['#cce5d8', '#004c23'],
    'aqua-green': ['#ccedeb', '#00524d'],
    blue: ['#ccdff1', '#004281'],
    purple: ['#d6cce3', '#240050'],
    pink: ['#efd3e3', '#57133a'],
    red: ['#f7d4d1', '#6b140e'],
    orange: ['#ffdc8e', '#4d3708'],
    yellow: ['#fff59d', '#4d4712'],
    'dhcw-blue (navy bg, white text)': ['#004281', '#ffffff'],
  };

  it.each(Object.entries(variants))('%s text/background pair is >= 4.5:1', (name, [bg, text]) => {
    expect(contrastRatio(bg, text)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});

describe('panel text meets WCAG AA contrast (1.4.3)', () => {
  it('default (green) background against white text is >= 4.5:1', () => {
    expect(contrastRatio('#007f3b', '#ffffff')).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });

  it('--navy background against white text is >= 4.5:1', () => {
    expect(contrastRatio('#1b365d', '#ffffff')).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});

describe('warning-text icon meets WCAG AA contrast (1.4.11 graphical object)', () => {
  it('default icon (navy circle, white glyph) is >= 4.5:1', () => {
    expect(contrastRatio('#1b365d', '#ffffff')).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });

  it('--reverse icon (white circle, navy glyph) is >= 4.5:1', () => {
    expect(contrastRatio('#ffffff', '#1b365d')).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});

describe('action-link text meets WCAG AA contrast (1.4.3)', () => {
  it('default (link-blue on white) is >= 4.5:1', () => {
    expect(contrastRatio('#005aa8', '#ffffff')).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });

  it('--reverse (white on navy) is >= 4.5:1', () => {
    expect(contrastRatio('#ffffff', '#1b365d')).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});
