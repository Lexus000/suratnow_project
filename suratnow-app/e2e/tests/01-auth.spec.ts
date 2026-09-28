import { test, expect } from '../fixtures/auth';

test.describe('Journey 1 - autentikasi dan session', () => {
  test('login valid membuka dashboard sesuai role dan password salah ditolak', async ({ page, userPage, adminPage, superadminPage }) => {
    await page.goto('/login');
    await page.getByTestId('login-email').fill('e2e-user@example.test');
    await page.getByTestId('login-password').fill('password-salah');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('login-error')).toContainText(/Invalid credentials|kesalahan|CSRF token mismatch/i);

    await userPage.goto('/user');
    await expect(userPage).toHaveURL(/\/user$/);
    await adminPage.goto('/admin');
    await expect(adminPage).toHaveURL(/\/admin$/);
    await superadminPage.goto('/superadmin');
    await expect(superadminPage).toHaveURL(/\/superadmin$/);
  });

  test('session yang dihapus tidak dapat melewati route guard', async ({ userPage }) => {
    await userPage.context().clearCookies();
    await userPage.goto('/admin');
    await expect(userPage).toHaveURL(/\/login$/);
  });
});
