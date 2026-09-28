import { request, type Page } from '@playwright/test';
import { frontendBaseUrl } from '../e2e-env';

export async function authenticatedGet(page: Page, url: string): Promise<{ status: number; contentType: string; body: string }> {
  const cookies = await page.context().cookies();
  const api = await request.newContext({
    extraHTTPHeaders: {
      Accept: 'application/json',
      Origin: frontendBaseUrl,
      Referer: `${frontendBaseUrl}/`,
      Cookie: cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; '),
    },
  });
  try {
    const response = await api.get(url);
    return {
      status: response.status(),
      contentType: response.headers()['content-type'] || '',
      body: await response.text(),
    };
  } finally {
    await api.dispose();
  }
}
