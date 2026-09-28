import { test, expect } from '../fixtures/auth';

test.describe('Journey 10 - chatbot AI', () => {
  test('pesan valid mendapat jawaban dari provider AI yang dimock', async ({ userPage }) => {
    await userPage.route('**/api/ai/chat', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ reply: 'Jawaban AI E2E: silakan cek menu Status Pengajuan.' }),
    }));
    await userPage.goto('/user');
    await userPage.getByTestId('ai-open').click();
    await userPage.getByTestId('ai-input').fill('Bagaimana mengecek status surat?');
    await userPage.getByTestId('ai-send').click();
    await expect(userPage.getByText('Jawaban AI E2E: silakan cek menu Status Pengajuan.')).toBeVisible({ timeout: 10_000 });
  });

  test('input kosong tidak dapat dikirim dan rate limit ditampilkan sebagai fallback', async ({ userPage }) => {
    await userPage.route('**/api/ai/chat', route => route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ reply: 'Terlalu banyak permintaan. Coba lagi sebentar.' }),
    }));
    await userPage.goto('/user');
    await userPage.getByTestId('ai-open').click();
    await expect(userPage.getByTestId('ai-send')).toBeDisabled();
    await userPage.getByTestId('ai-input').fill('Coba lagi');
    await userPage.getByTestId('ai-send').click();
    await expect(userPage.getByText('Terlalu banyak permintaan. Coba lagi sebentar.')).toBeVisible({ timeout: 10_000 });
  });

  test('network error AI ditampilkan tanpa membocorkan detail provider', async ({ userPage }) => {
    await userPage.route('**/api/ai/chat', route => route.abort());
    await userPage.goto('/user');
    await userPage.getByTestId('ai-open').click();
    await userPage.getByTestId('ai-input').fill('Tes koneksi');
    await userPage.getByTestId('ai-send').click();
    await expect(userPage.getByText(/kendala koneksi ke server AI/i)).toBeVisible({ timeout: 10_000 });
  });
});
