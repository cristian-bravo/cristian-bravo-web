import { test, expect } from './fixtures';

for (const prefix of ['', '/en']) {
  const language = prefix ? 'en' : 'es';
  const types = prefix
    ? {
        new: 'Build software',
        improve: 'Improve software',
        rescue: 'Recover software',
      }
    : {
        new: 'Crear software',
        improve: 'Mejorar software',
        rescue: 'Rescatar software',
      };

  test(`three project paths preserve the complete brief ${language}`, async ({
    page,
  }) => {
    await page.goto(`${prefix}/empezar-proyecto`);
    await expect(page.locator('.development-paper-card-link')).toHaveCount(3);
    await expect(
      page.locator(
        `.development-support-band a[href="${prefix}/empezar-proyecto/proyecto"]`,
      ),
    ).toBeVisible();
    for (const intent of Object.keys(types)) {
      await expect(
        page.locator(
          `.development-paper-card-link[href="${prefix}/empezar-proyecto/simple?intent=${intent}"]`,
        ),
      ).toHaveCount(1);
    }
    await page.goto(prefix || '/');
    await page.locator('.studio-rescue a').click();
    await expect(page).toHaveURL(
      new RegExp(`${prefix}/empezar-proyecto/simple\\?intent=rescue$`),
    );
    await expect(page.locator('[data-project-intent]')).toBeVisible();
    await page.locator('.header-lang-toggle').click();
    const alternate = prefix ? '' : '/en';
    await expect(page).toHaveURL(
      new RegExp(`${alternate}/empezar-proyecto/simple\\?intent=rescue$`),
    );
    await expect(page.locator('[name="consultationType"]')).toHaveValue(
      prefix ? 'Rescatar software' : 'Recover software',
    );
  });

  for (const [intent, consultationType] of Object.entries(types)) {
    test(`project intent ${intent} reaches the inquiry payload ${language}`, async ({
      page,
    }) => {
      let payload: Record<string, unknown> | undefined;
      await page.route('**/api/send-contact', async (route) => {
        payload = route.request().postDataJSON();
        await route.fulfill({ json: { success: true } });
      });
      await page.goto(`${prefix}/empezar-proyecto/simple?intent=${intent}`);
      await expect(page.locator('[data-project-intent]')).toBeVisible();
      await expect(page.locator('[name="consultationType"]')).toHaveValue(
        consultationType,
      );
      await expect(
        page.locator('[data-simple-request-form] [name="message"]'),
      ).toHaveValue('');
      await expect(
        page.locator('[data-simple-request-form] [name="message"]'),
      ).toHaveAccessibleDescription(/.+/);
      await page.locator('[name="name"]').fill('QA intent');
      await page.locator('[name="email"]').fill('qa@example.invalid');
      await page
        .locator('[data-simple-request-form] [name="message"]')
        .fill(
          'Necesitamos revisar el sistema de reservas y sus integraciones.',
        );
      await page.locator('[data-submit-button]').click();
      await expect(page.locator('[data-submit-success]')).toBeVisible();
      expect(payload?.consultationType).toBe(consultationType);
      expect(payload?.lang).toBe(language);
      expect(Object.keys(payload ?? {}).sort()).toEqual([
        'company',
        'consultationType',
        'email',
        'lang',
        'message',
        'name',
      ]);
    });
  }

  test(`unknown and adversarial project intents stay inert ${language}`, async ({
    page,
  }) => {
    for (const intent of [
      '__proto__',
      'constructor',
      '<img src=x onerror=alert(1)>',
      'https://attacker.invalid',
    ]) {
      const response = await page.goto(
        `${prefix}/empezar-proyecto/simple?intent=${encodeURIComponent(intent)}`,
      );
      expect(response?.status()).toBe(200);
      await expect(page.locator('[data-project-intent]')).toHaveCount(0);
      await expect(page.locator('[name="consultationType"]')).toHaveValue(
        prefix ? 'General consultation' : 'Consulta general',
      );
      await expect(
        page.locator('[data-simple-request-form] [name="message"]'),
      ).toHaveValue('');
      await expect(page.locator('[onerror]')).toHaveCount(0);
      await expect(page.locator('main')).not.toContainText(intent);
    }
  });
}
