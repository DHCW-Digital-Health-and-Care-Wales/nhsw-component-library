# Footer

**Component classes:** `.nhsw-site-footer`, `__container`
**Doc page:** `preview/site/footer.html`
**Source:** `src/components/site/_footer.scss`
**Example fixtures:** `footer-default.html`, `footer-no-links.html`, `footer-navigation.html`

## Automated test coverage

```gherkin
Feature: Footer — automated coverage

  Rule: Visual spec matches Figma Footer component

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Container padding
      Given the compiled CSS for .nhsw-site-footer__container
      Then padding is 30px vertical / 40px horizontal

  Rule: Documented classes stay honest against the compiled stylesheet

    @automated
    # specs/tests/css/component-registry.test.js
    Scenario: nhsw-site-footer (referenced in design-system-rules.md) exists in the compiled CSS
      Given design-system-rules.md documents nhsw-site-footer
      Then the .nhsw-site-footer selector is present in the compiled output
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Footer — manual verification

  @manual
  Scenario: "No links" variant still looks tidy
    Given the footer variant with no navigation links
    Then the copyright/branding content is well-spaced, with no leftover empty gaps

  @manual
  Scenario: Every footer link is reachable by keyboard
    Given the footer navigation variant
    When a user tabs through it
    Then every link receives visible focus in a sensible order
```

## Additional implementation advice

These aren't testable against the isolated component in this library — they depend on how the page or service around it is actually built (form re-submission, cross-page consistency, backend session timing, and so on). The component library can describe and support the pattern, but only the real integration can prove it's correct. Worth checking whenever a service uses this component.

- **Help links sit in the same place and behave the same on every page** (WCAG 2.2 SC 3.2.6) — a cross-page consistency concern for the service as a whole, not verifiable from a single footer instance.
