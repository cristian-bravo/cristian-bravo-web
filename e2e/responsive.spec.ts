import { test, expect, routes, viewports } from './fixtures';

for (const viewport of viewports) {
  test.describe(`${viewport.width}px`, () => {
    test.use({ viewport });
    for (const route of routes) {
      test(`${route} loads, fits and exposes usable content`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
          if (/violates the following Content Security Policy|Refused to execute/i.test(message.text())) errors.push(message.text());
        });
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        await expect(page.locator('main')).toHaveCount(1);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('[data-yuki-open]')).toBeVisible();
        const dimensions = await page.evaluate(() => ({
          width: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          clippedControls: Array.from(document.querySelectorAll('main input:not([type="hidden"]), main textarea, main select')).filter((node) => {
            const rect = node.getBoundingClientRect();
            return rect.width > 0 && (rect.left < -1 || rect.right > window.innerWidth + 1);
          }).map((node) => node.outerHTML.slice(0, 180)),
        }));
        expect(dimensions.scrollWidth, 'Document must not scroll horizontally').toBeLessThanOrEqual(dimensions.width + 1);
        expect(dimensions.clippedControls, 'Form controls must fit the screen').toEqual([]);
        expect(errors, 'No runtime or CSP errors').toEqual([]);
        await expect(page.locator('html')).toHaveAttribute('lang', route.startsWith('/en') ? 'en' : 'es');
      });
    }
  });
}

for (const viewport of [viewports[0], viewports[1], viewports[2], viewports[4]]) {
  test(`Yuki fits the available ${viewport.width}px screen when opened`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.locator('[data-yuki-open]').click();
    await expect(page.locator('[data-yuki-panel]')).toBeVisible();
    const bounds = await page.locator('[data-yuki-panel]').boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height + 1);
    await expect(page.locator('[data-yuki-input]')).toBeInViewport();
    await expect(page.locator('[data-yuki-send]')).toBeInViewport();
  });
}

for (const viewport of [{ width: 320, height: 568 }, { width: 844, height: 390 }]) {
  test(`short-screen Yuki remains reachable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.locator('[data-yuki-open]').click();
    const panel = page.locator('[data-yuki-panel]');
    const bounds = await panel.boundingBox();
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height + 1);
    await page.locator('[data-yuki-send]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-yuki-send]')).toBeInViewport();
    await page.locator('[data-yuki-close]').click();
    await expect(panel).toBeHidden();
  });
}
