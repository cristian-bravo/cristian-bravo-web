import { test, expect } from './fixtures';

for (const [name, route] of [
  ['home', '/'],
  ['services', '/servicios'],
  ['projects', '/proyectos'],
  ['start', '/empezar-proyecto'],
  ['rescue', '/empezar-proyecto/simple?intent=rescue'],
]) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    test(`visual review ${name} ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `test-results/visual-review/${name}-${viewport.width}-fold.png`,
        animations: 'disabled',
      });
      await page.screenshot({
        path: `test-results/visual-review/${name}-${viewport.width}-full.png`,
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}
