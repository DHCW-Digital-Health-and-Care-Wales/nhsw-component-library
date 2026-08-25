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
