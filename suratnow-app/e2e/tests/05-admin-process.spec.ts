import { test, expect } from '../fixtures/auth';
import { backendBaseUrl } from '../e2e-env';
import { performWithAcceptedDialog, submitSkm } from '../support/journeys';
import { authenticatedGet } from '../support/browser-api';

test.describe('Journey 5 - admin memproses pengajuan', () => {
  test('admin dapat preview, mengembalikan, lalu menyetujui dengan nomor registrasi', async ({ adminPage, userPage }) => {
    await submitSkm(userPage, `admin-flow-${Date.now()}`);
    const created = await authenticatedGet(userPage, `${backendBaseUrl}/api/letter-requests`);
    const requestId = (JSON.parse(created.body) as Array<{ id: number }>)[0].id;
    await adminPage.goto('/admin/status');
    await adminPage.getByTestId(`admin-preview-${requestId}`).click();
    await expect(adminPage.getByTestId('attachment-preview-frame')).toBeVisible();
    await adminPage.getByTestId('attachment-preview-close').click();

    await adminPage.getByTestId(`admin-process-${requestId}`).click();
    await performWithAcceptedDialog(adminPage, () => adminPage.getByRole('button', { name: 'Tolak' }).click());
    await expect(adminPage.getByTestId('admin-process-modal')).toBeVisible();

    await adminPage.getByTestId('admin-notes').fill('Mohon unggah dokumen dengan stempel yang terlihat.');
    await performWithAcceptedDialog(adminPage, () => adminPage.getByRole('button', { name: 'Kembalikan' }).click());
    await expect(adminPage.getByTestId('admin-process-modal')).toHaveCount(0);

    await adminPage.getByTestId(`admin-process-${requestId}`).click();
    await adminPage.getByRole('button', { name: 'Setujui Surat' }).click();
    await adminPage.getByTestId('admin-registration-number').fill(`E2E-UI-${Date.now()}`);
    await performWithAcceptedDialog(adminPage, () => adminPage.getByTestId('admin-approval-confirm').click());
    await expect(adminPage.getByTestId(`admin-status-row-${requestId}`)).toHaveCount(0, { timeout: 15_000 });
  });

  test('nomor registrasi kosong dicegah sebelum request approve dikirim', async ({ adminPage, userPage }) => {
    await submitSkm(userPage, `admin-empty-${Date.now()}`);
    const created = await authenticatedGet(userPage, `${backendBaseUrl}/api/letter-requests`);
    const requestId = (JSON.parse(created.body) as Array<{ id: number }>)[0].id;
    await adminPage.goto('/admin/status');
    await adminPage.getByTestId(`admin-process-${requestId}`).click();
    await adminPage.getByRole('button', { name: 'Setujui Surat' }).click();
    await adminPage.getByTestId('admin-approval-confirm').click();
    await expect(adminPage.getByTestId('admin-action-error')).toContainText('Nomor registrasi wajib');
  });

  test('network error saat approve tetap terlihat sebagai kegagalan', async ({ adminPage, userPage }) => {
    await submitSkm(userPage, `admin-network-${Date.now()}`);
    const created = await authenticatedGet(userPage, `${backendBaseUrl}/api/letter-requests`);
    const requestId = (JSON.parse(created.body) as Array<{ id: number }>)[0].id;
    await adminPage.route(`**/api/letter-requests/${requestId}/approve`, route => route.abort());
    await adminPage.goto('/admin/status');
    await adminPage.getByTestId(`admin-process-${requestId}`).click();
    await adminPage.getByRole('button', { name: 'Setujui Surat' }).click();
    await adminPage.getByTestId('admin-registration-number').fill(`E2E-NET-${Date.now()}`);
    const [message] = await performWithAcceptedDialog(adminPage, () => adminPage.getByTestId('admin-approval-confirm').click());
    expect(message).toMatch(/kesalahan saat memperbarui/i);
  });
});
