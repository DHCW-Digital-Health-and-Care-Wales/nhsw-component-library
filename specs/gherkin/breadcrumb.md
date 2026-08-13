# Breadcrumb

**Component classes:** `.nhsw-breadcrumb`
**Doc page:** `preview/actions/breadcrumb.html`
**Source:** `src/components/navigation/_breadcrumb.scss`
**Example fixtures:** `breadcrumb-default.html`, `breadcrumb-dark.html`

## Automated test coverage

```gherkin
Feature: Breadcrumb — automated coverage

  Rule: Documentation page stays structurally valid

    @automated
    # specs/tests/markup/documentation-gaps.test.js
    Scenario: Every live preview on the doc page has a matching code sample
      Given preview/actions/breadcrumb.html
      Then the number of example-preview includes equals the number of code-viewer includes
      And no html_sample/njk_sample capture block is empty
```

> **Coverage gap:** `nhsw-breadcrumb` is not named in `.agent/component-registry.md` or `.agent/design-system-rules.md`, so `component-registry.test.js` does not check its classes exist. There is no dedicated Figma spacing/colour spec in `component-specs.test.js` / `component-specs-2.test.js`, and its fixtures contain no form inputs or `<svg>`, so `accessibility.test.js` doesn't exercise it either. Everything below is manual-only.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Breadcrumb — manual verification

  @manual
  Scenario: Trail matches where you actually are on the site
    Given a user is on a nested page
    Then the breadcrumb lists each parent page in order, ending at or just before the current page

  @manual
  Scenario: Each link in the trail goes to the right page
    Given a breadcrumb with several links
    When a link partway through the trail is selected
    Then it lands on exactly that page

  @manual
  Scenario: Enough space around the links that you don't tap the wrong one (WCAG 2.2 SC 2.5.8)
    Given a breadcrumb trail
    Then there is enough space between links that you can't easily tap the wrong one

  @manual
  Scenario: Stays readable on a dark background (WCAG 2.2 SC 1.4.3)
    Given the dark-background variant of the breadcrumb
    Then the text remains clearly visible against the dark background

  @manual
  Scenario: Screen reader reads each link with meaningful text
    Given a breadcrumb trail
    When a screen reader reads it out
    Then each link is announced by its page name, not just "link, link, link"
```
