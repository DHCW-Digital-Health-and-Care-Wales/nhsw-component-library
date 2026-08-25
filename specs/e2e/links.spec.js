const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Crawls every rendered page for internal <a href> links and asserts each
// target actually resolves (200), so a broken/placeholder link doesn't slip
// back in unnoticed. Intentional "#" placeholders (documented external
// resources with no real target yet) and mailto:/external links are skipped.

const SITE_DIR = path.join(__dirname, '..', '..', 'preview', '_site_test');

function listRenderedPages() {
  const results = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) results.push(path.relative(SITE_DIR, full).split(path.sep).join('/'));
    }
  })(SITE_DIR);
  return results;
}

function extractInternalLinks(html) {
  const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((m) => m[1]);
  return hrefs.filter((href) => href.startsWith('/') && !href.startsWith('//'));
}

test.describe('No broken internal links', () => {
  const pages = listRenderedPages();

  // One assertion per rendered page keeps a single 404 from hiding every
  // other page's result behind it, and pinpoints exactly which page/link
  // broke instead of just "something on the site is broken".
  for (const relPath of pages) {
    test(`links on /${relPath} all resolve`, async ({ page, request, baseURL }) => {
      const html = fs.readFileSync(path.join(SITE_DIR, relPath), 'utf8');
      const links = [...new Set(extractInternalLinks(html))];

      const broken = [];
      for (const href of links) {
        const target = href.split('#')[0]; // strip in-page anchors
        if (!target) continue; // pure "#top" anchor
        const res = await request.get(new URL(target, baseURL).toString());
        if (res.status() >= 400) broken.push(`${href} -> ${res.status()}`);
      }

      expect(broken, `broken links found on /${relPath}`).toEqual([]);
    });
  }
});
