# Summary list

**Component classes:** `.nhsw-summary-list`, `--no-border`, `__row--no-border`, `__actions`, plus `.nhsw-summary-card`
**Doc page:** `preview/content/summary-list.html`
**Source:** `src/components/content/_summary-list.scss`, `src/components/content/_summary-card.scss`
**Example fixtures:** `summary-card-actions.html`, `summary-card-no-actions.html`, `summary-list-no-border.html`, `summary-cards-grouped.html`, `summary-list-immunisations.html`

## Automated test coverage

```gherkin
Feature: Summary list — automated coverage

  Rule: Documented classes stay honest against the compiled stylesheet

    @automated
    # specs/tests/css/component-registry.test.js
    Scenario: Every class named in the component registry exists in the compiled CSS
      Given .agent/component-registry.md documents nhsw-summary-list, --no-border, __row--no-border, __actions
      Then each of those selectors is present in the compiled output

  Rule: Documentation page stays structurally valid

    @automated
    # specs/tests/markup/documentation-gaps.test.js
    Scenario: Every live preview on the doc page has a matching code sample
      Given preview/content/summary-list.html
      Then the number of example-preview includes equals the number of code-viewer includes
```

> There is no dedicated Figma spacing/colour spec for summary list in `component-specs.test.js` / `component-specs-2.test.js`, and its fixtures contain no form inputs or `<svg>`, so `accessibility.test.js` doesn't exercise it.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Summary list — manual verification

  @manual
  Scenario: "Change" links are easy to tap accurately (WCAG 2.2 SC 2.5.8)
    Given a summary list row with a Change link
    Then it's large enough, or has enough space around it, to tap without missing

  @manual
  Scenario: Selecting "Change" pre-fills your previous answer (WCAG 2.2 SC 3.3.7)
    Given a user selects "Change" against a previously answered question
    Then the field is pre-filled with what they entered before
    And this doesn't apply if the answer is no longer valid or restoring it would be unsafe

  @manual
  Scenario: Screen reader reads each row's label and value as a pair
    Given a summary list row, e.g. "Name: Karen Francis"
    When a screen reader reads it
    Then the label and value are announced together, clearly associated

  @manual
  Scenario: Grouped summary cards are easy to tell apart
    Given several summary cards grouped on one page
    Then a user can clearly tell them apart and move between them
```
