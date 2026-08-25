import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

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
