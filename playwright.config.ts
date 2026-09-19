import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PLAYWRIGHT_PORT || 4321);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    locale: 'es-EC',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /(?:forms|interactions|commercial)\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /(?:forms|interactions|commercial)\.spec\.ts/,
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run build && node ./dist/server/entry.mjs',
        url: baseURL,
        // Never silently reuse a developer server that may hold live mail/chat keys.
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          HOST: '127.0.0.1',
          PORT: String(port),
          ALLOWED_ORIGINS: `${baseURL},https://cystems.ec,https://www.cystems.ec`,
          EMAIL_USER: '',
          EMAIL_PASS: '',
          YUKI_SITE_CHAT_ENABLED: 'false',
          // Exercises consent UI against test responses, not the live gateway.
          YUKI_SITE_CHAT_HISTORY_ENABLED: 'true',
          // Only this isolated loopback fixture acts as a trusted reverse proxy.
          // The security unit fixture separately verifies spoof rejection by default.
          TRUST_PROXY: 'cloudflare',
          TRUSTED_PROXY_CIDRS: '127.0.0.1/32,::1/128',
        },
      },
});
