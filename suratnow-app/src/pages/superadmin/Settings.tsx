import { useState } from 'react';
import { 
  Database, User, Shield, Settings as SettingsIcon, AlertCircle, 
  Download, Upload, Save, CheckCircle, FileSpreadsheet, 
  Image as ImageIcon, ExternalLink, Copy, Info, Key, Terminal, AlertTriangle 
} from 'lucide-react';
import { AnimatedPage } from "../../components/AnimatedPage";
import { useAuth } from "../../contexts/AuthContext";
import { isDemoMode } from "../../lib/runtimeMode";

export default function Settings() {
  const { user } = useAuth();
  const [tfa, setTfa] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [activeSheetTab, setActiveSheetTab] = useState('Overview');

  return (
    <AnimatedPage>
      <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto pb-24 text-slate-800 dark:text-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pengaturan Sistem</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola pengaturan sistem dan konfigurasi aplikasi</p>
        </div>

        {/* SECTION 1 - KELOLA DATA DEMO */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Sandbox Data Demo (Lokal)</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Fitur presentasi/testing hanya aktif jika VITE_DEMO_MODE=true; data produksi tetap berasal dari API dan database.</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex gap-3 text-sm mt-4 text-slate-600 dark:text-slate-400">
            <AlertCircle size={18} className="shrink-0 text-slate-500 mt-0.5" />
            <p>{isDemoMode ? 'Mode demo aktif: data sandbox tersimpan di localStorage browser.' : 'Mode produksi aktif: data demo tidak dibaca atau ditulis; sumber data adalah API dan database.'}</p>
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-bold text-sm mb-1">Reset Sandbox Demo</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Mengembalikan semua data ke kondisi awal demo dengan 20 pengajuan contoh dan user default.</p>
              <button disabled={!isDemoMode} title={isDemoMode ? 'Reset sandbox demo' : 'Aktifkan VITE_DEMO_MODE untuk menggunakan sandbox'} className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors text-sm shadow-sm">
                <AlertCircle size={16} /> Reset ke Data Awal
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm mb-1">Export Data</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Mengunduh semua data sistem dalam format JSON untuk backup atau migrasi.</p>
              <button disabled={!isDemoMode} title={isDemoMode ? 'Export sandbox demo' : 'Aktifkan VITE_DEMO_MODE untuk menggunakan sandbox'} className="w-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium">
                <Download size={16} /> Export Data JSON
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm mb-1">Import Data</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Mengimpor data dari file JSON yang telah diekspor sebelumnya.</p>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5 mb-3">
                <AlertCircle size={14} /> Import data akan menimpa semua data yang ada saat ini. Pastikan untuk melakukan backup terlebih dahulu.
              </p>
              <textarea 
                disabled={!isDemoMode}
                className="w-full h-24 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#0a5893] outline-none text-slate-800 dark:text-slate-200 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Paste konten JSON di sini..."
              />
              <button disabled={!isDemoMode} title={isDemoMode ? 'Import sandbox demo' : 'Aktifkan VITE_DEMO_MODE untuk menggunakan sandbox'} className="w-full bg-blue-500/80 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg mt-3 flex items-center justify-center gap-2 transition-colors text-sm font-medium shadow-sm">
                <Upload size={16} /> Import Data JSON
              </button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg mt-6 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Status Penyimpanan</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Sumber data runtime: {isDemoMode ? 'sandbox localStorage' : 'API/database'}</li>
              <li>Data production tidak bergantung pada cache browser</li>
              <li>Perubahan status disinkronkan melalui API</li>
              <li>Data terbagi dalam: Users, Letter Requests, dan Notifications</li>
            </ul>
          </div>
        </div>

        {/* SECTION 2 - PENGATURAN PROFIL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Pengaturan Profil</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Kelola informasi profil administrator dan preferensi akun</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mt-6">
            <div className="w-24 h-24 bg-[#0a5893] rounded-full shrink-0 flex items-center justify-center text-3xl font-bold text-white shadow-md">
              AKS
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                <input type="text" defaultValue={user?.name || ''} className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Jabatan</label>
                <input type="text" defaultValue="Administrator Sistem" className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nomor Telepon</label>
                <input type="text" defaultValue={user?.phone || ''} className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">NIP</label>
                <input type="text" defaultValue="" placeholder="Belum diisi" className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Unit Kerja</label>
                <input type="text" defaultValue="Kantor Kecamatan Suruh" className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors w-full sm:w-auto justify-center border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
              <ImageIcon size={16} /> Ubah Foto Profil
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-white bg-[#0a5893] hover:bg-[#08487a] px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto justify-center shadow-sm">
              <Save size={16} /> Simpan Perubahan
            </button>
          </div>
        </div>

        {/* SECTION 3 - KEAMANAN & AUTENTIKASI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Keamanan & Autentikasi</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pengaturan keamanan, autentikasi, dan kontrol akses sistem</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Aktifkan autentikasi dua faktor untuk keamanan tambahan</p>
              </div>
              <button 
                onClick={() => setTfa(!tfa)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${tfa ? 'bg-[#0a5893]' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${tfa ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Login Otomatis</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Ingat sesi login selama 30 hari</p>
              </div>
              <button 
                onClick={() => setAutoLogin(!autoLogin)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${autoLogin ? 'bg-[#0a5893]' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${autoLogin ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">Notifikasi Email</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Terima email untuk aktivitas penting</p>
              </div>
              <button 
                onClick={() => setEmailNotif(!emailNotif)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${emailNotif ? 'bg-[#0a5893]' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${emailNotif ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4 - PENGATURAN SISTEM (GOOGLE SHEETS) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              <SettingsIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Pengaturan Sistem</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Konfigurasi sistem dan integrasi eksternal</p>
            </div>
          </div>

          <div>
            <div className="p-5 mb-4 flex items-center gap-3">
              <FileSpreadsheet size={24} className="text-[#0a5893] dark:text-blue-400" />
              <div>
                <h3 className="font-bold text-sm">Setup Google Sheets Integration</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Panduan lengkap untuk mengintegrasikan sistem dengan Google Sheets sebagai database backup</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
              {['Overview', 'Setup API', 'Structure', 'Config', 'Code'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSheetTab(tab)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                    activeSheetTab === tab 
                      ? 'bg-white dark:bg-slate-700 text-[#0a5893] dark:text-blue-400 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeSheetTab === 'Overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="font-bold text-sm mb-4">Mengapa Google Sheets?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                  <div>
                    <h4 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-semibold text-xs mb-3 uppercase tracking-wider">
                      <CheckCircle size={18} /> KEUNTUNGAN
                    </h4>
                    <ul className="space-y-2 text-[13px] text-slate-600 dark:text-slate-400">
                      <li className="flex gap-2 items-start"><span className="text-slate-300 dark:text-slate-600 text-lg leading-4">•</span> Backup otomatis dan real-time</li>
                      <li className="flex gap-2 items-start"><span className="text-slate-300 dark:text-slate-600 text-lg leading-4">•</span> Akses mudah untuk analisis data</li>
                      <li className="flex gap-2 items-start"><span className="text-slate-300 dark:text-slate-600 text-lg leading-4">•</span> Gratis dan mudah digunakan</li>
                      <li className="flex gap-2 items-start"><span className="text-slate-300 dark:text-slate-600 text-lg leading-4">•</span> Kolaborasi tim yang mudah</li>
                      <li className="flex gap-2 items-start"><span className="text-slate-300 dark:text-slate-600 text-lg leading-4">•</span> Export ke berbagai format</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-semibold text-xs mb-3 uppercase tracking-wider">
                      <AlertTriangle size={18} /> PERTIMBANGAN
                    </h4>
                    <ul className="space-y-2 text-[13px] text-slate-600 dark:text-slate-400">
                      <li className="flex gap-2 items-start"><span className="text-slate-300 dark:text-slate-600 text-lg leading-4">•</span> Rate limiting API (100 req/100s/user)</li>
                      <li className="flex gap-2 items-start"><span className="text-slate-300 dark:text-slate-600 text-lg leading-4">•</span> Maksimal 10M cells per sheet</li>
                      <li className="flex gap-2 items-start"><span className="text-slate-300 dark:text-slate-600 text-lg leading-4">•</span> Latensi sedikit lebih tinggi</li>
                      <li className="flex gap-2 items-start"><span className="text-slate-300 dark:text-slate-600 text-lg leading-4">•</span> Perlu setup API key/OAuth</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SETUP API */}
            {activeSheetTab === 'Setup API' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                <h3 className="font-bold text-sm mb-6">Langkah-langkah Setup Google Sheets API</h3>
                
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                  
                  {/* Step 1 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#0a5893] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 ring-4 ring-white dark:ring-slate-900 z-10">1</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[13px] text-slate-800 dark:text-slate-100">Buat Project di Google Cloud Console</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Buka Google Cloud Console dan buat project baru untuk aplikasi kecamatan</p>
                      <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                        <ExternalLink size={14} /> Buka Google Cloud Console
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#0a5893] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 ring-4 ring-white dark:ring-slate-900 z-10">2</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[13px] text-slate-800 dark:text-slate-100">Aktifkan Google Sheets API</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">Di Google Cloud Console, aktifkan Google Sheets API untuk project Anda</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-4 list-decimal">
                        <li>Masuk ke "APIs & Services" &gt; "Library"</li>
                        <li>Cari "Google Sheets API"</li>
                        <li>Klik "Enable"</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#0a5893] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 ring-4 ring-white dark:ring-slate-900 z-10">3</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[13px] text-slate-800 dark:text-slate-100">Buat API Key</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">Buat API key untuk mengakses Google Sheets API</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-4 list-decimal">
                        <li>Masuk ke "APIs & Services" &gt; "Credentials"</li>
                        <li>Klik "Create Credentials" &gt; "API Key"</li>
                        <li>Salin API key yang dibuat</li>
                        <li>Restrict API key untuk keamanan</li>
                      </ul>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#0a5893] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 ring-4 ring-white dark:ring-slate-900 z-10">4</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[13px] text-slate-800 dark:text-slate-100">Setup Google Spreadsheet</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">Buat spreadsheet baru dan atur permissions</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-4 list-decimal">
                        <li>Buat Google Spreadsheet baru</li>
                        <li>Salin Sheet ID dari URL</li>
                        <li>Set sharing ke "Anyone with the link can edit" (untuk testing)</li>
                        <li>Atau gunakan Service Account untuk production</li>
                      </ul>
                    </div>
                  </div>

                </div>

                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-4 rounded-lg mt-8 flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Info size={18} className="shrink-0 text-slate-500 mt-0.5" />
                  <div>
                    <span className="font-bold">Keamanan:</span> Untuk production, gunakan Service Account dengan proper IAM permissions dan jangan expose API key di client-side code.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STRUCTURE */}
            {activeSheetTab === 'Structure' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6 border border-slate-100 dark:border-slate-800 p-6 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h3 className="font-bold text-[14px] text-slate-800 dark:text-slate-100 mb-1">Struktur Google Spreadsheet</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Template yang akan digunakan untuk menyimpan data pengajuan surat</p>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Template Headers</h4>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                      <Copy size={14} /> Copy Template
                    </button>
                  </div>
                  <pre className="bg-slate-50 dark:bg-slate-900 overflow-x-auto p-4 text-[11px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre">
                    {`ID Pengajuan    Nama Pemohon    NIK             Email               No. HP          Jenis Surat                 ...
1               Ahmad Sudrajat  3201234567890   ahmad@example.com   081234567890    Surat Keterangan Domisili   ...`}
                  </pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-bold text-sm mb-3">Kolom Utama</h4>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• ID Pengajuan:</span> Unique identifier</li>
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• Nama Pemohon:</span> Nama lengkap</li>
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• NIK:</span> Nomor Induk Kependudukan</li>
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• Jenis Surat:</span> Type surat yang diajukan</li>
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• Status:</span> Pending/Disetujui/Ditolak</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-3">Kolom Detail</h4>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• Email & No. HP:</span> Contact info</li>
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• Keperluan:</span> Tujuan penggunaan</li>
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• Deskripsi:</span> Detail tambahan</li>
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• Tanggal:</span> Created & updated timestamps</li>
                      <li><span className="font-semibold text-slate-800 dark:text-slate-200">• Catatan Admin:</span> Admin notes</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-sm mb-4">Setup Sheet Tabs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                      <h5 className="font-bold text-sm mb-1">Data Surat</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Sheet utama untuk menyimpan semua pengajuan surat</p>
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded text-[10px] font-semibold border border-blue-100 dark:border-blue-800/50">Primary</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                      <h5 className="font-bold text-sm mb-1">Data Pengguna</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Sheet terpisah untuk data master pengguna</p>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded text-[10px] font-semibold border border-slate-200 dark:border-slate-600">Optional</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                      <h5 className="font-bold text-sm mb-1">Log Aktivitas</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Sheet untuk menyimpan log perubahan status</p>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded text-[10px] font-semibold border border-slate-200 dark:border-slate-600">Optional</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CONFIG */}
            {activeSheetTab === 'Config' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-800">
                  <h3 className="font-bold text-sm mb-1">Konfigurasi Aplikasi</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Input API credentials dan Sheet ID untuk integrasi</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Google Sheet ID</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: 1BxIMVs0XRA5nFMdKvBdBZjgrmUUqptlbs74OgvE2upms"
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Sheet ID dapat ditemukan di URL: https://docs.google.com/spreadsheets/d/<span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">[SHEET_ID]</span>/edit</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Google API Key</label>
                      <input 
                        type="password" 
                        placeholder="Masukkan API Key dari Google Cloud Console"
                        className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">API Key dapat dibuat di Google Cloud Console &gt; APIs & Services &gt; Credentials</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex gap-3 text-sm text-slate-600 dark:text-slate-400 mt-2">
                      <Key size={18} className="shrink-0 text-slate-500 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-0.5">Keamanan:</span> 
                        Jangan commit API key ke version control. Gunakan environment variables untuk production deployment.
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button className="bg-[#0a5893] hover:bg-[#08487a] text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                        <SettingsIcon size={16} /> Simpan Konfigurasi
                      </button>
                      <button className="border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
                        Test Koneksi
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-800">
                  <h4 className="font-bold text-sm mb-3">Environment Variables</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Untuk production, gunakan environment variables:</p>
                  <pre className="bg-[#0f172a] text-emerald-400 p-4 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto shadow-inner border border-slate-800">
                    <code className="text-slate-400"># .env.local</code><br/>
                    GOOGLE_SHEETS_ID=<span className="text-amber-300">your_sheet_id_here</span><br/>
                    GOOGLE_API_KEY=<span className="text-amber-300">your_api_key_here</span><br/>
                    GOOGLE_SHEETS_RANGE=<span className="text-amber-300">Sheet1!A:Z</span>
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 5: CODE */}
            {activeSheetTab === 'Code' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-[13px] flex items-center gap-2">
                        <Terminal size={16} className="text-slate-500" /> Implementation Code
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Contoh kode untuk implementasi Google Sheets API</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg">
                      <Copy size={14} /> Copy Code
                    </button>
                  </div>
                  
                  <div className="p-4 sm:p-6 bg-[#0f172a]">
                    <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-widest border-b border-slate-700/50 pb-2 inline-block">Google Sheets API Integration</h4>
                    <pre className="text-blue-300 text-[11px] sm:text-xs font-mono overflow-x-auto leading-relaxed">
{`// 1. Aktifkan Google Sheets API di Google Cloud Console
// 2. Buat Service Account atau API Key
// 3. Konfigurasi permissions untuk spreadsheet

// Contoh penggunaan Google Sheets API v4
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
const API_KEY = 'YOUR_API_KEY';
const RANGE = 'Sheet1!A:Z';

// Read data
const readURL = \`https://sheets.googleapis.com/v4/spreadsheets/\${SHEET_ID}/values/\${RANGE}?key=\${API_KEY}\`;

// Write data (requires OAuth/Service Account for POST/PUT)
const writeURL = \`https://sheets.googleapis.com/v4/spreadsheets/\${SHEET_ID}/values/\${RANGE}?valueInputOption=USER_ENTERED\`;

// Example API call (Fetch wrapper)
async function fetchSheetData() {
  try {
    const response = await fetch(readURL);
    const data = await response.json();
    return data.values; // Returns array of arrays
  } catch (error) {
    console.error('Error fetching sheet:', error);
  }
}`}
                    </pre>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-800">
                  <h4 className="font-bold text-sm mb-4">Error Handling</h4>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50">
                    <p className="text-[13px] font-semibold mb-3 text-slate-700 dark:text-slate-200">Common Issues & Solutions</p>
                    <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                      <li><span className="font-bold text-rose-600 dark:text-rose-400">403 Forbidden:</span> Check API key restrictions and permissions</li>
                      <li><span className="font-bold text-amber-600 dark:text-amber-400">404 Not Found:</span> Verify Sheet ID and sheet name (Range)</li>
                      <li><span className="font-bold text-blue-600 dark:text-blue-400">429 Rate Limited:</span> Implement retry mechanism with exponential backoff</li>
                      <li><span className="font-bold text-slate-800 dark:text-slate-300">400 Bad Request:</span> Check data format and range syntax</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
