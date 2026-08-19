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

  @manual
  Scenario: Current page is not a link
    Given a breadcrumb trail
    When it is displayed
    Then the current page is shown as text and is not a clickable link

  @manual
  Scenario: Keyboard focus is visible (WCAG 2.2 SC 2.4.7)
    Given a breadcrumb link
    When it receives keyboard focus
    Then a visible focus indicator appears, on both light and dark backgrounds

  @manual
  Scenario: Links can be navigated using the keyboard
    Given a breadcrumb trail
    When a keyboard user tabs through the page
    Then each breadcrumb link can receive focus and be activated

  @manual
  Scenario: Breadcrumb wraps correctly on smaller screens
    Given a breadcrumb trail with several long items
    When it doesn't fit on one line
    Then it wraps onto a second line without overlapping content

  @manual
  Scenario: Long breadcrumb labels remain readable
    Given a breadcrumb item with an unusually long, unbroken label
    Then it breaks onto multiple lines rather than overflowing the page sideways

  @manual
  Scenario: Remains usable at 200% and 400% zoom (WCAG 2.2 SC 1.4.10)
    Given a page containing breadcrumbs
    When browser zoom is increased to 200%, then 400%
    Then the breadcrumbs remain readable and usable without loss of content

  @manual
  Scenario: Hover state is clear and consistent with other links
    Given a breadcrumb link
    When a user hovers over it
    Then the hover state is visually apparent and consistent with other links
    But the current-page text does not react to hover
```

## Additional implementation advice

These aren't testable against the isolated component in this library — they depend on how the page or service around it is actually built (form re-submission, cross-page consistency, backend session timing, and so on). The component library can describe and support the pattern, but only the real integration can prove it's correct. Worth checking whenever a service uses this component.

- **Trail matches where you actually are on the site** — whether the breadcrumb accurately reflects the current page's place in the site hierarchy depends on the page data the service passes in, not the breadcrumb component itself.
- **Each link in the trail goes to the right page** — every link in the fixtures here is `href="#"`; whether it actually lands on the right page depends on the URLs the consuming app supplies, not the component itself.
