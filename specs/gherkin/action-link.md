# Action link

**Component classes:** `.nhsw-action-link`, `.nhsw-action-link__icon`, `.nhsw-action-link__text`, `.nhsw-action-link--navy`, `.nhsw-action-link--red`
**Doc page:** `preview/actions/action-link.html`
**Source:** `src/components/actions/_action-link.scss`
**Example fixtures:** `action-link-default.html`, `action-link-dark.html`, `action-link-group.html`

## Automated test coverage

These scenarios are already verified by `npm test`. They are listed here for traceability only — do not re-run them by hand.

```gherkin
Feature: Action link — automated coverage

  Rule: Visual spec matches Figma Action link component (icon+text row)

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Icon sizing and gap
      Given the compiled CSS for .nhsw-action-link__icon
      Then it is 32px by 32px
      And it has an 8px margin-right before the label

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Default colour is link-blue throughout
      Given the compiled CSS for .nhsw-action-link
      Then the icon fill is #005aa8
      And the text colour is #005aa8

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Hover only recolours the text
      Given the compiled CSS for .nhsw-action-link
      When the component is hovered
      Then the text colour becomes #7c2855
      But no hover rule exists for .nhsw-action-link__icon, so the icon stays link-blue

  Rule: Documented classes stay honest against the compiled stylesheet

    @automated
    # specs/tests/css/component-registry.test.js
    Scenario: Every class named in the component registry exists in the compiled CSS
      Given .agent/component-registry.md documents nhsw-action-link, __icon, __text, --navy, --red
      Then each of those selectors is present in the compiled output

  Rule: Icons are hidden from assistive technology

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario Outline: Decorative SVG icons are aria-hidden
      Given the "<fixture>" example fixture
      When an <svg> is not labelled with aria-label, a <title>, or role="img"
      Then it must carry aria-hidden="true"

      Examples:
        | fixture                     |
        | action-link-default.html    |
        | action-link-dark.html       |
        | action-link-group.html      |
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Action link — manual verification

  @manual
  Scenario: Icon and label read as one action, with a clear gap between them
    Given an action link
    Then a blue circular arrow icon sits immediately before the text
    And there is a clear gap between the icon and the text, not crammed together

  @manual
  Scenario: Default colour is consistent — icon and text match
    Given an action link in its default state
    Then the icon and the text are the same link-blue colour

  @manual
  Scenario: Hover only recolours the text, not the icon
    Given an action link
    When you hover over it with a mouse
    Then the text changes colour
    And the icon stays link-blue

  @manual
  Scenario: Text is easy to read against its background (WCAG 2.2 SC 1.4.3)
    Given an action link in its default state
    Then the text is clearly readable against the white page background

  @manual
  Scenario: Stays readable on a dark background (WCAG 2.2 SC 1.4.3)
    Given an action link placed on a dark/navy background
    Then both the icon and the text remain clearly visible

  @manual
  Scenario: Screen reader only announces the link text, not the icon (WCAG 2.2 SC 4.1.2)
    Given an action link with a decorative icon
    When a screen reader reads it out
    Then only the link text is announced, with no extra description of the icon
```
