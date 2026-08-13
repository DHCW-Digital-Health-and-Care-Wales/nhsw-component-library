# Error summary

**Component classes:** `.nhsw-error-summary`, `.nhsw-error-summary__title`
**Doc page:** `preview/actions/error-summary.html`
**Source:** `src/components/forms/_error-summary.scss`
**Example fixtures:** `error-summary-default.html`, `error-summary-date.html`, `error-summary-checkboxes.html`, `error-summary-timeout.html`

## Automated test coverage

```gherkin
Feature: Error summary — automated coverage

  Rule: Visual spec matches Figma Error summary component

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Title spacing
      Given the compiled CSS for .nhsw-error-summary__title
      Then it has a 24px margin below it, before the error list

  Rule: Linked fields are properly described and marked invalid

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario Outline: aria-invalid fields sit alongside a visible error message
      Given the "<fixture>" example fixture
      When a field has aria-invalid="true"
      Then a .nhsw-error-message is present in its containing fieldset or form group

      Examples:
        | fixture                        |
        | error-summary-default.html     |
        | error-summary-date.html        |
        | error-summary-timeout.html     |

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario Outline: hint and error text are connected via aria-describedby
      Given the "<fixture>" example fixture
      Then every .nhsw-hint/.nhsw-error-message with an id is referenced by some aria-describedby

      Examples:
        | fixture                        |
        | error-summary-default.html     |
        | error-summary-date.html        |
        | error-summary-checkboxes.html  |
        | error-summary-timeout.html     |

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario: Date input errors stay wrapped in fieldset + legend
      Given error-summary-date.html
      Then every .nhsw-date-input sits inside a <fieldset> with a <legend>

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario: Checkbox group errors stay wrapped in fieldset + legend
      Given error-summary-checkboxes.html
      Then the .nhsw-checkboxes group sits inside a <fieldset> with a <legend>
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Error summary — manual verification

  @manual
  Scenario: Shows a clear "There is a problem" heading with a list of errors
    Given a form submitted with invalid answers
    Then an error summary appears with a heading and a list of what's wrong

  @manual
  Scenario: Each error links to its field, and clicking it jumps you there (WCAG 2.2 SC 2.4.3)
    Given the error summary's list of links
    When one is selected
    Then focus moves straight to the matching field on the page
```

## Additional implementation advice

These aren't testable against the isolated component in this library — they depend on how the page or service around it is actually built (form re-submission, cross-page consistency, backend session timing, and so on). The component library can describe and support the pattern, but only the real integration can prove it's correct. Worth checking whenever a service uses this component.

- **Submitting an invalid form doesn't clear what you already typed** (WCAG 2.2 SC 3.3.7) — requires the service to correctly persist submitted values when it re-renders the page with errors. That's a server/form-handling concern, not something the error summary markup can guarantee on its own.
- **Keyboard focus jumps to the error summary automatically** (WCAG 2.2 SC 3.3.1) — the component ships `tabindex="-1"` on the error summary so it's programmatically focusable, but actually calling `.focus()` on page load after a failed submission is something the service's own JS/server-rendering needs to do.
