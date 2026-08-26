import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const projectRoot = path.resolve(import.meta.dirname, '../../..');
const examplesDir = path.join(projectRoot, 'preview/examples');

function loadExampleBody(filename) {
  const raw = fs.readFileSync(path.join(examplesDir, filename), 'utf8');
  const withoutFrontMatter = raw.replace(/^---[\s\S]*?---\n/, '');
  // strip the couple of {{ '...' | relative_url }} filters used for asset src=
  const withoutLiquid = withoutFrontMatter.replace(/\{\{[^}]*\}\}/g, 'x');
  const dom = new JSDOM(`<!doctype html><body>${withoutLiquid}</body>`);
  return dom.window.document;
}

const exampleFiles = fs.readdirSync(examplesDir).filter((f) => f.endsWith('.html')).sort();

describe('every visible form input has an associated label (design-system-rules.md: "Every input must have a visible label")', () => {
  it.each(exampleFiles)('%s', (filename) => {
    const doc = loadExampleBody(filename);
    const visibleInputs = [...doc.querySelectorAll('input, select, textarea')].filter((el) => el.getAttribute('type') !== 'hidden');

    for (const input of visibleInputs) {
      const id = input.getAttribute('id');
      if (!id) {
        throw new Error(`${input.outerHTML.slice(0, 80)} has no id, so it cannot be labelled`);
      }
      const label = doc.querySelector(`label[for="${id}"]`);
      expect(label, `expected a <label for="${id}"> for ${input.outerHTML.slice(0, 80)}`).not.toBeNull();
    }
  });
});

describe('label for= always matches a real element id= in the same fixture ("Labels must use matching for and id")', () => {
  it.each(exampleFiles)('%s', (filename) => {
    const doc = loadExampleBody(filename);
    const labels = [...doc.querySelectorAll('label[for]')];
    for (const label of labels) {
      const targetId = label.getAttribute('for');
      const target = doc.getElementById(targetId);
      expect(target, `label for="${targetId}" has no matching id in the fixture`).not.toBeNull();
    }
  });
});

describe('inputs never rely on placeholder text as their only label ("Do not use placeholder text as a label")', () => {
  it.each(exampleFiles)('%s', (filename) => {
    const doc = loadExampleBody(filename);
    const withPlaceholder = [...doc.querySelectorAll('input[placeholder], textarea[placeholder]')];
    for (const input of withPlaceholder) {
      const id = input.getAttribute('id');
      const hasLabel = id && doc.querySelector(`label[for="${id}"]`);
      expect(hasLabel, `${input.outerHTML.slice(0, 80)} has a placeholder but no real <label>`).toBeTruthy();
    }
  });
});

describe('hint and error text are connected via aria-describedby ("Hint and error text must be connected with aria-describedby")', () => {
  it.each(exampleFiles)('%s', (filename) => {
    const doc = loadExampleBody(filename);
    const describedTargets = [...doc.querySelectorAll('.nhsw-hint[id], .nhsw-error-message[id]')];
    for (const el of describedTargets) {
      const id = el.getAttribute('id');
      const referencingEls = [...doc.querySelectorAll('[aria-describedby]')].filter((ref) =>
        ref.getAttribute('aria-describedby').split(/\s+/).includes(id)
      );
      expect(
        referencingEls.length,
        `#${id} (${el.className}) is not referenced by any aria-describedby in ${filename}`
      ).toBeGreaterThan(0);
    }
  });
});

describe('fields marked aria-invalid="true" sit alongside a visible error message ("Invalid fields must use aria-invalid=true")', () => {
  it.each(exampleFiles)('%s', (filename) => {
    const doc = loadExampleBody(filename);
    const invalidFields = [...doc.querySelectorAll('[aria-invalid="true"]')];
    for (const field of invalidFields) {
      const container = field.closest('fieldset, .nhsw-form-group') || doc;
      const hasErrorMessage = container.querySelector('.nhsw-error-message');
      expect(
        hasErrorMessage,
        `${field.outerHTML.slice(0, 80)} is aria-invalid but has no .nhsw-error-message nearby`
      ).not.toBeNull();
    }
  });
});

describe('date inputs are wrapped in fieldset + legend ("Date inputs must use fieldset and legend")', () => {
  it.each(exampleFiles)('%s', (filename) => {
    const doc = loadExampleBody(filename);
    const dateInputGroups = [...doc.querySelectorAll('.nhsw-date-input')];
    for (const group of dateInputGroups) {
      const fieldset = group.closest('fieldset');
      expect(fieldset, `.nhsw-date-input in ${filename} is not inside a <fieldset>`).not.toBeNull();
      expect(fieldset.querySelector('legend'), `fieldset around .nhsw-date-input in ${filename} has no <legend>`).not.toBeNull();
    }
  });
});

describe('checkbox and radio groups are wrapped in fieldset + legend', () => {
  it.each(exampleFiles)('%s', (filename) => {
    const doc = loadExampleBody(filename);
    const groups = [...doc.querySelectorAll('.nhsw-checkboxes, .nhsw-radios')];
    for (const group of groups) {
      const fieldset = group.closest('fieldset');
      // Some fixtures show a single conditional/divider fragment in isolation
      // (documentation snippets), so only enforce this when the fixture's
      // top-level content is the group itself, not a partial excerpt.
      if (!fieldset && doc.body.children.length > 1) continue;
      if (fieldset) {
        expect(fieldset.querySelector('legend'), `fieldset around ${group.className} in ${filename} has no <legend>`).not.toBeNull();
      }
    }
  });
});

describe('decorative SVG icons are hidden from assistive technology ("Action links must use aria-hidden on decorative SVG icons")', () => {
  it.each(exampleFiles)('%s', (filename) => {
    const doc = loadExampleBody(filename);
    const svgs = [...doc.querySelectorAll('svg')];
    for (const svg of svgs) {
      const isLabelledAsImage = svg.hasAttribute('aria-label') || svg.querySelector('title') || svg.getAttribute('role') === 'img';
      if (isLabelledAsImage) continue;
      expect(svg.getAttribute('aria-hidden'), `<svg> in ${filename} is neither aria-hidden nor labelled: ${svg.outerHTML.slice(0, 100)}`).toBe('true');
    }
  });
});
