import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';

const visualDirectory = path.resolve('.cache/profile-journey/visual');

const sceneTarget = (page: Page, index: number) => page.evaluate((sceneIndex) => {
  const journey = document.querySelector<HTMLElement>('[data-profile-journey]')!;
  const stage = journey.querySelector<HTMLElement>('[data-profile-stage]')!;
  return journey.getBoundingClientRect().top + window.scrollY + sceneIndex * stage.getBoundingClientRect().height;
}, index);

async function expectScene(page: Page, index: number) {
  const journey = page.locator('[data-profile-journey]');
  const scene = journey.locator('[data-profile-scene]').nth(index);
  await expect(journey).toHaveAttribute('data-profile-active', String(index));
  await expect(journey.locator('[data-profile-scene].is-active')).toHaveCount(1);
  await expect(scene).toHaveAttribute('aria-hidden', 'false');
  await expect(scene).not.toHaveAttribute('inert', '');
  await expect(scene).toHaveCSS('opacity', '1');
  return scene;
}

async function scrollToScene(page: Page, index: number) {
  const target = await sceneTarget(page, index);
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), target);
  return expectScene(page, index);
}

async function expectHorizontalFit(page: Page, scope: Locator) {
  const overflow = await scope.evaluate((root) => {
    const candidates = root.querySelectorAll<HTMLElement>('h2, h3, p, li, a, button, .profile-interest-art');
    return Array.from(candidates).filter((node) => {
      const bounds = node.getBoundingClientRect();
      return bounds.width > 0 && bounds.height > 0 && (
        bounds.left < -1 || bounds.right > window.innerWidth + 1 || (
          !node.matches('.profile-interest-art') && node.scrollWidth > node.clientWidth + 1
        )
      );
    }).map((node) => ({ tag: node.tagName, text: node.textContent?.trim().slice(0, 70) }));
  });
  expect(overflow, 'readable content stays inside the viewport without clipped text').toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
}

async function expectSceneGeometry(page: Page, scene: Locator) {
  await expect.poll(async () => {
    const content = await scene.locator('.profile-scene-content').boundingBox();
    const header = await page.locator('[data-site-header] .header-frame').boundingBox();
    return content !== null && header !== null && content.y >= header.y + header.height + 8
      && content.y + content.height <= page.viewportSize()!.height - 15;
  }, { message: 'all scene content fits below the header and above the viewport edge' }).toBe(true);
  await expectHorizontalFit(page, scene);
}

async function expectNativeScenes(page: Page) {
  const journey = page.locator('[data-profile-journey]');
  await expect(journey).toHaveAttribute('data-profile-mode', 'native');
  await expect(journey.locator('[data-profile-scene]')).toHaveCount(4);
  await expect(journey.locator('[data-profile-scene][aria-hidden="true"], [data-profile-scene][inert]')).toHaveCount(0);
  expect(await page.locator('[data-profile-stage]').evaluate((node) => getComputedStyle(node).position)).not.toMatch(/sticky|fixed/);
  const bounds = await journey.locator('[data-profile-scene]').evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom };
  }));
  for (let index = 1; index < bounds.length; index += 1) {
    expect(bounds[index].top, 'native chapters follow one another without overlaps').toBeGreaterThanOrEqual(bounds[index - 1].bottom - 1);
  }
  for (const scene of await journey.locator('[data-profile-scene]').all()) {
    await expect(scene.locator('h2')).toBeVisible();
    await expectHorizontalFit(page, scene);
  }
}

async function expectInterestArt(page: Page) {
  const entries = page.locator('.profile-interest-entry');
  const illustrations = page.locator('.profile-interest-art img');
  await expect(entries).toHaveCount(4);
  await expect(illustrations).toHaveCount(4);
  for (const illustration of await illustrations.all()) {
    await expect.poll(() => illustration.evaluate((node) => {
      const image = node as HTMLImageElement;
      return image.complete && image.naturalWidth > 0 && image.naturalHeight > 0;
    })).toBe(true);
  }
}

