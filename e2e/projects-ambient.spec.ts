import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';

const ambientSelector = '[data-project-ambient]';

// Sample the properties anime.js changes, rather than trusting the lifecycle marker.
const readMotion = (ambient: Locator) => ambient.evaluate((element) => JSON.stringify(
  Array.from(element.querySelectorAll<SVGElement>('[data-ambient-drift], [data-ambient-trace]')).map((node) => ({
    transform: getComputedStyle(node).transform,
    transformAttribute: node.getAttribute('transform'),
    dash: getComputedStyle(node).strokeDashoffset,
    dashAttribute: node.getAttribute('stroke-dashoffset'),
  })),
));

async function expectMotion(ambient: Locator) {
  await expect(ambient).toHaveAttribute('data-ambient-state', 'running');
  const initial = await readMotion(ambient);
  await expect.poll(() => readMotion(ambient), {
    message: 'An eligible background visibly advances its SVG animation',
    intervals: [50, 100, 200],
  }).not.toBe(initial);
}

async function expectStill(ambient: Locator) {
  const uniqueFrames = await ambient.evaluate(async (element) => {
    const frames = new Set<string>();
    for (let frame = 0; frame < 12; frame += 1) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      frames.add(JSON.stringify(Array.from(
        element.querySelectorAll<SVGElement>('[data-ambient-drift], [data-ambient-trace]'),
      ).map((node) => ({
        transform: getComputedStyle(node).transform,
        transformAttribute: node.getAttribute('transform'),
        dash: getComputedStyle(node).strokeDashoffset,
        dashAttribute: node.getAttribute('stroke-dashoffset'),
      }))));
    }
    return frames.size;
  });
  expect(uniqueFrames, 'Inactive/reduced-motion backgrounds remain still across rendered frames').toBe(1);
}

async function expectAllScenesDecorated(page: Page) {
  const scenes = page.locator('[data-ps-scene]');
  await expect(scenes).toHaveCount(17);
  await expect(page.locator(ambientSelector)).toHaveCount(17);
  for (const scene of await scenes.all()) {
    const ambient = scene.locator(ambientSelector);
    await expect(ambient).toHaveCount(1);
    await expect(ambient).toHaveAttribute('aria-hidden', 'true');
    await expect(ambient).toHaveCSS('pointer-events', 'none');
    expect(await ambient.locator('[data-ambient-drift]').count()).toBeGreaterThan(0);
    expect(await ambient.locator('[data-ambient-trace]').count()).toBeGreaterThan(0);
    await expect(ambient.locator('a, button, input, [tabindex]')).toHaveCount(0);
  }
}

async function expectOnlyVisibleNativeBackgroundsRun(page: Page) {
  await expect.poll(() => page.locator(`${ambientSelector}[data-ambient-state="running"]`).count()).toBeGreaterThan(0);
  await expect.poll(() => page.locator(`${ambientSelector}[data-ambient-state="running"]`).evaluateAll((elements) =>
    elements.filter((element) => {
      const scene = element.closest('[data-ps-scene]')!;
      const rect = scene.getBoundingClientRect();
      return rect.bottom <= 0 || rect.top >= innerHeight;
    }).length,
  ), { message: 'Offscreen native scenes do not consume animation work' }).toBe(0);
}

