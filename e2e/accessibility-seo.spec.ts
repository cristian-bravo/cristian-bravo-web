import AxeBuilder from '@axe-core/playwright';
import { test, expect, routes } from './fixtures';

for (const route of routes) {
  test(`SEO document contract ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveTitle(route.endsWith('/perfil/cristian-bravo') ? /Cristian/i : /CYSTEMS/i);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length).toBeGreaterThan(40);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://cystems.ec${route === '/' ? '/' : route}`);
    await expect(page.locator('link[hreflang="es"]')).toHaveAttribute('href', /^https:\/\/cystems\.ec\//);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', /^https:\/\/cystems\.ec\/en/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\//);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', route.endsWith('/blog') ? /noindex/ : /^index, follow/);
    const structured = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(structured.length).toBeGreaterThan(0);
    for (const json of structured) expect(() => JSON.parse(json)).not.toThrow();
    await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#main-content');
    await expect(page.locator('#main-content')).toHaveCount(1);
    const unsafeLinks = await page.locator('a[target="_blank"]').evaluateAll((links) => links
      .filter((link) => !/(noopener|noreferrer)/.test(link.getAttribute('rel') || ''))
      .map((link) => link.getAttribute('href')));
    expect(unsafeLinks).toEqual([]);
  });

  for (const width of [390, 1440]) {
    test(`WCAG A/AA ${route} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      await testInfo.attach('axe-results', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
      expect(results.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
    });
  }
}

test('public crawler files are discoverable and sitemap uses HTTPS canonical URLs', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toMatch(/Sitemap:\s*https:\/\/cystems\.ec\/sitemap/i);
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('https://cystems.ec/');
  expect(body).not.toMatch(/localhost|127\.0\.0\.1/);
  const locations = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(new Set(locations).size).toBe(locations.length);
  expect(locations).toHaveLength(16);
  expect(locations.some((url) => url.includes('/blog'))).toBe(false);
  for (const url of locations) {
    const canonicalPage = await request.get(new URL(url).pathname);
    expect(canonicalPage.status(), url).toBe(200);
  }
});

test('all first-party links and displayed image assets resolve', async ({ page, request }) => {
  const urls = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const links = await page.locator('a[href], img[src]').evaluateAll((elements) => elements
      .map((element) => element.getAttribute(element.tagName === 'IMG' ? 'src' : 'href') || '')
      .filter((url) => url.startsWith('/') && !url.startsWith('//'))
      .map((url) => url.split('#')[0]));
    links.filter(Boolean).forEach((url) => urls.add(url));
  }
  const failures: string[] = [];
  for (const url of urls) {
    const response = await request.head(url);
    if (response.status() >= 400) failures.push(`${response.status()} ${url}`);
  }
  expect(failures).toEqual([]);
});

test('legacy request URLs consolidate with permanent redirects', async ({ request }) => {
  for (const prefix of ['', '/en']) {
    for (const legacy of ['solicitar-servicio', 'solicitar-desarrollo']) {
      for (const suffix of ['', '/simple', '/proyecto']) {
        const response = await request.get(`${prefix}/${legacy}${suffix}`, { maxRedirects: 0 });
        expect(response.status()).toBe(301);
        expect(response.headers().location).toBe(`${prefix}/empezar-proyecto${suffix}`);
      }
    }
  }
});

for (const route of ['/not-a-cystems-page', '/en/not-a-cystems-page', '/blog/nonexistent-article', '/en/blog/nonexistent-article']) {
  test(`missing page returns a useful unindexed 404: ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('html')).toHaveAttribute('lang', route.startsWith('/en/') ? 'en' : 'es');
  });
}

for (const route of ['/', '/servicios', '/proyectos', '/perfil/cristian-bravo', '/empezar-proyecto/simple', '/empezar-proyecto/proyecto', '/contacto']) {
  for (const width of [390, 1440]) {
    test(`dark theme WCAG ${route} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto(route);
      await expect(page.locator('html')).toHaveClass(/dark/);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      await testInfo.attach('axe-dark-results', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
      expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
    });
  }
}
