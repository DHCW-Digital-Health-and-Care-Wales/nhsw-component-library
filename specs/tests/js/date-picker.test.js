import { describe, it, expect, beforeEach, vi } from 'vitest';
import { runScript } from '../support/load-script.js';

const SCRIPT = 'dist/nhsw-date-picker.js';

function buildMinimalPicker({ value = '', disabled = false } = {}) {
  document.body.innerHTML = `
    <div class="nhsw-form-group">
      <label class="nhsw-label" for="booking-date">Booking date</label>
      <div class="nhsw-hint" id="booking-date-hint">For example, 27-Jun-2025</div>
      <div class="nhsw-date-picker"
        data-module="nhsw-date-picker"
        data-input-id="booking-date"
        data-input-name="booking-date"
        data-describedby="booking-date-hint"
        ${value ? `data-value="${value}"` : ''}
        ${disabled ? 'data-disabled' : ''}
      ></div>
    </div>
  `;
  runScript(SCRIPT);
  return {
    root: document.querySelector('.nhsw-date-picker'),
    input: document.getElementById('booking-date'),
    toggle: document.querySelector('.nhsw-date-picker__toggle'),
    dialog: document.querySelector('.nhsw-date-picker__dialog'),
  };
}

describe('NhswDatePicker — minimal hook markup', () => {
  it('builds the input, toggle button and dialog from data-* attributes', () => {
    const { input, toggle, dialog } = buildMinimalPicker();
    expect(input).not.toBeNull();
    expect(input.getAttribute('placeholder')).toBe('DD-MMM-YYYY');
    expect(input.getAttribute('aria-describedby')).toBe('booking-date-hint');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-haspopup')).toBe('dialog');
    expect(dialog.hasAttribute('hidden')).toBe(true);
  });

  it('derives the toggle button\'s accessible name from the <label for>', () => {
    const { toggle } = buildMinimalPicker();
    expect(toggle.getAttribute('aria-label')).toBe('Open calendar for Booking date');
  });

  it('does not rebuild chrome for markup that already has a toggle button (full HTML reference pattern)', () => {
    document.body.innerHTML = `
      <div class="nhsw-date-picker" data-module="nhsw-date-picker">
        <div class="nhsw-date-picker__input-group">
          <input class="nhsw-input nhsw-date-picker__input" id="custom-date" type="text">
          <button class="nhsw-date-picker__toggle" type="button" aria-expanded="false" aria-haspopup="dialog">Open</button>
        </div>
        <div class="nhsw-date-picker__dialog" role="dialog" aria-modal="true" hidden>
          <div class="nhsw-date-picker__dialog-header">
            <button class="nhsw-date-picker__nav-button nhsw-date-picker__prev-year-button">«</button>
            <button class="nhsw-date-picker__nav-button nhsw-date-picker__prev-button">‹</button>
            <span class="nhsw-date-picker__month-year"></span>
            <button class="nhsw-date-picker__nav-button nhsw-date-picker__next-button">›</button>
            <button class="nhsw-date-picker__nav-button nhsw-date-picker__next-year-button">»</button>
          </div>
          <table class="nhsw-date-picker__calendar"><tbody></tbody></table>
          <div class="nhsw-date-picker__dialog-footer">
            <button class="nhsw-date-picker__cancel-button">Cancel</button>
            <button class="nhsw-date-picker__ok-button">OK</button>
          </div>
        </div>
      </div>
    `;
    const marker = document.getElementById('custom-date');
    runScript(SCRIPT);
    // same element instance survives — proves _buildHTML's innerHTML rewrite was skipped
    expect(document.getElementById('custom-date')).toBe(marker);
  });
});