for (const { prefix, theme } of [
  { prefix: '', theme: 'light' },
  { prefix: '/en', theme: 'dark' },
] as const) {
  test(`ambient SVGs animate only the active desktop view (${prefix || 'es'}, ${theme})`, async ({ page }) => {
    test.setTimeout(60_000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'no-preference' });
    await page.goto(`${prefix}/proyectos`);
    await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', 'scene');
    await expectAllScenesDecorated(page);

    const heroAmbient = page.locator('.ps-scene--hero').locator(ambientSelector);
    await expectMotion(heroAmbient);
    await expect(page.locator(`${ambientSelector}[data-ambient-state="running"]`)).toHaveCount(1);

    // Exercise the real scene navigation; decoration must never intercept input.
    await page.locator('[data-ps-dot]').nth(4).click();
    const project = page.locator('[data-project-brand="telollevamos"]');
    await expect(project).toHaveClass(/is-active/);
    await expect(project).toHaveAttribute('aria-hidden', 'false');
    await expectMotion(project.locator(ambientSelector));
    await expect(heroAmbient).toHaveAttribute('data-ambient-state', 'paused');
    await expectStill(heroAmbient);
    await expect(page.locator(`${ambientSelector}[data-ambient-state="running"]`)).toHaveCount(1);
    const projectAction = project.locator('.ps-project-feature__action').first();
    await projectAction.click({ trial: true });
    await projectAction.focus();
    await expect(projectAction).toBeFocused();

    // Check the final view as well as the introduction and project cards.
    await page.locator('[data-ps-dot]').last().click();
    const cta = page.locator('.ps-scene--cta');
    await expect(cta).toHaveClass(/is-active/);
    await expectMotion(cta.locator(ambientSelector));
    await cta.locator('a').first().click({ trial: true });

    if (prefix) {
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', 'native');
      await cta.scrollIntoViewIfNeeded();
      await expectMotion(cta.locator(ambientSelector));
      await expectOnlyVisibleNativeBackgroundsRun(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    }
    expect(errors).toEqual([]);
  });
}

test('native mobile backgrounds pause offscreen and leave the header and project actions usable', async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' });
  await page.goto('/proyectos');
  await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', 'native');
  await expectAllScenesDecorated(page);
  const heroAmbient = page.locator('.ps-scene--hero').locator(ambientSelector);
  await expectMotion(heroAmbient);

  const menuToggle = page.locator('[data-header-menu-toggle]');
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-header-mobile-link]').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');

  const project = page.locator('[data-project-brand="telollevamos"]');
  await project.scrollIntoViewIfNeeded();
  await expectMotion(project.locator(ambientSelector));
  await expect(heroAmbient).toHaveAttribute('data-ambient-state', 'paused');
  await expectStill(heroAmbient);
  await expectOnlyVisibleNativeBackgroundsRun(page);
  await project.locator('.ps-project-feature__action').first().click({ trial: true });

  const cta = page.locator('.ps-scene--cta');
  await cta.scrollIntoViewIfNeeded();
  await expectMotion(cta.locator(ambientSelector));
  await expectOnlyVisibleNativeBackgroundsRun(page);
  await cta.locator('a').first().click({ trial: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(errors).toEqual([]);
});

test('reduced motion keeps every background static and live preference changes cleanly resume anime.js', async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto('/en/proyectos');
  await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', 'native');
  await expectAllScenesDecorated(page);
  await expect(page.locator(`${ambientSelector}[data-ambient-state="static"]`)).toHaveCount(17);
  const heroAmbient = page.locator('.ps-scene--hero').locator(ambientSelector);
  await expectStill(heroAmbient);
  const authoredStaticMotion = await readMotion(heroAmbient);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', 'scene');
  await expectMotion(heroAmbient);
  await expect(page.locator(`${ambientSelector}[data-ambient-state="running"]`)).toHaveCount(1);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', 'native');
  await expect(page.locator(`${ambientSelector}[data-ambient-state="static"]`)).toHaveCount(17);
  // Reversion returns animated SVG styles to their authored defaults. Observe
  // that reset before measuring stillness across subsequent rendered frames.
  await expect.poll(() => readMotion(heroAmbient)).toBe(authoredStaticMotion);
  await expectStill(heroAmbient);
  await expect(page.locator(`${ambientSelector}[data-ambient-state="running"]`)).toHaveCount(0);

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', 'scene');
  await expectMotion(heroAmbient);
  await page.locator('[data-ps-dot]').nth(1).click();
  await expect(page.locator('[data-ps-scene]').nth(1)).toHaveClass(/is-active/);
  expect(errors).toEqual([]);
});
