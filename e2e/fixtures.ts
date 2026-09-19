import { test as base, expect } from '@playwright/test';

// UI tests must never deliver mail or send a real chat message. Each interaction
// test supplies its own deterministic response, registered after these guards.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route('**/api/send-*', (route) => route.abort('blockedbyclient'));
    await page.route('**/api/yuki-chat', (route) => route.abort('blockedbyclient'));
    await use(page);
  },
});
export { expect };

export const routes = [
  '/', '/servicios', '/proyectos', '/perfil/cristian-bravo', '/empezar-proyecto',
  '/empezar-proyecto/simple', '/empezar-proyecto/proyecto', '/contacto', '/blog',
].flatMap((route) => [route, `/en${route === '/' ? '' : route}`]);

export const viewports = [
  { width: 320, height: 740 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];
