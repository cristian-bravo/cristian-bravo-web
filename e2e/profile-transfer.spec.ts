import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from './fixtures';

const visualDirectory = path.resolve('.cache/profile-transfer/visual');

for (const { prefix, chips, viewport } of [
  {
    prefix: '',
    chips: ['Full Stack', 'Producto', 'Arquitectura', 'Escalabilidad', 'Sistemas', 'Aplicaciones web', 'UI/UX'],
    viewport: { width: 1440, height: 900 },
  },
  {
    prefix: '/en',
    chips: ['Full Stack', 'Product', 'Architecture', 'Scalability', 'Systems', 'Web apps', 'UI/UX'],
    viewport: { width: 390, height: 844 },
  },
]) {
  test(`portfolio uses the requested portrait and combines both sets of skills ${prefix || 'es'}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`${prefix}/proyectos`);
    const hero = page.locator('.ps-hero');
    const card = hero.locator('.profile-identity-card');
    await expect(card).toHaveCount(1);
    await expect(hero.locator('img')).toHaveCount(1);
    await expect(card.locator('img')).toHaveAttribute('src', '/avatar/avatar_1.webp');
    await expect.poll(() => card.locator('img').evaluate((node) => {
      const image = node as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    })).toBe(true);
    await expect(card.locator('.profile-identity-card__chip')).toHaveText(chips);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    await mkdir(visualDirectory, { recursive: true });
    await card.screenshot({ path: path.join(visualDirectory, `projects-${prefix ? 'en' : 'es'}-card.png`) });
  });
}

for (const { width, height } of [
  { width: 320, height: 760 },
  { width: 390, height: 844 },
  { width: 858, height: 900 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
]) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`profile introduces Cristian over the wallpaper with four reachable links at ${width}x${height} ${colorScheme}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto('/perfil/cristian-bravo');
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator('[data-profile-hero]');
      await expect(hero.locator('.profile-avatar-section, .profile-avatar-stage, .profile-identity-card')).toHaveCount(0);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(hero.locator('h1')).toHaveText(/Cristian\s*Bravo/);
      await expect(page.locator('.profile-expertise-section h2')).toBeAttached();
      const intro = hero.locator('.profile-hero-intro');
      await expect(intro).toBeVisible();
      const introRect = await intro.boundingBox();
      expect(introRect).not.toBeNull();
      expect(introRect!.x).toBeGreaterThanOrEqual(0);
      expect(introRect!.x + introRect!.width).toBeLessThanOrEqual(width);
      expect(introRect!.y).toBeGreaterThanOrEqual(0);
      expect(introRect!.y + introRect!.height).toBeLessThanOrEqual(height);
      const video = hero.locator(`video.profile-hero-background--${colorScheme}`);
      await expect(video).toBeVisible();
      await expect(video.locator('source')).toHaveAttribute('src', colorScheme === 'dark'
        ? '/wallpapers/videos/avatar_clean.mp4'
        : '/wallpapers/videos/avatar_pets.mp4');
      await expect.poll(() => video.evaluate((node) => (node as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
      await expect(hero.locator('[data-profile-quick-link]')).toHaveCount(4);

      const links = await hero.locator('[data-profile-quick-link]').evaluateAll((nodes) => nodes.map((node) => {
        const surface = node.querySelector('.profile-contact-link__icon')!;
        const rect = surface.getBoundingClientRect();
        const target = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return {
          href: node.getAttribute('href'),
          accessibleName: node.getAttribute('aria-label'),
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          reachable: target !== null && node.contains(target),
        };
      }));
      expect(new Set(links.map((link) => link.href)).size).toBe(4);
      for (const link of links) {
        expect(link.accessibleName).toBeTruthy();
        expect(link.width).toBeGreaterThanOrEqual(44);
        expect(link.height).toBeGreaterThanOrEqual(44);
        expect(link.left).toBeGreaterThanOrEqual(0);
        expect(link.right).toBeLessThanOrEqual(width);
        expect(link.top).toBeGreaterThanOrEqual(0);
        expect(link.bottom).toBeLessThanOrEqual(height);
        expect(link.reachable, `${link.href} can be clicked without an overlay intercepting it`).toBe(true);
      }
      const projectLink = await intro.locator('.profile-hero-intro__link').boundingBox();
      expect(Math.min(...links.map((link) => link.top))).toBeGreaterThan(projectLink!.y + projectLink!.height + 20);
      expect(Math.max(...links.map((link) => link.top)) - Math.min(...links.map((link) => link.top))).toBeLessThan(1);
      expect(links[0].left).toBeGreaterThanOrEqual(introRect!.x);
      expect(links[3].right).toBeLessThanOrEqual(introRect!.x + introRect!.width);
      for (let index = 0; index < links.length; index += 1) {
        for (const other of links.slice(index + 1)) {
          const current = links[index];
          const overlaps = current.left < other.right && current.right > other.left
            && current.top < other.bottom && current.bottom > other.top;
          expect(overlaps).toBe(false);
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await mkdir(visualDirectory, { recursive: true });
      await page.screenshot({ path: path.join(visualDirectory, `profile-${width}-${colorScheme}.png`) });
    });
  }
}
