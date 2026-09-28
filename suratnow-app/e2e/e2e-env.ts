import path from 'node:path';

export const frontendPort = process.env.E2E_FRONTEND_PORT || '5173';
export const backendPort = process.env.E2E_BACKEND_PORT || '8080';
export const frontendBaseUrl = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${frontendPort}`;
export const backendBaseUrl = process.env.E2E_BACKEND_URL || `http://127.0.0.1:${backendPort}`;
export const backendDirectory = path.resolve(process.env.E2E_BACKEND_DIR || '../suratnow-backend');
export const phpBinary = process.env.E2E_PHP_BIN || 'php';
export const authDirectory = path.resolve('.playwright/auth');
export const resetTokenPath = path.resolve('.playwright/reset-token.json');

export const testEnvironment: Record<string, string> = {
  APP_ENV: 'e2e',
  APP_DEBUG: 'false',
  APP_KEY: process.env.E2E_APP_KEY || 'base64:7mJf4zjX0lQ0M1P2Y3r4t5u6v7w8x9y0z1A2B3C4D5E=',
  APP_URL: backendBaseUrl,
  DB_CONNECTION: 'mysql',
  DB_HOST: process.env.E2E_DB_HOST || '127.0.0.1',
  DB_PORT: process.env.E2E_DB_PORT || '3306',
  DB_DATABASE: process.env.E2E_DB_DATABASE || 'suratnow_e2e',
  DB_USERNAME: process.env.E2E_DB_USERNAME || 'root',
  DB_PASSWORD: process.env.E2E_DB_PASSWORD || '',
  SESSION_DRIVER: 'database',
  SESSION_SECURE_COOKIE: 'false',
  SESSION_SAME_SITE: 'lax',
  CACHE_STORE: 'array',
  QUEUE_CONNECTION: 'sync',
  MAIL_MAILER: 'array',
  FILESYSTEM_DISK: 'local',
  CORS_ALLOWED_ORIGINS: frontendBaseUrl,
  SANCTUM_STATEFUL_DOMAINS: `${new URL(frontendBaseUrl).host},localhost:${frontendPort}`,
  FRONTEND_URL: frontendBaseUrl,
  E2E_ALLOW_DATABASE_MUTATION: 'true',
  LOG_CHANNEL: 'stderr',
  BCRYPT_ROUNDS: '4',
  VITE_API_URL: `${backendBaseUrl}/api`,
};

export function applyTestEnvironment(): void {
  for (const [key, value] of Object.entries(testEnvironment)) {
    if (!process.env[key]) process.env[key] = value;
  }
}
