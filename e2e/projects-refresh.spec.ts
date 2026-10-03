import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test, expect } from './fixtures';

const projectTitles = [
  'NY Campus Virtual',
  'Fundación Manos en Acción',
  'Berlina',
  'Telollevamos',
  'DePaso',
  'Riocargo Express',
  'Fualtec',
  'Alkosto',
  'Plataformas educativas',
  'IDEC',
  'Nexus',
  'SH Fast Recover',
  '360IO',
  'Club Guias',
  'Entidad bancaria',
];
const addedIndexes = [1, 2, 3, 4, 5, 9, 10, 11];
const projectLinks: Record<string, string[]> = {
  'Fundación Manos en Acción': ['https://fundacionma.com', 'https://administracion.fundacionma.com'],
  Berlina: ['https://berlina.app'],
  Telollevamos: ['https://telollevamos.com'],
  DePaso: ['https://depaso.app'],
  'Riocargo Express': ['https://riocargoexpress.com/'],
  IDEC: ['https://www.idec.ec'],
  Nexus: ['https://www.nexuscorpec.com'],
  'SH Fast Recover': ['https://shfastrecover.com'],
};
const cvPath = '/cv/Cristian_Bravo_Full_Stack_Developer_CV.pdf';
const cvHash = 'e6640d541860880153a65136f0f438784e30d58f3bad5834c0b8b0ec382bb8d3';
const sha256 = (body: Buffer) => createHash('sha256').update(body).digest('hex');

test('short desktop windows keep every scene reachable through native scrolling', async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1024, height: 600 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/proyectos');
  await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', 'native');
  for (const scene of await page.locator('[data-ps-scene]').all()) {
    await expect(scene).not.toHaveAttribute('aria-hidden', 'true');
    await expect(scene).not.toHaveAttribute('inert', '');
    await scene.scrollIntoViewIfNeeded();
    await expect(scene).toBeInViewport();
  }
  await page.locator('.ps-scene--cta a').first().scrollIntoViewIfNeeded();
  await expect(page.locator('.ps-scene--cta a').first()).toBeInViewport();
});

for (const width of [320, 375, 390, 430, 768, 1024, 1366, 1440, 1920]) {
  for (const colorScheme of ['light', 'dark'] as const) {
    test.describe(`${width}px ${colorScheme} refreshed portfolio`, () => {
      test.use({
        viewport: { width, height: width < 768 ? 844 : 900 },
        colorScheme,
        reducedMotion: 'no-preference',
      });

      test('preserves every scene and keeps project content usable', async ({ page }, testInfo) => {
        test.setTimeout(120_000);
        const errors: string[] = [];
        const failedResources: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (message) => {
          if (message.type() === 'error') errors.push(message.text());
        });
        page.on('response', (response) => {
          if (response.status() >= 400 && new URL(response.url()).origin === new URL(page.url()).origin) {
            failedResources.push(`${response.status()} ${new URL(response.url()).pathname}`);
          }
        });
        const response = await page.goto('/proyectos');
        expect(response?.status()).toBe(200);
        await page.evaluate(() => document.fonts.ready);
        if (colorScheme === 'dark') await expect(page.locator('html')).toHaveClass(/dark/);
        else await expect(page.locator('html')).not.toHaveClass(/dark/);

        const root = page.locator('.ps-root');
        const projects = page.locator('.ps-scene--project');
        const desktop = width >= 1120;
        await expect(root).toHaveAttribute('data-ps-mode', desktop ? 'scene' : 'native');
        await expect(projects.locator('.ps-project-feature__title')).toHaveText(projectTitles);
        await expect(page.locator('[data-ps-scene]')).toHaveCount(projectTitles.length + 2);
        await expect(page.locator('[data-ps-dot]')).toHaveCount(projectTitles.length + 2);

        for (let index = 0; index < projectTitles.length; index += 1) {
          const scene = projects.nth(index);
          if (desktop) {
            await page.evaluate((sceneIndex) => {
              window.scrollTo({ top: sceneIndex * window.innerHeight * 0.58, behavior: 'instant' });
            }, index + 1);
            await expect(scene).toHaveClass(/is-active/);
            await expect(scene).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('[data-ps-counter-current]')).toHaveText(String(index + 2));
            await expect(scene.locator('.ps-project-feature__desc')).toHaveCSS('opacity', '1');
          } else {
            await scene.scrollIntoViewIfNeeded();
            await expect(scene).not.toHaveAttribute('aria-hidden', 'true');
          }
          await expect(scene.locator('.ps-project-feature__title')).toBeVisible();
          const layout = await scene.evaluate((node) => {
            const copy = Array.from(node.querySelectorAll<HTMLElement>(
              '.ps-project-feature__title, .ps-project-feature__subtitle, .ps-project-feature__desc',
            ));
            return {
              pageWidth: document.documentElement.clientWidth,
              scrollWidth: document.documentElement.scrollWidth,
              clippedText: copy.filter((element) => {
                const rect = element.getBoundingClientRect();
                const surface = element.closest('.ps-project-feature__surface')?.getBoundingClientRect();
                return rect.width > 0 && (
                  rect.left < -1 || rect.right > window.innerWidth + 1 ||
                  (surface && (rect.left < surface.left - 1 || rect.right > surface.right + 1)) ||
                  element.scrollWidth > element.clientWidth + 2 ||
                  (getComputedStyle(element).overflowY !== 'visible' &&
                    element.scrollHeight > element.clientHeight + 2)
                );
              }).map((element) => element.textContent?.trim()),
            };
          });
          expect(layout.scrollWidth, projectTitles[index]).toBeLessThanOrEqual(layout.pageWidth + 1);
          expect(layout.clippedText, projectTitles[index]).toEqual([]);

          if (addedIndexes.includes(index)) {
            const images = scene.locator('.ps-project-feature__image');
            expect(await images.count(), `${projectTitles[index]} has real screenshots`).toBeGreaterThan(0);
            for (const img of await images.all()) {
              await img.scrollIntoViewIfNeeded();
              await expect.poll(() => img.evaluate((element: HTMLImageElement) =>
                element.complete && element.naturalWidth > 0 && element.naturalHeight > 0,
              ), { message: `Screenshot loaded for ${projectTitles[index]}` }).toBe(true);
              await expect(img).toHaveAttribute('alt', /\S/);
              await expect(img).toHaveAttribute('width', /^\d+$/);
              await expect(img).toHaveAttribute('height', /^\d+$/);
              await expect(img).toHaveAttribute('loading', 'lazy');
              await expect(img).toHaveAttribute('srcset', /800w.*1600w/);
              await expect(img).toHaveAttribute('sizes', /\S/);
              await expect(img).toHaveCSS('object-fit', 'cover');
            }
            for (const action of await scene.locator('.ps-project-feature__action').all()) {
              await action.scrollIntoViewIfNeeded();
              await expect(action).toBeVisible();
              const bounds = await action.boundingBox();
              expect(bounds).not.toBeNull();
              expect(bounds!.x).toBeGreaterThanOrEqual(-1);
              expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
              expect(bounds!.height).toBeGreaterThanOrEqual(36);
              if (desktop) {
                await action.hover();
                await expect(action).not.toHaveCSS('transform', 'none');
              }
              await action.focus();
              await expect(action).toBeFocused();
            }
            if (width === 390 || width === 1440) {
              await scene.screenshot({
                path: testInfo.outputPath(`project-${index + 1}-${colorScheme}-${width}.png`),
                animations: 'disabled',
              });
            }
          }
        }

        const finalScene = page.locator('.ps-scene--cta');
        if (desktop) {
          await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
          await expect(finalScene).toHaveClass(/is-active/);
        } else await finalScene.scrollIntoViewIfNeeded();
        await expect(finalScene.locator('a').first()).toBeInViewport();
        expect(failedResources, 'All requested first-party resources resolve').toEqual([]);
        expect(errors, 'No console or runtime errors').toEqual([]);
      });
    });
  }
}

