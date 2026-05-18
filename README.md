# NHSW Style Library

A starter SCSS component library using Dart Sass, with all source files under src and a single compiled CSS output at dist/nhsw.css.

## Folder structure

`	ext
nhsw-style-library/
├─ package.json
├─ .gitignore
├─ README.md
├─ dist/
│  └─ nhsw.css
└─ src/
   ├─ index.scss
   ├─ tokens/
   │  ├─ _index.scss
   │  └─ _colours.scss
   ├─ utilities/
   │  ├─ _index.scss
   │  └─ _focus-ring.scss
   ├─ foundations/
   │  ├─ _index.scss
   │  └─ _input-base.scss
   └─ components/
      ├─ _index.scss
      └─ forms/
         ├─ _index.scss
         ├─ _input.scss
         ├─ _textarea.scss
         └─ _select.scss
`

## What each folder is for

### src/
Your authored Sass source code. Everything you write lives here.

### src/tokens/
Design tokens: reusable values such as colours, spacing, font sizes, borders, and other raw design values.

### src/utilities/
Small reusable helpers such as mixins, functions, and utility snippets.

### src/foundations/
Shared styling recipes used by multiple components. These are not directly used in markup.

### src/components/
Real UI components that you apply in markup.

### src/components/forms/
Form-related components such as inputs, textareas, and selects.

### dist/
Compiled output. Do not edit files here by hand.

## What each file is for

### src/index.scss
The single Sass entry point that pulls everything together into one compiled CSS file.

### src/tokens/_index.scss
Barrel file that forwards token files.

### src/tokens/_colours.scss
Colour tokens and semantic aliases for components.

### src/utilities/_index.scss
Barrel file for utilities.

### src/utilities/_focus-ring.scss
Shared focus-ring mixin.

### src/foundations/_index.scss
Barrel file for shared foundations.

### src/foundations/_input-base.scss
Reusable base input mixin.

### src/components/_index.scss
Barrel file for component groups.

### src/components/forms/_index.scss
Barrel file for form components.

### src/components/forms/_input.scss
Defines the generic .nhsw-input component and includes the input base once.

### src/components/forms/_textarea.scss
Textarea-only overrides.

### src/components/forms/_select.scss
Select-only overrides.

## Colour palette

`scss
-colour-text-primary: #212b32;
-colour-text-secondary: #4c6272;
-colour-text-exceptional: #ffffff;
-colour-text-blue: #1b365d;

-colour-link: #005aa8;

-colour-button-primary: #1b365d;
-colour-button-secondary: #4c6272;
-colour-button-delete: #d5281b;
-colour-button-exceptional-light: #f5bb66;

-colour-background-grey: #f0f4f5;
-colour-background-white: #ffffff;
-colour-background-blue: #1b365d;

-colour-border-primary: #212b32;
-colour-border-secondary: #4c6272;
-colour-border-grey: #d8dde0;
-colour-border-gold: #aa8630;

-colour-shadow-primary-button: #0e1b2f;
-colour-shadow-exceptional-button: #554318;

-colour-focus: #ffeb3b;
`

## Why .nhsw-input is better than repeating the mixin everywhere

If you include the same mixin into many selectors, Sass will inline the CSS each time. That means repeated output.

This is better:

`scss
.nhsw-input {
  @include base.nhsw-input-base;
}

textarea.nhsw-input {
  min-height: 6rem;
  resize: vertical;
}

select.nhsw-input {
  padding-right: 2.5rem;
}
`

That way the shared base CSS is emitted once, and only the differences are emitted separately.

## Starter SCSS files

### src/index.scss

`scss
@forward "tokens";
@forward "utilities";
@forward "foundations";
@forward "components";
`

### src/tokens/_index.scss

`scss
@forward "colours";
`

### src/tokens/_colours.scss

`scss
-colour-text-primary: #212b32;
-colour-text-secondary: #4c6272;
-colour-text-exceptional: #ffffff;
-colour-text-blue: #1b365d;

-colour-link: #005aa8;

-colour-button-primary: #1b365d;
-colour-button-secondary: #4c6272;
-colour-button-delete: #d5281b;
-colour-button-exceptional-light: #f5bb66;

-colour-background-grey: #f0f4f5;
-colour-background-white: #ffffff;
-colour-background-blue: #1b365d;

-colour-border-primary: #212b32;
-colour-border-secondary: #4c6272;
-colour-border-grey: #d8dde0;
-colour-border-gold: #aa8630;

-colour-shadow-primary-button: #0e1b2f;
-colour-shadow-exceptional-button: #554318;

-colour-focus: #ffeb3b;

// semantic aliases for form controls
-colour-input-text: -colour-text-primary;
-colour-input-placeholder: -colour-text-secondary;
-colour-input-background: -colour-background-white;
-colour-input-border: -colour-border-secondary;
-colour-input-border-hover: -colour-border-primary;
-colour-input-focus: -colour-focus;
-colour-input-invalid: -colour-button-delete;
-colour-input-disabled-background: -colour-background-grey;
-colour-input-disabled-text: -colour-text-secondary;
`

### src/utilities/_index.scss

`scss
@forward "focus-ring";
`

### src/utilities/_focus-ring.scss

`scss
@use "../tokens/colours" as c;

@mixin nhsw-focus-ring {
  outline: 3px solid c.-colour-input-focus;
  outline-offset: 0;
}
`

### src/foundations/_index.scss

`scss
@forward "input-base";
`

### src/foundations/_input-base.scss

`scss
@use "../tokens/colours" as c;
@use "../utilities/focus-ring" as u;

@mixin nhsw-input-base {
  display: block;
  width: 100%;
  min-height: 2.5rem;
  padding: 0.625rem 0.75rem;
  box-sizing: border-box;
  border: 1px solid c.-colour-input-border;
  border-radius: 0;
  background-color: c.-colour-input-background;
  color: c.-colour-input-text;
  font: inherit;
  line-height: 1.5;
  appearance: none;

  &::placeholder {
    color: c.-colour-input-placeholder;
    opacity: 1;
  }

  &:hover {
    border-color: c.-colour-input-border-hover;
  }

  &:focus {
    @include u.nhsw-focus-ring;
  }

  &:disabled,
  &[disabled] {
    background-color: c.-colour-input-disabled-background;
    color: c.-colour-input-disabled-text;
    cursor: not-allowed;
    opacity: 1;
  }

  &[aria-invalid="true"],
  &.nhsw-is-invalid {
    border-color: c.-colour-input-invalid;
  }
}
`

### src/components/_index.scss

`scss
@forward "forms";
`

### src/components/forms/_index.scss

`scss
@forward "input";
@forward "textarea";
@forward "select";
`

### src/components/forms/_input.scss

`scss
@use "../../foundations/input-base" as base;

.nhsw-input {
  @include base.nhsw-input-base;
}
`

### src/components/forms/_textarea.scss

`scss
textarea.nhsw-input {
  min-height: 6rem;
  resize: vertical;
}
`

### src/components/forms/_select.scss

`scss
select.nhsw-input {
  padding-right: 2.5rem;
}
`

## Setup and build

Install dependencies:

`powershell
npm.cmd install
`

Build once:

`powershell
npm.cmd run build:css
`

Watch for changes:

`powershell
npm.cmd run watch:css
`

Use 
pm.cmd in PowerShell if 
pm.ps1 is blocked by execution policy.
