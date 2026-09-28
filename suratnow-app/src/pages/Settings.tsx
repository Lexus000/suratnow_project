import { DashboardLayout } from "../components/layout/DashboardLayout";
import { AnimatedPage } from "../components/AnimatedPage";
import { useAuth } from "../contexts/AuthContext";
import { 
  Settings as SettingsIcon, User, Globe, Sun, Volume2, Save, LogOut 
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <AnimatedPage className="space-y-6 pb-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Pengaturan</h2>
            <p className="text-sm text-slate-500">Kelola preferensi akun dan aplikasi Anda</p>
          </div>
          <div className="p-2 text-[#0a5893] hover:bg-blue-50 rounded-full transition-colors cursor-pointer shrink-0">
            <SettingsIcon size={24} />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-xl flex items-center justify-between md:justify-start gap-1 overflow-x-auto w-full shadow-sm border border-slate-200">
          <button className="px-6 py-2 bg-white text-slate-800 font-semibold text-sm rounded-lg shadow-sm whitespace-nowrap flex-1 md:flex-none transition-all">
            Akun
          </button>
          <button className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm rounded-lg hover:bg-slate-200/50 transition-colors whitespace-nowrap flex-1 md:flex-none">
            Keamanan
          </button>
          <button className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm rounded-lg hover:bg-slate-200/50 transition-colors whitespace-nowrap flex-1 md:flex-none">
            Notifikasi
          </button>
          <button className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm rounded-lg hover:bg-slate-200/50 transition-colors whitespace-nowrap flex-1 md:flex-none">
            Privasi
          </button>
          <button className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm rounded-lg hover:bg-slate-200/50 transition-colors whitespace-nowrap flex-1 md:flex-none">
            Bantuan
          </button>
          <button className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm rounded-lg hover:bg-slate-200/50 transition-colors whitespace-nowrap flex-1 md:flex-none">
            Tentang
          </button>
        </div>

        {/* SECTION 1: Informasi Akun */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <User size={20} className="text-slate-700" />
            <h3 className="text-lg font-semibold text-slate-800">Informasi Akun</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">Pengaturan dasar akun Anda</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium">
                {user?.name || 'Belum diisi'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">NIK</label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium">
                {user?.nik || 'Belum diisi'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium">
                {user?.email || 'Belum diisi'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">No. Telepon</label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium">
                {user?.phone || 'Belum diisi'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tempat Lahir</label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium">
                -
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal Lahir</label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium">
                -
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Alamat Lengkap</label>
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 font-medium">
                {user?.address || 'Belum diisi'}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              <span className="font-bold">Penting:</span> Pastikan semua informasi akun Anda sudah lengkap dan benar. Data yang tidak lengkap dapat memperlambat proses verifikasi pengajuan surat.
            </p>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              Edit Profil
            </button>
          </div>
        </div>

        {/* SECTION 2: Preferensi */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Globe size={20} className="text-slate-700" />
            <h3 className="text-lg font-semibold text-slate-800">Preferensi</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Row 1 */}
            <div className="py-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Sun size={20} className="text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Mode Gelap</h4>
                  <p className="text-xs text-slate-500">Aktifkan tema gelap untuk aplikasi</p>
                </div>
              </div>
              <button className="w-11 h-6 bg-slate-200 rounded-full relative transition-colors focus:outline-none shrink-0">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 left-0.5 transition-transform"></div>
              </button>
            </div>

            {/* Row 2 */}
            <div className="py-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                {/* Spacer to align with icons above */}
                <div className="w-5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Bahasa</h4>
                  <p className="text-xs text-slate-500">Pilih bahasa aplikasi</p>
                </div>
              </div>
              <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-[#0a5893] focus:border-[#0a5893] block p-2 outline-none cursor-pointer">
                <option>Bahasa Indonesia</option>
                <option>English</option>
              </select>
            </div>

            {/* Row 3 */}
            <div className="py-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Volume2 size={20} className="text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Suara Notifikasi</h4>
                  <p className="text-xs text-slate-500">Aktifkan suara untuk notifikasi</p>
                </div>
              </div>
              <button className="w-11 h-6 bg-[#0a5893] rounded-full relative transition-colors focus:outline-none shrink-0">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 right-0.5 transition-transform"></div>
              </button>
            </div>

            {/* Row 4 */}
            <div className="py-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Save size={20} className="text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Auto-save</h4>
                  <p className="text-xs text-slate-500">Simpan draft otomatis saat mengisi form</p>
                </div>
              </div>
              <button className="w-11 h-6 bg-[#0a5893] rounded-full relative transition-colors focus:outline-none shrink-0">
                <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 right-0.5 transition-transform"></div>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: Danger Zone */}
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-rose-700 mb-0.5">Keluar dari Akun</h3>
            <p className="text-sm text-rose-600/80">Anda akan keluar dari sesi saat ini</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-600 text-white font-semibold text-sm rounded-lg hover:bg-rose-700 transition-colors shadow-sm shrink-0">
            <LogOut size={16} /> Logout
          </button>
        </div>

      </AnimatedPage>
    </DashboardLayout>
  );
}
