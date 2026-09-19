import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

type Signal = { event: string; location: string; language: string };
async function captureSignals(page: Page) {
  const signals: Signal[] = [];
  await page.exposeFunction('__qaCaptureSignal', (detail: Signal) =>
    signals.push(detail),
  );
  await page.addInitScript(() => {
    window.addEventListener('cystems:analytics', (event) => {
      if (event instanceof CustomEvent) {
        const recorder = (
          window as unknown as {
            __qaCaptureSignal: (detail: unknown) => Promise<void>;
          }
        ).__qaCaptureSignal;
        void recorder(event.detail);
      }
    });
  });
  return signals;
}

for (const prefix of ['', '/en']) {
  test(`local commercial signals follow real actions without duplicate binding ${prefix || 'es'}`, async ({
    page,
  }) => {
    const signals = await captureSignals(page);
    const language = prefix ? 'en' : 'es';
    await page.goto(prefix || '/');
    await page.evaluate(() => {
      window.dispatchEvent(new Event('astro:page-load'));
      window.dispatchEvent(new Event('astro:page-load'));
    });
    await page.locator('[data-yuki-open]').click();
    await page.locator('[data-yuki-close]').click();
    await expect
      .poll(() => signals.filter((item) => item.event === 'ai_open').length)
      .toBe(1);
    await page.locator('[data-analytics-event="hero_cta"]').click();
    await expect
      .poll(() => signals.filter((item) => item.event === 'hero_cta').length)
      .toBe(1);
    await page.locator('footer [data-analytics-event="contact_click"]').click();
    await expect
      .poll(
        () => signals.filter((item) => item.event === 'contact_click').length,
      )
      .toBe(1);
    await page.goto(`${prefix}/proyectos?email=do-not-record@example.invalid`);
    await page.evaluate(() =>
      window.dispatchEvent(new Event('astro:page-load')),
    );
    await expect
      .poll(
        () => signals.filter((item) => item.event === 'project_view').length,
      )
      .toBe(1);
    for (const signal of signals) {
      expect(Object.keys(signal).sort()).toEqual([
        'event',
        'language',
        'location',
      ]);
      expect(signal.language).toBe(language);
    }
    expect(JSON.stringify(signals)).not.toContain('do-not-record');
    expect(
      await page.evaluate(() =>
        Object.keys(localStorage).some((key) => /analytics/i.test(key)),
      ),
    ).toBe(false);
    expect(
      (await page.context().cookies()).some((cookie) =>
        /analytics|_ga|ph_/i.test(cookie.name),
      ),
    ).toBe(false);
  });
}

test('form signals exclude personal data and only count server-confirmed success', async ({
  page,
}) => {
  const signals = await captureSignals(page);
  let requests = 0;
  await page.route('**/api/send-contact', async (route) => {
    requests++;
    await route.fulfill(
      requests === 1
        ? { status: 503, json: { success: false, message: 'Fixture retry' } }
        : { json: { success: true } },
    );
  });
  await page.goto('/empezar-proyecto/simple?intent=rescue');
  const form = page.locator('[data-simple-request-form]');
  await form.locator('[name="name"]').fill('Sensitive QA person');
  await form.locator('[name="email"]').fill('private-qa@example.invalid');
  await form
    .locator('[name="message"]')
    .fill('A private project description that must never enter analytics.');
  await page.locator('[data-submit-button]').click();
  await expect(page.locator('[data-submit-error]')).toBeVisible();
  expect(signals.filter((item) => item.event === 'form_complete')).toHaveLength(
    0,
  );
  await page.locator('[data-submit-button]').click();
  await expect(page.locator('[data-submit-success]')).toBeVisible();
  await expect
    .poll(() => signals.filter((item) => item.event === 'form_complete').length)
    .toBe(1);
  expect(signals).toEqual([
    { event: 'form_start', location: 'simple_form', language: 'es' },
    { event: 'form_complete', location: 'simple_form', language: 'es' },
  ]);
});

test('project form completion is recorded only after final confirmation', async ({
  page,
}) => {
  const signals = await captureSignals(page);
  await page.route('**/api/send-project', (route) =>
    route.fulfill({ json: { success: true } }),
  );
  await page.goto('/en/empezar-proyecto/proyecto');
  const form = page.locator('[data-project-wizard-form]');
  await form.locator('[name="fullName"]').fill('QA private name');
  await form.locator('[name="email"]').fill('private@example.invalid');
  await form.locator('[name="phone"]').fill('+593 99 123 4567');
  await form
    .locator('[name="projectDescription"]')
    .fill('Private project description.');
  const next = page.locator('[data-next-button]');
  await next.click();
  await next.click();
  await next.click();
  await expect(page.locator('[data-confirm-modal]')).toBeVisible();
  expect(signals.filter((item) => item.event === 'form_complete')).toHaveLength(
    0,
  );
  await page.locator('[data-confirm-send]').click();
  await expect(page.locator('[data-submit-success]')).toBeVisible();
  await expect
    .poll(() => signals.filter((item) => item.event === 'form_complete').length)
    .toBe(1);
  expect(signals).toEqual([
    { event: 'form_start', location: 'project_form', language: 'en' },
    { event: 'form_complete', location: 'project_form', language: 'en' },
  ]);
});

test('analytics rejects injected names and locations and ignores free-form attributes', async ({
  page,
}) => {
  const signals = await captureSignals(page);
  await page.goto('/');
  await page.evaluate(() => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.analyticsEvent = 'private-email@example.invalid';
    button.dataset.analyticsLocation = 'hero';
    document.body.append(button);
    button.click();
    button.dataset.analyticsEvent = 'hero_cta';
    button.dataset.analyticsLocation = '__proto__';
    button.click();
    button.dataset.analyticsLocation = 'hero';
    button.dataset.analyticsEmail = 'private@example.invalid';
    button.dataset.analyticsMessage = 'do not record this';
    button.click();
    button.remove();
  });
  await expect.poll(() => signals.length).toBe(1);
  expect(signals).toEqual([
    { event: 'hero_cta', location: 'hero', language: 'es' },
  ]);
});
