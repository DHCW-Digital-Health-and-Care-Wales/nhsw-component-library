import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { load as loadYaml } from 'js-yaml';
import { configure, COMPONENTS_ROOT } from '../../../src/nunjucks.config.js';

const componentDirs = fs
  .readdirSync(COMPONENTS_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(COMPONENTS_ROOT, name, `${name}.yaml`)))
  .sort();

describe('every component macro has a yaml spec with at least one example', () => {
  it.each(componentDirs)('%s', (name) => {
    const spec = loadYaml(fs.readFileSync(path.join(COMPONENTS_ROOT, name, `${name}.yaml`), 'utf8'));
    expect(spec.macro, `${name}.yaml is missing a "macro" field`).toBeTruthy();
    expect(Array.isArray(spec.examples) && spec.examples.length > 0, `${name}.yaml has no examples`).toBe(true);
  });
});

describe('every yaml example renders through its macro without throwing, and produces real markup', () => {
  const env = configure({ noCache: true, throwOnUndefined: false });

  for (const name of componentDirs) {
    const spec = loadYaml(fs.readFileSync(path.join(COMPONENTS_ROOT, name, `${name}.yaml`), 'utf8'));
    const macroName = spec.macro;

    for (const example of spec.examples) {
      it(`${name} / ${example.name}`, () => {
        const isCall = Boolean(example.call);
        const template = isCall
          ? `{% from "${name}/macro.njk" import ${macroName} %}\n{% call ${macroName}(data) %}${example.content || ''}{% endcall %}`
          : `{% from "${name}/macro.njk" import ${macroName} %}\n{{ ${macroName}(data) }}`;

        const html = env.renderString(template, { data: example.data || {} });

        expect(html.trim().length, 'rendered output should not be empty').toBeGreaterThan(0);
        expect(html, 'rendered output should contain an HTML element').toMatch(/<[a-z][\s\S]*>/i);
        expect(html, 'rendered output leaked an unrendered JS object').not.toMatch(/\[object Object\]/);
        expect(html, 'rendered output leaked the literal string "undefined"').not.toMatch(/>undefined</);
      });
    }
  }
});

describe('all-components.njk re-exports every macro under its namespace', () => {
  const env = configure({ noCache: true, throwOnUndefined: false });

  it.each(
    componentDirs
      .flatMap((name) => {
        const spec = loadYaml(fs.readFileSync(path.join(COMPONENTS_ROOT, name, `${name}.yaml`), 'utf8'));
        return [spec.macro];
      })
      .filter(Boolean)
  )('nhsw.%s is callable via the all-components import', (macroName) => {
    const template = `{% import "all-components.njk" as nhsw %}{% if nhsw.${macroName} %}present{% else %}missing{% endif %}`;
    const out = env.renderString(template, {});
    expect(out).toBe('present');
  });
});
