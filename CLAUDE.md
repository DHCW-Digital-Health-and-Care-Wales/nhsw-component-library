# NHSW Style Library Agent Instructions

You are working on the NHSW Sass component library.

## Always read first

Before creating or changing pages, read:

- .agent/design-system-rules.md
- .agent/component-registry.md
- preview/index.html
- src/index.scss
- src/components/_index.scss

## Purpose

This project is a Sass-based NHS Wales style/component library.

The goal is to create consistent, accessible static HTML preview and example pages using existing NHSW classes.

## Page generation rules

When asked to create a page:

- Use existing components before inventing new ones.
- Use the standard page shell:
  - nhsw-site-header
  - nhsw-main-wrapper
  - nhsw-width-container or nhsw-fluid-container
  - nhsw-site-footer
- Add the page under `preview/`.
- Link the page from `preview/index.html` if appropriate.
- Do not add inline styles unless explicitly asked.
- Do not invent colours, typography, spacing or one-off CSS.
- Use existing tokens and classes.

## Accessibility rules

- Every input must have a visible label.
- Labels must use matching `for` and `id`.
- Hint and error text must be connected with `aria-describedby`.
- Invalid fields must use `aria-invalid="true"`.
- Date inputs must use `fieldset` and `legend`.
- Do not use placeholder text as a label.

## Build command

After changing SCSS or preview pages, run:

npm.cmd run build:css

If working in a non-Windows shell, use:

npm run build:css

## Review

After generation, summarise:
- files changed
- components used
- any assumptions made
