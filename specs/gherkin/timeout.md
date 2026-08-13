# Timeout

**Component classes:** `.nhsw-timeout-modal`, `[data-nhsw-timeout-countdown]`, `[data-nhsw-timeout-live]`, `[data-nhsw-timeout-dismiss]`
**Doc page:** `preview/content/timeout.html`
**Source:** `src/components/content/_timeout-modal.scss`, behaviour in `preview/assets/nhsw-docs.js`
**Example fixtures:** `timeout-default.html`, `timeout-mobile.html`

## Automated test coverage

```gherkin
Feature: Timeout — automated coverage

  Rule: Countdown behaviour

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: Countdown ticks down every second and pluralises correctly
      Given a countdown starting at 65 seconds ("1 minute and 5 seconds")
      When 1 second elapses
      Then the text reads "1 minute and 4 seconds"
      When a further 4 seconds elapse (5 total)
      Then the text reads "1 minute and 0 seconds"
      When 1 more second elapses (6 total)
      Then the text reads "59 seconds" (minutes unit dropped once it hits zero)

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: The live region updates only every 15 ticks, not every second
      Given the countdown is running
      When 14 seconds elapse
      Then the live region is still empty
      When the 15th second elapses
      Then the live region announces "50 seconds remaining"

    @automated
    # specs/tests/js/docs-behaviors.test.js
    Scenario: Dismissing the modal stops the countdown and closes it
      Given the timeout modal is open and counting down
      When the user activates the dismiss ("Stay logged in") button
      Then the modal's open attribute is removed
      And the countdown text does not change even after further time passes
      # Also regression-guards the fallback path for jsdom's <dialog>, which has
      # no real close(): the component falls back to removeAttribute('open').
```

> `figma-tokens.test.js`'s comment notes that Timeout has no Figma page at all, so there is no dedicated visual spec test for it.

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: Timeout — manual verification

  @manual
  Scenario: Users can extend their session as many times as they need (WCAG 2.2 SC 2.2.1)
    Given a user repeatedly hits the timeout warning
    Then they can dismiss/extend it every time, with no limit on how many times

  @manual
  Scenario: Focus returns to what the user was doing before the modal appeared
    Given a user was focused on a form field when the timeout modal opened
    When they dismiss the modal
    Then focus returns to that same field

  @manual
  Scenario: Dialog heading is announced when it opens
    Given the timeout modal opens
    When a screen reader user is on the page
    Then they hear the modal's heading announced as its title

  @manual
  Scenario: Mobile version stays usable on a small screen
    Given the mobile version of the timeout modal
    Then the countdown, message and dismiss button all stay visible and usable without scrolling issues

  @manual
  Scenario: Server session length gives enough time for the on-screen warning to work
    Given the "server requirements" guidance on the doc page
    Then the real server session expiry allows enough time for the warning-and-extend flow to complete
```
