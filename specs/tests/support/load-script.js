import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '../../..');

/**
 * Evaluates one of the library's plain-script files (nhsw-docs.js,
 * nhsw-date-picker.js) against the current jsdom document. These scripts are
 * self-executing IIFEs that wire up listeners against whatever matches
 * their selectors at evaluation time, so the fixture markup must already be
 * in `document.body` before calling this.
 */
export function runScript(relativePath) {
  const source = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
  // eslint-disable-next-line no-new-func
  const fn = new Function(source);
  fn.call(globalThis);
}
