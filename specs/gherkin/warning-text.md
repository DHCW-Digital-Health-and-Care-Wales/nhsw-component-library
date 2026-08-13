# Warning text

**Component classes:** `.nhsw-warning-text`
**Doc page:** `preview/callouts/warning-text.html`
**Source:** `src/components/content/_warning-text.scss`
**Example fixtures:** `warning-text-default.html`, `warning-text-dark.html`

## Automated test coverage

```gherkin
Feature: Warning text — automated coverage

  Rule: Visual spec matches Figma Warning text component

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Icon-to-text gap
      Given the compiled CSS for .nhsw-warning-text
      Then there is a 12px gap between the icon and the text
```

> Note: like warning callout, warning text's icon is rendered via CSS, not an inline `<svg>`, so `accessibility.test.js`'s decorative-SVG-must-be-aria-hidden check does not exercise this component's fixtures.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Warning text — manual verification

  @manual
  Scenario: Doesn't rely on colour alone to signal a warning (WCAG 2.2 SC 1.4.1)
    Given warning text on a page
    Then it combines an icon and text, not just colour
    And hidden "Warning" text is present for screen reader users

  @manual
  Scenario: Icon is easy to see against its background (WCAG 2.2 SC 1.4.11)
    Given the warning icon
    Then it has clear contrast against its surrounding colours

  @manual
  Scenario: Stays readable on a dark background
    Given the dark-background variant of warning text
    Then both the icon and text remain clearly visible
```
