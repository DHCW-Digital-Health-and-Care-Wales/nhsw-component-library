# Component test specs

One file per documented component under `preview/`. Each file has two sections:

- **Automated test coverage** — Gherkin scenarios tagged `@automated`, each citing the exact spec file in `specs/tests/` that already verifies it. These exist for traceability; don't re-run them by hand, and update them if the cited test changes.
- **Manual test scenarios** — Gherkin scenarios tagged `@manual`. These are the ones a human (or a dedicated a11y/browser tool) needs to actually run — mostly real-browser rendering, contrast, screen reader behaviour, and keyboard/focus flows that the CSS-compilation and JSDOM-based automated suite can't observe.

Where a component has little or no automated coverage (e.g. it isn't named in `.agent/component-registry.md`/`design-system-rules.md` and has no dedicated Figma spec test), that gap is called out explicitly at the top of the Manual section rather than left implicit.

## Index

| Category | Components |
|---|---|
| Actions | [action-link](action-link.md), [back-link](back-link.md), [breadcrumb](breadcrumb.md), [error-summary](error-summary.md), [expander](expander.md), [file-upload](file-upload.md), [skip-link](skip-link.md) |
| Callouts | [notification-banner](notification-banner.md), [warning-callout](warning-callout.md), [warning-text](warning-text.md) |
| Components | [buttons](buttons.md) |
| Content | [cards](cards.md), [details](details.md), [inset-text](inset-text.md), [pagination](pagination.md), [panel](panel.md), [summary-list](summary-list.md), [table](table.md), [tabs](tabs.md), [tag](tag.md) |
| Forms | [checkboxes](checkboxes.md), [date-input](date-input.md), [input](input.md), [radios](radios.md), [select](select.md), [textarea](textarea.md) |
| Site | [footer](footer.md), [header](header.md), [site-navigation](site-navigation.md) |

## Keeping this in sync

These are documentation, not executable specs — nothing in `npm test` reads this folder. If an automated test in `specs/tests/` is added, removed, or its assertions change, update the corresponding `@automated` scenario(s) here so the "already covered" claim stays true.
