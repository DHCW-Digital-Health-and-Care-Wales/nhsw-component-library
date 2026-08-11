import path from 'node:path';
import * as sass from 'sass';

const projectRoot = path.resolve(import.meta.dirname, '../../..');

/**
 * Compiles an inline SCSS snippet with loadPaths pointed at src/, so a probe
 * can @use the real token/component partials without needing a file on disk.
 * Used to assert on a token's or mixin's actual resolved CSS output, rather
 * than grep-ing the full compiled nhsw.css for a substring.
 */
export function compileProbe(scssBody) {
  return sass.compileString(scssBody, { loadPaths: [path.join(projectRoot, 'src')] }).css;
}

export function readCustomProperty(css, name) {
  const match = css.match(new RegExp(`${name}:\\s*([^;]+);`));
  return match ? match[1].trim() : null;
}
