import { test, expect } from '../fixtures/auth';
import { backendBaseUrl } from '../e2e-env';
import { performWithAcceptedDialog, submitSkm } from '../support/journeys';
import { authenticatedGet } from '../support/browser-api';

test.describe('Journey 6 - sinkronisasi lintas dashboard', () => {
  test('pengajuan warga muncul di admin dan status final tercermin di semua ringkasan', async ({ userPage, adminPage, superadminPage }) => {
    await submitSkm(userPage, `sync-${Date.now()}`);
    const userRequestsResponse = await authenticatedGet(userPage, `${backendBaseUrl}/api/letter-requests`);
    expect(userRequestsResponse.status).toBe(200);
    const userRequests = JSON.parse(userRequestsResponse.body) as Array<{ id: number; status: string }>;
    const requestId = userRequests[0].id;

    await adminPage.goto('/admin/status');
    await expect(adminPage.getByTestId(`admin-status-row-${requestId}`)).toBeVisible({ timeout: 15_000 });
    await adminPage.getByTestId(`admin-process-${requestId}`).click();
    await adminPage.getByRole('button', { name: 'Setujui Surat' }).click();
    await adminPage.getByTestId('admin-registration-number').fill(`E2E-SYNC-${Date.now()}`);
    await performWithAcceptedDialog(adminPage, () => adminPage.getByTestId('admin-approval-confirm').click());

    await expect.poll(async () => {
      const response = await authenticatedGet(userPage, `${backendBaseUrl}/api/letter-requests/${requestId}`);
      return (JSON.parse(response.body) as { status: string }).status;
    }, { timeout: 15_000 }).toBe('approved');

    await userPage.goto('/user');
    await expect(userPage.getByTestId('user-stat-approved')).toHaveText(/\d+/);
    await adminPage.goto('/admin');
    await expect(adminPage.getByTestId('admin-stat-approved')).toHaveText(/\d+/);
    await superadminPage.goto('/superadmin');
    await expect(superadminPage.getByTestId('superadmin-stat-approved')).toHaveText(/\d+/);
  });
});
