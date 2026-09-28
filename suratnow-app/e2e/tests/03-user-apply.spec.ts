import { test, expect } from '../fixtures/auth';
import { performWithAcceptedDialog, samplePdf, submitSkm } from '../support/journeys';

test.describe('Journey 3 - pengajuan surat warga', () => {
  test('happy path memilih jenis surat, upload PDF, dan menjadi pending', async ({ userPage }) => {
    await submitSkm(userPage, `happy-${Date.now()}`);
    await expect(userPage.getByText('Pending').first()).toBeVisible();
    await expect(userPage.getByTestId('letter-pdf-input')).toHaveCount(0);
  });

  test('file bukan PDF dan data wajib yang kosong ditolak di sisi UI', async ({ userPage }) => {
    await userPage.goto('/user/request');
    await userPage.getByTestId('letter-type-surat-keterangan-miskin-skm').click();
    await userPage.getByTestId('letter-next').click();
    await userPage.getByTestId('letter-name').fill('');
    await userPage.getByTestId('letter-nik').fill('');
    await performWithAcceptedDialog(userPage, () => userPage.getByTestId('letter-next').click());

    await userPage.getByTestId('letter-name').fill('E2E Invalid File');
    await userPage.getByTestId('letter-nik').fill('9990000000000004');
    await userPage.getByTestId('letter-next').click();
    await performWithAcceptedDialog(userPage, () => userPage.getByTestId('letter-pdf-input').setInputFiles({ name: 'malware.txt', mimeType: 'text/plain', buffer: Buffer.from('not a pdf') }));
    await expect(userPage.getByTestId('letter-pdf-input')).toHaveCount(1);
  });

  test('network error saat pengajuan tidak berpura-pura berhasil', async ({ userPage }) => {
    await userPage.route('**/api/letter-requests', route => route.abort());
    await userPage.goto('/user/request');
    await userPage.getByTestId('letter-type-surat-keterangan-miskin-skm').click();
    await userPage.getByTestId('letter-next').click();
    await userPage.getByTestId('letter-name').fill('E2E Network Failure');
    await userPage.getByTestId('letter-nik').fill('9990000000000005');
    await userPage.getByTestId('letter-next').click();
    await userPage.getByTestId('letter-pdf-input').setInputFiles(samplePdf);
    const [message] = await performWithAcceptedDialog(userPage, () => userPage.getByTestId('letter-next').click());
    expect(message).toMatch(/kesalahan saat mengirim/i);
  });
});