for (const prefix of ['', '/en']) {
  test(`new project links and discreet confidential content ${prefix || 'es'}`, async ({ page }) => {
    await page.goto(`${prefix}/proyectos`);
    await expect(page.locator('.ps-root')).toHaveAttribute('data-ps-mode', 'native');
    const projects = page.locator('.ps-scene--project');
    await expect(projects).toHaveCount(projectTitles.length);
    await expect(projects.locator('.ps-project-feature__title')).toHaveText(
      projectTitles.map((title) => !prefix ? title : title === 'Plataformas educativas'
        ? 'Education platforms' : title === 'Entidad bancaria' ? 'Banking institution' : title),
    );
    for (const [title, hrefs] of Object.entries(projectLinks)) {
      const scene = projects.filter({ has: page.locator('.ps-project-feature__title', { hasText: title }) });
      await expect(scene).toHaveCount(1);
      const actual = (await scene.locator('.ps-project-feature__action').evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).href),
      )).map((url) => new URL(url).href);
      expect(actual).toEqual(hrefs.map((url) => new URL(url).href));
      for (const link of await scene.locator('.ps-project-feature__action').all()) {
        await expect(link).toHaveAttribute('target', '_blank');
        await expect(link).toHaveAttribute('rel', /noopener/);
        await expect(link).toHaveAttribute('rel', /noreferrer/);
        await expect(link).toHaveAttribute('aria-label', /\S/);
      }
    }
    const confidential = projects.filter({ has: page.locator('.ps-project-feature--confidential') });
    await expect(confidential).toHaveCount(3);
    const bank = confidential.filter({
      has: page.locator('.ps-project-feature__title', { hasText: prefix ? 'Banking institution' : 'Entidad bancaria' }),
    });
    await expect(bank).toHaveCount(1);
    const text = await bank.innerText();
    expect(text).not.toMatch(/360IO|Club Guias|WordPress|API|Sync|Cifrado|Encrypted|Auditado|Audited|Proyecto oculto|Hidden project/i);
    expect(text).toMatch(prefix ? /financial sector/i : /sector financiero/i);
    await expect(bank.locator('.ps-project-feature__image')).toHaveCount(0);
    await expect(bank.locator('a')).toHaveCount(0);
  });

  test(`updated CV keeps the download behavior ${prefix || 'es'}`, async ({ page, request }) => {
    const response = await request.get(cvPath);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/application\/pdf/);
    expect(sha256(await response.body())).toBe(cvHash);
    await page.goto(`${prefix}/perfil/cristian-bravo`);
    const cv = page.locator('[data-profile-quick-link][download]');
    await expect(cv).toHaveAttribute('href', cvPath);
    await expect(cv).toHaveAttribute('download', '');
    await expect(cv).not.toHaveAttribute('target');
    const downloadPromise = page.waitForEvent('download');
    await cv.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('Cristian_Bravo_Full_Stack_Developer_CV.pdf');
    expect(await download.failure()).toBeNull();
    const path = await download.path();
    expect(path).not.toBeNull();
    expect(sha256(await readFile(path!))).toBe(cvHash);
  });
}
