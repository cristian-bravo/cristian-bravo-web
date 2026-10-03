import { test, expect } from './fixtures';

test.describe('restored original animation experience', () => {
  test.use({ reducedMotion: 'no-preference' });

  for (const prefix of ['', '/en']) {
    test(`profile videos and contact icons animate in both themes ${prefix || 'es'}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (
          /violates the following Content Security Policy|Refused to execute/i.test(
            message.text(),
          )
        ) {
          errors.push(message.text());
        }
      });
      await page.setViewportSize({ width: 1440, height: 900 });
      const response = await page.goto(`${prefix}/perfil/cristian-bravo`);
      const policy = response?.headers()['content-security-policy'] || '';
      expect(policy).toContain("media-src 'self'");
      expect(
        policy
          .split(';')
          .find((directive) => directive.trim().startsWith('script-src ')),
      ).not.toMatch(/'unsafe-inline'|'unsafe-eval'/);
      await expect(page.locator('[data-profile-quick-link]')).toHaveCount(4);

      for (const dark of [false, true]) {
        if (dark) await page.locator('#theme-toggle').click();
        const activeVideo = page.locator(
          `video.profile-hero-background--${dark ? 'dark' : 'light'}`,
        );
        const hiddenVideo = page.locator(
          `video.profile-hero-background--${dark ? 'light' : 'dark'}`,
        );
        await expect(activeVideo).toBeVisible();
        await expect(hiddenVideo).toBeHidden();
        await expect(activeVideo.locator('source')).toHaveAttribute(
          'src',
          dark
            ? '/wallpapers/videos/avatar_clean.mp4'
            : '/wallpapers/videos/avatar_pets.mp4',
        );
        await expect
          .poll(() =>
            activeVideo.evaluate((node) => {
              const video = node as HTMLVideoElement;
              return {
                ready: video.readyState >= 2,
                playing: !video.paused,
                muted: video.muted,
                error: video.error?.code ?? null,
              };
            }),
          )
          .toEqual({ ready: true, playing: true, muted: true, error: null });
        const initialTime = await activeVideo.evaluate(
          (node) => (node as HTMLVideoElement).currentTime,
        );
        await expect
          .poll(() =>
            activeVideo.evaluate(
              (node) => (node as HTMLVideoElement).currentTime,
            ),
          )
          .not.toBe(initialTime);

        const contacts = page.locator('[data-profile-quick-link]');
        const before = await contacts.evaluateAll((nodes) => nodes.map((node) => ({
          animation: getComputedStyle(node).animationName,
          transform: getComputedStyle(node).transform,
          x: node.getBoundingClientRect().x,
          y: node.getBoundingClientRect().y,
        })));
        expect(before.every((link) => link.animation === 'none' && link.transform === 'none')).toBe(true);
        await page.mouse.move(100, 100);
        await page.mouse.move(1300, 750);
        await expect.poll(() => contacts.evaluateAll((nodes) => nodes.map((node) => ({
          animation: getComputedStyle(node).animationName,
          transform: getComputedStyle(node).transform,
          x: node.getBoundingClientRect().x,
          y: node.getBoundingClientRect().y,
        })))).toEqual(before);
        for (const icon of await page.locator('.profile-contact-link__icon img').all()) {
          const transform = await icon.evaluate((node) => getComputedStyle(node).transform);
          await expect.poll(() => icon.evaluate((node) => getComputedStyle(node).transform)).not.toBe(transform);
        }
      }

      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect.poll(() => page.locator('.profile-contact-link__icon img').evaluateAll((nodes) =>
        nodes.every((node) => getComputedStyle(node).transform === 'none')
      )).toBe(true);
      await page.locator('.profile-story-section').scrollIntoViewIfNeeded();
      await expect(page.locator('[data-profile-navbar]')).toHaveClass(
        /is-scrolled/,
      );
      expect(errors).toEqual([]);
    });

    test(`original home animations run under strict CSP in both themes ${prefix || 'es'}`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (
          /violates the following Content Security Policy|Refused to execute/i.test(
            message.text(),
          )
        ) {
          errors.push(message.text());
        }
      });
      await page.setViewportSize({ width: 1440, height: 900 });
      const response = await page.goto(prefix || '/');
      const scriptPolicy = response
        ?.headers()
        ['content-security-policy']?.split(';')
        .find((directive) => directive.trim().startsWith('script-src '));
      expect(scriptPolicy).toBeTruthy();
      expect(scriptPolicy).not.toMatch(/'unsafe-inline'|'unsafe-eval'/);
      await expect(page.locator('#home-hero')).toBeVisible();
      await expect(page.locator('.home-bubbles-section')).toHaveCount(1);
      await expect(page.locator('.home-method-section')).toHaveCount(1);
      await expect(page.locator('.next-step-refined')).toHaveCount(1);

      for (const dark of [false, true]) {
        if (dark) await page.locator('#theme-toggle').click();
        const shownLogo = page.locator(
          `.home-hero__brand-logo--${dark ? 'dark' : 'light'}`,
        );
        const hiddenLogo = page.locator(
          `.home-hero__brand-logo--${dark ? 'light' : 'dark'}`,
        );
        await expect(shownLogo).toBeVisible();
        await expect(hiddenLogo).toBeHidden();
        for (const selector of [
          '.home-hero__scanline',
          '.home-hero__brand-ring',
          '.home-hero__brand-mark',
        ]) {
          const animated = page.locator(selector);
          const initial = await animated.evaluate((node) => ({
            name: getComputedStyle(node).animationName,
            transform: getComputedStyle(node).transform,
          }));
          expect(initial.name).not.toBe('none');
          await expect
            .poll(() =>
              animated.evaluate((node) => getComputedStyle(node).transform),
            )
            .not.toBe(initial.transform);
        }
        expect(
          await page
            .locator('.home-bubbles-section')
            .evaluate(
              (node) => getComputedStyle(node, '::before').animationName,
            ),
        ).not.toBe('none');
      }
      expect(errors).toEqual([]);
    });

    test(`portfolio scene navigation works by keyboard, scroll and responsive transitions ${prefix || 'es'}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${prefix}/proyectos`);
      const root = page.locator('.ps-root');
      const scenes = page.locator('[data-ps-scene]');
      const active = page.locator('[data-ps-scene].is-active');
      const dots = page.locator('[data-ps-dot]');
      const total = await scenes.count();
      expect(total).toBeGreaterThan(4);
      await expect(dots).toHaveCount(total);
      await expect(root).toHaveAttribute('data-ps-mode', 'scene');
      await expect(active).toHaveCount(1);
      await expect(active).toHaveAttribute('data-scene-index', '0');
      await expect(active).toHaveAttribute('aria-hidden', 'false');

      await dots.nth(2).focus();
      await page.keyboard.press('Enter');
      await expect(active).toHaveAttribute('data-scene-index', '2');
      await expect(page.locator('[data-ps-counter-current]')).toHaveText('3');
      await expect(scenes.first()).toHaveAttribute('aria-hidden', 'true');
      await expect(dots.nth(2)).toHaveClass(/is-active/);
      // Verify the dot reached its destination before testing a wheel interaction.
      await expect
        .poll(() => page.evaluate(() => Math.abs(window.scrollY - 2 * window.innerHeight * 0.58)))
        .toBeLessThan(1);
      await page.mouse.wheel(0, 540);
      await expect
        .poll(async () => Number(await active.getAttribute('data-scene-index')))
        .toBeGreaterThan(2);

      await page.setViewportSize({ width: 390, height: 844 });
      await expect(root).toHaveAttribute('data-ps-mode', 'native');
      await expect(active).toHaveCount(total);
      await expect(
        page.locator('[data-ps-scene][aria-hidden="true"]'),
      ).toHaveCount(0);
      await scenes.last().scrollIntoViewIfNeeded();
      await expect(scenes.last()).toBeInViewport();

      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(root).toHaveAttribute('data-ps-mode', 'scene');
      await expect(active).toHaveCount(1);
      await expect(active).toHaveAttribute('aria-hidden', 'false');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(root).toHaveAttribute('data-ps-mode', 'native');
      await expect(
        page.locator('[data-ps-scene][aria-hidden="true"]'),
      ).toHaveCount(0);
    });
  }
});

test('original ambient animations respect reduced motion', async ({ page }) => {
  await page.goto('/');
  for (const selector of [
    '.home-hero__scanline',
    '.home-hero__brand-ring',
    '.home-hero__brand-mark',
  ]) {
    expect(
      await page
        .locator(selector)
        .evaluate((node) => getComputedStyle(node).animationName),
    ).toBe('none');
  }
  expect(
    await page
      .locator('.home-bubbles-section')
      .evaluate((node) => getComputedStyle(node, '::before').animationName),
  ).toBe('none');
});
