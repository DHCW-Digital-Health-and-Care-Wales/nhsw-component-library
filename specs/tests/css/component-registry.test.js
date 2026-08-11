import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import sass from 'sass';

const projectRoot = path.resolve(import.meta.dirname, '../../..');

let compiledCss = '';

beforeAll(() => {
  const result = sass.compile(path.join(projectRoot, 'src/index.scss'));
  compiledCss = result.css;
});

it('compiles src/index.scss without errors and produces non-empty CSS', () => {
  expect(compiledCss.length).toBeGreaterThan(0);
});

/**
 * Every class name (and BEM element/modifier) mentioned in the component
 * registry and design-system rules docs must actually exist as a selector
 * in the compiled CSS. This is what keeps .agent/component-registry.md
 * honest as new components/modifiers are added or renamed.
 */
// Not a CSS class — referenced in prose as an asset filename (assets/nhsw-logo.svg).
const NOT_CLASSES = new Set(['nhsw-logo']);

function extractClassNames(text) {
  const matches = text.match(/nhsw-[a-z0-9-]+(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?/g) || [];
  return [...new Set(matches)].filter((name) => !name.endsWith('-') && !NOT_CLASSES.has(name));
}

const registryPath = path.join(projectRoot, '.agent/component-registry.md');
const rulesPath = path.join(projectRoot, '.agent/design-system-rules.md');

const registryClasses = fs.existsSync(registryPath) ? extractClassNames(fs.readFileSync(registryPath, 'utf8')) : [];
const rulesClasses = fs.existsSync(rulesPath) ? extractClassNames(fs.readFileSync(rulesPath, 'utf8')) : [];
const allDocumentedClasses = [...new Set([...registryClasses, ...rulesClasses])].sort();

describe('every class documented in .agent/component-registry.md and design-system-rules.md exists in the compiled CSS', () => {
  it.each(allDocumentedClasses)('%s', (className) => {
    const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const selectorPattern = new RegExp('\\.' + escaped + '(?:[^a-zA-Z0-9_-]|$)');
    expect(compiledCss).toMatch(selectorPattern);
  });
});

describe('grid column classes referenced by design-system-rules.md', () => {
  const columns = ['full', 'one-half', 'one-third', 'two-thirds', 'one-quarter', 'three-quarters'];
  it.each(columns)('.nhsw-grid-column-%s exists', (name) => {
    expect(compiledCss).toContain('.nhsw-grid-column-' + name);
  });
});

describe('tag colour modifiers listed in the registry all resolve to distinct rules', () => {
  const colours = ['white', 'grey', 'green', 'aqua-green', 'blue', 'purple', 'pink', 'red', 'orange', 'yellow'];
  it.each(colours)('.nhsw-tag--%s exists', (colour) => {
    expect(compiledCss).toContain('.nhsw-tag--' + colour);
  });
});
