import { test, expect } from './fixtures';

for (const prefix of ['', '/en']) {
  test(`simple inquiry validates, retries and confirms ${prefix || 'es'}`, async ({ page }) => {
    let payload: any;
    let count = 0;
    await page.route('**/api/send-contact', async (route) => {
      payload = route.request().postDataJSON();
      count++;
      await route.fulfill(count === 1
        ? { status: 503, json: { success: false, message: 'Error temporal de prueba. Conservamos tus datos.' } }
        : { json: { success: true } });
    });
    await page.goto(`${prefix}/empezar-proyecto/simple`);
    const form = page.locator('[data-simple-request-form]');
    await page.locator('[data-submit-button]').click();
    await expect(form.locator('[name="name"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(form.locator('[name="email"]')).toHaveAttribute('aria-invalid', 'true');
    expect(count).toBe(0);
    await form.locator('[name="name"]').fill('QA Cystems');
    await form.locator('[name="email"]').fill('invalid-email');
    await form.locator('[name="message"]').fill('Necesito una plataforma de reservas con pagos y reportes para mi empresa.');
    await page.locator('[data-submit-button]').click();
    await expect(form.locator('[name="email"]')).toHaveAttribute('aria-invalid', 'true');
    expect(count).toBe(0);
    await form.locator('[name="email"]').fill('qa@example.invalid');
    await form.locator('[type="tel"]').fill('+593 99 123 4567');
    await page.locator('[data-submit-button]').click();
    await expect(page.locator('[data-submit-error]')).toBeVisible();
    await expect(form.locator('[name="name"]')).toHaveValue('QA Cystems');
    await expect(page.locator('[data-submit-button]')).toBeEnabled();
    await page.locator('[data-submit-button]').click();
    await expect(page.locator('[data-submit-success]')).toBeVisible();
    expect(payload.lang).toBe(prefix ? 'en' : 'es');
    expect(payload.email).toBe('qa@example.invalid');
    expect(count).toBe(2);
    await page.locator('[data-reset-button]').click();
    await expect(form).toBeVisible();
    await expect(form.locator('[name="name"]')).toHaveValue('');
  });

  test(`project wizard validates, restores, reviews and submits ${prefix || 'es'}`, async ({ page }) => {
    let postBody = '';
    await page.route('**/api/send-project', async (route) => {
      postBody = route.request().postData() || '';
      await route.fulfill({ json: { success: true } });
    });
    await page.goto(`${prefix}/empezar-proyecto/proyecto`);
    const form = page.locator('[data-project-wizard-form]');
    const next = page.locator('[data-next-button]');
    await next.click();
    await expect(form.locator('[name="fullName"]')).toHaveAttribute('aria-invalid', 'true');
    await expect(form.locator('[name="fullName"]')).toBeFocused();
    await form.locator('[name="fullName"]').fill('QA Wizard');
    await form.locator('[name="email"]').fill('qa@example.invalid');
    await form.locator('[name="phone"]').fill('+593991234567');
    await form.locator('[name="projectDescription"]').fill('Una plataforma de reservas para nuestra empresa en Ecuador.');
    expect(await page.evaluate(() => localStorage.getItem('cystems-project-request-v2'))).toBeNull();
    expect(await page.evaluate(() => sessionStorage.getItem('cystems-project-request-v2'))).toContain('QA Wizard');
    await next.click();
    await expect(page.locator('[data-step-panel="2"]')).toBeVisible();
    await form.locator('[name="projectType"]').selectOption({ index: 1 });
    await page.reload();
    await expect(page.locator('[data-step-panel="2"]')).toBeVisible();
    await expect(page.locator('[data-restored-status]')).toBeVisible();
    await next.click();
    await expect(page.locator('[data-step-panel="3"]')).toBeVisible();
    await form.locator('.development-checkbox-card:has([name="features"])').first().click();
    await expect(form.locator('[name="features"]').first()).toBeChecked();
    await page.locator('[data-file-input]').setInputFiles({ name: 'unsafe.html', mimeType: 'text/html', buffer: Buffer.from('<script>alert(1)</script>') });
    await expect(page.locator('[data-error-for="uploadedFiles"]')).toBeVisible();
    await page.locator('[data-file-input]').setInputFiles([]);
    await next.click();
    const modal = page.locator('[data-confirm-modal]');
    await expect(modal).toBeVisible();
    await expect(page.locator('[data-summary-contact-name]')).toHaveText('QA Wizard');
    await expect(page.locator('[data-confirm-cancel]')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    await expect(next).toBeFocused();
    await next.click();
    await page.locator('[data-confirm-send]').click();
    await expect(page.locator('[data-submit-success]')).toBeVisible();
    expect(postBody).toContain('qa@example.invalid');
    expect(postBody).toContain('QA Wizard');
  });
}

test('wizard remains usable when browser storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    for (const key of ['localStorage', 'sessionStorage']) {
      Object.defineProperty(window, key, { get() { throw new DOMException('Storage blocked', 'SecurityError'); } });
    }
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/empezar-proyecto/proyecto');
  const form = page.locator('[data-project-wizard-form]');
  await form.locator('[name="fullName"]').fill('QA Private Mode');
  await form.locator('[name="email"]').fill('qa@example.invalid');
  await form.locator('[name="phone"]').fill('+593991234567');
  await form.locator('[name="projectDescription"]').fill('Una plataforma para mi empresa.');
  await page.locator('[data-next-button]').click();
  await expect(page.locator('[data-step-panel="2"]')).toBeVisible();
  expect(errors).toEqual([]);
});

test('wizard removes only its legacy personal data and survives a corrupt draft', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('cystems-yuki-memory-opt-in', 'true');
    localStorage.setItem('cystems-project-request-v1', '{"email":"old@example.invalid"}');
    localStorage.setItem('cystems-project-request-v2', '{"email":"old@example.invalid"}');
    sessionStorage.setItem('cystems-project-request-v2', '{malformed json');
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/empezar-proyecto/proyecto');
  await expect(page.locator('[data-step-panel="1"]')).toBeVisible();
  await page.locator('[data-next-button]').click();
  await expect(page.locator('[name="fullName"]')).toHaveAttribute('aria-invalid', 'true');
  expect(await page.evaluate(() => ({
    oldDraft: localStorage.getItem('cystems-project-request-v1'),
    previousDraft: localStorage.getItem('cystems-project-request-v2'),
    theme: localStorage.getItem('theme'),
    consent: localStorage.getItem('cystems-yuki-memory-opt-in'),
  }))).toEqual({ oldDraft: null, previousDraft: null, theme: 'dark', consent: 'true' });
  expect(errors).toEqual([]);
});
