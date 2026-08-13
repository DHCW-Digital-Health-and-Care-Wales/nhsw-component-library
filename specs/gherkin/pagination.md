# Pagination

**Component classes:** `.nhsw-pagination`, `--numbered`, `__previous`, `__next`, `__list`, `__item--current`, `__item--ellipsis`
**Doc page:** `preview/content/pagination.html`
**Source:** `src/components/content/_pagination.scss`
**Example fixtures:** `pagination-numbered.html`, `pagination-content.html`, `pagination-first.html`, `pagination-last.html`, `pagination-next-only.html`, `pagination-sessions.html`

## Automated test coverage

```gherkin
Feature: Pagination — automated coverage

  Rule: Documented classes stay honest against the compiled stylesheet

    @automated
    # specs/tests/css/component-registry.test.js
    Scenario: Every class named in the component registry exists in the compiled CSS
      Given .agent/component-registry.md documents nhsw-pagination, __previous, __next, __list, __item--current, __item--ellipsis
      Then each of those selectors is present in the compiled output

  Rule: Icons are hidden from assistive technology

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario Outline: Decorative SVG icons (previous/next chevrons) are aria-hidden
      Given the "<fixture>" example fixture
      When an <svg> is not labelled with aria-label, a <title>, or role="img"
      Then it must carry aria-hidden="true"

      Examples:
        | fixture                        |
        | pagination-content.html        |
        | pagination-first.html          |
        | pagination-last.html           |
        | pagination-next-only.html      |
        | pagination-numbered.html       |
        | pagination-sessions.html       |
```

> There is no dedicated Figma spacing/colour spec for pagination in `component-specs.test.js` / `component-specs-2.test.js`.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Pagination — manual verification

  @manual
  Scenario: Previous/Next and page-number links all take you to the right page
    Given a pagination component
    When a previous, next, or numbered link is selected
    Then it takes you to exactly the right page

  @manual
  Scenario: Current page is clearly marked, visually and for screen readers (WCAG 2.2 SC 1.3.1)
    Given the numbered pagination variant
    Then the current page is visually distinct
    And a screen reader announces it as the current page, not just another link

  @manual
  Scenario: Ellipsis isn't clickable and isn't announced as a link
    Given a numbered pagination with an ellipsis
    When a screen reader reads it
    Then the ellipsis isn't announced as a clickable link

  @manual
  Scenario: Reads as a labelled navigation region to a screen reader (WCAG 2.2 SC 1.3.1)
    Given a pagination component
    When a screen reader user navigates by landmarks or headings
    Then they can identify it as the page navigation

  @manual
  Scenario: "Next only" variant works without a numbered list present
    Given the next-only pagination variant
    Then a user can move forward through content without any numbered list showing
```
