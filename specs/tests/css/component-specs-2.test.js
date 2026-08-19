import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, readCustomProperty } from '../support/compile-scss.js';

// Expected values below were read directly out of Figma component nodes for
// this design system:
// https://www.figma.com/design/RplwUuFizhzeH1ng7M0SMO/DHCW-Design-System-V2
// Each describe block cites the specific node(s) inspected. Checked 2026-08-11.
// Second pass covering: Action link, Error summary, Expander, File upload,
// Footer, Site header nav, Table, Tabs. (Header's Figma page models a
// different sub-pattern to our masthead, and Timeout has no Figma page at
// all, so neither is covered here.)

function block(css, selectorRegex) {
  const match = css.match(new RegExp(`^${selectorRegex}\\s*\\{([^}]*)\\}`, 'm'));
  return match ? match[1] : '';
}

describe('action link matches Figma Action link component (icon+text row)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/actions/action-link";`);
  });

  it('icon is 32x32px with an 8px gap before the label', () => {
    const icon = block(css, '\\.nhsw-action-link__icon');
    expect(icon).toMatch(/width:\s*32px/);
    expect(icon).toMatch(/height:\s*32px/);
    expect(icon).toMatch(/margin-right:\s*8px/);
  });

  it('default state is fully link-blue (icon and text), not the old invented green', () => {
    const icon = block(css, '\\.nhsw-action-link__icon');
    const link = block(css, '\\.nhsw-action-link');
    const text = block(css, '\\.nhsw-action-link__text');
    expect(icon).toMatch(/fill:\s*#005aa8/);
    // Text colour is set on the link itself and inherited by .__text, rather
    // than redeclared directly on .__text — :visited can only ever restyle
    // the element it matches, never a descendant, so the colour has to live
    // on .nhsw-action-link for the :visited state to work at all.
    expect(link).toMatch(/color:\s*#005aa8/);
    expect(text).toMatch(/color:\s*inherit/);
  });

  it('hover recolours the text to #7c2855 but leaves the icon link-blue', () => {
    const hoverText = block(css, '\\.nhsw-action-link:hover \\.nhsw-action-link__text');
    expect(hoverText).toMatch(/color:\s*#7c2855/);
    expect(css).not.toMatch(/\.nhsw-action-link:hover \.nhsw-action-link__icon/);
  });

  it('hover underline is 2px thick', () => {
    const hoverText = block(css, '\\.nhsw-action-link:hover \\.nhsw-action-link__text');
    expect(hoverText).toMatch(/text-decoration-thickness:\s*2px/);
  });

  it('link shrinks to fit its content instead of stretching full width', () => {
    const link = block(css, '\\.nhsw-action-link');
    expect(link).toMatch(/width:\s*fit-content/);
  });

  it('focus state is a tight yellow highlight with a dark underline and no separate outline', () => {
    const focus = block(css, '\\.nhsw-action-link:focus');
    expect(focus).toMatch(/outline:\s*none/);
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/border-bottom:\s*max\(4px, 0\.25rem\) solid #212b32/);
  });

  it('focus text and icon are the same dark colour', () => {
    const focusText = block(css, '\\.nhsw-action-link:focus \\.nhsw-action-link__text');
    const focusIcon = block(css, '\\.nhsw-action-link:focus \\.nhsw-action-link__icon');
    expect(focusText).toMatch(/color:\s*#0b0c0c/);
    expect(focusIcon).toMatch(/fill:\s*#0b0c0c/);
  });

  it('visited state recolours the link itself, not a descendant (required for :visited to apply at all)', () => {
    const visited = block(css, '\\.nhsw-action-link:visited');
    expect(visited).toMatch(/color:\s*#212b32/);
  });

  it('active state underlines the text', () => {
    const active = block(css, '\\.nhsw-action-link:active \\.nhsw-action-link__text');
    expect(active).toMatch(/text-decoration:\s*underline/);
  });

  it('on dark backgrounds, hover stays white — not the light-background hover colour', () => {
    const reverseHover = block(css, '\\.nhsw-action-link--reverse:hover \\.nhsw-action-link__text');
    expect(reverseHover).toMatch(/color:\s*#ffffff/);
    expect(reverseHover).not.toMatch(/#7c2855/);
  });

  it('on dark backgrounds, focus still wins over a simultaneous hover (mouse click = both at once)', () => {
    const reverseFocusText = block(css, '\\.nhsw-action-link--reverse:focus \\.nhsw-action-link__text');
    const reverseFocusIcon = block(css, '\\.nhsw-action-link--reverse:focus \\.nhsw-action-link__icon');
    expect(reverseFocusText).toMatch(/color:\s*#0b0c0c/);
    expect(reverseFocusIcon).toMatch(/fill:\s*#0b0c0c/);
  });
});

describe('back link hover/focus states', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/actions/back-link";`);
  });

  it('hover recolours to #7c2855 and removes the underline', () => {
    const hover = block(css, '\\.nhsw-back-link:hover');
    expect(hover).toMatch(/color:\s*#7c2855/);
    expect(hover).toMatch(/text-decoration:\s*none/);
  });

  it('focus state is a tight yellow highlight with a dark underline and no separate outline', () => {
    const focus = block(css, '\\.nhsw-back-link:focus');
    expect(focus).toMatch(/outline:\s*none/);
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/color:\s*#212b32/);
    expect(focus).toMatch(/border-bottom:\s*max\(4px, 0\.25rem\) solid #212b32/);
  });

  it('on dark backgrounds, hover stays white with no underline', () => {
    const reverseHover = block(css, '\\.nhsw-back-link--reverse:hover');
    expect(reverseHover).toMatch(/color:\s*#ffffff/);
    expect(reverseHover).toMatch(/text-decoration:\s*none/);
  });

  it('on dark backgrounds, focus text is still dark (wins over a simultaneous hover)', () => {
    const reverseFocus = block(css, '\\.nhsw-back-link--reverse:focus');
    expect(reverseFocus).toMatch(/color:\s*#212b32/);
  });
});

describe('breadcrumb link hover/focus states', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/navigation/breadcrumb";`);
  });

  it('link hover recolours to #7c2855 and removes the underline', () => {
    const hover = block(css, '\\.nhsw-breadcrumb__link:hover');
    expect(hover).toMatch(/color:\s*#7c2855/);
    expect(hover).toMatch(/text-decoration:\s*none/);
  });

  it('link focus state is a tight yellow highlight with a dark underline and no separate outline', () => {
    const focus = block(css, '\\.nhsw-breadcrumb__link:focus');
    expect(focus).toMatch(/outline:\s*none/);
    expect(focus).toMatch(/background-color:\s*#ffeb3b/);
    expect(focus).toMatch(/border-bottom:\s*max\(4px, 0\.25rem\) solid #212b32/);
  });

  it('on dark backgrounds, hover stays white with no underline', () => {
    const reverseHover = block(css, '\\.nhsw-breadcrumb--reverse \\.nhsw-breadcrumb__link:hover');
    expect(reverseHover).toMatch(/color:\s*#ffffff/);
    expect(reverseHover).toMatch(/text-decoration:\s*none/);
  });

  it('on dark backgrounds, focus matches the default focus treatment', () => {
    const reverseFocus = block(css, '\\.nhsw-breadcrumb--reverse \\.nhsw-breadcrumb__link:focus');
    expect(reverseFocus).toMatch(/outline:\s*none/);
    expect(reverseFocus).toMatch(/background-color:\s*#ffeb3b/);
    expect(reverseFocus).toMatch(/border-bottom:\s*max\(4px, 0\.25rem\) solid #212b32/);
  });

  it('separator is CSS-generated content, not a real character in the text', () => {
    const separator = block(css, '\\.nhsw-breadcrumb__list-item:not\\(:last-child\\)::after');
    expect(separator).toMatch(/content:\s*"›"/);
  });
});

describe('error summary matches Figma Error summary component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/error-summary";`);
  });

  it('heading sits 24px above the error list', () => {
    const title = block(css, '\\.nhsw-error-summary__title');
    expect(title).toMatch(/margin:\s*0 0 24px/);
  });
});

describe('expander matches Figma Expander component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/expander";`);
  });

  it('button has 24px padding', () => {
    const button = block(css, '\\.nhsw-expander__button');
    expect(button).toMatch(/padding:\s*24px/);
  });

  it('icon is 28x28px with a 12px gap before the label', () => {
    const icon = block(css, '\\.nhsw-expander__icon');
    expect(icon).toMatch(/width:\s*28px/);
    expect(icon).toMatch(/height:\s*28px/);
    expect(icon).toMatch(/margin-right:\s*12px/);
  });

  it('expanded content is flush with the button padding (no indent under the label)', () => {
    const content = block(css, '\\.nhsw-expander__content');
    expect(content).toMatch(/padding:\s*0 24px 24px/);
  });
});

describe('file upload matches Figma Upload a file component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/file-upload";`);
  });

  it('dashed box has a 1px secondary-coloured border, 28px padding, 20px gap', () => {
    const base = block(css, '\\.nhsw-file-upload');
    expect(base).toMatch(/border:\s*1px dashed #4c6272/);
    expect(base).toMatch(/padding:\s*28px/);
    expect(base).toMatch(/gap:\s*20px/);
  });

  it('status readout has uniform 10px padding', () => {
    const status = block(css, '\\.nhsw-file-upload__status');
    expect(status).toMatch(/padding:\s*10px/);
  });

  it('actions row has a 20px gap', () => {
    const actions = block(css, '\\.nhsw-file-upload__actions');
    expect(actions).toMatch(/gap:\s*20px/);
  });
});

describe('site footer matches Figma Footer component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/site/footer";`);
  });

  it('container has 30px vertical / 40px horizontal padding', () => {
    const container = block(css, '\\.nhsw-site-footer__container');
    expect(container).toMatch(/padding:\s*1\.875rem 2\.5rem/);
  });
});

describe('site header nav matches Figma Service navigation component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/site/header";`);
  });

  it('nav link has 16px vertical / 4px horizontal padding', () => {
    const link = block(css, '\\.nhsw-site-header__nav-link');
    expect(link).toMatch(/padding:\s*1rem 0\.25rem/);
  });

  it('nav list has an 8px gap between items', () => {
    const list = block(css, '\\.nhsw-site-header__nav-list');
    expect(list).toMatch(/gap:\s*0\.5rem/);
  });
});

describe('table matches Figma Table component (Desktop/Tablet cell)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/table";`);
  });

  it('header row has a 2px border-bottom', () => {
    const headRow = block(css, '\\.nhsw-table__head th');
    expect(headRow).toMatch(/border-bottom:\s*2px solid #d8dde0/);
  });

  it('cell/header padding is 12px top and bottom from tablet up', () => {
    expect(css).toMatch(/padding-top:\s*12px/);
    expect(css).toMatch(/padding-bottom:\s*12px/);
  });
});

describe('tabs match Figma Tabs component', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/tabs";`);
  });

  it('unselected tab has 8px vertical / 16px horizontal padding', () => {
    const tab = block(css, '\\.nhsw-tabs__tab');
    expect(tab).toMatch(/padding:\s*0\.5rem 1rem/);
  });

  it('selected tab has 12px vertical / 16px horizontal padding', () => {
    const selected = block(css, '\\.nhsw-tabs__tab--selected');
    expect(selected).toMatch(/padding:\s*0\.75rem 1rem/);
  });
});
