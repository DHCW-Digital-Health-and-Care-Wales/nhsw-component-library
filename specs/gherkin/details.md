# Details

**Component classes:** `.nhsw-details`, `__summary`, `__summary-text`, `__text`
**Doc page:** `preview/content/details.html`
**Source:** `src/components/content/_details.scss`
**Example fixtures:** `details-default.html`, `details-multiple.html`, `details-open.html`

## Automated test coverage

```gherkin
Feature: Details — automated coverage

  Rule: Documented classes stay honest against the compiled stylesheet

    @automated
    # specs/tests/css/component-registry.test.js
    Scenario: Every class named in the component registry exists in the compiled CSS
      Given .agent/component-registry.md documents nhsw-details, __summary, __summary-text, __text, and the open attribute
      Then each of those selectors is present in the compiled output

  Rule: Documentation page stays structurally valid

    @automated
    # specs/tests/markup/documentation-gaps.test.js
    Scenario: Every live preview on the doc page has a matching code sample
      Given preview/content/details.html
      Then the number of example-preview includes equals the number of code-viewer includes
```

> Note: this uses the native `<details>`/`<summary>` HTML elements, so basic keyboard/AT behaviour (opening on Enter/Space, `aria-expanded` equivalent semantics) comes from the browser for free and isn't something this component's own tests need to re-verify. There is no Figma spacing/colour spec for it, and its fixtures contain no form inputs or `<svg>`, so `accessibility.test.js` doesn't exercise it.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Details — manual verification

  @manual
  Scenario: Clicking the summary opens and closes the hidden content
    Given a details component
    When the summary line is clicked
    Then the hidden content shows or hides accordingly

  @manual
  Scenario: Multiple details on a page work independently
    Given a page with several details components
    When one is opened
    Then the others stay in whatever state they were in

  @manual
  Scenario: Pre-opened variant is visible immediately
    Given a details component set to start open
    Then its content is visible as soon as the page loads, with no interaction needed

  @manual
  Scenario: Background is easy to read against the page (WCAG 2.2 SC 1.4.3)
    Given a details component
    Then its background gives clear contrast against the page

  @manual
  Scenario: Summary text says what's actually inside (WCAG 2.2 SC 2.4.4)
    Given the summary link text
    Then it clearly describes what you'll find inside, rather than something vague like "More information"
```
