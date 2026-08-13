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
    # specs/tests/css/component-specs-2.test.js
    Scenario: Nav link padding
      Given the compiled CSS for .nhsw-site-header__nav-link
      Then padding is 16px vertical / 4px horizontal

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Nav list item gap
      Given the compiled CSS for .nhsw-site-header__nav-list
      Then the gap between items is 8px
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
```
