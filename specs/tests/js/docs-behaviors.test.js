import { describe, it, expect, beforeEach, vi } from 'vitest';
import { runScript } from '../support/load-script.js';

// Covers only the docs-site's own authoring tooling (code samples, the
// HTML/Figma reveal toggle) — not real component behaviour. That's shipped
// separately as dist/nhsw-behaviours.js and tested in behaviours.test.js.
const SCRIPT = 'preview/assets/nhsw-docs.js';

function setBody(html) {
  document.body.innerHTML = html;
}

describe('code viewer tabs (data-module="nhsw-code-viewer")', () => {
  beforeEach(() => {
    setBody(`
      <div data-module="nhsw-code-viewer">
        <button class="nhsw-code-viewer__tab nhsw-code-viewer__tab--active" aria-selected="true" aria-controls="panel-html">HTML</button>
        <button class="nhsw-code-viewer__tab" aria-selected="false" aria-controls="panel-njk">Nunjucks</button>
        <div id="panel-html" class="nhsw-code-viewer__panel"><code>&lt;div&gt;html&lt;/div&gt;</code></div>
        <div id="panel-njk" class="nhsw-code-viewer__panel nhsw-code-viewer__panel--hidden"><code>{{ macro() }}</code></div>
        <button class="nhsw-code-viewer__copy">Copy code</button>
      </div>
    `);
    runScript(SCRIPT);
  });

  it('switches the active tab and panel on click', () => {
    const [htmlTab, njkTab] = document.querySelectorAll('.nhsw-code-viewer__tab');
    njkTab.dispatchEvent(new Event('click'));

    expect(njkTab.classList.contains('nhsw-code-viewer__tab--active')).toBe(true);
    expect(njkTab.getAttribute('aria-selected')).toBe('true');
    expect(htmlTab.classList.contains('nhsw-code-viewer__tab--active')).toBe(false);
    expect(htmlTab.getAttribute('aria-selected')).toBe('false');

    expect(document.getElementById('panel-njk').classList.contains('nhsw-code-viewer__panel--hidden')).toBe(false);
    expect(document.getElementById('panel-html').classList.contains('nhsw-code-viewer__panel--hidden')).toBe(true);
  });

  it('copies the currently visible panel\'s code, not the hidden one', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    document.querySelector('.nhsw-code-viewer__copy').dispatchEvent(new Event('click'));

    expect(writeText).toHaveBeenCalledWith('<div>html</div>');
  });

  it('shows "Copied!" feedback and reverts it after 2 seconds', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const copyBtn = document.querySelector('.nhsw-code-viewer__copy');
    copyBtn.dispatchEvent(new Event('click'));
    await vi.waitFor(() => expect(copyBtn.textContent).toBe('Copied!'));

    vi.advanceTimersByTime(2000);
    expect(copyBtn.textContent).toBe('Copy code');
    vi.useRealTimers();
  });
});

describe('example-preview HTML/Figma toggle', () => {
  beforeEach(() => {
    setBody(`
      <button class="nhsw-example-preview__footer-button" data-toggle="code-x" aria-controls="code-x" aria-expanded="false">HTML</button>
      <div id="code-x" hidden></div>
    `);
    runScript(SCRIPT);
  });

  it('un-hides the target and flips aria-expanded on click, and re-hides on a second click', () => {
    const btn = document.querySelector('[data-toggle]');
    btn.dispatchEvent(new Event('click'));
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('code-x').hidden).toBe(false);

    btn.dispatchEvent(new Event('click'));
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById('code-x').hidden).toBe(true);
  });
});
