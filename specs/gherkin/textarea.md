# Textarea

**Component classes:** `.nhsw-textarea`
**Doc page:** `preview/forms/textarea.html`
**Source:** `src/components/forms/_textarea.scss`, character-counter behaviour in `preview/assets/nhsw-docs.js`
**Example fixtures:** `textarea-default.html`, `textarea-sized.html`, `textarea-error.html`, `textarea-consent.html`

## Automated test coverage

```gherkin
Feature: Textarea — automated coverage

  Rule: Documented classes stay honest against the compiled stylesheet

    @automated
    # specs/tests/css/component-registry.test.js
    Scenario: Every class named in the design-system-rules exists in the compiled CSS
      Given design-system-rules.md documents nhsw-textarea
      Then the .nhsw-textarea selector is present in the compiled output

  Rule: Every textarea has a real, correctly-associated label

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario Outline: Visible textareas have an associated label
      Given the "<fixture>" example fixture
      Then the textarea has a <label for> pointing at its id

      Examples:
        | fixture                  |
        | textarea-default.html    |
        | textarea-sized.html      |
        | textarea-error.html      |
        | textarea-consent.html    |

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario: Textarea never relies on placeholder text as its only label
      Given the textarea example fixtures
      Then every textarea[placeholder] also has a real associated <label>

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario Outline: Hint and error text are connected via aria-describedby
      Given the "<fixture>" example fixture
      Then every .nhsw-hint/.nhsw-error-message with an id is referenced by some aria-describedby

      Examples:
        | fixture                  |
        | textarea-default.html    |
        | textarea-error.html      |
        | textarea-consent.html    |

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario: aria-invalid textarea sits alongside a visible error message
      Given textarea-error.html
      Then the [aria-invalid="true"] textarea has a .nhsw-error-message nearby

  Rule: Character counter behaviour (data-max-length)

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: Full count shown with no input
      Given a textarea with data-max-length="10"
      Then the counter reads "You have 10 characters remaining"

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: Counter counts down as the user types
      When the user types "hello" (5 characters)
      Then the counter reads "You have 5 characters remaining"

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: Singular "character" is used when exactly 1 remains
      When 9 of 10 characters are used
      Then the counter reads "You have 1 character remaining"

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: Counter goes negative once the limit is exceeded, without throwing
      When the user types 14 characters into a 10-character limit
      Then the counter reads "You have -4 characters remaining"
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Textarea — manual verification

  @manual
  Scenario: You can click in and type across multiple lines
    Given a textarea
    When a user clicks into it and types multiple lines
    Then the text wraps and appears as expected

  @manual
  Scenario: Pasting into the field works
    Given a textarea
    When a user pastes text into it
    Then the pasted text appears correctly — paste is never blocked

  @manual
  Scenario: Character counter counts down correctly, and doesn't break when you go over
    Given a textarea with a character limit and live counter
    When a user types past the limit
    Then the counter keeps counting (going negative) without breaking or freezing

  @manual
  Scenario: Field height suits the amount of content someone is likely to write
    Given the sized textarea variant
    Then its visible height roughly matches how much someone is expected to write
```
