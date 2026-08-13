# Warning callout

**Component classes:** `.nhsw-warning-callout`, `__heading`, `__content`
**Doc page:** `preview/callouts/warning-callout.html`
**Source:** `src/components/callouts/_warning-callout.scss`
**Example fixtures:** `warning-callout-default.html`, `warning-callout-important.html`, `warning-callout-text.html`

## Automated test coverage

```gherkin
Feature: Warning callout — automated coverage

  Rule: Visual spec matches Figma Warning callout component

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Heading layout
      Given the compiled CSS for .nhsw-warning-callout__heading (the layout rule, not the typography one)
      Then it has a 10px gap between icon and text
      And padding is 8px vertical / 32px horizontal

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Content padding
      Given the compiled CSS for .nhsw-warning-callout__content
      Then padding is 48px top, 32px sides, 32px bottom

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Heading and content use the Extended/yellow token
      Given the compiled CSS for .nhsw-warning-callout
      Then the heading background is #ffeb3b
      And the content border is a 1px solid #ffeb3b line

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Content background matches Extended/yellow-light
      Given the compiled CSS for .nhsw-warning-callout__content
      Then the background colour is #fff9c4

  Rule: Documentation page stays structurally valid

    @automated
    # specs/tests/markup/documentation-gaps.test.js
    Scenario: Every live preview on the doc page has a matching code sample
      Given preview/callouts/warning-callout.html
      Then the number of example-preview includes equals the number of code-viewer includes
```

> Note: unlike action-link or pagination, the warning callout's icon is not exercised by `accessibility.test.js`'s decorative-SVG check — its example fixtures render the icon via CSS, not an inline `<svg>`, so that automated check does not apply here.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Warning callout — manual verification

  @manual
  Scenario: Heading and body text are clearly readable against the yellow background (WCAG 2.2 SC 1.4.3)
    Given a warning callout
    Then the heading and body text are easy to read against their background

  @manual
  Scenario: Doesn't rely on colour alone to signal a warning (WCAG 2.2 SC 1.4.1)
    Given a warning callout
    Then it combines an icon and text with the yellow colouring, not colour by itself
    And hidden "Warning" text is present for screen reader users

  @manual
  Scenario: Warning icon is easy to see against its background (WCAG 2.2 SC 1.4.11)
    Given the warning icon
    Then it has clear contrast against its background
```

## Additional implementation advice

These aren't testable against the isolated component in this library — they depend on how the page or service around it is actually built (form re-submission, cross-page consistency, backend session timing, and so on). The component library can describe and support the pattern, but only the real integration can prove it's correct. Worth checking whenever a service uses this component.

- **Used sparingly, not on every section of a page** — an editorial/content-governance concern about how often a service chooses to use the component, not something the component itself controls.
