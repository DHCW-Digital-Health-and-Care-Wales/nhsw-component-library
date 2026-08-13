# Back link

**Component classes:** `.nhsw-back-link`
**Doc page:** `preview/actions/back-link.html`
**Source:** `src/components/actions/_back-link.scss`
**Example fixtures:** `back-link-default.html`, `back-link-dark.html`

## Automated test coverage

```gherkin
Feature: Back link — automated coverage

  Rule: Documentation page stays structurally valid

    @automated
    # specs/tests/markup/documentation-gaps.test.js
    Scenario: Every live preview on the doc page has a matching code sample
      Given preview/actions/back-link.html
      Then the number of example-preview includes equals the number of code-viewer includes
      And no html_sample/njk_sample capture block is empty
```

> **Coverage gap:** unlike most components, `nhsw-back-link` is not named in `.agent/component-registry.md` or `.agent/design-system-rules.md`, so it is not checked by `component-registry.test.js`'s class-existence sweep. It also has no dedicated entry in `component-specs.test.js` / `component-specs-2.test.js` (no Figma spacing/colour assertions), and its example fixtures contain no form inputs or `<svg>`, so none of the `accessibility.test.js` checks exercise it either. Everything below is currently manual-only.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Back link — manual verification

  @manual
  Scenario: Shows a "<" arrow before the text
    Given a back link
    Then a "<" arrow appears immediately before the word "Back"

  @manual
  Scenario: Takes you back to the previous page
    Given a user is on a page reached via a back link
    When they select it
    Then they land back on the previous page

  @manual
  Scenario: Previously entered answers are still there when you go back (WCAG 2.2 SC 3.3.7)
    Given a user filled in a form and used the back link to leave the page
    When they return to that page
    Then their answers are still filled in
    And this doesn't apply if the data is no longer valid, or restoring it would be unsafe

  @manual
  Scenario: Stays readable on a dark background (WCAG 2.2 SC 1.4.3)
    Given the dark-background variant of the back link
    Then the text remains clearly visible against the dark background

  @manual
  Scenario: Enough space around it that you don't tap the wrong thing (WCAG 2.2 SC 2.5.8)
    Given a back link placed near other links or buttons
    Then there is enough space that you can't easily tap the wrong one

  @manual
  Scenario: "Back link as a button" performs an action, not a navigation
    Given the "back link as a button" variant
    When it's activated
    Then it performs an action (e.g. clears something) rather than loading a new page
```
