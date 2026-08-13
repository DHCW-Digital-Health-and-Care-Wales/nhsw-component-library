# Tabs

**Component classes:** `.nhsw-tabs`, `__list`, `__tab`, `--selected`, `__panel`, `--hidden`
**Doc page:** `preview/content/tabs.html`
**Source:** `src/components/content/_tabs.scss`, behaviour in `preview/assets/nhsw-docs.js`
**Example fixtures:** `tabs-default.html`

## Automated test coverage

```gherkin
Feature: Tabs — automated coverage

  Rule: Visual spec matches Figma Tabs component

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Unselected tab padding
      Given the compiled CSS for .nhsw-tabs__tab
      Then padding is 8px vertical / 16px horizontal

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Selected tab padding
      Given the compiled CSS for .nhsw-tabs__tab--selected
      Then padding is 12px vertical / 16px horizontal

  Rule: Click behaviour

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: Clicking a tab activates it and shows only its panel
      Given a tabs component with "One" selected
      When a user clicks the "Two" tab
      Then "Two" gains --selected and aria-selected="true"
      And "One" loses --selected and aria-selected becomes "false"
      And only panel-2 is shown (panel-1 gains --hidden)

  Rule: Keyboard behaviour

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: ArrowRight moves focus to the next tab and wraps at the end
      Given the last tab is focused
      When ArrowRight is pressed
      Then focus and selection move to the first tab

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: ArrowLeft moves focus to the previous tab and wraps at the start
      Given the first tab is focused
      When ArrowLeft is pressed
      Then focus and selection move to the last tab

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: Unrelated keys do not change the selected tab
      Given a tab is focused
      When an unrelated key (e.g. Tab) is pressed
      Then the currently selected tab does not change

  Rule: Nested tabs are scoped correctly

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: A tabs instance nested inside another tabs panel is not double-bound
      Given an outer .nhsw-tabs containing an inner .nhsw-tabs within one of its panels
      When the inner tab is clicked
      Then its click handler fires exactly once, not twice
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Tabs — manual verification

  @manual
  Scenario: Clicking a tab shows only that tab's content
    Given a set of tabs
    When a different tab is clicked
    Then only that tab's panel is shown, and the others are hidden

  @manual
  Scenario: Arrow keys move between tabs and wrap around at the ends
    Given a tab is focused via keyboard
    When the right or left arrow key is pressed repeatedly
    Then focus moves to each tab in turn and wraps back around at the start/end

  @manual
  Scenario: Screen reader announces which tab is selected, and how many there are (WCAG 2.2 SC 4.1.2)
    Given a set of tabs
    When a screen reader user focuses one
    Then they hear its name, its position (e.g. "2 of 4"), and whether it's selected

  @manual
  Scenario: Tab labels never wrap onto a second line
    Given a set of tabs with realistic label lengths
    Then the row of tabs stays on a single line at normal viewport widths

  @manual
  Scenario: No tab is ever shown disabled
    Given a set of tabs
    Then none of them are greyed out or disabled
```
