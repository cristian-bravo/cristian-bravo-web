import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';

test('mobile navigation supports keyboard, Escape and inert closed content', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('[data-header-menu-toggle]');
  const panel = page.locator('[data-header-mobile-panel]');
  await expect(panel).toHaveAttribute('inert', '');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).not.toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await expect(panel).toHaveAttribute('inert', '');
  await menu.click();
  await panel.locator('a[href="/servicios"]').click();
  await expect(page).toHaveURL(/\/servicios$/);
});

test('theme persists and translated route keeps current page', async ({
  page,
}) => {
  await page.goto('/servicios');
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.locator('.header-lang-toggle').click();
  await expect(page).toHaveURL(/\/en\/servicios$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});

test('keyboard skip link takes focus to main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('Yuki handles safe rendering, history opt-in and keyboard dismissal', async ({
  page,
}) => {
  const requests: Record<string, unknown>[] = [];
  const adversarialReply =
    '<img src=x onerror=alert(1)> Response supplied by the test.';
  await page.route('**/api/yuki-chat', async (route) => {
    requests.push(route.request().postDataJSON());
    await route.fulfill({
      json: { success: true, response: adversarialReply },
    });
  });
  await page.goto('/');
  const launcher = page.locator('[data-yuki-open]');
  await launcher.click();
  const input = page.locator('[data-yuki-input]');
  await expect(input).toBeFocused();
  await expect(page.locator('[data-yuki-consent]')).not.toBeChecked();
  await input.fill('Quiero un sistema para mi empresa en Ecuador.');
  await input.press('Enter');
  await expect(page.locator('[data-yuki-messages]')).toContainText(
    adversarialReply,
  );
  await expect(page.locator('[data-yuki-messages] img')).toHaveCount(0);
  expect(requests[0].remember).toBe(false);
  await page.locator('[data-yuki-consent]').check();
  await input.fill('Recuerda que necesito integraciones con mi CRM.');
  await input.press('Enter');
  await expect.poll(() => requests.length).toBe(2);
  expect(requests[1].remember).toBe(true);
  await expect(page.locator('[data-yuki-send]')).toBeEnabled();
  await input.press('Escape');
  await expect(page.locator('[data-yuki-panel]')).toBeHidden();
  await expect(launcher).toBeFocused();
  await page.reload();
  await launcher.click();
  await expect(page.locator('[data-yuki-consent]')).toBeChecked();
  const results = await new AxeBuilder({ page })
    .include('[data-yuki-assistant]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

for (const prefix of ['', '/en']) {
  test(`navigation only marks the current destination ${prefix || 'es'}`, async ({
    page,
  }) => {
    await page.goto(`${prefix}/servicios`);
    const nav = page.locator('[data-header-nav]');
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(nav.locator('[aria-current="page"]')).toHaveAttribute(
      'href',
      `${prefix}/servicios`,
    );
    await page.goto(`${prefix}/empezar-proyecto`);
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(0);
    await expect(page.locator('[data-header-nav-indicator]')).toHaveAttribute(
      'data-ready',
      'false',
    );
    await nav.locator('a').first().hover();
    await expect(page.locator('[data-header-nav-indicator]')).toHaveAttribute(
      'data-ready',
      'true',
    );
    await page.locator('h1').hover();
    await expect(page.locator('[data-header-nav-indicator]')).toHaveAttribute(
      'data-ready',
      'false',
    );
  });
}

test('Yuki recovers from a service error and rejects blank messages', async ({
  page,
}) => {
  let sent = 0;
  await page.route('**/api/yuki-chat', async (route) => {
    sent++;
    await route.fulfill({
      status: 503,
      json: {
        success: false,
        message: 'Servicio temporalmente no disponible.',
      },
    });
  });
  await page.goto('/en');
  await page.locator('[data-yuki-open]').click();
  await page.locator('[data-yuki-input]').fill('   ');
  await page.locator('[data-yuki-send]').click();
  expect(sent).toBe(0);
  await page.locator('[data-yuki-prompt]').first().click();
  await expect(page.locator('[data-yuki-messages]')).toContainText(
    'Servicio temporalmente no disponible.',
  );
  await expect(page.locator('[data-yuki-input]')).toBeEnabled();
  expect(sent).toBe(1);
});

test('reduced motion removes perpetual Yuki animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const animation = await page
    .locator('.yuki-launcher__pulse')
    .evaluate((node) => getComputedStyle(node).animationName);
  expect(animation).toBe('none');
});

test('service details dialog traps keyboard focus and closes with Escape', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/servicios');
  const trigger = page.locator('[data-modal-open]').first();
  const modalId = await trigger.getAttribute('data-modal-open');
  await trigger.click();
  const dialog = page.locator(`[id="${modalId}"]`);
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('role', 'dialog');
  await expect(dialog.locator('.services-modal-close')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect
    .poll(() =>
      dialog.evaluate((node) => node.contains(document.activeElement)),
    )
    .toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

for (const prefix of ['', '/en']) {
  test(`original portfolio stays readable with reduced motion ${prefix || 'es'}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: prefix ? 1440 : 390, height: 900 });
    await page.goto(`${prefix}/proyectos`);
    await expect(page.locator('.ps-root')).toHaveAttribute(
      'data-ps-mode',
      'native',
    );
    const scenes = page.locator('[data-ps-scene]');
    const total = await scenes.count();
    expect(total).toBeGreaterThan(4);
    for (const scene of await scenes.all()) {
      await expect(scene).toHaveClass(/is-active/);
      await expect(scene).not.toHaveAttribute('aria-hidden', 'true');
      await expect(scene).not.toHaveAttribute('inert', '');
      await scene.scrollIntoViewIfNeeded();
      await expect(scene).toBeInViewport();
    }
    await expect(page.locator('.ps-scene--cta a').first()).toBeVisible();
  });
}
