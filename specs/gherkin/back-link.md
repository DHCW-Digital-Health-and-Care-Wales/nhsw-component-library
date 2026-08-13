# Back link

**Component classes:** `.nhsw-back-link`
**Doc page:** `preview/actions/back-link.html`
**Source:** `src/components/actions/_back-link.scss`
**Example fixtures:** `back-link-default.html`, `back-link-dark.html`

## Automated test coverage

```gherkin
Feature: Back link — automated coverage

  Rule: Documentation page stays structurally valid

    @automated
    # specs/tests/markup/documentation-gaps.test.js
    Scenario: Every live preview on the doc page has a matching code sample
      Given preview/actions/back-link.html
      Then the number of example-preview includes equals the number of code-viewer includes
      And no html_sample/njk_sample capture block is empty
```

> **Coverage gap:** unlike most components, `nhsw-back-link` is not named in `.agent/component-registry.md` or `.agent/design-system-rules.md`, so it is not checked by `component-registry.test.js`'s class-existence sweep. It also has no dedicated entry in `component-specs.test.js` / `component-specs-2.test.js` (no Figma spacing/colour assertions), and its example fixtures contain no form inputs or `<svg>`, so none of the `accessibility.test.js` checks exercise it either. Everything below is currently manual-only.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Back link — manual verification

  @manual
  Scenario: Shows a "<" arrow before the text
    Given a back link
    Then a "<" arrow appears immediately before the word "Back"

  @manual
  Scenario: Stays readable on a dark background (WCAG 2.2 SC 1.4.3)
    Given the dark-background variant of the back link
    Then the text remains clearly visible against the dark background

  @manual
  Scenario: Enough space around it that you don't tap the wrong thing (WCAG 2.2 SC 2.5.8)
    Given a back link placed near other links or buttons
    Then there is enough space that you can't easily tap the wrong one

  @manual
  Scenario: "Back link as a button" performs an action, not a navigation
    Given the "back link as a button" variant
    When it's activated
    Then it performs an action (e.g. clears something) rather than loading a new page
```

## Additional implementation advice

These aren't testable against the isolated component in this library — they depend on how the page or service around it is actually built (form re-submission, cross-page consistency, backend session timing, and so on). The component library can describe and support the pattern, but only the real integration can prove it's correct. Worth checking whenever a service uses this component.

- **Takes you back to the previous page** — the component only ships a styled `<a>` (or `<button>` for the "as a button" variant); there's no built-in "go back" behaviour. Whether it actually lands on the previous page depends entirely on the `href` (or JS) the consuming app wires up. In every fixture here it's `href="#"`, so this genuinely can't be demonstrated in isolation — check it in the real service instead.
- **Previously entered answers are still there when you go back** (WCAG 2.2 SC 3.3.7) — when a user goes back to a previous page, the service must pre-populate fields with what they already entered (unless the data's no longer valid, or restoring it would be unsafe). This depends on how the surrounding page/service manages form state — it can't be verified against the back link component alone.
