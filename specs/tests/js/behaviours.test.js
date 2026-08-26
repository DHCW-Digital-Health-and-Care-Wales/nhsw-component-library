import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { runScript } from '../support/load-script.js';

// Covers dist/nhsw-behaviours.js — the shipped component behaviour that
// ships in releases (alongside nhsw-date-picker.js) for any app consuming
// the Nunjucks macros directly, not just this docs site. Docs-site-only
// authoring tooling (code samples, the HTML/Figma reveal toggle) is
// separate: preview/assets/nhsw-docs.js, tested in docs-behaviors.test.js.
const SCRIPT = 'dist/nhsw-behaviours.js';

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
    expect(document.getElementById('ta-count').textContent).toBe('You have 4 characters too many');
  });

  it('uses the singular "character" when exactly 1 over the limit', () => {
    const field = document.getElementById('ta');
    field.value = '12345678901';
    field.dispatchEvent(new Event('input'));
    expect(document.getElementById('ta-count').textContent).toBe('You have 1 character too many');
  });

  it('adds the error class once over the limit, and removes it again if the user deletes back under', () => {
    const field = document.getElementById('ta');
    const counter = document.getElementById('ta-count');
    expect(counter.classList.contains('nhsw-textarea__count--error')).toBe(false);

    field.value = '12345678901234';
    field.dispatchEvent(new Event('input'));
    expect(counter.classList.contains('nhsw-textarea__count--error')).toBe(true);

    field.value = 'hello';
    field.dispatchEvent(new Event('input'));
    expect(counter.classList.contains('nhsw-textarea__count--error')).toBe(false);
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

  it('wires aria-controls from the checked state on load, without aria-expanded (invalid on checkbox/radio roles)', () => {
    const input = document.getElementById('cb');
    expect(input.getAttribute('aria-controls')).toBe('reveal');
    expect(input.hasAttribute('aria-expanded')).toBe(false);
  });

  it('reveals the target when checked', () => {
    const input = document.getElementById('cb');
    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(document.getElementById('reveal').classList.contains('nhsw-checkboxes__conditional--hidden')).toBe(false);
  });

  it('hides the target again when unchecked', () => {
    const input = document.getElementById('cb');
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    input.checked = false;
    input.dispatchEvent(new Event('change'));

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

describe('file upload (.nhsw-file-upload__input)', () => {
  beforeEach(() => {
    setBody(`
      <div class="nhsw-file-upload">
        <span class="nhsw-file-upload__status">No file chosen</span>
        <div class="nhsw-file-upload__actions">
          <input class="nhsw-file-upload__input" id="fu" type="file">
          <label class="nhsw-button nhsw-file-upload__button" for="fu">Choose file</label>
        </div>
      </div>
    `);
    runScript(SCRIPT);
  });

  function selectFile(name) {
    const input = document.getElementById('fu');
    Object.defineProperty(input, 'files', { value: [{ name }], configurable: true });
    input.dispatchEvent(new Event('change'));
    return input;
  }

  it('shows the selected file name and marks the status/container as filled', () => {
    selectFile('prescription.pdf');
    const status = document.querySelector('.nhsw-file-upload__status');
    expect(status.textContent).toBe('prescription.pdf');
    expect(status.classList.contains('nhsw-file-upload__status--filled')).toBe(true);
    expect(document.querySelector('.nhsw-file-upload').classList.contains('nhsw-file-upload--has-file')).toBe(true);
  });

  it('reverts to the original status text if the selection is cleared', () => {
    const input = selectFile('prescription.pdf');
    Object.defineProperty(input, 'files', { value: [], configurable: true });
    input.dispatchEvent(new Event('change'));
    const status = document.querySelector('.nhsw-file-upload__status');
    expect(status.textContent).toBe('No file chosen');
    expect(status.classList.contains('nhsw-file-upload__status--filled')).toBe(false);
    expect(document.querySelector('.nhsw-file-upload').classList.contains('nhsw-file-upload--has-file')).toBe(false);
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
    // Regression guard for the :scope-qualified selectors in
    // nhsw-behaviours.js — without :scope, a nested demo (like the one on
    // the Tabs doc page itself) would have its tabs double-bound by both
    // the outer and inner querySelectorAll.
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

    // one listener from the behaviours script + our spy = spy called exactly once
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
