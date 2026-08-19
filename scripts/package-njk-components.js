'use strict';

/*
 * Packages the Nunjucks component suite (src/components/**) into a
 * standalone zip that other projects (e.g. a prototyping kit) can download
 * and drop straight into their own Nunjucks search path — no dependency on
 * the rest of this repo.
 *
 * Usage: node scripts/package-njk-components.js
 * Output: dist/nhsw-nunjucks-components.zip
 */

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const ROOT = path.join(__dirname, '..');
const COMPONENTS_SRC = path.join(ROOT, 'src', 'components');
const NUNJUCKS_CONFIG_SRC = path.join(ROOT, 'src', 'nunjucks.config.js');
const OUT_DIR = path.join(ROOT, 'dist');
const OUT_FILE = path.join(OUT_DIR, 'nhsw-nunjucks-components.zip');

function packageReadme(version) {
  return `# NHSW Nunjucks components v${version}

Every NHSW component as a Nunjucks macro (one per component, under
\`components/<name>/macro.njk\`), styled after the GOV.UK/NHS.UK frontend
libraries. Requires the NHSW Sass build (\`nhsw.css\`) to be loaded on the
page — these macros only render markup, not styles.

## Use with your own Nunjucks setup

Point your FileSystemLoader's search path at the extracted \`components/\`
directory, then import whatever you need:

\`\`\`js
const nunjucks = require('nunjucks');
nunjucks.configure('components', { autoescape: true });
\`\`\`

\`\`\`njk
{% from "button/macro.njk" import nhswButton %}
{{ nhswButton({ text: "Continue", classes: "nhsw-button--primary" }) }}
\`\`\`

Or pull every macro in at once with \`{% import "all-components.njk" as nhsw %}\`.

## Use the bundled loader

\`nunjucks.config.js\` is the same environment config this library's own
tests use — copy it alongside \`components/\` and call
\`configure({ ... }).renderString(...)\` / \`.render(...)\`.

## Docs

Every component's params and worked examples are documented in its
\`<name>.yaml\` file, and \`components/README.md\` covers the shared
conventions (form-group wrapping, label/hint/error composition, the
maxlength/character-count contract, etc).
`;
}

// src/components/ also holds the pre-existing Sass category folders
// (actions/, forms/, etc, each full of _*.scss partials) — only the flat
// dirs that actually contain a macro.njk are real Nunjucks components.
function findNjkComponentDirs() {
  return fs
    .readdirSync(COMPONENTS_SRC, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => fs.existsSync(path.join(COMPONENTS_SRC, name, 'macro.njk')));
}

function main() {
  const { version } = require(path.join(ROOT, 'package.json'));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const output = fs.createWriteStream(OUT_FILE);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`Wrote ${path.relative(ROOT, OUT_FILE)} (${archive.pointer()} bytes)`);
  });
  archive.on('warning', (err) => {
    throw err;
  });
  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  for (const name of findNjkComponentDirs()) {
    archive.directory(path.join(COMPONENTS_SRC, name), `components/${name}`);
  }
  archive.file(path.join(COMPONENTS_SRC, 'all-components.njk'), { name: 'components/all-components.njk' });
  archive.file(path.join(COMPONENTS_SRC, 'README.md'), { name: 'components/README.md' });
  archive.file(NUNJUCKS_CONFIG_SRC, { name: 'nunjucks.config.js' });
  archive.append(packageReadme(version), { name: 'README.md' });
  archive.finalize();
}

main();
