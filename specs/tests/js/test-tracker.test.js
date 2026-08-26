import { describe, it, expect, beforeEach } from 'vitest';
import { runScript } from '../support/load-script.js';

const SCRIPT = 'preview/assets/nhsw-test-tracker.js';

function setBody(html) {
  document.body.innerHTML = html;
}

describe('manual test tracker (data-module="nhsw-test-tracker")', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('counts only the checklist\'s own checkboxes, not ones nested inside a live example', () => {
    setBody(`
      <div data-module="nhsw-test-tracker" data-tracker-key="checkboxes-test">
        <p><strong data-tracker-count></strong></p>
        <fieldset>
          <div class="nhsw-checkboxes">
            <div class="nhsw-checkboxes__item">
              <input class="nhsw-checkboxes__input" id="item-1" type="checkbox">
              <div class="nhsw-example-preview">
                <div class="nhsw-example-preview__body">
                  <input id="demo-1" type="checkbox">
                  <input id="demo-2" type="checkbox">
                </div>
              </div>
            </div>
            <div class="nhsw-checkboxes__item">
              <input class="nhsw-checkboxes__input" id="item-2" type="checkbox">
            </div>
          </div>
        </fieldset>
      </div>
    `);
    runScript(SCRIPT);
    expect(document.querySelector('[data-tracker-count]').textContent).toBe('0 of 2 checks complete');
  });

  it('updates the count when a checklist item is ticked, ignoring demo checkboxes', () => {
    setBody(`
      <div data-module="nhsw-test-tracker" data-tracker-key="checkboxes-test-2">
        <p><strong data-tracker-count></strong></p>
        <fieldset>
          <div class="nhsw-checkboxes">
            <div class="nhsw-checkboxes__item">
              <input class="nhsw-checkboxes__input" id="item-a" type="checkbox">
              <div class="nhsw-example-preview">
                <div class="nhsw-example-preview__body">
                  <input id="demo-a" type="checkbox">
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    `);
    runScript(SCRIPT);
    const demoBox = document.getElementById('demo-a');
    demoBox.checked = true;
    demoBox.dispatchEvent(new Event('change'));
    expect(document.querySelector('[data-tracker-count]').textContent).toBe('0 of 1 checks complete');

    const itemBox = document.getElementById('item-a');
    itemBox.checked = true;
    itemBox.dispatchEvent(new Event('change'));
    expect(document.querySelector('[data-tracker-count]').textContent).toBe('1 of 1 checks complete');
  });
});
