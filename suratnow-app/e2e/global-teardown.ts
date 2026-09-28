import fs from 'node:fs/promises';
import { resetTokenPath } from './e2e-env';
import { runArtisan } from './support/backend';

export default async function globalTeardown(): Promise<void> {
  if (process.env.E2E_KEEP_DB !== 'true') {
    await runArtisan(['e2e:cleanup']);
  }

  await fs.rm(resetTokenPath, { force: true });
}
