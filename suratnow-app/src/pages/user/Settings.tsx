import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Settings as SettingsIcon, Shield, Bell, Eye, HelpCircle, Info, Lock, 
  Mail, Phone, LogOut, CheckCircle2, ToggleLeft, ToggleRight, Download, 
  Trash2, ExternalLink, MapPin, Clock, Key, X, Building, UserCheck, AlertTriangle
} from "lucide-react";

export function UserSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Akun');
  
  // Keamanan State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Notifikasi State
  const [notifState, setNotifState] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  const toggleNotif = (key: keyof typeof notifState) => {
    setNotifState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Privasi State
  const [privasiState, setPrivasiState] = useState({
    publik: false,
    email: false,
    telepon: false
  });

  const togglePrivasi = (key: keyof typeof privasiState) => {
    setPrivasiState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'license' | null>(null);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sesi ini?')) {
      alert('Anda telah berhasil keluar dari sistem.');
      window.location.href = '/login';
    }
  };

  const tabs = ['Akun', 'Keamanan', 'Notifikasi', 'Privasi', 'Bantuan', 'Tentang'];

  return (
    <DashboardLayout>
      <AnimatedPage className="space-y-6 pb-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Pengaturan</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Kelola preferensi akun dan aplikasi Anda</p>
          </div>
          <div className="p-2 bg-[#0a5893]/10 text-[#0a5893] dark:bg-blue-900/20 dark:text-blue-400 rounded-lg shrink-0">
            <SettingsIcon size={24} />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl flex items-center gap-1 overflow-x-auto w-full shadow-sm border border-slate-200 dark:border-slate-700/50">
          {tabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 font-semibold text-sm rounded-lg whitespace-nowrap flex-1 transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-600' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT --- */}
        <div className="w-full">

          {/* TAB 1: AKUN */}
          {activeTab === 'Akun' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
                <UserCheck className="text-slate-400 dark:text-slate-500" size={20}/> Informasi Dasar
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Data kependudukan bersifat read-only. Hubungi admin untuk perubahan.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Nama Lengkap</label>
                  <input type="text" value={user?.name || 'Belum diisi'} disabled className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">NIK</label>
                  <input type="text" value={user?.nik || 'Belum diisi'} disabled className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
                  <input type="text" value={user?.email || 'Belum diisi'} disabled className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">No. Telepon</label>
                  <input type="text" value={user?.phone || 'Belum diisi'} disabled className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tempat Lahir</label>
                  <input type="text" value="Belum diisi" disabled className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Tanggal Lahir</label>
                  <input type="text" value="Belum diisi" disabled className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Alamat Lengkap</label>
                  <textarea disabled rows={3} value={user?.address || 'Belum diisi'} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KEAMANAN */}
          {activeTab === 'Keamanan' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
                <Shield className="text-slate-700 dark:text-slate-300" size={20}/> Keamanan Akun
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Kelola pengaturan keamanan dan password</p>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-transparent">
                  <div className="flex items-start gap-4">
                    <Lock className="text-slate-400 mt-1" size={20}/>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Password</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Status perubahan password dikelola oleh sistem</p>
                    </div>
                  </div>
                  <button onClick={() => setIsPasswordModalOpen(true)} className="mt-4 sm:mt-0 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Ubah Password
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-transparent">
                  <div className="flex items-start gap-4">
                    <Mail className="text-slate-400 mt-1" size={20}/>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Verifikasi Email</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Email sudah terverifikasi</p>
                    </div>
                  </div>
                  <span className="mt-4 sm:mt-0 flex items-center gap-1.5 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                    <CheckCircle2 size={16} /> Verified
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-transparent">
                  <div className="flex items-start gap-4">
                    <Phone className="text-slate-400 mt-1" size={20}/>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Verifikasi No. HP</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Nomor HP sudah terverifikasi</p>
                    </div>
                  </div>
                  <span className="mt-4 sm:mt-0 flex items-center gap-1.5 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                    <CheckCircle2 size={16} /> Verified
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                 <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Sesi Login</h4>
                 <div className="flex justify-between items-center p-5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50">
                   <div>
                     <p className="font-semibold text-slate-800 dark:text-slate-200">Browser ini (Chrome)</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Terakhir aktif: Sekarang • IP: 192.168.1.1</p>
                   </div>
                   <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md">
                     Aktif
                   </span>
                 </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFIKASI */}
          {activeTab === 'Notifikasi' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
                <Bell className="text-slate-700 dark:text-slate-300" size={20}/> Pengaturan Notifikasi
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Pilih jenis notifikasi yang ingin Anda terima</p>
              
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                <div className="py-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Email Notifikasi</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Terima notifikasi status pengajuan via email</p>
                  </div>
                  <button onClick={() => toggleNotif('email')} className="text-slate-400 hover:opacity-80 transition-opacity">
                    {notifState.email ? <ToggleRight size={36} className="text-[#0a5893] dark:text-blue-500" /> : <ToggleLeft size={36} />}
                  </button>
                </div>
                <div className="py-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">SMS Notifikasi</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Terima notifikasi penting via SMS</p>
                  </div>
                  <button onClick={() => toggleNotif('sms')} className="text-slate-400 hover:opacity-80 transition-opacity">
                    {notifState.sms ? <ToggleRight size={36} className="text-[#0a5893] dark:text-blue-500" /> : <ToggleLeft size={36} />}
                  </button>
                </div>
                <div className="py-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Push Notifikasi</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Terima notifikasi push di browser</p>
                  </div>
                  <button onClick={() => toggleNotif('push')} className="text-slate-400 hover:opacity-80 transition-opacity">
                    {notifState.push ? <ToggleRight size={36} className="text-[#0a5893] dark:text-blue-500" /> : <ToggleLeft size={36} />}
                  </button>
                </div>
                <div className="py-5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Marketing Email</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Terima informasi dan update terbaru kecamatan</p>
                  </div>
                  <button onClick={() => toggleNotif('marketing')} className="text-slate-400 hover:opacity-80 transition-opacity">
                    {notifState.marketing ? <ToggleRight size={36} className="text-[#0a5893] dark:text-blue-500" /> : <ToggleLeft size={36} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVASI */}
          {activeTab === 'Privasi' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
                  <Eye className="text-slate-700 dark:text-slate-300" size={20}/> Pengaturan Privasi
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Kontrol siapa yang dapat melihat informasi Anda</p>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  <div className="py-5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Profil Publik</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Izinkan profil Anda dilihat oleh sesama pengguna</p>
                    </div>
                    <button onClick={() => togglePrivasi('publik')} className="text-slate-400 hover:opacity-80 transition-opacity">
                      {privasiState.publik ? <ToggleRight size={36} className="text-[#0a5893] dark:text-blue-500" /> : <ToggleLeft size={36} />}
                    </button>
                  </div>
                  <div className="py-5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Tampilkan Email</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Izinkan email Anda dilihat oleh admin secara publik</p>
                    </div>
                    <button onClick={() => togglePrivasi('email')} className="text-slate-400 hover:opacity-80 transition-opacity">
                      {privasiState.email ? <ToggleRight size={36} className="text-[#0a5893] dark:text-blue-500" /> : <ToggleLeft size={36} />}
                    </button>
                  </div>
                  <div className="py-5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Tampilkan No. HP</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Izinkan nomor HP Anda dilihat oleh admin</p>
                    </div>
                    <button onClick={() => togglePrivasi('telepon')} className="text-slate-400 hover:opacity-80 transition-opacity">
                      {privasiState.telepon ? <ToggleRight size={36} className="text-[#0a5893] dark:text-blue-500" /> : <ToggleLeft size={36} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">Data Privasi</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Kelola data pribadi Anda</p>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-transparent">
                    <div className="flex items-start gap-4">
                      <Download className="text-slate-400 mt-1" size={20}/>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Export Data</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Download semua data Anda</p>
                      </div>
                    </div>
                    <button className="mt-4 sm:mt-0 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Download
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20">
                    <div className="flex items-start gap-4">
                      <Trash2 className="text-rose-500 mt-1" size={20}/>
                      <div>
                        <p className="font-semibold text-rose-700 dark:text-rose-400">Hapus Akun</p>
                        <p className="text-sm text-rose-600/80 dark:text-rose-400/80 mt-0.5">Hapus akun dan semua data permanen</p>
                      </div>
                    </div>
                    <button className="mt-4 sm:mt-0 px-5 py-2.5 text-sm font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm transition-colors">
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BANTUAN */}
          {activeTab === 'Bantuan' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
              <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-1">
                  <HelpCircle className="text-slate-700 dark:text-slate-300" size={20}/> Bantuan & Dukungan
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Dapatkan bantuan dan dukungan untuk menggunakan aplikasi</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 border border-slate-200 dark:border-slate-700/50 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors group cursor-pointer">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">FAQ</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Pertanyaan yang sering diajukan</p>
                    <div className="flex items-center justify-center w-full py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors gap-2">
                      <ExternalLink size={16}/> Lihat FAQ
                    </div>
                  </div>
                  <div className="p-5 border border-slate-200 dark:border-slate-700/50 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors group cursor-pointer">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Panduan Pengguna</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Panduan lengkap menggunakan aplikasi</p>
                    <div className="flex items-center justify-center w-full py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors gap-2">
                      <ExternalLink size={16}/> Baca Panduan
                    </div>
                  </div>
                  <div className="p-5 border border-slate-200 dark:border-slate-700/50 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors group cursor-pointer">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Hubungi Support</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Butuh bantuan lebih lanjut?</p>
                    <div className="flex items-center justify-center w-full py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors gap-2">
                      <Mail size={16}/> Kirim Email
                    </div>
                  </div>
                  <div className="p-5 border border-slate-200 dark:border-slate-700/50 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors group cursor-pointer">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Lapor Bug</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Laporkan masalah atau bug aplikasi</p>
                    <div className="flex items-center justify-center w-full py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors gap-2">
                      <AlertTriangle size={16}/> Lapor Bug
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900/50 border border-[#0a5893]/20 dark:border-blue-900/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-[#0a5893] dark:bg-blue-900 p-4 flex items-center gap-2">
                  <Building className="text-white" size={20}/>
                  <h3 className="font-bold text-white text-lg">Kontak Kantor Kecamatan Suruh</h3>
                </div>
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#0a5893] dark:text-blue-400 mt-0.5" size={20}/>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Alamat Kantor</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Jln. P. Jend. Sudirman No. 1<br/>
                        Rt.01 Rw. 01 Desa Suruh<br/>
                        Kecamatan Suruh, Kabupaten Trenggalek<br/>
                        Jawa Timur 66362
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="text-[#0a5893] dark:text-blue-400 mt-0.5" size={20}/>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Email</p>
                      <p className="text-sm text-[#0a5893] dark:text-blue-400 font-medium hover:underline cursor-pointer">suruhtrenggalek@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="text-[#0a5893] dark:text-blue-400 mt-0.5" size={20}/>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Jam Layanan</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Senin - Jumat: 08:00 - 15:00</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Sabtu - Minggu: Tutup</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl flex items-start gap-3">
                    <Info className="text-[#0a5893] dark:text-blue-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-[#0a5893] dark:text-blue-400">Catatan:</span> Pelayanan tutup pada hari libur nasional. Untuk urusan mendesak, silakan hubungi melalui email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TENTANG */}
          {activeTab === 'Tentang' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-10 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center mb-10 pb-8 border-b border-slate-100 dark:border-slate-800/80">
                <div className="w-16 h-16 bg-[#0a5893] rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <Building className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Sistem Pelayanan Surat Digital</h2>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-3">Kantor Kecamatan Suruh</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">Aplikasi digital untuk memudahkan pelayanan surat menyurat di Kecamatan Suruh, Trenggalek</p>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full">
                  Versi 1.0.0
                </span>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4 mb-10">
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/50">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Dikembangkan oleh</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Tim IT Kecamatan Suruh</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/50">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Terakhir update</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">24 Juli 2025</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/50">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Platform</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Web Application</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800/50">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Wilayah</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Trenggalek, Jawa Timur</span>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden mt-6 bg-white dark:bg-slate-800">
                <button 
                  onClick={() => setActiveModal('privacy')}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 transition-colors"
                >
                  <ExternalLink size={18} className="text-slate-400" />
                  Kebijakan Privasi
                </button>
                <button 
                  onClick={() => setActiveModal('terms')}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 transition-colors"
                >
                  <ExternalLink size={18} className="text-slate-400" />
                  Syarat & Ketentuan
                </button>
                <button 
                  onClick={() => setActiveModal('license')}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <ExternalLink size={18} className="text-slate-400" />
                  Lisensi Open Source
                </button>
              </div>
            </div>
          )}

        </div>
        
        {/* GLOBAL FOOTER: LOGOUT */}
        <div className="mt-8 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-800/50 rounded-xl p-5 flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-rose-600 dark:text-rose-500 text-sm">Keluar dari Akun</h4>
            <p className="text-xs text-rose-500/80 dark:text-rose-400/80 mt-1">Sesi Anda akan diakhiri dan Anda harus masuk kembali.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>        {/* MODAL: UBAH PASSWORD */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Key className="text-[#0a5893] dark:text-blue-400" size={18}/> Ubah Password
                </h3>
                <button onClick={() => setIsPasswordModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password Saat Ini</label>
                  <input type="password" placeholder="Masukkan password lama" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm focus:ring-2 focus:ring-[#0a5893] outline-none text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password Baru</label>
                  <input type="password" placeholder="Minimal 8 karakter" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm focus:ring-2 focus:ring-[#0a5893] outline-none text-slate-800 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Konfirmasi Password Baru</label>
                  <input type="password" placeholder="Ketik ulang password baru" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-lg text-sm focus:ring-2 focus:ring-[#0a5893] outline-none text-slate-800 dark:text-slate-100" />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button onClick={() => setIsPasswordModalOpen(false)} className="px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">Batal</button>
                <button onClick={() => { alert('Password berhasil diubah!'); setIsPasswordModalOpen(false); }} className="px-5 py-2.5 bg-[#0a5893] text-white rounded-lg font-bold shadow-sm hover:bg-[#08487a] transition-colors">Simpan Password</button>
              </div>
            </div>
          </div>
        )}

        {/* Legal Info Modal */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[80vh] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">

              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 rounded-t-2xl">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  {activeModal === 'privacy' && 'Kebijakan Privasi'}
                  {activeModal === 'terms' && 'Syarat & Ketentuan'}
                  {activeModal === 'license' && 'Lisensi Open Source'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <X size={20}/>
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar text-sm text-slate-600 dark:text-slate-300 space-y-4">
                {activeModal === 'privacy' && (
                  <>
                    <p><strong>1. Pengumpulan Data:</strong> Sistem Pelayanan Digital Kecamatan Suruh mengumpulkan data pribadi warga seperti NIK, Nama, dan detail kontak semata-mata untuk keperluan pelayanan administrasi pemerintahan.</p>
                    <p><strong>2. Keamanan Data:</strong> Kami berkomitmen untuk melindungi data pribadi Anda menggunakan standar enkripsi terkini. Data Anda tidak akan dibagikan kepada pihak ketiga tanpa izin resmi.</p>
                    <p><strong>3. Hak Pengguna:</strong> Anda berhak untuk meminta penghapusan atau pembaruan data Anda melalui petugas administrasi kami.</p>
                  </>
                )}
                {activeModal === 'terms' && (
                  <>
                    <p><strong>1. Penggunaan Layanan:</strong> Layanan ini disediakan untuk memfasilitasi administrasi warga Kecamatan Suruh secara digital.</p>
                    <p><strong>2. Kewajiban Pengguna:</strong> Seluruh data dan dokumen lampiran yang diunggah harus asli dan dapat dipertanggungjawabkan kebenarannya di mata hukum.</p>
                    <p><strong>3. Sanksi Penyalahgunaan:</strong> Pemalsuan dokumen melalui sistem ini dapat dikenakan sanksi sesuai dengan peraturan perundang-undangan yang berlaku.</p>
                  </>
                )}
                {activeModal === 'license' && (
                  <>
                    <p>Aplikasi ini dibangun menggunakan berbagai teknologi dan pustaka <em>Open Source</em>, termasuk namun tidak terbatas pada:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      <li><strong>React & React DOM:</strong> MIT License</li>
                      <li><strong>Tailwind CSS:</strong> MIT License</li>
                      <li><strong>Lucide Icons:</strong> ISC License</li>
                      <li><strong>Vite:</strong> MIT License</li>
                    </ul>
                    <p className="mt-4 text-xs text-slate-400">Hak Cipta © {new Date().getFullYear()} Kecamatan Suruh, Kabupaten Trenggalek.</p>
                  </>
                )}
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button onClick={() => setActiveModal(null)} className="px-5 py-2 bg-[#0a5893] hover:bg-blue-800 text-white font-medium rounded-lg transition-colors">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatedPage>
    </DashboardLayout>
  );
}
