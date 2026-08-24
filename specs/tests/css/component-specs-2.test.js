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

describe('error summary link and field error styling', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/error-summary"; @use "components/forms/error-message"; @use "components/forms/form-group";`);
  });

  it('error summary link is bold red, compound with .nhsw-link so it wins the colour regardless of stylesheet order', () => {
    const link = block(css, '\\.nhsw-error-summary__link\\.nhsw-link');
    expect(link).toMatch(/color:\s*#d5281b/);
    expect(link).toMatch(/font-weight:\s*700/);
  });

  it('error summary link hover is a distinct darker red', () => {
    const hover = block(css, '\\.nhsw-error-summary__link\\.nhsw-link:hover');
    expect(hover).toMatch(/color:\s*#951c13/);
  });

  it('error message has no top margin', () => {
    const message = block(css, '\\.nhsw-error-message');
    expect(message).toMatch(/margin-top:\s*0/);
  });

  it('label inside an errored field group matches the error message size and drops the bold', () => {
    const label = block(css, '\\.nhsw-form-group--error \\.nhsw-label');
    expect(label).toMatch(/font-weight:\s*400/);
    expect(label).toMatch(/font-size:\s*1rem/);
  });
});

describe('expander hover/focus states and default appearance', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/expander";`);
  });

  it('default state is a white box with a 1px border, thicker on the bottom edge', () => {
    const base = block(css, '\\.nhsw-expander');
    expect(base).toMatch(/background-color:\s*#ffffff/);
    expect(base).toMatch(/border:\s*1px solid #d8dde0/);
    expect(base).toMatch(/border-bottom-width:\s*4px/);
  });

  it('hover recolours the link text, icon and border together, and removes the underline', () => {
    const hover = block(css, '\\.nhsw-expander:hover');
    expect(hover).toMatch(/border-color:\s*#7c2855/);
    const hoverText = block(css, '\\.nhsw-expander:hover \\.nhsw-expander__link-text');
    expect(hoverText).toMatch(/color:\s*#7c2855/);
    expect(hoverText).toMatch(/text-decoration:\s*none/);
    const hoverIcon = block(css, '\\.nhsw-expander:hover \\.nhsw-expander__icon');
    expect(hoverIcon).toMatch(/background-color:\s*#7c2855/);
  });

  it('focus highlights the icon+text heading with a yellow background and black underline, not the whole button', () => {
    const focusButton = block(css, '\\.nhsw-expander__button:focus');
    expect(focusButton).toMatch(/outline:\s*none/);
    const focusHeading = block(css, '\\.nhsw-expander__button:focus \\.nhsw-expander__heading');
    expect(focusHeading).toMatch(/background-color:\s*#ffeb3b/);
    expect(focusHeading).toMatch(/border-bottom:\s*max\(4px, 0\.25rem\) solid #212b32/);
  });

  it('focus turns the link text and icon near-black and removes the underline, keeping the yellow heading highlight', () => {
    const focusText = block(css, '\\.nhsw-expander__button:focus \\.nhsw-expander__link-text');
    expect(focusText).toMatch(/color:\s*#0b0c0c/);
    expect(focusText).toMatch(/text-decoration:\s*none/);
    const focusIcon = block(css, '\\.nhsw-expander__button:focus \\.nhsw-expander__icon');
    expect(focusIcon).toMatch(/background-color:\s*#0b0c0c/);
    const focusHeading = block(css, '\\.nhsw-expander__button:focus \\.nhsw-expander__heading');
    expect(focusHeading).toMatch(/background-color:\s*#ffeb3b/);
  });

  it('heading top-aligns the icon with wrapped text instead of centring it', () => {
    const heading = block(css, '\\.nhsw-expander__heading');
    expect(heading).toMatch(/align-items:\s*flex-start/);
  });

  it('link text can break within an unbreakable long word instead of overflowing', () => {
    const text = block(css, '\\.nhsw-expander__link-text');
    expect(text).toMatch(/overflow-wrap:\s*anywhere/);
  });

  it('reverse variant swaps to a transparent box with white border, icon and text', () => {
    const reverse = block(css, '\\.nhsw-expander--reverse');
    expect(reverse).toMatch(/background-color:\s*transparent/);
    expect(reverse).toMatch(/border-color:\s*#ffffff/);
    const reverseText = block(css, '\\.nhsw-expander--reverse \\.nhsw-expander__link-text');
    expect(reverseText).toMatch(/color:\s*#ffffff/);
    const reverseIcon = block(css, '\\.nhsw-expander--reverse \\.nhsw-expander__icon');
    expect(reverseIcon).toMatch(/background-color:\s*#ffffff/);
    expect(reverseIcon).toMatch(/color:\s*#1b365d/);
  });

  it('reverse variant keeps everything white on hover instead of switching to the purple hover colour, and removes the underline', () => {
    const reverseHover = block(css, '\\.nhsw-expander--reverse:hover');
    expect(reverseHover).toMatch(/border-color:\s*#ffffff/);
    const reverseHoverText = block(css, '\\.nhsw-expander--reverse:hover \\.nhsw-expander__link-text');
    expect(reverseHoverText).toMatch(/color:\s*#ffffff/);
    expect(reverseHoverText).toMatch(/text-decoration:\s*none/);
    const reverseHoverIcon = block(css, '\\.nhsw-expander--reverse:hover \\.nhsw-expander__icon');
    expect(reverseHoverIcon).toMatch(/background-color:\s*#ffffff/);
  });
});

describe('file upload hover/uploaded/focus states', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/file-upload";`);
  });

  it('hover turns the whole box white, and the Choose file button matches our own secondary button hover state', () => {
    const hover = block(css, '\\.nhsw-file-upload:hover');
    expect(hover).toMatch(/background-color:\s*#ffffff/);
    const hoverButton = block(css, '\\.nhsw-file-upload:hover \\.nhsw-file-upload__button');
    expect(hoverButton).toMatch(/background-color:\s*#f2f2f2/i);
    expect(hoverButton).toMatch(/box-shadow:\s*0 2px 0 #1b2a49/i);
  });

  it('an error state shows a red border around the box', () => {
    const errorBox = block(css, '\\.nhsw-form-group--error \\.nhsw-file-upload');
    expect(errorBox).toMatch(/border-color:\s*#d5281b/);
  });

  it('the uploaded-file state has a white background and a solid (not dashed) border', () => {
    const hasFile = block(css, '\\.nhsw-file-upload--has-file');
    expect(hasFile).toMatch(/background-color:\s*#ffffff/);
    expect(hasFile).toMatch(/border-style:\s*solid/);
  });

  it('the filled status readout uses the dark secondary colour with white text', () => {
    const filled = block(css, '\\.nhsw-file-upload__status--filled');
    expect(filled).toMatch(/background-color:\s*#4c6272/);
    expect(filled).toMatch(/color:\s*#ffffff/);
  });

  it('"No file chosen" and "or drop file" use the standard dark text colour, not a greyed-out one', () => {
    const status = block(css, '\\.nhsw-file-upload__status');
    const hint = block(css, '\\.nhsw-file-upload__hint');
    expect(status).toMatch(/color:\s*#212b32/);
    expect(hint).toMatch(/color:\s*#212b32/);
  });

  it('focusing the hidden file input highlights the Choose file button with a background colour, not just a border', () => {
    const focusButton = block(css, '\\.nhsw-file-upload__input:focus \\+ \\.nhsw-file-upload__button');
    expect(focusButton).toMatch(/background-color:\s*#ffeb3b/);
    expect(focusButton).toMatch(/border:\s*none/);
  });

  it('a long selected file name can break instead of overflowing the status box', () => {
    const status = block(css, '\\.nhsw-file-upload__status');
    expect(status).toMatch(/overflow-wrap:\s*break-word/);
  });
});

describe('skip link is not underlined and shows a bordered focus state', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/navigation/skip-link";`);
  });

  it('base state has no underline', () => {
    const base = block(css, '\\.nhsw-skip-link');
    expect(base).toMatch(/text-decoration:\s*none/);
  });

  it('focus state adds a thick 4px bottom-edge border on top of the yellow highlight, with the default UA outline suppressed', () => {
    const focus = block(css, '\\.nhsw-skip-link:focus');
    expect(focus).toMatch(/box-shadow:\s*0 4px 0 #212b32/);
    expect(focus).toMatch(/outline:\s*none/);
  });
});

describe('warning text icon aligns to the first line, not the vertical centre', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/content/warning-text";`);
  });

  it('icon is pinned to the top of the container, with no centring transform', () => {
    const icon = block(css, '\\.nhsw-warning-text__icon');
    expect(icon).toMatch(/top:\s*0/);
    expect(icon).not.toMatch(/transform:\s*translateY/);
  });
});

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
