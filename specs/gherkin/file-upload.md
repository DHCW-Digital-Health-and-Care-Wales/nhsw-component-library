# File upload

**Component classes:** `.nhsw-file-upload`, `.nhsw-file-upload__status`, `.nhsw-file-upload__actions`
**Doc page:** `preview/actions/file-upload.html`
**Source:** `src/components/forms/_file-upload.scss`
**Example fixtures:** `file-upload-default.html`, `file-upload-reverse.html`

## Automated test coverage

```gherkin
Feature: File upload — automated coverage

  Rule: Visual spec matches Figma "Upload a file" component

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Dashed drop-zone box
      Given the compiled CSS for .nhsw-file-upload
      Then the border is a 1px dashed line in the secondary colour (#4c6272)
      And padding is 28px on all sides
      And the internal gap is 20px

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Status readout padding
      Given the compiled CSS for .nhsw-file-upload__status
      Then padding is 10px on all sides

    @automated
    # specs/tests/css/component-specs-2.test.js
    Scenario: Actions row gap
      Given the compiled CSS for .nhsw-file-upload__actions
      Then the gap between actions is 20px

  Rule: The file input itself always has a real, associated label

    @automated
    # specs/tests/markup/accessibility.test.js
    Scenario Outline: Visible inputs have an associated label
      Given the "<fixture>" example fixture
      Then every visible input (including the file input) has a <label for> pointing at its id

      Examples:
        | fixture                    |
        | file-upload-default.html   |
        | file-upload-reverse.html   |
```

## Manual test scenarios

Practical checks — look at the component and try it, no special tools needed unless noted. Where a check comes from an accessibility guideline, the WCAG reference is included in the scenario name so it's clear why it's there, without needing the full guideline spelled out.

```gherkin
Feature: File upload — manual verification

  @manual
  Scenario: Choosing a file opens the OS file picker and shows the file name after
    Given an empty file upload
    When a file is chosen via the OS file picker
    Then the selected file's name appears in the status area

  @manual
  Scenario: Reusing a previously uploaded file works, without re-uploading from disk
    Given the "let users reuse uploaded files" pattern
    When a user returns to the upload step
    Then they can pick a file they uploaded earlier instead of browsing their device again

  @manual
  Scenario: Mobile version stays usable on a small screen
    Given the mobile version of the file upload
    Then all its controls remain reachable and readable without odd wrapping or overlap

  @manual
  Scenario: Works for speech-recognition (Dragon) users after one extra interaction
    Given a user operating with Dragon NaturallySpeaking
    When they land on the page containing the file upload for the first time
    Then they may need to first click/tap elsewhere on the page once before the upload control responds — check this doesn't block them entirely
```
