import { test, expect } from './fixtures';

const viewportCases = [
  [320, 760], [375, 812], [640, 900], [768, 900], [858, 900],
  [860, 900], [900, 900], [1024, 900], [1119, 900], [1120, 700],
  [1120, 900], [1280, 720], [1366, 768], [1440, 900], [1920, 1080],
] as const;

for (const [width, height] of viewportCases) {
  test(`projects maintain header clearance and readable content at ${width}×${height}`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/proyectos');
    await page.evaluate(() => document.fonts.ready);
    // Measure final positions without waiting through every scene transition.
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });

    const desktop = width >= 1120 && height >= 700;
    await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', desktop ? 'scene' : 'native');
    const header = page.locator('.header-frame');
    const headerBox = await header.boundingBox();
    const heroBox = await page.locator('.ps-hero').boundingBox();
    expect(headerBox).not.toBeNull();
    expect(heroBox).not.toBeNull();
    expect(heroBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height + 15);
    expect(headerBox!.height).toBeLessThan(120);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    if (width < 1120) {
      const toggle = page.locator('[data-header-menu-toggle]');
      await expect(toggle).toBeVisible();
      await expect(page.locator('[data-header-nav]')).toBeHidden();
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('[data-header-mobile-panel]')).toHaveAttribute('aria-hidden', 'false');
      await expect(page.locator('[data-header-mobile-link]').first()).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    } else {
      await expect(page.locator('[data-header-menu-toggle]')).toBeHidden();
      const navBox = await page.locator('[data-header-nav]').boundingBox();
      const actionBox = await page.locator('.header-actions').boundingBox();
      expect(navBox!.y).toBeGreaterThan(headerBox!.y);
      expect(navBox!.height).toBeLessThan(60);
      expect(navBox!.x + navBox!.width).toBeLessThanOrEqual(actionBox!.x);
    }

    const scenes = page.locator('[data-ps-scene]');
    for (let index = 0; index < await scenes.count(); index += 1) {
      const scene = scenes.nth(index);
      if (desktop) {
        await page.evaluate((i) => window.scrollTo({ top: i * innerHeight * 0.58, behavior: 'instant' }), index);
        await expect(scene).toHaveClass(/is-active/);
        const content = await scene.locator('.ps-scene__inner').boundingBox();
        const currentHeader = await header.boundingBox();
        expect(content!.y, `scene ${index} clears header`).toBeGreaterThanOrEqual(currentHeader!.y + currentHeader!.height + 15);
        expect(content!.y + content!.height, `scene ${index} fits vertically`).toBeLessThanOrEqual(height - 15);
      } else {
        await expect(scene).not.toHaveAttribute('inert', '');
      }

      const clippedContent = await scene.locator('.ps-project-feature__copy, .ps-project-feature__title, .ps-project-feature__actions, .ps-project-feature__tags').evaluateAll((elements) => elements.filter((element) => element.scrollWidth > element.clientWidth + 1).map((element) => element.className));
      expect(clippedContent, `scene ${index} does not clip text or actions`).toEqual([]);
    }
  });
}
