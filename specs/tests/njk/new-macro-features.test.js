import { describe, it, expect, beforeAll } from 'vitest';
import { configure } from '../../../src/nunjucks.config.js';

describe('nhswCard previewSrc renders the framed preview variant', () => {
  let env;
  beforeAll(() => {
    env = configure({ noCache: true });
  });

  it('renders nhsw-card__preview wrapping nhsw-card__preview-image with the given src/alt', () => {
    const html = env.renderString(
      '{% from "card/macro.njk" import nhswCard %}{{ nhswCard(data) }}',
      { data: { title: 'Appointments', previewSrc: '/assets/example.jpg', previewAlt: 'Preview' } },
    );
    expect(html).toMatch(/<div class="nhsw-card__preview">\s*<img class="nhsw-card__preview-image" src="\/assets\/example\.jpg" alt="Preview">/);
  });

  it('does not also render the flush nhsw-card__image variant', () => {
    const html = env.renderString(
      '{% from "card/macro.njk" import nhswCard %}{{ nhswCard(data) }}',
      { data: { title: 'Appointments', previewSrc: '/assets/example.jpg', imageSrc: '/assets/should-be-ignored.jpg' } },
    );
    expect(html).not.toMatch(/nhsw-card__image"/);
  });
});

describe('nhswHeader nav param renders nhswSiteNavigation in the right place', () => {
  let env;
  beforeAll(() => {
    env = configure({ noCache: true });
  });

  it('renders the nav items, positioned after </header> and before the hero band', () => {
    const html = env.renderString(
      '{% from "header/macro.njk" import nhswHeader %}{{ nhswHeader(data) }}',
      {
        data: {
          serviceName: 'Service name',
          nav: { items: [{ text: 'Appointments', href: '/appointments', current: true }] },
          hero: { title: 'Manage your care online' },
        },
      },
    );
    const headerEnd = html.indexOf('</header>');
    const navStart = html.indexOf('nhsw-site-header__nav');
    const heroStart = html.indexOf('nhsw-site-header__hero-band');

    expect(headerEnd).toBeGreaterThan(-1);
    expect(navStart).toBeGreaterThan(headerEnd);
    expect(heroStart).toBeGreaterThan(navStart);
    expect(html).toMatch(/nhsw-site-header__nav-link--current[^>]*aria-current="page"/);
    expect(html).toContain('Appointments');
  });

  it('renders no nav markup when the nav param is omitted', () => {
    const html = env.renderString(
      '{% from "header/macro.njk" import nhswHeader %}{{ nhswHeader(data) }}',
      { data: { serviceName: 'Service name' } },
    );
    expect(html).not.toContain('nhsw-site-header__nav-list');
  });
});

describe('nhswButton as: "label" renders a label instead of a button/anchor', () => {
  let env;
  beforeAll(() => {
    env = configure({ noCache: true });
  });

  it('renders <label for="..."> with the given classes, not a <button> or <a>', () => {
    const html = env.renderString(
      '{% from "button/macro.njk" import nhswButton %}{{ nhswButton(data) }}',
      { data: { as: 'label', for: 'my-input', text: 'Choose file', classes: 'nhsw-button--secondary' } },
    ).trim();
    expect(html).toMatch(/^<label class="nhsw-button nhsw-button--secondary" for="my-input">Choose file<\/label>$/);
  });
});

describe('nhswFileUpload still renders its button via nhswButton unchanged', () => {
  let env;
  beforeAll(() => {
    env = configure({ noCache: true });
  });

  it('renders the exact same "Choose file" label markup as before the nhswButton refactor', () => {
    const html = env.renderString(
      '{% from "file-upload/macro.njk" import nhswFileUpload %}{{ nhswFileUpload(data) }}',
      { data: { id: 'evidence' } },
    );
    expect(html).toContain(
      '<label class="nhsw-button nhsw-button--secondary nhsw-button--inline nhsw-file-upload__button" for="evidence">Choose file</label>',
    );
  });
});
