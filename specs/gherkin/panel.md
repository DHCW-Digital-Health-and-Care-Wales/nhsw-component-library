# Panel

**Component classes:** `.nhsw-panel`, `--navy`
**Doc page:** `preview/content/panel.html`
**Source:** `src/components/content/_panel.scss`
**Example fixtures:** `panel-default.html`, `panel-navy.html`, `panel-no-icon.html`

## Automated test coverage

```gherkin
Feature: Panel — automated coverage

  Rule: Visual spec matches Figma Panel component (Small, Green variant)

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Padding
      Given the compiled CSS for .nhsw-panel
      Then padding is 32px vertical / 40px horizontal

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Background colour
      Given the compiled CSS for .nhsw-panel
      Then the background colour is #007f3b

  Rule: Icons are hidden from assistive technology

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario: Decorative SVG icon is aria-hidden
      Given panel-default.html
      When an <svg> is not labelled with aria-label, a <title>, or role="img"
      Then it must carry aria-hidden="true"
```

> `documentation-gaps.test.js` explicitly exempts panel.html from the 1:1 example-preview/code-viewer check: the white/navy pairs after "Blue background" reuse the --navy modifier code shown earlier on the page, so only the white variant repeats a code sample — that exemption is itself asserted (a code-viewer must still exist somewhere on the page).

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Panel — manual verification

  @manual
  Scenario: Text stays fully readable when the page is zoomed in a lot (WCAG 2.2 SC 1.4.4)
    Given a panel with typical content
    When the page is zoomed to 400%
    Then the text doesn't clip, overlap, or get cut off

  @manual
  Scenario: Heading, not just colour, says what the panel means (WCAG 2.2 SC 1.4.1)
    Given the green (default) and navy panel variants
    Then each has a clear heading so its purpose doesn't depend on the colour

  @manual
  Scenario: "No icon" variant still makes sense on its own
    Given the no-icon panel variant, large and small
    Then the heading and body text alone are enough to understand the message

  @manual
  Scenario: Smaller panel variant stays legible
    Given the smaller panel variant
    Then the icon and text stay proportionate and easy to read
```
