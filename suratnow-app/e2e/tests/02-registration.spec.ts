import { test, expect } from '../fixtures/auth';

test.describe('Journey 2 - registrasi', () => {
  test('registrasi valid berhasil, data duplikat dan password pendek ditolak', async ({ page, browser }) => {
    const email = `e2e-new-${Date.now()}@example.test`;
    await page.goto('/register');
    await page.getByTestId('register-name').fill('E2E Registered User');
    await page.getByTestId('register-email').fill(email);
    await page.getByTestId('register-password').fill('E2eNewPassword!2026');
    await page.getByTestId('register-submit').click();
    await expect(page).toHaveURL(/\/user$/);

    const cleanContext = await browser.newContext();
    const cleanPage = await cleanContext.newPage();
    try {
      await cleanPage.goto('/register');
      await cleanPage.getByTestId('register-name').fill('Duplicate User');
      await cleanPage.getByTestId('register-email').fill('e2e-user@example.test');
      await cleanPage.getByTestId('register-password').fill('E2eNewPassword!2026');
      await cleanPage.getByTestId('register-submit').click();
      await expect(cleanPage.getByTestId('register-error')).toBeVisible();

      await cleanPage.goto('/register');
      await cleanPage.getByTestId('register-name').fill('Short Password User');
      await cleanPage.getByTestId('register-email').fill(`e2e-short-${Date.now()}@example.test`);
      await cleanPage.getByTestId('register-password').fill('short');
      await expect(cleanPage.getByTestId('register-password')).toHaveAttribute('minlength', '12');
      await cleanPage.getByTestId('register-submit').click();
      await expect(cleanPage).toHaveURL(/\/register$/);
    } finally {
      await cleanContext.close();
    }
  });

  test('network error saat registrasi menampilkan error yang dapat dipahami', async ({ page }) => {
    await page.route('**/api/register', route => route.abort());
    await page.goto('/register');
    await page.getByTestId('register-name').fill('Network Failure User');
    await page.getByTestId('register-email').fill(`e2e-network-${Date.now()}@example.test`);
    await page.getByTestId('register-password').fill('E2eNetworkPassword!2026');
    await page.getByTestId('register-submit').click();
    await expect(page.getByTestId('register-error')).toBeVisible();
  });
});
