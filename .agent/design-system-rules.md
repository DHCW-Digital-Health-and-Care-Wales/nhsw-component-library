# NHSW design system rules

Generate static HTML preview/documentation pages only.

Please note that our organisation is called Digital Health and Care Wales, so branding should reflect this. Do not use NHS branding or logos. When putting the logo in, under the docs folder, there's an assets/nhsw-logo file that should be used for the logo.

Use existing classes:
- nhsw-site-header
- nhsw-main-wrapper
- nhsw-width-container
- nhsw-site-footer
- nhsw-body
- nhsw-h1 to nhsw-h5
- nhsw-form-group
- nhsw-label
- nhsw-hint
- nhsw-error-message
- nhsw-input
- nhsw-select
- nhsw-textarea
- nhsw-link
- nhsw-inset-text
- nhsw-warning-callout

Do not create inline styles unless explicitly asked.
Do not invent new component classes unless the request asks for a new component.
Do not use placeholder CSS.
Keep pages accessible:
- labels must use for/id
- hints and errors must use aria-describedby
- error fields must use aria-invalid="true"
- main must use id="maincontent"