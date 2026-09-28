import { test, expect } from '../fixtures/auth';
import { backendBaseUrl } from '../e2e-env';
import { authenticatedGet } from '../support/browser-api';
import { performWithAcceptedDialog } from '../support/journeys';

test.describe('Journey 8 - manajemen pengguna superadmin', () => {
  test('superadmin dapat membuat, mengedit, mengubah role, menonaktifkan, dan reset password user', async ({ superadminPage }) => {
    await superadminPage.goto('/superadmin/pengguna');
    const email = `e2e-managed-${Date.now()}@example.test`;
    await superadminPage.getByTestId('user-management-add').click();
    await superadminPage.getByTestId('user-management-name').fill('E2E Managed User');
    await superadminPage.getByTestId('user-management-email').fill(email);
    await superadminPage.getByTestId('user-management-role').selectOption('user');
    await superadminPage.getByTestId('user-management-submit').click();

    await expect.poll(async () => {
      const response = await authenticatedGet(superadminPage, `${backendBaseUrl}/api/superadmin/users`);
      if (response.status !== 200) return false;
      const users = JSON.parse(response.body) as Array<{ email: string }>;
      return users.some(user => user.email === email);
    }, { timeout: 15_000 }).toBe(true);
    const usersResponse = await authenticatedGet(superadminPage, `${backendBaseUrl}/api/superadmin/users`);
    expect(usersResponse.status).toBe(200);
    const users = JSON.parse(usersResponse.body) as Array<{ id: number; email: string }>;
    const managedUser = users.find(user => user.email === email);
    expect(managedUser).toBeDefined();
    const row = superadminPage.getByTestId(`user-row-${managedUser!.id}`);
    await expect(row).toContainText('E2E Managed User');

    await row.getByTestId(`user-actions-${managedUser!.id}`).click();
    await superadminPage.getByTestId(`user-edit-${managedUser!.id}`).click();
    await superadminPage.getByTestId('user-management-edit-name').fill('E2E Managed User Updated');
    await superadminPage.getByTestId('user-management-edit-submit').click();
    await expect(row).toContainText('E2E Managed User Updated');

    await row.getByTestId(`user-actions-${managedUser!.id}`).click();
    await performWithAcceptedDialog(superadminPage, () => superadminPage.getByTestId(`user-role-admin-${managedUser!.id}`).click());
    await expect(row).toContainText('Admin');

    await row.getByTestId(`user-actions-${managedUser!.id}`).click();
    await performWithAcceptedDialog(superadminPage, () => superadminPage.getByTestId(`user-status-toggle-${managedUser!.id}`).click());
    await expect(row).toContainText('Nonaktif');

    await row.getByTestId(`user-actions-${managedUser!.id}`).click();
    await performWithAcceptedDialog(superadminPage, () => superadminPage.getByTestId(`user-reset-${managedUser!.id}`).click(), 2);
  });

  test('role user tidak dapat membuka area superadmin', async ({ userPage }) => {
    await userPage.goto('/superadmin/pengguna');
    await expect(userPage).toHaveURL(/\/user$/);
  });
});
