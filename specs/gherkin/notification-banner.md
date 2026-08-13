# Notification banner

**Component classes:** `.nhsw-notification-banner`, `--success`, `__header`, `__title`, `__content`, `__heading`, `__link`
**Doc page:** `preview/callouts/notification-banner.html`
**Source:** `src/components/callouts/_notification-banner.scss`
**Example fixtures:** `notification-banner-default.html`, `notification-banner-service.html`, `notification-banner-success.html`

## Automated test coverage

```gherkin
Feature: Notification banner — automated coverage

  Rule: Visual spec matches Figma Attention banner (Important variant)

    @automated
    # specs/tests/css/component-specs.test.js
    Scenario: Header background uses the correct dark-blue token
      Given the compiled CSS for .nhsw-notification-banner__header
      Then the background colour is #004281 (Extended/blue-dark), not the generic link-blue token

  Rule: Documented classes stay honest against the compiled stylesheet

    @automated
    # specs/tests/css/component-registry.test.js
    Scenario: Every class named in the component registry exists in the compiled CSS
      Given .agent/component-registry.md documents nhsw-notification-banner, --success, __header, __title, __content, __heading, __link
      Then each of those selectors is present in the compiled output
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Notification banner — manual verification

  @manual
  Scenario: Heading plus colour, not colour alone, shows what kind of banner it is (WCAG 2.2 SC 1.4.1)
    Given a notification banner (default or success)
    Then it has a text heading ("Important"/"Success") as well as its colour treatment

  @manual
  Scenario: Success banner is announced automatically to screen readers
    Given a success banner appears after an action, e.g. a form submission
    Then a screen reader announces it without the user needing to go and find it

  @manual
  Scenario: Link inside the banner is clearly distinguishable and works
    Given a notification banner containing a link
    When the link is selected
    Then it's visually distinct from the surrounding text and navigates correctly

  @manual
  Scenario: Same heading text reused consistently across a service (WCAG 2.2 SC 3.2.4)
    Given this banner type appears on more than one page
    Then it uses the same heading text each time, so users learn to recognise it
```
