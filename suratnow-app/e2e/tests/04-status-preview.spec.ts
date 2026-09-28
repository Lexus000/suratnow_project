import { test, expect } from '../fixtures/auth';
import { backendBaseUrl } from '../e2e-env';
import { authenticatedGet } from '../support/browser-api';

test.describe('Journey 4 - status dan preview lampiran', () => {
  test('warga melihat preview PDF asli yang diunggah', async ({ userPage }) => {
    await userPage.goto('/user/status');
    await userPage.getByTestId('user-status-preview-1').click();
    await expect(userPage.getByTestId('attachment-preview-modal')).toBeVisible();
    await expect(userPage.getByTestId('attachment-preview-frame')).toBeVisible();
    await userPage.getByTestId('attachment-preview-close').click();
    await expect(userPage.getByTestId('attachment-preview-modal')).toHaveCount(0);
  });

  test('missing attachment menghasilkan state kosong yang informatif', async ({ userPage }) => {
    await userPage.route('**/api/letter-requests/1/attachment', route => route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Attachment not found' }),
    }));
    await userPage.goto('/user/status');
    await userPage.getByTestId('user-status-preview-1').click();
    await expect(userPage.getByTestId('attachment-preview-error')).toContainText('tidak dapat dibuka');
  });

  test('user A tidak dapat mengambil attachment milik user B', async ({ userPage }) => {
    const response = await authenticatedGet(userPage, `${backendBaseUrl}/api/letter-requests/3/attachment`);
    expect(response.status).toBe(403);
  });
});
