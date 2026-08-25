'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { configure, COMPONENTS_ROOT } = require('../src/nunjucks.config');

const OUTPUT_ROOT = path.join(__dirname, '..', 'njk-preview');

function findYamlFiles() {
  return fs
    .readdirSync(COMPONENTS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .flatMap((name) => {
      const yamlPath = path.join(COMPONENTS_ROOT, name, `${name}.yaml`);
      return fs.existsSync(yamlPath) ? [{ name, yamlPath }] : [];
    });
}

function main() {
  const env = configure({ noCache: true });
  const components = findYamlFiles();

  let total = 0;
  let failed = 0;
  const failures = [];

  for (const { name, yamlPath } of components) {
    const spec = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
    const macroName = spec.macro;
    const examples = spec.examples || [];

    const outDir = path.join(OUTPUT_ROOT, name);
    fs.mkdirSync(outDir, { recursive: true });

    for (const example of examples) {
      total += 1;
      const isCall = Boolean(example.call);
      const template = isCall
        ? `{% from "${name}/macro.njk" import ${macroName} %}\n{% call ${macroName}(data) %}${example.content || ''}{% endcall %}`
        : `{% from "${name}/macro.njk" import ${macroName} %}\n{{ ${macroName}(data) }}`;

      try {
        const html = env.renderString(template, { data: example.data || {} });
        fs.writeFileSync(path.join(outDir, `${example.name}.html`), html, 'utf8');
      } catch (err) {
        failed += 1;
        failures.push({ name, example: example.name, error: err.message });
      }
    }
  }

  console.log(`Rendered ${total - failed}/${total} examples across ${components.length} components.`);
  if (failures.length) {
    console.log('\nFailures:');
    for (const f of failures) {
      console.log(`  ${f.name} / ${f.example}: ${f.error}`);
    }
    process.exitCode = 1;
  }
}

main();
