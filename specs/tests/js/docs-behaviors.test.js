import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { runScript } from '../support/load-script.js';

const SCRIPT = 'preview/assets/nhsw-docs.js';

function setBody(html) {
  document.body.innerHTML = html;
}

describe('character counter (data-max-length)', () => {
  beforeEach(() => {
    setBody(`
      <textarea id="ta" data-max-length="10" data-max-length-target="ta-count"></textarea>
      <span id="ta-count"></span>
    `);
    runScript(SCRIPT);
  });

  it('shows the full count with no input', () => {
    expect(document.getElementById('ta-count').textContent).toBe('You have 10 characters remaining');
  });

  it('counts down as the user types', () => {
    const field = document.getElementById('ta');
    field.value = 'hello';
    field.dispatchEvent(new Event('input'));
    expect(document.getElementById('ta-count').textContent).toBe('You have 5 characters remaining');
  });

  it('uses the singular "character" when exactly 1 remains', () => {
    const field = document.getElementById('ta');
    field.value = '123456789';
    field.dispatchEvent(new Event('input'));
    expect(document.getElementById('ta-count').textContent).toBe('You have 1 character remaining');
  });

  it('goes negative once the limit is exceeded, without throwing', () => {
    const field = document.getElementById('ta');
    field.value = '12345678901234';
    field.dispatchEvent(new Event('input'));
    expect(document.getElementById('ta-count').textContent).toBe('You have -4 characters remaining');
  });
});

describe('conditionally revealed content (data-aria-controls)', () => {
  beforeEach(() => {
    setBody(`
      <input type="checkbox" id="cb" data-aria-controls="reveal">
      <div id="reveal" class="nhsw-checkboxes__conditional nhsw-checkboxes__conditional--hidden"></div>
    `);
    runScript(SCRIPT);
  });

  it('wires aria-controls and aria-expanded from the checked state on load', () => {
    const input = document.getElementById('cb');
    expect(input.getAttribute('aria-controls')).toBe('reveal');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('reveals the target and updates aria-expanded when checked', () => {
    const input = document.getElementById('cb');
    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('reveal').classList.contains('nhsw-checkboxes__conditional--hidden')).toBe(false);
  });

  it('hides the target again when unchecked', () => {
    const input = document.getElementById('cb');
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    input.checked = false;
    input.dispatchEvent(new Event('change'));

    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById('reveal').classList.contains('nhsw-checkboxes__conditional--hidden')).toBe(true);
  });
});

describe('exclusive checkbox (data-checkbox-exclusive, e.g. "None of these")', () => {
  beforeEach(() => {
    setBody(`
      <input type="checkbox" name="opts" id="a" value="a">
      <input type="checkbox" name="opts" id="b" value="b">
      <input type="checkbox" name="opts" id="none" value="none" data-checkbox-exclusive>
    `);
    runScript(SCRIPT);
  });

  it('unchecks other options in the group when the exclusive option is checked', () => {
    document.getElementById('a').checked = true;
    document.getElementById('b').checked = true;
    const none = document.getElementById('none');
    none.checked = true;
    none.dispatchEvent(new Event('change'));

    expect(document.getElementById('a').checked).toBe(false);
    expect(document.getElementById('b').checked).toBe(false);
  });

  it('unchecks the exclusive option when any other option is checked', () => {
    const none = document.getElementById('none');
    none.checked = true;
    none.dispatchEvent(new Event('change'));

    const a = document.getElementById('a');
    a.checked = true;
    a.dispatchEvent(new Event('change'));

    expect(none.checked).toBe(false);
  });
});

