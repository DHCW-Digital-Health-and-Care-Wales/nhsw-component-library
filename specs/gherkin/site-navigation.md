# Site navigation

**Component classes:** `.nhsw-site-header__nav`, `__nav-container`, `__nav-list`, `__nav-link`, `--current`
**Doc page:** `preview/site/site-navigation.html`
**Source:** `src/components/site/_header.scss` (this doc page documents the same nav markup/classes as the header component, focused on the navigation pattern in isolation)
**Example fixtures:** `site-navigation-default.html`, `site-navigation-dark.html`, `site-navigation-tag.html`

## Automated test coverage

Because this page documents the same `.nhsw-site-header__nav-*` classes as [header](header.md), it shares that component's automated CSS coverage.

```gherkin
Feature: Site navigation — automated coverage

  Rule: Visual spec matches Figma Service navigation component

    @automated
    # specs/tests/css/components/header.test.js
    Scenario: Nav link padding
      Given the compiled CSS for .nhsw-site-header__nav-link
      Then padding is 16px vertical / 4px horizontal

    @automated
    # specs/tests/css/components/header.test.js
    Scenario: Nav list item gap
      Given the compiled CSS for .nhsw-site-header__nav-list
      Then the gap between items is 2rem

    @automated
    # specs/tests/css/components/header.test.js
    Scenario: Inactive links are underlined by default; hover/focus drop the underline without changing colour
      Given the compiled CSS for .nhsw-site-header__nav-link
      Then the base state is underlined, :hover removes the underline with no colour change, and :focus removes it on the link itself

    @automated
    # specs/tests/css/components/header.test.js
    Scenario: Current-page indicator overlaps the nav bar's own border, doesn't double it up
      Given the compiled CSS for .nhsw-site-header__nav-link--current
      Then it is drawn with an inset box-shadow (#212b32, or white on the --reverse variant), not a border-bottom

    @automated
    # specs/tests/css/components/header.test.js
    Scenario: The tag badge next to a nav item has no bespoke colours of its own
      Given the compiled CSS for .nhsw-site-header__nav-badge
      Then it only supplies spacing — its colour comes from pairing it with a real .nhsw-tag class in markup
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Site navigation — manual verification

  @manual
  Scenario: Current page is clearly marked, visually and for screen readers
    Given a nav link pointing at the current page
    Then it's visually distinguished from the other links
    And a screen reader announces it as the current page

  @manual
  Scenario: Expanded menus never cover whatever has keyboard focus (WCAG 2.2 SC 2.4.11)
    Given a navigation with an expandable menu
    When a submenu is open
    Then it doesn't cover the element that currently has keyboard focus

  @manual
  Scenario: Stays readable on a dark background
    Given the dark-background navigation variant
    Then the links remain clearly readable

  @manual
  Scenario: Tag next to a nav item doesn't break the layout or shrink its click area
    Given a nav item with a tag next to it
    Then the tag sits correctly alongside the link without reducing the link's clickable area

  @manual
  Scenario: Keyboard focus is clearly visible (WCAG 2.2 SC 2.4.7)
    Given a site navigation link
    When it receives keyboard focus
    Then a clear visible focus indicator is shown

  @manual
  Scenario: Navigation can be used entirely with the keyboard
    Given a site navigation component
    When a keyboard user tabs through the navigation
    Then all navigation items can be reached and activated without using a mouse

  @manual
  Scenario: Navigation is identifiable as a navigation region
    Given a screen reader user navigates page landmarks
    When the site navigation is encountered
    Then it is identified as a navigation region

  @manual
  Scenario: Current page remains distinguishable without colour alone (WCAG 2.2 SC 1.4.1)
    Given a navigation item representing the current page
    When viewed by a user who cannot perceive colour differences
    Then the current page remains distinguishable through more than colour alone

  @manual
  Scenario: Site navigation remains usable at 200% and 400% zoom (WCAG 2.2 SC 1.4.10)
    Given a site navigation component
    When browser zoom is increased to 200% or 400%
    Then navigation items remain readable and operable without loss of information

  @manual
  Scenario: Long navigation labels remain readable
    Given a navigation item with a long label
    When viewed on a small screen or at high zoom levels
    Then the label remains readable and does not overlap neighbouring navigation items

  @manual
  Scenario: Navigation adapts correctly on small screens
    Given a site navigation component
    When viewed on a mobile-width screen
    Then all navigation options remain accessible without clipping or horizontal scrolling

  @manual
  Scenario: Expanded submenu remains associated with its parent item
    Given a navigation item with an expanded submenu
    When the submenu is displayed
    Then it is visually clear which parent navigation item the submenu belongs to
```
