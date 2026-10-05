import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { runScript } from '../support/load-script.js';

// Covers dist/nhsw-behaviours.js — the shipped component behaviour that
// ships in releases (alongside nhsw-date-picker.js) for any app consuming
// the Nunjucks macros directly, not just this docs site. Docs-site-only
// authoring tooling (code samples, the HTML/Figma reveal toggle) is
// separate: preview/assets/nhsw-docs.js, tested in docs-behaviors.test.js.
//
// Runs against both the source and minified build so a bad esbuild
// upgrade, or a hand-edit of the .min.js, would fail CI rather than only
// showing up once a consuming app hits it in production.
const BUILDS = [
  ['source', 'dist/nhsw-behaviours.js'],
  ['minified', 'dist/nhsw-behaviours.min.js'],
];

function setBody(html) {
  document.body.innerHTML = html;
}

describe.each(BUILDS)('nhsw-behaviours.js (%s)', (label, SCRIPT) => {
  describe('character counter (data-max-length)', () => {
    const COUNT_HTML = `
      <textarea id="ta" maxlength="10" aria-describedby="ta-count" data-max-length="10" data-max-length-target="ta-count"></textarea>
      <div class="nhsw-hint nhsw-textarea__count" id="ta-count">You have 10 characters remaining</div>
    `;
    const field = () => document.getElementById('ta');
    const description = () => document.getElementById('ta-count');
    const visible = () => document.querySelector('.nhsw-character-count__status');
    const screenReader = () => document.querySelector('.nhsw-character-count__sr-status');
    const type = (value) => {
      field().value = value;
      field().dispatchEvent(new Event('input'));
    };

    beforeEach(() => {
      setBody(COUNT_HTML);
      runScript(SCRIPT);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe('structure, matching the NHS.UK character count', () => {
      it('creates its single live region from script, so the page never loads with a live region that then changes', () => {
        setBody(COUNT_HTML);
        expect(document.querySelectorAll('[aria-live]')).toHaveLength(0);
        runScript(SCRIPT);
        const regions = document.querySelectorAll('[aria-live]');
        expect(regions).toHaveLength(1);
        expect(regions[0]).toBe(screenReader());
        expect(regions[0].getAttribute('aria-live')).toBe('polite');
        expect(regions[0].classList.contains('nhsw-visually-hidden')).toBe(true);
      });

      it('hides the visible count from assistive technology, so the count is not read twice', () => {
        expect(visible().getAttribute('aria-hidden')).toBe('true');
        expect(visible().classList.contains('nhsw-textarea__count')).toBe(true);
        expect(visible().textContent).toBe('You have 10 characters remaining');
      });

      it('keeps the original count element as the textarea description, visually hidden, so it is read when the field is focused', () => {
        expect(field().getAttribute('aria-describedby')).toBe('ta-count');
        expect(description().classList.contains('nhsw-visually-hidden')).toBe(true);
        expect(description().hasAttribute('aria-live')).toBe(false);
        expect(description().hasAttribute('aria-hidden')).toBe(false);
      });

      it('removes the hard maxlength, so users can go over and are told, rather than being silently cut off', () => {
        expect(field().hasAttribute('maxlength')).toBe(false);
      });
    });

    describe('visible count', () => {
      it('shows the full count with no input', () => {
        expect(visible().textContent).toBe('You have 10 characters remaining');
      });

      it('counts down as the user types', () => {
        type('hello');
        expect(visible().textContent).toBe('You have 5 characters remaining');
      });

      it('uses the singular "character" when exactly 1 remains', () => {
        type('123456789');
        expect(visible().textContent).toBe('You have 1 character remaining');
      });

      it('switches to "too many" wording once the limit is exceeded, without throwing', () => {
        type('12345678901234');
        expect(visible().textContent).toBe('You have 4 characters too many');
      });

      it('uses the singular "character" when exactly 1 over the limit', () => {
        type('12345678901');
        expect(visible().textContent).toBe('You have 1 character too many');
      });

      it('adds the error class once over the limit, and removes it again if the user deletes back under', () => {
        expect(visible().classList.contains('nhsw-textarea__count--error')).toBe(false);
        type('12345678901234');
        expect(visible().classList.contains('nhsw-textarea__count--error')).toBe(true);
        type('hello');
        expect(visible().classList.contains('nhsw-textarea__count--error')).toBe(false);
      });

      it('keeps the description text current, silently, so returning to the field reads the real count and not a stale one', () => {
        type('hello');
        expect(description().textContent).toBe('You have 5 characters remaining');
      });
    });

    describe('screen reader announcements (same timing as NHS.UK: checked every 1000ms while focused, once typing has paused for 500ms)', () => {
      it('writes the starting count into the live region when the script runs', () => {
        expect(screenReader().textContent).toBe('You have 10 characters remaining');
      });

      it('does not announce on every keystroke', () => {
        vi.useFakeTimers();
        field().dispatchEvent(new Event('focus'));
        type('h');
        type('he');
        type('hel');
        expect(screenReader().textContent).toBe('You have 10 characters remaining');
        vi.advanceTimersByTime(999);
        expect(screenReader().textContent).toBe('You have 10 characters remaining');
      });

      it('announces the current count once typing has stopped', () => {
        vi.useFakeTimers();
        field().dispatchEvent(new Event('focus'));
        type('hello');
        vi.advanceTimersByTime(1000);
        expect(screenReader().textContent).toBe('You have 5 characters remaining');
      });

      it('waits while the user is still typing, then announces the latest count after they pause', () => {
        vi.useFakeTimers();
        field().dispatchEvent(new Event('focus'));
        type('hel');
        vi.advanceTimersByTime(900);
        type('hello w');
        vi.advanceTimersByTime(100);
        expect(screenReader().textContent).toBe('You have 10 characters remaining');
        vi.advanceTimersByTime(1000);
        expect(screenReader().textContent).toBe('You have 3 characters remaining');
      });

      it('announces "too many" wording through the live region once over the limit', () => {
        vi.useFakeTimers();
        field().dispatchEvent(new Event('focus'));
        type('12345678901234');
        vi.advanceTimersByTime(1000);
        expect(screenReader().textContent).toBe('You have 4 characters too many');
      });

      it('does not announce when the field is not focused', () => {
        vi.useFakeTimers();
        type('hello');
        vi.advanceTimersByTime(5000);
        expect(screenReader().textContent).toBe('You have 10 characters remaining');
      });

      it('stops checking once the field loses focus', () => {
        vi.useFakeTimers();
        field().dispatchEvent(new Event('focus'));
        field().dispatchEvent(new Event('blur'));
        type('hello');
        vi.advanceTimersByTime(5000);
        expect(screenReader().textContent).toBe('You have 10 characters remaining');
      });

      it('does not announce again if nothing has changed', () => {
        vi.useFakeTimers();
        field().dispatchEvent(new Event('focus'));
        type('hello');
        vi.advanceTimersByTime(1000);
        screenReader().textContent = 'sentinel';
        vi.advanceTimersByTime(3000);
        expect(screenReader().textContent).toBe('sentinel');
      });
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

  describe('tabs (.nhsw-tabs), matching the NHS.UK tabs', () => {
    const TABS_HTML = `
      <div class="nhsw-tabs">
        <ul class="nhsw-tabs__list" role="tablist">
          <li role="presentation"><button class="nhsw-tabs__tab nhsw-tabs__tab--selected" role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">One</button></li>
          <li role="presentation"><button class="nhsw-tabs__tab" role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2">Two</button></li>
          <li role="presentation"><button class="nhsw-tabs__tab" role="tab" id="tab-3" aria-selected="false" aria-controls="panel-3">Three</button></li>
        </ul>
        <div id="panel-1" class="nhsw-tabs__panel" role="tabpanel" aria-labelledby="tab-1">Panel one</div>
        <div id="panel-2" class="nhsw-tabs__panel nhsw-tabs__panel--hidden" role="tabpanel" aria-labelledby="tab-2">Panel two</div>
        <div id="panel-3" class="nhsw-tabs__panel nhsw-tabs__panel--hidden" role="tabpanel" aria-labelledby="tab-3">Panel three</div>
      </div>
    `;
    const tabs = () => [...document.querySelectorAll('.nhsw-tabs__tab')];
    const panel = (n) => document.getElementById(`panel-${n}`);
    const isHidden = (n) => panel(n).classList.contains('nhsw-tabs__panel--hidden');
    const isSelected = (tab) => tab.classList.contains('nhsw-tabs__tab--selected');
    const press = (tab, key) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      tab.dispatchEvent(event);
      return event;
    };

    // jsdom has no matchMedia, so the script treats it as a wide screen unless a
    // test supplies one. `setWide` plays a viewport resize across the breakpoint.
    function stubMatchMedia(wide) {
      const listeners = [];
      const mediaQuery = {
        matches: wide,
        addEventListener: (_type, listener) => listeners.push(listener),
        removeEventListener: () => {},
      };
      window.matchMedia = vi.fn(() => mediaQuery);
      return {
        setWide(next) {
          mediaQuery.matches = next;
          listeners.forEach((listener) => listener());
        },
      };
    }

    afterEach(() => {
      delete window.matchMedia;
    });

    describe('from the tablet breakpoint up (tabs)', () => {
      beforeEach(() => {
        setBody(TABS_HTML);
        runScript(SCRIPT);
      });

      it('asks for the same breakpoint the stylesheet uses (40.0625em)', () => {
        const media = stubMatchMedia(true);
        setBody(TABS_HTML);
        runScript(SCRIPT);
        expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 40.0625em)');
        expect(media).toBeDefined();
      });

      it('exposes the tablist, tab and tabpanel roles and links each panel back to its tab', () => {
        expect(document.querySelector('.nhsw-tabs__list').getAttribute('role')).toBe('tablist');
        expect(tabs().map((t) => t.getAttribute('role'))).toEqual(['tab', 'tab', 'tab']);
        expect(tabs().map((t) => t.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
        expect([1, 2, 3].map((n) => panel(n).getAttribute('role'))).toEqual(['tabpanel', 'tabpanel', 'tabpanel']);
        expect([1, 2, 3].map((n) => panel(n).getAttribute('aria-labelledby'))).toEqual(['tab-1', 'tab-2', 'tab-3']);
      });

      it('makes only the selected tab a tab stop, so Tab leaves the tab list for the panel (roving tabindex)', () => {
        expect(tabs().map((t) => t.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
      });

      it('activates the clicked tab, shows only its panel and moves the tab stop with it', () => {
        const [tab1, tab2] = tabs();
        tab2.dispatchEvent(new Event('click'));

        expect(isSelected(tab2)).toBe(true);
        expect(isSelected(tab1)).toBe(false);
        expect(tab2.getAttribute('aria-selected')).toBe('true');
        expect(tab1.getAttribute('aria-selected')).toBe('false');
        expect(tabs().map((t) => t.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
        expect(isHidden(2)).toBe(false);
        expect(isHidden(1)).toBe(true);
      });

      it('moves focus to the next tab and activates it on ArrowRight', () => {
        tabs()[0].focus();
        const event = press(tabs()[0], 'ArrowRight');

        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(tabs()[1]);
        expect(isSelected(tabs()[1])).toBe(true);
        expect(isHidden(2)).toBe(false);
        expect(tabs().map((t) => t.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
      });

      it('moves focus to the previous tab on ArrowLeft', () => {
        tabs()[1].dispatchEvent(new Event('click'));
        tabs()[1].focus();
        press(tabs()[1], 'ArrowLeft');

        expect(document.activeElement).toBe(tabs()[0]);
        expect(isSelected(tabs()[0])).toBe(true);
      });

      it('stops at the last tab on ArrowRight and the first tab on ArrowLeft, without wrapping (as NHS.UK does)', () => {
        tabs()[2].dispatchEvent(new Event('click'));
        tabs()[2].focus();
        press(tabs()[2], 'ArrowRight');
        expect(document.activeElement).toBe(tabs()[2]);
        expect(isSelected(tabs()[2])).toBe(true);

        tabs()[0].dispatchEvent(new Event('click'));
        tabs()[0].focus();
        press(tabs()[0], 'ArrowLeft');
        expect(document.activeElement).toBe(tabs()[0]);
        expect(isSelected(tabs()[0])).toBe(true);
      });

      it('leaves ArrowDown and ArrowUp alone, so a screen reader user can move down into the panel content', () => {
        tabs()[0].focus();
        for (const key of ['ArrowDown', 'ArrowUp']) {
          const event = press(tabs()[0], key);
          expect(event.defaultPrevented, `${key} must not be intercepted`).toBe(false);
          expect(isSelected(tabs()[0])).toBe(true);
          expect(document.activeElement).toBe(tabs()[0]);
        }
      });

      it('does not respond to unrelated keys', () => {
        tabs()[0].focus();
        const event = press(tabs()[0], 'Tab');
        expect(event.defaultPrevented).toBe(false);
        expect(isSelected(tabs()[0])).toBe(true);
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

    describe('below the tablet breakpoint (tabs switched off, all content shown)', () => {
      beforeEach(() => {
        stubMatchMedia(false);
        setBody(TABS_HTML);
        runScript(SCRIPT);
      });

      it('removes every tab role and state, so the tabs are announced as a plain list of controls', () => {
        const list = document.querySelector('.nhsw-tabs__list');
        expect(list.hasAttribute('role')).toBe(false);
        expect([...list.children].every((li) => !li.hasAttribute('role'))).toBe(true);
        for (const tab of tabs()) {
          for (const attribute of ['role', 'aria-selected', 'aria-controls', 'tabindex']) {
            expect(tab.hasAttribute(attribute), `${tab.id} should not have ${attribute}`).toBe(false);
          }
        }
        for (const n of [1, 2, 3]) {
          expect(panel(n).hasAttribute('role')).toBe(false);
          expect(panel(n).hasAttribute('aria-labelledby')).toBe(false);
        }
      });

      it('shows every panel', () => {
        expect([1, 2, 3].map(isHidden)).toEqual([false, false, false]);
      });

      it('keeps the tab ids, which other links on the page can point at', () => {
        expect(tabs().map((t) => t.id)).toEqual(['tab-1', 'tab-2', 'tab-3']);
      });

      it('jumps to the section when a tab is pressed, moving focus to its panel, and leaves every panel visible', () => {
        const event = new Event('click', { cancelable: true });
        tabs()[1].dispatchEvent(event);

        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(panel(2));
        expect(panel(2).getAttribute('tabindex')).toBe('-1');
        expect([1, 2, 3].map(isHidden)).toEqual([false, false, false]);
        expect(isSelected(tabs()[0])).toBe(true);
      });

      it('ignores the arrow keys, because there are no tabs to move between', () => {
        tabs()[0].focus();
        const event = press(tabs()[0], 'ArrowRight');
        expect(event.defaultPrevented).toBe(false);
        expect(document.activeElement).toBe(tabs()[0]);
      });
    });

    describe('resizing across the breakpoint', () => {
      it('switches the tabs on and off, remembering which tab was selected', () => {
        const media = stubMatchMedia(true);
        setBody(TABS_HTML);
        runScript(SCRIPT);

        tabs()[2].dispatchEvent(new Event('click'));
        expect([1, 2, 3].map(isHidden)).toEqual([true, true, false]);

        media.setWide(false);
        expect(document.querySelector('.nhsw-tabs__list').hasAttribute('role')).toBe(false);
        expect([1, 2, 3].map(isHidden)).toEqual([false, false, false]);

        media.setWide(true);
        expect(document.querySelector('.nhsw-tabs__list').getAttribute('role')).toBe('tablist');
        expect(isSelected(tabs()[2])).toBe(true);
        expect([1, 2, 3].map(isHidden)).toEqual([true, true, false]);
        expect(tabs().map((t) => t.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);
        expect(tabs().map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true']);
      });

      it('does not stack up duplicate listeners as it switches back and forth', () => {
        const media = stubMatchMedia(true);
        setBody(TABS_HTML);
        runScript(SCRIPT);

        media.setWide(false);
        media.setWide(true);
        media.setWide(false);
        media.setWide(true);

        tabs()[0].focus();
        press(tabs()[0], 'ArrowRight');
        expect(isSelected(tabs()[1])).toBe(true);
        expect(isSelected(tabs()[2])).toBe(false);
        expect(document.activeElement).toBe(tabs()[1]);
      });
    });
  });
});
