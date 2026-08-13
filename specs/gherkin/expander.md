# Expander

**Component classes:** `.nhsw-expander`, `.nhsw-expander__button`, `.nhsw-expander__icon`, `.nhsw-expander__content`
**Doc page:** `preview/actions/expander.html`
**Source:** `src/components/content/_expander.scss`, behaviour in `preview/assets/nhsw-docs.js`
**Example fixtures:** `expander-default.html`

## Automated test coverage

```gherkin
Feature: Expander — automated coverage

  Rule: Visual spec matches Figma Expander component

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Button padding
      Given the compiled CSS for .nhsw-expander__button
      Then it has 24px padding on all sides

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Icon size and gap
      Given the compiled CSS for .nhsw-expander__icon
      Then it is 28px by 28px
      And it has a 12px margin-right before the label

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Expanded content is flush with the button, not indented
      Given the compiled CSS for .nhsw-expander__content
      Then padding is 0 top, 24px right, 24px bottom, 24px left

  Rule: Toggle behaviour

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: Clicking the button toggles aria-expanded and the hidden content
      Given an .nhsw-expander__button with aria-expanded="false" controlling a hidden region
      When the button is clicked
      Then aria-expanded becomes "true" and the region's hidden attribute is removed
      When the button is clicked again
      Then aria-expanded becomes "false" and the region is hidden again
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Expander — manual verification

  @manual
  Scenario: Clicking the button opens and closes the section, with the icon flipping
    Given a closed expander
    When the button is clicked
    Then the section opens and the icon switches to its "open" state
    And clicking again closes it and switches the icon back

  @manual
  Scenario: Border and icon are easy to see against the background (WCAG 2.2 SC 1.4.11)
    Given an expander
    Then its border and toggle icon are clearly visible against the surrounding page

  @manual
  Scenario: Works the same with keyboard only as with a mouse (WCAG 2.2 SC 2.1.1)
    Given an expander button is focused via keyboard
    When Enter or Space is pressed
    Then it opens or closes exactly as a mouse click would

  @manual
  Scenario: Screen reader announces whether it's open or closed (WCAG 2.2 SC 4.1.2)
    Given a screen reader user activates an expander
    Then the announced state (expanded/collapsed) matches what's actually shown on screen
```
