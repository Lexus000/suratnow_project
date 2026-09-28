import fs from 'node:fs/promises';
import { chromium, type FullConfig } from '@playwright/test';
import { authDirectory, frontendBaseUrl, resetTokenPath } from './e2e-env';
import { runArtisan } from './support/backend';

const users = {
  user: { email: 'e2e-user@example.test', password: 'E2eUserPassword!2026', path: '/user' },
  admin: { email: 'e2e-admin@example.test', password: 'E2eAdminPassword!2026', path: '/admin' },
  superadmin: { email: 'e2e-superadmin@example.test', password: 'E2eSuperadminPassword!2026', path: '/superadmin' },
  petugas: { email: 'e2e-petugas@example.test', password: 'E2ePetugasPassword!2026', path: '/petugas' },
} as const;

export default async function globalSetup(_config: FullConfig): Promise<void> {
  await fs.mkdir(authDirectory, { recursive: true });
  await runArtisan(['e2e:reset']);

  const browser = await chromium.launch();
  try {
    for (const [role, credentials] of Object.entries(users)) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`${frontendBaseUrl}/login`);
      await page.getByTestId('login-email').fill(credentials.email);
      await page.getByTestId('login-password').fill(credentials.password);
      await page.getByTestId('login-submit').click();
      await page.waitForURL(new RegExp(`${credentials.path.replace('/', '\\/')}$`));
      await context.storageState({ path: `${authDirectory}/${role}.json` });
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const token = await runArtisan(['e2e:password-token', 'e2e-reset@example.test']);
  await fs.writeFile(resetTokenPath, JSON.stringify({ email: 'e2e-reset@example.test', token }, null, 2), 'utf8');
}
