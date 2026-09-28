import path from 'node:path';
import { expect, type Page } from '@playwright/test';

export const samplePdf = path.resolve('e2e/fixtures/sample.pdf');

export async function submitSkm(page: Page, suffix = String(Date.now())): Promise<void> {
  await page.goto('/user/request');
  await page.getByTestId('letter-type-surat-keterangan-miskin-skm').click();
  await page.getByTestId('letter-next').click();
  await page.getByTestId('letter-name').fill(`E2E Pemohon ${suffix}`);
  await page.getByTestId('letter-nik').fill(`99900000${suffix.slice(-8).padStart(8, '0')}`.slice(0, 16));
  await page.getByTestId('letter-next').click();
  await expect(page.getByTestId('letter-pdf-input')).toBeAttached();
  await page.getByTestId('letter-pdf-input').setInputFiles(samplePdf);

  await performWithAcceptedDialog(page, () => page.getByTestId('letter-next').click());
  await page.waitForURL(/\/user\/status$/);
}

export async function acceptNextDialog(page: Page): Promise<void> {
  const dialog = await page.waitForEvent('dialog');
  await dialog.accept();
}

export async function performWithAcceptedDialog(page: Page, action: () => Promise<void>, expectedCount = 1): Promise<string[]> {
  const messages: string[] = [];
  let resolveDialogs!: (value: string[]) => void;
  let rejectDialogs!: (reason: Error) => void;
  const dialogsDone = new Promise<string[]>((resolve, reject) => {
    resolveDialogs = resolve;
    rejectDialogs = reject;
  });
  const timeout = setTimeout(() => {
    rejectDialogs(new Error(`Expected ${expectedCount} browser dialog(s), received ${messages.length}`));
  }, 15_000);
  const handler = async (dialog: import('@playwright/test').Dialog) => {
    messages.push(dialog.message());
    await dialog.accept();
    if (messages.length >= expectedCount) resolveDialogs([...messages]);
  };

  page.on('dialog', handler);
  try {
    await action();
    return await dialogsDone;
  } finally {
    clearTimeout(timeout);
    page.off('dialog', handler);
  }
}
