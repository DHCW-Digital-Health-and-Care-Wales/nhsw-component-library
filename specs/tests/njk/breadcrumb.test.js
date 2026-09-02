import { describe, it, expect, beforeAll } from 'vitest';
import { configure } from '../../../src/nunjucks.config.js';

describe('nhswBreadcrumb never renders a non-link "current page" item', () => {
  let env;
  beforeAll(() => {
    env = configure({ noCache: true });
  });

  const data = {
    items: [
      { text: 'Home', href: '/' },
      { text: 'NHS services', href: '/nhs-services' },
      { text: 'Hospitals', href: '/hospitals' },
    ],
  };

  it('renders every item, including the last one, as a real link', () => {
    const html = env.renderString(
      '{% from "breadcrumb/macro.njk" import nhswBreadcrumb %}{{ nhswBreadcrumb(data) }}',
      { data },
    );
    expect(html).not.toContain('nhsw-breadcrumb__current');
    expect(html).not.toContain('aria-current');
    expect(html.match(/nhsw-breadcrumb__link/g) || []).toHaveLength(3);
    expect(html).toMatch(/<a class="nhsw-breadcrumb__link" href="\/hospitals">Hospitals<\/a>/);
  });

  it('mobile "Back to" link points at the last item in items', () => {
    const html = env.renderString(
      '{% from "breadcrumb/macro.njk" import nhswBreadcrumb %}{{ nhswBreadcrumb(data) }}',
      { data },
    );
    expect(html).toMatch(/nhsw-breadcrumb__mobile-back[\s\S]*href="\/hospitals"[\s\S]*Back to Hospitals/);
  });
});
