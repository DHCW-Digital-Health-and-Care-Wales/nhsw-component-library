import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '../../..');

function findDocPages() {
  const dirs = ['actions', 'callouts', 'components', 'content', 'forms', 'site'];
  const files = [];
  for (const dir of dirs) {
    const full = path.join(projectRoot, 'preview', dir);
    if (!fs.existsSync(full)) continue;
    for (const entry of fs.readdirSync(full)) {
      if (entry.endsWith('.html') && entry !== 'index.html') {
        files.push(path.join('preview', dir, entry));
      }
    }
  }
  return files.sort();
}

// Pages where an example-preview.html include is intentionally not paired
// with a code-viewer.html include, because the code was already taught by an
// earlier example on the same page (see the page for the reasoning):
//  - panel.html: white/navy pairs after the "Blue background" section reuse
//    the --navy modifier code shown there; only the white variant repeats code.
const KNOWN_EXCEPTIONS = new Set([
  'preview/content/panel.html',
]);

describe('every live component preview has a matching code sample', () => {
  const pages = findDocPages();

  it.each(pages)('%s', (relativePath) => {
    const text = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
    const previewCount = (text.match(/\{%\s*include\s+example-preview\.html/g) || []).length;
    const codeViewerCount = (text.match(/\{%\s*include\s+code-viewer\.html/g) || []).length;

    if (KNOWN_EXCEPTIONS.has(relativePath)) {
      // still assert code-viewer isn't accidentally removed entirely
      expect(codeViewerCount).toBeGreaterThan(0);
      return;
    }

    expect(codeViewerCount).toBe(previewCount);
  });
});

describe('no empty html_sample or njk_sample captures', () => {
  const pages = findDocPages();
  const captureRe = /\{%\s*capture\s+(html_sample|njk_sample)\s*%\}\{%\s*raw\s*%\}([\s\S]*?)\{%\s*endraw\s*%\}\{%\s*endcapture\s*%\}/g;

  it.each(pages)('%s', (relativePath) => {
    const text = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
    let match;
    const empties = [];
    while ((match = captureRe.exec(text))) {
      if (!match[2].trim()) empties.push(match[1]);
    }
    expect(empties).toEqual([]);
  });
});

describe('the "Examples" tab consistently uses screenshot-placeholder.html, not a live component preview', () => {
  // Established site-wide convention: the Examples tab shows a mocked-up
  // "real product" screenshot, not a re-rendered live component (that's what
  // How to use / Variants are for). warning-text.html used to be the lone
  // exception — see the earlier fix for that page.
  const pages = findDocPages();

  it.each(pages)('%s', (relativePath) => {
    const text = fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
    const examplesTabMatch = text.match(/id="panel-examples"[\s\S]*$/);
    if (!examplesTabMatch) return; // no Examples tab on this page
    const examplesTabHtml = examplesTabMatch[0];
    expect(examplesTabHtml).not.toMatch(/\{%\s*include\s+example-preview\.html/);
  });
});
