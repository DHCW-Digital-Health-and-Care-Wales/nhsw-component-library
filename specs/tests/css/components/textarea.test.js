import { describe, it, expect, beforeAll } from 'vitest';
import { compileProbe, block } from '../../support/compile-scss.js';

describe('textarea character-counter spacing', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/textarea";`);
  });

  it('the counter text (.nhsw-textarea__count) sits 4px below the box', () => {
    const count = block(css, '\\.nhsw-textarea__count');
    expect(count).toMatch(/margin-top:\s*4px/);
  });

  it('the counter turns red and bold once over the limit (--error modifier)', () => {
    const error = block(css, '\\.nhsw-textarea__count--error');
    expect(error).toMatch(/color:\s*#d5281b/);
    expect(error).toMatch(/font-weight:\s*700/);
  });
});

describe('textarea shares the standard input styling (border, background, placeholder, disabled state)', () => {
  let css = '';

  beforeAll(() => {
    css = compileProbe(`@use "components/forms/textarea";`);
  });

  it('has a 2px secondary-coloured border and a white background', () => {
    const textarea = block(css, '\\.nhsw-textarea\\b');
    expect(textarea).toMatch(/border:\s*2px solid #4c6272/);
    expect(textarea).toMatch(/background-color:\s*#ffffff/);
  });

  it('placeholder text uses the secondary text colour', () => {
    const placeholder = block(css, '\\.nhsw-textarea::placeholder');
    expect(placeholder).toMatch(/color:\s*#4c6272/);
  });

  it('disabled state greys out the background and text', () => {
    const disabled = block(css, '\\.nhsw-textarea:disabled, \\.nhsw-textarea\\[disabled\\]');
    expect(disabled).toMatch(/background-color:\s*#f0f4f5/);
    expect(disabled).toMatch(/color:\s*#4c6272/);
  });

  it('inherits its font family instead of falling back to the browser default textarea font', () => {
    const textarea = block(css, '\\.nhsw-textarea\\b');
    expect(textarea).toMatch(/font-family:\s*inherit/);
  });
});
