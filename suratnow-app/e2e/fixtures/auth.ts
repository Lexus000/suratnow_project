import { test as base, expect, type Page } from '@playwright/test';
import { authDirectory } from '../e2e-env';

type AuthFixtures = {
  userPage: Page;
  adminPage: Page;
  superadminPage: Page;
  petugasPage: Page;
};

export const test = base.extend<AuthFixtures>({
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: `${authDirectory}/user.json` });
    await use(await context.newPage());
    await context.close();
  },
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: `${authDirectory}/admin.json` });
    await use(await context.newPage());
    await context.close();
  },
  superadminPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: `${authDirectory}/superadmin.json` });
    await use(await context.newPage());
    await context.close();
  },
  petugasPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: `${authDirectory}/petugas.json` });
    await use(await context.newPage());
    await context.close();
  },
});

export { expect };
