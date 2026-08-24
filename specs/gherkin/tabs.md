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
  Scenario: Long tab labels remain readable
    Given tabs with realistic long labels
    When viewed at different viewport sizes
    Then labels remain readable and the tab layout remains usable

  @manual
  Scenario: No tab is ever shown disabled
    Given a set of tabs
    Then none of them are greyed out or disabled

  @manual
  Scenario: Keyboard focus is clearly visible (WCAG 2.2 SC 2.4.7)
    Given a tab receives keyboard focus
    When a keyboard user navigates between tabs
    Then a clear visible focus indicator is shown on the focused tab

  @manual
  Scenario: Active tab is visually distinct from inactive tabs
    Given a set of tabs
    When one tab is selected
    Then the active tab is clearly distinguishable without relying on colour alone (checks like different background, border treatment, position and font weight)

  @manual
  Scenario: Selected tab can be identified without colour alone (WCAG 2.2 SC 1.4.1)
    Given a selected tab
    When viewed by a user who cannot perceive colour differences
    Then its selected state is still clear

  @manual
  Scenario: Tabs remain usable at 200% and 400% zoom (WCAG 2.2 SC 1.4.10)
    Given a set of tabs
    When browser zoom is increased to 200% or 400%
    Then all tabs remain readable and operable without loss of information

  @manual
  Scenario: Tabs remain usable on small screens
    Given a set of tabs
    When viewed on a narrow viewport
    Then users can still access every tab without content being clipped or obscured

  @manual
  Scenario: Tab panel follows immediately after the tab list
    Given a tab is selected
    When a screen reader or keyboard user accesses the tab panel
    Then the associated content is presented immediately after the tabs
```
