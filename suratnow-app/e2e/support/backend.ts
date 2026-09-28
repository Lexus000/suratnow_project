import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { applyTestEnvironment, backendDirectory, phpBinary, testEnvironment } from '../e2e-env';

const execFileAsync = promisify(execFile);

export async function runArtisan(args: string[]): Promise<string> {
  applyTestEnvironment();
  const result = await execFileAsync(phpBinary, ['artisan', ...args], {
    cwd: backendDirectory,
    env: { ...process.env, ...testEnvironment },
    maxBuffer: 10 * 1024 * 1024,
  });

  return result.stdout.trim();
}