for (const prefix of ['', '/en']) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`profile journey scroll, step buttons and footer work ${prefix || 'es'} ${colorScheme}`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.emulateMedia({ colorScheme, reducedMotion: 'no-preference' });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${prefix}/perfil/cristian-bravo`);
      await page.evaluate(() => document.fonts.ready);
      const journey = page.locator('[data-profile-journey]');
      const scenes = journey.locator('[data-profile-scene]');
      const steps = journey.locator('[data-profile-step]');
      await expect(journey).toHaveAttribute('data-profile-mode', 'scene');
      await expect(scenes).toHaveCount(4);
      await expect(steps).toHaveCount(4);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.locator('[data-profile-stage]').evaluate((node) => getComputedStyle(node).position)).toBe('sticky');

      await mkdir(visualDirectory, { recursive: true });
      for (let index = 0; index < 4; index += 1) {
        const scene = await scrollToScene(page, index);
        await expectSceneGeometry(page, scene);
        expect(await journey.locator('[data-profile-progress]').evaluate((node) =>
          new DOMMatrixReadOnly(getComputedStyle(node).transform).a
        )).toBeCloseTo(index / 3, 3);
        if (index === 2) await expectInterestArt(page);
        await page.screenshot({ path: path.join(visualDirectory, `desktop-${prefix ? 'en' : 'es'}-${colorScheme}-scene-${index}.png`) });
      }
      await expect(journey.locator('[data-profile-scene][aria-hidden="true"][inert]')).toHaveCount(3);

      await steps.nth(1).focus();
      const keyboardTarget = await sceneTarget(page, 1);
      await page.keyboard.press('Enter');
      await expect.poll(() => page.evaluate((target) => Math.abs(window.scrollY - target), keyboardTarget)).toBeLessThan(2);
      await expectScene(page, 1);
      await expect(steps.nth(1)).toBeFocused();

      await page.mouse.move(720, 450);
      await page.mouse.wheel(0, 900);
      await expectScene(page, 2);
      await page.mouse.wheel(0, -900);
      await expectScene(page, 1);

      const clickTarget = await sceneTarget(page, 3);
      await steps.nth(3).click();
      await expect.poll(() => page.evaluate((target) => Math.abs(window.scrollY - target), clickTarget)).toBeLessThan(2);
      await expectScene(page, 3);
      const footerLink = page.locator('footer a').last();
      await footerLink.scrollIntoViewIfNeeded();
      await expect(footerLink).toBeInViewport();
      await expect(footerLink).not.toHaveAttribute('inert', '');
      expect(errors).toEqual([]);
    });
  }

  test(`profile journey remains accessible across resize and reduced motion ${prefix || 'es'}`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`${prefix}/perfil/cristian-bravo`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('[data-profile-journey]')).toHaveAttribute('data-profile-mode', 'scene');
    await scrollToScene(page, 2);
    await page.setViewportSize({ width: 390, height: 844 });
    await expectNativeScenes(page);
    await page.locator('footer a').last().scrollIntoViewIfNeeded();
    await expect(page.locator('footer a').last()).toBeInViewport();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('[data-profile-journey]')).toHaveAttribute('data-profile-mode', 'scene');
    await scrollToScene(page, 1);
    await expectSceneGeometry(page, page.locator('[data-profile-scene]').nth(1));
    await page.locator('[data-profile-step]').nth(1).focus();
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expectNativeScenes(page);
    await expect(page.locator('[data-profile-scene]').nth(1)).toBeFocused();
  });
}

test('profile falls back to normal scrolling when a chapter grows beyond the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/perfil/cristian-bravo');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-profile-journey]')).toHaveAttribute('data-profile-mode', 'scene');
  await scrollToScene(page, 1);
  await page.locator('.profile-story-copy').first().evaluate((node) => {
    node.textContent = `${node.textContent} `.repeat(14);
  });
  await expectNativeScenes(page);
  const visionLink = page.locator('.profile-vision-cta a').first();
  await visionLink.scrollIntoViewIfNeeded();
  await expect(visionLink).toBeInViewport();
});

for (const [width, height] of [[320, 760], [390, 844], [858, 900], [1280, 720]] as const) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test(`profile sections flow naturally at ${width}×${height} ${colorScheme}`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ colorScheme, reducedMotion: 'no-preference' });
      await page.goto('/perfil/cristian-bravo');
      await page.evaluate(() => document.fonts.ready);
      await expectNativeScenes(page);
      await mkdir(visualDirectory, { recursive: true });
      await page.screenshot({ path: path.join(visualDirectory, `native-${width}-${colorScheme}-hero.png`) });
      const interests = page.locator('.profile-interests-section');
      for (const illustration of await page.locator('.profile-interest-art img').all()) {
        await illustration.scrollIntoViewIfNeeded();
      }
      await expectInterestArt(page);
      await interests.screenshot({ path: path.join(visualDirectory, `native-${width}-${colorScheme}-interests.png`) });
      await page.locator('footer a').last().scrollIntoViewIfNeeded();
      await expect(page.locator('footer a').last()).toBeInViewport();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }
}