describe('timeout countdown (data-nhsw-timeout-countdown)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setBody(`
      <dialog class="nhsw-timeout-modal" open>
        <span data-nhsw-timeout-countdown data-seconds="65">1 minute and 5 seconds</span>
        <span data-nhsw-timeout-live></span>
        <button data-nhsw-timeout-dismiss>Stay logged in</button>
      </dialog>
    `);
    // jsdom's <dialog> has no real close(); the component falls back to
    // removeAttribute('open') when .close is not a function, which is the
    // exact branch under test here.
    runScript(SCRIPT);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts down every second and pluralises correctly as minutes drop off', () => {
    const countdown = document.querySelector('[data-nhsw-timeout-countdown]');
    vi.advanceTimersByTime(1000);
    expect(countdown.textContent).toBe('1 minute and 4 seconds');

    vi.advanceTimersByTime(4000);
    expect(countdown.textContent).toBe('1 minute and 0 seconds');

    vi.advanceTimersByTime(1000);
    expect(countdown.textContent).toBe('59 seconds');
  });

  it('updates the live region only every 15 ticks', () => {
    const live = document.querySelector('[data-nhsw-timeout-live]');
    vi.advanceTimersByTime(14000);
    expect(live.textContent).toBe('');
    vi.advanceTimersByTime(1000);
    expect(live.textContent).toBe('50 seconds remaining');
  });

  it('stops the countdown and closes the dialog when dismissed', () => {
    const dialog = document.querySelector('.nhsw-timeout-modal');
    document.querySelector('[data-nhsw-timeout-dismiss]').dispatchEvent(new Event('click'));
    expect(dialog.hasAttribute('open')).toBe(false);

    const countdown = document.querySelector('[data-nhsw-timeout-countdown]');
    const textAfterDismiss = countdown.textContent;
    vi.advanceTimersByTime(5000);
    expect(countdown.textContent).toBe(textAfterDismiss);
  });
});

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

describe('expander (.nhsw-expander__button)', () => {
  beforeEach(() => {
    setBody(`
      <button class="nhsw-expander__button" aria-controls="exp-body" aria-expanded="false">Digital consent</button>
      <div id="exp-body" hidden></div>
    `);
    runScript(SCRIPT);
  });

  it('toggles aria-expanded and the hidden attribute on the controlled region', () => {
    const btn = document.querySelector('.nhsw-expander__button');
    btn.dispatchEvent(new Event('click'));
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('exp-body').hidden).toBe(false);

    btn.dispatchEvent(new Event('click'));
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById('exp-body').hidden).toBe(true);
  });
});

describe('tabs (.nhsw-tabs)', () => {
  beforeEach(() => {
    setBody(`
      <div class="nhsw-tabs">
        <ul class="nhsw-tabs__list">
          <li><button class="nhsw-tabs__tab nhsw-tabs__tab--selected" aria-selected="true" aria-controls="panel-1">One</button></li>
          <li><button class="nhsw-tabs__tab" aria-selected="false" aria-controls="panel-2">Two</button></li>
          <li><button class="nhsw-tabs__tab" aria-selected="false" aria-controls="panel-3">Three</button></li>
        </ul>
        <div id="panel-1" class="nhsw-tabs__panel">Panel one</div>
        <div id="panel-2" class="nhsw-tabs__panel nhsw-tabs__panel--hidden">Panel two</div>
        <div id="panel-3" class="nhsw-tabs__panel nhsw-tabs__panel--hidden">Panel three</div>
      </div>
    `);
    runScript(SCRIPT);
  });

  it('activates the clicked tab and shows only its panel', () => {
    const [tab1, tab2] = document.querySelectorAll('.nhsw-tabs__tab');
    tab2.dispatchEvent(new Event('click'));

    expect(tab2.classList.contains('nhsw-tabs__tab--selected')).toBe(true);
    expect(tab1.classList.contains('nhsw-tabs__tab--selected')).toBe(false);
    expect(document.getElementById('panel-2').classList.contains('nhsw-tabs__panel--hidden')).toBe(false);
    expect(document.getElementById('panel-1').classList.contains('nhsw-tabs__panel--hidden')).toBe(true);
  });

  it('moves focus to the next tab and activates it on ArrowRight, wrapping at the end', () => {
    const tabs = document.querySelectorAll('.nhsw-tabs__tab');
    tabs[2].focus();
    tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(document.activeElement).toBe(tabs[0]);
    expect(tabs[0].classList.contains('nhsw-tabs__tab--selected')).toBe(true);
  });

  it('moves focus to the previous tab on ArrowLeft, wrapping at the start', () => {
    const tabs = document.querySelectorAll('.nhsw-tabs__tab');
    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

    expect(document.activeElement).toBe(tabs[2]);
    expect(tabs[2].classList.contains('nhsw-tabs__tab--selected')).toBe(true);
  });

  it('does not respond to unrelated keys', () => {
    const tabs = document.querySelectorAll('.nhsw-tabs__tab');
    tabs[0].focus();
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(tabs[0].classList.contains('nhsw-tabs__tab--selected')).toBe(true);
  });

  it('does not wire up a nested .nhsw-tabs demo inside a panel a second time', () => {
    // Regression guard for the :scope-qualified selectors in nhsw-docs.js —
    // without :scope, a nested demo (like the one on the Tabs doc page itself)
    // would have its tabs double-bound by both the outer and inner querySelectorAll.
    setBody(`
      <div class="nhsw-tabs" id="outer">
        <ul class="nhsw-tabs__list">
          <li><button class="nhsw-tabs__tab nhsw-tabs__tab--selected" aria-selected="true" aria-controls="outer-panel">Outer tab</button></li>
        </ul>
        <div id="outer-panel" class="nhsw-tabs__panel">
          <div class="nhsw-tabs" id="inner">
            <ul class="nhsw-tabs__list">
              <li><button class="nhsw-tabs__tab nhsw-tabs__tab--selected" aria-selected="true" aria-controls="inner-panel">Inner tab</button></li>
            </ul>
            <div id="inner-panel" class="nhsw-tabs__panel">Inner content</div>
          </div>
        </div>
      </div>
    `);
    runScript(SCRIPT);

    const clickSpy = vi.fn();
    const innerTab = document.querySelector('#inner .nhsw-tabs__tab');
    innerTab.addEventListener('click', clickSpy);
    innerTab.dispatchEvent(new Event('click'));

    // one listener from the docs script + our spy = spy called exactly once
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
