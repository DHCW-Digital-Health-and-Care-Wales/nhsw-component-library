# Cards

**Component classes:** `.nhsw-card`, `.nhsw-card__icon`, `.nhsw-card__title`, `.nhsw-card__description`
**Doc page:** `preview/content/cards.html`
**Source:** `src/components/cards/_card.scss`
**Example fixtures:** `card-basic.html`, `card-chevron.html`, `card-icon.html`, `card-image.html`, `card-links.html`, `card-actions.html`, `card-grid.html`, `card-nonclickable.html`, `card-stat.html`

## Automated test coverage

```gherkin
Feature: Cards — automated coverage

  Rule: Documentation page stays structurally valid

    @automated
    # specs/tests/markup/documentation-gaps.test.js
    Scenario: Every live preview on the doc page has a matching code sample
      Given preview/content/cards.html
      Then the number of example-preview includes equals the number of code-viewer includes
      And no html_sample/njk_sample capture block is empty
```

> **Coverage gap:** `nhsw-card` is not named in `.agent/component-registry.md` or `.agent/design-system-rules.md`, so `component-registry.test.js` doesn't check its classes exist, and there's no Figma spacing/colour spec for it in `component-specs.test.js` / `component-specs-2.test.js`. Its examples have no form inputs, and the icon variant (`card-icon.html`) uses a plain `<span aria-hidden="true">`, not an `<svg>`, so `accessibility.test.js`'s decorative-SVG check does not run against it either. Everything below is manual-only.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Cards — manual verification

  @manual
  Scenario: The whole card is clickable, not just the title
    Given a clickable card
    When anywhere within the card is clicked
    Then it takes you to the card's destination

  @manual
  Scenario: Non-clickable cards aren't announced as links
    Given a non-clickable card
    When a screen reader reads it
    Then it isn't announced as a link

  @manual
  Scenario: Card grid stacks sensibly on mobile
    Given a grid of cards
    When viewed on a mobile-width screen
    Then they stack into a single column without overlapping or clipped text

  @manual
  Scenario: Decorative icon content isn't read aloud by a screen reader
    Given a card using the small icon-badge variant
    When a screen reader reads the card
    Then the icon glyph itself isn't read out as text

  @manual
  Scenario: A group of cards used for navigation reads as a list of options
    Given cards grouped together for navigation
    When a screen reader reads them
    Then they're announced as a list of options, not as unrelated content

  @manual
  Scenario: Heading level matches the surrounding page structure
    Given a card with its heading level overridden (e.g. h3 instead of h2)
    Then the rendered heading tag matches what was specified, keeping the page outline correct
```
