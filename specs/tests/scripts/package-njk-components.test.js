// @vitest-environment node
//
// jsdom's environment silently breaks adm-zip's zlib decompression (entries
// report their real byte size but every read method returns empty content)
// — this file only exercises plain Node file/zip logic and needs no DOM, so
// force the real Node environment instead of this project's jsdom default.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import AdmZip from 'adm-zip';

// This packages dist/nhsw-nunjucks-components.zip — attached to every
// release — but the script itself only ever ran at release time
// (.github/workflows/*.yml), never on a PR, so a broken path or filter here
// would only surface once someone was actually cutting a release. Requiring
// it via createRequire (rather than a static import) lets the test call its
// exported functions directly without going through the require.main===module
// CLI guard.
const require = createRequire(import.meta.url);
const { findNjkComponentDirs, packageReadme, main } = require('../../../scripts/package-njk-components.js');

const ROOT = path.resolve(import.meta.dirname, '../../..');
const COMPONENTS_SRC = path.join(ROOT, 'src', 'components');

describe('findNjkComponentDirs', () => {
  const dirs = findNjkComponentDirs();

  it('finds at least one component', () => {
    expect(dirs.length).toBeGreaterThan(0);
  });

  it('every returned name is a real directory containing macro.njk', () => {
    for (const name of dirs) {
      expect(fs.existsSync(path.join(COMPONENTS_SRC, name, 'macro.njk'))).toBe(true);
    }
  });

  it('excludes shared building-block directories that have no macro.njk of their own (e.g. label/, hint/)', () => {
    const allDirs = fs
      .readdirSync(COMPONENTS_SRC, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
    const withoutMacro = allDirs.filter((name) => !fs.existsSync(path.join(COMPONENTS_SRC, name, 'macro.njk')));

    expect(withoutMacro.length).toBeGreaterThan(0); // sanity: this repo does have some (label/, hint/, ...)
    for (const name of withoutMacro) {
      expect(dirs).not.toContain(name);
    }
  });
});

describe('packageReadme', () => {
  const readme = packageReadme('9.9.9');

  it('includes the given version', () => {
    expect(readme).toContain('v9.9.9');
  });

  it('tells consumers they need the Sass build for styles', () => {
    expect(readme).toContain('nhsw.css');
  });

  it('tells consumers they need nhsw-behaviours.js for interactivity', () => {
    expect(readme).toContain('nhsw-behaviours.js');
  });

  it('tells consumers the date picker ships as a separate script', () => {
    expect(readme).toContain('nhsw-date-picker.js');
  });
});

describe('main (end-to-end zip contents)', () => {
  let zip;
  let outFile;

  beforeAll(async () => {
    outFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'nhsw-njk-pkg-test-')), 'nhsw-nunjucks-components.zip');
    await main({ outFile });
    zip = new AdmZip(outFile);
  });

  afterAll(() => {
    fs.rmSync(path.dirname(outFile), { recursive: true, force: true });
  });

  function readEntry(name) {
    const entry = zip.getEntry(name);
    expect(entry, `expected zip entry "${name}" to exist`).not.toBeNull();
    return zip.readAsText(entry);
  }

  it('writes a top-level README.md that mentions the required JS', () => {
    const readme = readEntry('README.md');
    expect(readme).toContain('nhsw-behaviours.js');
    expect(readme).toContain('nhsw-date-picker.js');
  });

  it('writes components/README.md matching the real src/components/README.md verbatim', () => {
    const real = fs.readFileSync(path.join(COMPONENTS_SRC, 'README.md'), 'utf8');
    expect(readEntry('components/README.md')).toBe(real);
  });

  it('writes nunjucks.config.js and components/all-components.njk', () => {
    expect(zip.getEntry('nunjucks.config.js')).not.toBeNull();
    expect(zip.getEntry('components/all-components.njk')).not.toBeNull();
  });

  it('includes a macro.njk for every component findNjkComponentDirs() reports, and nothing else', () => {
    const zipComponentDirs = new Set(
      zip
        .getEntries()
        .map((entry) => entry.entryName)
        .filter((name) => /^components\/[^/]+\/macro\.njk$/.test(name))
        .map((name) => name.split('/')[1]),
    );

    expect([...zipComponentDirs].sort()).toEqual([...findNjkComponentDirs()].sort());
  });
});
