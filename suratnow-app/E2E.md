# End-to-end testing

Suite E2E menggunakan Playwright dan database MySQL terisolasi bernama `suratnow_e2e`. Database utama tidak disentuh. Global setup melakukan migrate + seed sebelum test, sedangkan global teardown membersihkan database tersebut setelah test selesai.

## Prasyarat lokal

- MySQL/Laragon aktif.
- Backend tersedia di `D:\Codex\suratnow-backend` atau atur `E2E_BACKEND_DIR`.
- PHP CLI tersedia. Contoh Laragon:

```powershell
$env:E2E_PHP_BIN = 'D:\laragon\bin\php\php-8.5.5-nts-Win32-vs17-x64\php.exe'
$env:E2E_DB_USERNAME = 'root'
$env:E2E_DB_PASSWORD = ''
npx playwright install chromium
```

## Menjalankan

```powershell
npm run test:e2e       # suite lengkap
npm run test:e2e:ui    # Playwright UI mode
npm run test:e2e:ci    # reporter ringkas untuk CI
```

Port default E2E adalah frontend `5173` dan backend `8080`. Jika port tersebut dipakai aplikasi lain, gunakan port terpisah dan biarkan Playwright menyalakan servernya:

```powershell
$env:E2E_FRONTEND_PORT = '5174'
$env:E2E_BACKEND_PORT = '8081'
npm run test:e2e
```

`E2E_EXTERNAL_SERVERS=true` hanya diperlukan jika kedua server sudah dinyalakan sendiri. Untuk mempertahankan database hasil test saat debugging, set `E2E_KEEP_DB=true`; gunakan hanya pada database yang namanya berakhiran `_e2e`.

## Cakupan journey

Suite mencakup autentikasi, registrasi, pengajuan PDF, preview lampiran, proses admin, sinkronisasi dashboard, cetak surat, manajemen user superadmin, reset password, dan chatbot. Setiap journey memiliki happy path serta failure state yang relevan. Auth fixture menyimpan sesi login per role agar flow login tidak diulang di setiap test.

## Batasan yang disengaja

- Email reset password memakai token yang dibuat oleh command E2E; pengiriman email provider produksi tidak diuji.
- Chatbot memakai mock response agar test tidak bergantung pada provider AI eksternal.
- Sinkronisasi diuji melalui polling endpoint dan refresh dashboard; ini memverifikasi konsistensi data, bukan koneksi WebSocket real-time.
- Preview PDF memverifikasi frame dan content-type dari endpoint private; rendering visual PDF tetap bergantung pada PDF viewer browser.

## CI

Workflow `.github/workflows/e2e.yml` berjalan pada setiap pull request dan `workflow_dispatch`. Backend dapat berada di folder `suratnow-backend/` pada repository yang sama, atau di-checkout dari repository yang ditentukan oleh secret `BACKEND_REPOSITORY`.
