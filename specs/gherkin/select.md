# Select

**Component classes:** `.nhsw-select`, `--s`, `--m`, `--l`
**Doc page:** `preview/forms/select.html`
**Source:** `src/components/forms/_select.scss`
**Example fixtures:** `select-hint.html`, `select-error.html`, `select-service.html`, `select-widths.html`

## Automated test coverage

```gherkin
Feature: Select — automated coverage

  Rule: Documented classes stay honest against the compiled stylesheet

    @automated
    # specs/tests/css/component-registry.test.js
    Scenario: Every class named in the design-system-rules exists in the compiled CSS
      Given design-system-rules.md documents nhsw-select
      Then the .nhsw-select selector is present in the compiled output

  Rule: Every select has a real, correctly-associated label

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario Outline: Visible selects have an associated label
      Given the "<fixture>" example fixture
      Then the select has a <label for> pointing at its id

      Examples:
        | fixture                |
        | select-hint.html       |
        | select-error.html      |
        | select-service.html    |
        | select-widths.html     |

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario Outline: Hint and error text are connected via aria-describedby
      Given the "<fixture>" example fixture
      Then every .nhsw-hint/.nhsw-error-message with an id is referenced by some aria-describedby

      Examples:
        | fixture             |
        | select-hint.html    |
        | select-error.html   |

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario: aria-invalid select sits alongside a visible error message
      Given select-error.html
      Then the [aria-invalid="true"] select has a .nhsw-error-message nearby
```

> There is no dedicated Figma spacing/colour spec for select in `component-specs.test.js` / `component-specs-2.test.js`; its --s/--m/--l size modifiers are only checked for existence, not for exact width.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Select — manual verification

  @manual
  Scenario: Opening and choosing an option works with keyboard alone (WCAG 2.2 SC 2.5.7)
    Given a select field
    When a user opens it and chooses an option using only the keyboard
    Then it works without needing a mouse

  @manual
  Scenario: Long option lists are easy to scroll and choose from
    Given a select with many options, e.g. "Choose Pharmacy"
    Then a user can find and pick the right option without excessive difficulty

  @manual
  Scenario: Size variants are visibly different, sensible widths
    Given the s/m/l select size variants
    Then each is a clearly different, sensible width for its content
```
