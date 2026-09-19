import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from '@playwright/test';

const freePort = async () => {
  const socket = createServer();
  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  return port;
};
const port = await freePort();
const baseURL = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['dist/server/entry.mjs'], {
  stdio: 'ignore',
  env: {
    ...process.env,
    HOST: '127.0.0.1',
    PORT: String(port),
    NODE_ENV: 'production',
    EMAIL_USER: '',
    EMAIL_PASS: '',
    YUKI_SITE_CHAT_ENABLED: 'false',
  },
});
let chrome;
try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null)
      throw new Error('Production server did not start');
    try {
      ready = (await fetch(baseURL, { signal: AbortSignal.timeout(500) })).ok;
    } catch {}
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!ready) throw new Error('Production server startup timed out');
  chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });
  await mkdir('test-results/performance', { recursive: true });
  const measurements = [];
  for (const path of ['/', '/servicios', '/proyectos']) {
    const result = await lighthouse(`${baseURL}${path}`, {
      port: chrome.port,
      output: ['json', 'html'],
      logLevel: 'error',
      // The workstation antivirus injects a script into HTTP responses. It is
      // not shipped by this app; exclude only that host from this browser's
      // lab measurement, without changing antivirus or production settings.
      blockedUrlPatterns: ['*://*.kaspersky-labs.com/*'],
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        disabled: false,
      },
    });
    if (!result)
      throw new Error(`Lighthouse did not return a report for ${path}`);
    const slug = path === '/' ? 'home' : path.slice(1);
    await writeFile(`test-results/performance/${slug}.json`, result.report[0]);
    await writeFile(`test-results/performance/${slug}.html`, result.report[1]);
    const audit = result.lhr.audits;
    measurements.push({
      path,
      scores: Object.fromEntries(
        Object.entries(result.lhr.categories).map(([key, value]) => [
          key,
          Math.round(value.score * 100),
        ]),
      ),
      lcpMs: Math.round(audit['largest-contentful-paint'].numericValue),
      cls: audit['cumulative-layout-shift'].numericValue,
      tbtMs: Math.round(audit['total-blocking-time'].numericValue),
    });
  }
  await writeFile(
    'test-results/performance/summary.json',
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        environment:
          'Local production build; Lighthouse simulated mobile throttling; workstation-injected kaspersky-labs.com requests blocked only in the audit browser. Lab results, not field Core Web Vitals.',
        measurements,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(measurements, null, 2));
} finally {
  if (chrome) await Promise.resolve(chrome.kill());
  server.kill();
}
