import { test, expect } from '../fixtures/auth';
import { backendBaseUrl } from '../e2e-env';
import { authenticatedGet } from '../support/browser-api';

test.describe('Journey 7 - cetak surat', () => {
  test('surat approved tersedia di halaman cetak dan endpoint menghasilkan PDF', async ({ userPage }) => {
    await userPage.goto('/user/print');
    await expect(userPage.getByTestId('print-download-1')).toBeVisible();
    const response = await authenticatedGet(userPage, `${backendBaseUrl}/api/letters/1/print`);
    expect(response.status).toBe(200);
    expect(response.contentType).toContain('application/pdf');
  });

  test('request print untuk surat pending ditolak backend', async ({ userPage }) => {
    const response = await authenticatedGet(userPage, `${backendBaseUrl}/api/letters/2/print`);
    expect(response.status).toBe(422);
  });

  test('network error saat download tidak dianggap berhasil', async ({ userPage }) => {
    await userPage.route('**/api/letters/1/print', route => route.abort());
    await userPage.goto('/user/print');
    const printError = userPage.waitForEvent('requestfailed');
    await userPage.getByTestId('print-download-1').click();
    await printError;
    await expect(userPage.getByTestId('print-error')).toBeVisible();
  });
});
