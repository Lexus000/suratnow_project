import { defineConfig, devices } from '@playwright/test';
import { applyTestEnvironment, backendBaseUrl, backendDirectory, backendPort, frontendBaseUrl, frontendPort, phpBinary } from './e2e/e2e-env';

applyTestEnvironment();

const quoteCommandPath = (value: string) => `"${value.replaceAll('"', '\\"')}"`;
const backendCommand = `${quoteCommandPath(phpBinary)} artisan serve --host=127.0.0.1 --port=${backendPort}`;
const useExternalServers = process.env.E2E_EXTERNAL_SERVERS === 'true';

export default defineConfig({
  testDir: './e2e/tests',
  globalSetup: './e2e/global-setup.ts',
  globalTeardown: './e2e/global-teardown.ts',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: frontendBaseUrl,
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  webServer: useExternalServers ? undefined : [
    {
      command: `npm run dev -- --host 127.0.0.1 --port ${frontendPort}`,
      url: frontendBaseUrl,
      cwd: process.cwd(),
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: backendCommand,
      url: `${backendBaseUrl}/up`,
      cwd: backendDirectory,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