describe('NhswDatePicker — open, close and disabled state', () => {
  it('opens the calendar dialog and marks the toggle expanded on click', () => {
    const { toggle, dialog } = buildMinimalPicker();
    toggle.dispatchEvent(new Event('click'));
    expect(dialog.hasAttribute('hidden')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes again on a second toggle click', () => {
    const { toggle, dialog } = buildMinimalPicker();
    toggle.dispatchEvent(new Event('click'));
    toggle.dispatchEvent(new Event('click'));
    expect(dialog.hasAttribute('hidden')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on Escape and returns focus to the toggle button', () => {
    const { toggle, dialog } = buildMinimalPicker();
    toggle.dispatchEvent(new Event('click'));
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(dialog.hasAttribute('hidden')).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  it('closes when a click lands outside the component', () => {
    const { toggle, dialog, root } = buildMinimalPicker();
    toggle.dispatchEvent(new Event('click'));
    expect(dialog.hasAttribute('hidden')).toBe(false);

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new Event('click', { bubbles: true }));

    expect(dialog.hasAttribute('hidden')).toBe(true);
    expect(root.contains(outside)).toBe(false);
  });

  it('does nothing when the toggle is disabled', () => {
    const { toggle, dialog } = buildMinimalPicker({ disabled: true });
    expect(toggle.disabled).toBe(true);
    toggle.dispatchEvent(new Event('click'));
    expect(dialog.hasAttribute('hidden')).toBe(true);
  });
});

describe('NhswDatePicker — parsing a pre-filled input value', () => {
  it('parses a valid DD-MMM-YYYY value and highlights that day as pending on open', () => {
    const { toggle, dialog } = buildMinimalPicker({ value: '15-Sep-2025' });
    toggle.dispatchEvent(new Event('click'));

    const pending = dialog.querySelector('.nhsw-date-picker__day--pending');
    expect(pending).not.toBeNull();
    expect(pending.getAttribute('data-date')).toBe('2025-09-15');
    expect(dialog.querySelector('.nhsw-date-picker__month-year').textContent).toBe('September 2025');
  });

  it('falls back to today when the input is empty', () => {
    const { toggle, dialog } = buildMinimalPicker();
    toggle.dispatchEvent(new Event('click'));

    const pending = dialog.querySelector('.nhsw-date-picker__day--pending');
    const today = new Date();
    const expected = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    expect(pending.getAttribute('data-date')).toBe(expected);
  });

  it('falls back to today when the input holds an unparseable value (e.g. a real calendar date that does not exist)', () => {
    const { toggle, dialog } = buildMinimalPicker({ value: '31-Feb-2025' });
    toggle.dispatchEvent(new Event('click'));

    const today = new Date();
    expect(dialog.querySelector('.nhsw-date-picker__month-year').textContent).toBe(
      ['January','February','March','April','May','June','July','August','September','October','November','December'][today.getMonth()] + ' ' + today.getFullYear()
    );
  });
});

describe('NhswDatePicker — confirming a date', () => {
  it('writes the chosen date back to the input in DD-MMM-YYYY format and closes', () => {
    const { toggle, dialog, input } = buildMinimalPicker({ value: '15-Sep-2025' });
    toggle.dispatchEvent(new Event('click'));
    dialog.querySelector('.nhsw-date-picker__ok-button').dispatchEvent(new Event('click'));

    expect(input.value).toBe('15-Sep-2025');
    expect(dialog.hasAttribute('hidden')).toBe(true);
  });

  it('dispatches a bubbling change event on the input when confirmed', () => {
    const { toggle, dialog, input } = buildMinimalPicker({ value: '15-Sep-2025' });
    const handler = vi.fn();
    input.addEventListener('change', handler);

    toggle.dispatchEvent(new Event('click'));
    dialog.querySelector('.nhsw-date-picker__ok-button').dispatchEvent(new Event('click'));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('clicking a day in the grid selects it, then OK confirms that day', () => {
    const { toggle, dialog, input } = buildMinimalPicker({ value: '15-Sep-2025' });
    toggle.dispatchEvent(new Event('click'));

    const target = dialog.querySelector('[data-date="2025-09-20"]');
    target.dispatchEvent(new Event('click'));
    expect(target.getAttribute('aria-selected')).toBe('true');

    dialog.querySelector('.nhsw-date-picker__ok-button').dispatchEvent(new Event('click'));
    expect(input.value).toBe('20-Sep-2025');
  });

  it('Cancel closes without writing to the input', () => {
    const { toggle, dialog, input } = buildMinimalPicker({ value: '15-Sep-2025' });
    toggle.dispatchEvent(new Event('click'));
    const target = dialog.querySelector('[data-date="2025-09-20"]');
    target.dispatchEvent(new Event('click'));

    dialog.querySelector('.nhsw-date-picker__cancel-button').dispatchEvent(new Event('click'));

    expect(input.value).toBe('15-Sep-2025');
    expect(dialog.hasAttribute('hidden')).toBe(true);
  });
});

describe('NhswDatePicker — keyboard navigation within the calendar grid', () => {
  function openAt(value) {
    const picker = buildMinimalPicker({ value });
    picker.toggle.dispatchEvent(new Event('click'));
    return picker;
  }

  function pendingDate(dialog) {
    return dialog.querySelector('.nhsw-date-picker__day--pending').getAttribute('data-date');
  }

  it('ArrowRight/ArrowLeft move by 1 day', () => {
    const { dialog } = openAt('15-Sep-2025');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(pendingDate(dialog)).toBe('2025-09-16');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(pendingDate(dialog)).toBe('2025-09-14');
  });

  it('updates aria-selected on the newly focused day and clears it from the previous one, within the same month', () => {
    // Regression guard: keyboard navigation used to move focus/tabindex without
    // re-rendering, so aria-selected stayed stuck on the original day and never
    // reflected the actually-focused day to screen reader users.
    const { dialog } = openAt('15-Sep-2025');
    const day15 = dialog.querySelector('[data-date="2025-09-15"]');
    expect(day15.getAttribute('aria-selected')).toBe('true');

    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    const day16 = dialog.querySelector('[data-date="2025-09-16"]');
    expect(day16.getAttribute('aria-selected')).toBe('true');
    expect(dialog.querySelector('[data-date="2025-09-15"]').getAttribute('aria-selected')).toBe('false');
  });

  it('ArrowDown/ArrowUp move by 1 week', () => {
    const { dialog } = openAt('15-Sep-2025');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(pendingDate(dialog)).toBe('2025-09-22');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(pendingDate(dialog)).toBe('2025-09-08');
  });

  it('Home moves to Monday of the current week, End moves to Sunday', () => {
    // 15 Sep 2025 is a Monday
    const { dialog } = openAt('18-Sep-2025'); // Thursday
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(pendingDate(dialog)).toBe('2025-09-15');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(pendingDate(dialog)).toBe('2025-09-21');
  });

  it('PageUp/PageDown move by 1 month, crossing a year boundary correctly', () => {
    const { dialog } = openAt('15-Jan-2025');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
    expect(dialog.querySelector('.nhsw-date-picker__month-year').textContent).toBe('December 2024');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
    expect(dialog.querySelector('.nhsw-date-picker__month-year').textContent).toBe('February 2025');
  });

  it('Shift+PageUp/PageDown move by 1 year', () => {
    const { dialog } = openAt('15-Sep-2025');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', shiftKey: true, bubbles: true }));
    expect(dialog.querySelector('.nhsw-date-picker__month-year').textContent).toBe('September 2024');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', shiftKey: true, bubbles: true }));
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', shiftKey: true, bubbles: true }));
    expect(dialog.querySelector('.nhsw-date-picker__month-year').textContent).toBe('September 2026');
  });

  it('Enter confirms the focused day and closes the dialog', () => {
    const { dialog, input } = openAt('15-Sep-2025');
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(input.value).toBe('16-Sep-2025');
    expect(dialog.hasAttribute('hidden')).toBe(true);
  });

  it('ignores day-navigation keys entirely once the dialog is closed', () => {
    const { dialog, toggle } = openAt('15-Sep-2025');
    toggle.dispatchEvent(new Event('click')); // close
    expect(() => dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))).not.toThrow();
    expect(dialog.hasAttribute('hidden')).toBe(true);
  });
});

describe('NhswDatePicker — quick-shortcut buttons', () => {
  it('the "Today" shortcut sets the pending date to today and re-renders the visible month', () => {
    const { toggle, dialog } = buildMinimalPicker({ value: '15-Jan-2020' });
    toggle.dispatchEvent(new Event('click'));
    dialog.querySelector('[data-offset-days="0"]').dispatchEvent(new Event('click'));

    const today = new Date();
    const expected = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    expect(dialog.querySelector('.nhsw-date-picker__day--pending').getAttribute('data-date')).toBe(expected);
  });

  it('the "+1 week" shortcut moves 7 days ahead of today', () => {
    const { toggle, dialog } = buildMinimalPicker();
    toggle.dispatchEvent(new Event('click'));
    dialog.querySelector('[data-offset-days="7"]').dispatchEvent(new Event('click'));

    const target = new Date();
    target.setDate(target.getDate() + 7);
    const expected = target.getFullYear() + '-' + String(target.getMonth() + 1).padStart(2, '0') + '-' + String(target.getDate()).padStart(2, '0');
    expect(dialog.querySelector('.nhsw-date-picker__day--pending').getAttribute('data-date')).toBe(expected);
  });
});

describe('NhswDatePicker.initAll', () => {
  it('initialises every [data-module="nhsw-date-picker"] element within a given scope', () => {
    document.body.innerHTML = `
      <div class="nhsw-date-picker" data-module="nhsw-date-picker" data-input-id="a"></div>
      <div class="nhsw-date-picker" data-module="nhsw-date-picker" data-input-id="b"></div>
    `;
    runScript(SCRIPT);
    expect(document.querySelectorAll('.nhsw-date-picker__toggle').length).toBe(2);
  });
});
