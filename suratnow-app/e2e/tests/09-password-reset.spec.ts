import { test, expect } from '../fixtures/auth';
import { runArtisan } from '../support/backend';

test.describe('Journey 9 - forgot dan reset password', () => {
  test('forgot password memakai respons generik dan reset valid berhasil', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByTestId('forgot-email').fill('alamat-tidak-terdaftar@example.test');
    await page.getByTestId('forgot-submit').click();
    await expect(page.getByTestId('forgot-message')).toContainText('Jika email terdaftar');

    const token = await runArtisan(['e2e:password-token', 'e2e-reset@example.test']);
    await page.goto(`/reset-password?email=${encodeURIComponent('e2e-reset@example.test')}&token=${encodeURIComponent(token)}`);
    await page.getByTestId('reset-password').fill('E2eResetCompleted!2026');
    await page.getByTestId('reset-password-confirmation').fill('E2eResetCompleted!2026');
    await page.getByTestId('reset-submit').click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('token invalid, password pendek, dan confirmation mismatch ditolak', async ({ page }) => {
    await page.goto('/reset-password?email=e2e-reset%40example.test&token=invalid-token');
    await page.getByTestId('reset-password').fill('E2eResetCompleted!2026');
    await page.getByTestId('reset-password-confirmation').fill('PasswordBerbeda!2026');
    await page.getByTestId('reset-submit').click();
    await expect(page.getByTestId('reset-error')).toBeVisible();

    await page.goto('/reset-password?email=e2e-reset%40example.test&token=invalid-token');
    await page.getByTestId('reset-password').fill('short');
    await page.getByTestId('reset-password-confirmation').fill('short');
    await expect(page.getByTestId('reset-password')).toHaveAttribute('minlength', '12');
    await page.getByTestId('reset-submit').click();
    await expect(page).toHaveURL(/reset-password/);
  });

  test('network error saat forgot password tetap memberi respons generik', async ({ page }) => {
    await page.route('**/api/password/forgot', route => route.abort());
    await page.goto('/forgot-password');
    await page.getByTestId('forgot-email').fill('e2e-user@example.test');
    await page.getByTestId('forgot-submit').click();
    await expect(page.getByTestId('forgot-message')).toContainText('Jika email terdaftar');
  });
});
