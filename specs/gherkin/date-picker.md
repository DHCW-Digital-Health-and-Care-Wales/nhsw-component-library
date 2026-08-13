# Date picker

**Component classes:** `.nhsw-date-picker`, `__toggle`, `__dialog`, `__input`, `__calendar`, `__day--pending`, `__nav-button`, `__month-year`, `__ok-button`, `__cancel-button`
**Doc page:** `preview/forms/date-picker.html`
**Source:** `src/components/forms/_date-picker.scss`, behaviour in `dist/nhsw-date-picker.js`
**Example fixtures:** rendered live/inline on the doc page itself (does not use the example-preview.html pattern)

This is the most heavily automated component in the library — `specs/tests/js/date-picker.test.js` has 20+ scenarios. It is reproduced below, grouped to match the test file's own `describe` blocks.

## Automated test coverage

```gherkin
Feature: Date picker — automated coverage

  Rule: Minimal hook markup builds the full component

    @automated
    Scenario: data-* attributes build the input, toggle and dialog
      Given a minimal <div data-module="nhsw-date-picker" data-input-id="booking-date" ...>
      When the script initialises it
      Then the input gets placeholder "DD-MMM-YYYY" and aria-describedby from data-describedby
      And the toggle button starts with aria-expanded="false" and aria-haspopup="dialog"
      And the dialog starts with the hidden attribute

    @automated
    Scenario: Toggle button's accessible name is derived from the field's own <label for>
      Given a <label for="booking-date">Booking date</label> next to the picker
      Then the toggle button's aria-label reads "Open calendar for Booking date"

    @automated
    Scenario: Full HTML reference markup is left untouched, not rebuilt
      Given markup that already includes a hand-written toggle button and dialog structure
      When the script initialises it
      Then the exact same DOM node for the input survives (innerHTML rewrite is skipped)

  Rule: Open, close and disabled state

    @automated
    Scenario: Toggle click opens the dialog
      When the toggle button is clicked
      Then the dialog's hidden attribute is removed and aria-expanded becomes "true"

    @automated
    Scenario: A second toggle click closes it again
      When the toggle is clicked twice
      Then the dialog is hidden again and aria-expanded returns to "false"

    @automated
    Scenario: Escape closes the dialog and returns focus to the toggle
      Given the dialog is open
      When Escape is pressed inside it
      Then the dialog is hidden and focus returns to the toggle button

    @automated
    Scenario: Clicking outside the component closes it
      Given the dialog is open
      When a click lands outside the picker's root element
      Then the dialog is hidden

    @automated
    Scenario: A disabled toggle does nothing
      Given data-disabled is set
      Then the toggle is a disabled button and clicking it does not open the dialog

  Rule: Parsing a pre-filled input value

    @automated
    Scenario: A valid DD-MMM-YYYY value opens on that month with the day pending
      Given the input holds "15-Sep-2025"
      When the dialog is opened
      Then the day 2025-09-15 is marked --pending and the header reads "September 2025"

    @automated
    Scenario: An empty input falls back to today's date
      Given the input is empty
      When the dialog is opened
      Then the pending day is today's date

    @automated
    Scenario: An unparseable value (e.g. 31 Feb) falls back to today's month, not a crash
      Given the input holds "31-Feb-2025" (not a real date)
      When the dialog is opened
      Then the header shows the current month/year, not an error

  Rule: Confirming a date

    @automated
    Scenario: OK writes the chosen date back in DD-MMM-YYYY format and closes
      Given a day is pending
      When OK is clicked
      Then the input's value is set to that date in DD-MMM-YYYY format and the dialog closes

    @automated
    Scenario: Confirming dispatches a bubbling change event
      When a date is confirmed via OK
      Then the input fires exactly one bubbling "change" event

    @automated
    Scenario: Clicking a day in the grid selects it, then OK confirms that exact day
      When a specific day cell is clicked
      Then it gains aria-selected="true"
      When OK is then clicked
      Then the input value matches that clicked day

    @automated
    Scenario: Cancel closes without writing to the input
      Given a different day has been selected in the grid
      When Cancel is clicked
      Then the input's value is unchanged and the dialog closes

  Rule: Keyboard navigation within the calendar grid

    @automated
    Scenario: ArrowRight/ArrowLeft move by 1 day
    @automated
    Scenario: Moving focus updates aria-selected on the newly focused day and clears it from the previous one, within the same month
    @automated
    Scenario: ArrowDown/ArrowUp move by 1 week
    @automated
    Scenario: Home moves to Monday of the current week, End moves to Sunday
    @automated
    Scenario: PageUp/PageDown move by 1 month, correctly crossing a year boundary
    @automated
    Scenario: Shift+PageUp/PageDown move by 1 year
    @automated
    Scenario: Enter confirms the focused day and closes the dialog
    @automated
    Scenario: Day-navigation keys are inert once the dialog is closed (no throw, no change)

  Rule: Quick-shortcut buttons

    @automated
    Scenario: The "Today" shortcut sets the pending date to today and re-renders the visible month
    @automated
    Scenario: The "+1 week" shortcut moves the pending date 7 days ahead of today

  Rule: Bulk initialisation

    @automated
    Scenario: initAll wires up every [data-module="nhsw-date-picker"] within a scope
      Given two picker elements on the page
      When initAll runs
      Then both get their toggle button built
```

> Source: `specs/tests/js/date-picker.test.js` (all scenarios above map 1:1 to `it()` blocks in that file — see it for exact assertions). This component's doc page is exempt from the standard example-preview/code-viewer pairing check in `documentation-gaps.test.js` because it renders each live variant inline instead.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Date picker — manual verification

  @manual
  Scenario: Opening the calendar is announced correctly by a screen reader
    Given a user opens the calendar with a screen reader running
    Then it's announced as a dialog, and the toggle button's open/closed state is announced correctly

  @manual
  Scenario: A date can be picked using only the keyboard
    Given a user tabs to the date picker toggle
    When they open it, move around with arrow keys, and press Enter
    Then the chosen date is written into the input, with no mouse needed

  @manual
  Scenario: Error state clearly shows what's wrong
    Given the error-state variant
    Then a visible error message is shown next to the field, connected to it

  @manual
  Scenario: Disabled state can't be opened by mouse or keyboard
    Given the disabled-state variant
    Then the toggle looks visibly greyed out and doesn't open the calendar either way

  @manual
  Scenario: Tabbing while the calendar is open stays inside the dialog
    Given the calendar dialog is open
    When a user tabs repeatedly
    Then focus cycles among the dialog's own controls and doesn't escape to the page behind it
```
