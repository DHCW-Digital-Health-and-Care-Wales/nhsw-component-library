# Inset text

**Component classes:** `.nhsw-inset-text`
**Doc page:** `preview/content/inset-text.html`
**Source:** `src/components/content/_inset-text.scss`
**Example fixtures:** `inset-text-default.html`, `inset-text-heading.html`

## Automated test coverage

```gherkin
Feature: Inset text — automated coverage

  Rule: Visual spec matches Figma Inset text component

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Padding
      Given the compiled CSS for .nhsw-inset-text
      Then padding is 24px top/right/bottom, 32px left

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Left border
      Given the compiled CSS for .nhsw-inset-text
      Then it has an 8px solid gold (#aa8630) border-left

  Rule: Documented classes stay honest against the compiled stylesheet

    @automated
    # specs/tests/css/component-registry.test.js
    Scenario: nhsw-inset-text (referenced in design-system-rules.md) exists in the compiled CSS
      Given .agent/design-system-rules.md documents nhsw-inset-text
      Then the .nhsw-inset-text selector is present in the compiled output
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Inset text — manual verification

  @manual
  Scenario: Visually stands out clearly from surrounding body text
    Given inset text on a page
    Then its border and indent make it clearly distinct from ordinary paragraphs

  @manual
  Scenario: Screen reader users are told it's set apart, not just shown visually (WCAG 2.2 SC 1.3.1)
    Given inset text that relies on its border and indent to stand out
    When a screen reader reads it
    Then the user is told this content is set apart from the main body copy

  @manual
  Scenario: "With heading" variant renders the heading clearly
    Given inset text with a heading
    Then the heading is visually distinct from the body text inside the block
```
