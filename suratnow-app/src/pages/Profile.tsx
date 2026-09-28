import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { AnimatedPage } from "../components/AnimatedPage";
import { 
  UserCheck, Camera, Mail, Phone, MapPin, Calendar, 
  FileText, Clock, CheckCircle2, XCircle, Shield,
  Key, Smartphone, Laptop, Download, AlertTriangle, X, LogOut, ToggleLeft, ToggleRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Ringkasan');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Comprehensive Personal Data
  const [userData, setUserData] = useState({
    nik: '', namaLengkap: '', email: '', telepon: '', alamat: '',
    tempatLahir: '', tanggalLahir: '', jenisKelamin: '', agama: '',
    pekerjaan: '', statusKawin: ''
  });
  const [editForm, setEditForm] = useState({...userData});
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    if (!user) return;
    const nextData = {
      nik: user.nik || '',
      namaLengkap: user.name || '',
      email: user.email || '',
      telepon: user.phone || '',
      alamat: user.address || '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: '',
      agama: '',
      pekerjaan: '',
      statusKawin: ''
    };
    setUserData(nextData);
    setEditForm(nextData);
  }, [user]);

  useEffect(() => {
    api.get('/user/stats')
      .then(response => setStats(response.data))
      .catch(() => setStats({ total: 0, pending: 0, approved: 0, rejected: 0 }));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUserData(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(userData);
    setIsEditing(false);
  };
  return (
    <DashboardLayout>
      <AnimatedPage className="space-y-6 pb-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Profil Pengguna</h2>
            <p className="text-sm text-slate-500">Kelola informasi pribadi dan akun Anda</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a5893]/10 text-[#0a5893] rounded-full border border-[#0a5893]/20 w-fit shrink-0">
            <UserCheck size={16} />
            <span className="text-sm font-semibold">Akun Terverifikasi</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1 overflow-x-auto w-full max-w-4xl shadow-sm border border-slate-200">
          {['Ringkasan', 'Data Pribadi', 'Aktivitas', 'Keamanan'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 font-semibold text-sm rounded-lg whitespace-nowrap flex-1 transition-all ${
                activeTab === tab 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content (Ringkasan) */}
        {activeTab === 'Ringkasan' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start animate-in fade-in duration-300">
            
            {/* Left Side: Avatar & Identity */}
            <div className="flex flex-col items-center w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 pr-0 md:pr-8 text-center shrink-0">
              <div className="relative mb-5">
                <div className="w-28 h-28 bg-[#0a5893] text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md overflow-hidden">
                  {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : 'BS'}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-md border border-slate-100 text-[#0a5893] hover:bg-slate-50 transition-colors"
                >
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1.5">{userData.namaLengkap}</h3>
              <p className="text-sm text-slate-500 mb-4">NIK: {userData.nik}</p>
              <span className="px-4 py-1.5 bg-slate-100 text-[#0a5893] text-xs font-semibold rounded-lg border border-slate-200 shadow-sm">
                Warga
              </span>
            </div>

            {/* Right Side: Details Grid */}
            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 md:pl-4 pt-4 md:pt-0">
              <div className="flex items-start gap-4">
                <Mail className="text-slate-400 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
                  <p className="text-[15px] font-medium text-slate-800 break-all">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-slate-400 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">No. Telepon</p>
                  <p className="text-[15px] font-medium text-slate-800">{userData.telepon}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-slate-400 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Alamat</p>
                  <p className="text-[15px] font-medium text-slate-800 line-clamp-2">{userData.alamat}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="text-slate-400 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Bergabung</p>
              <p className="text-[15px] font-medium text-slate-800">{user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : 'Belum tersedia'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        {activeTab === 'Ringkasan' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-blue-50 text-blue-500 rounded-xl">
                <FileText size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-0.5">Total Pengajuan</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.total}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-amber-50 text-amber-500 rounded-xl">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-0.5">Pending</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.pending}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-emerald-50 text-emerald-500 rounded-xl">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-0.5">Disetujui</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.approved}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3.5 bg-rose-50 text-rose-500 rounded-xl">
                <XCircle size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-0.5">Ditolak</p>
                <h3 className="text-2xl font-bold text-slate-800">{stats.rejected}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Data Pribadi Content */}
        {activeTab === 'Data Pribadi' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Informasi Pribadi</h3>
                <p className="text-sm text-slate-500">Data kependudukan dan profil Anda</p>
              </div>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#0a5893]/10 text-[#0a5893] font-semibold text-sm rounded-lg hover:bg-[#0a5893]/20 transition-colors"
                >
                  Edit Profil
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCancel}
                    className="px-4 py-2 bg-slate-100 text-slate-600 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#0a5893] text-white font-semibold text-sm rounded-lg hover:bg-[#08487a] transition-colors shadow-sm"
                  >
                    Simpan
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(userData).map(([key, value]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className={key === 'alamat' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-slate-500 mb-1.5">{label}</label>
                    {!isEditing ? (
                      <p className="text-slate-800 font-medium py-2 px-3 bg-slate-50 rounded-lg border border-transparent">
                        {value}
                      </p>
                    ) : key === 'alamat' ? (
                      <textarea 
                        value={editForm[key as keyof typeof editForm]}
                        onChange={(e) => setEditForm({...editForm, [key]: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0a5893] outline-none text-slate-800"
                        rows={3}
                      />
                    ) : key === 'jenisKelamin' ? (
                      <select
                        value={editForm[key as keyof typeof editForm]}
                        onChange={(e) => setEditForm({...editForm, [key]: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0a5893] outline-none text-slate-800 bg-white"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    ) : (
                      <input 
                        type={key === 'tanggalLahir' ? 'date' : 'text'}
                        value={editForm[key as keyof typeof editForm]}
                        onChange={(e) => setEditForm({...editForm, [key]: e.target.value})}
                        disabled={key === 'nik'}
                        className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0a5893] outline-none text-slate-800 ${key === 'nik' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Aktivitas Content */}
        {activeTab === 'Aktivitas' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 shadow-sm mt-6">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">Aktivitas Terbaru</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-12">Riwayat aktivitas dan pengajuan surat Anda</p>
            
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
              <FileText size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Belum ada aktivitas</p>
            </div>
          </div>
        )}

        {/* Keamanan Content */}
        {activeTab === 'Keamanan' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-8 shadow-sm mt-6">
             <div className="mb-8">
               <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
                  <Shield className="text-[#0a5893] dark:text-blue-400" size={24}/> Keamanan & Privasi
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola kredensial login, perangkat terhubung, dan kontrol penuh atas data pribadi Anda.</p>
             </div>
             
             <div className="space-y-8">
               <div>
                 <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider">Akses Login</h4>
                 <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl bg-transparent overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5">
                     <div>
                       <p className="font-semibold text-slate-800 dark:text-slate-200">Password</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Status perubahan password dikelola oleh sistem</p>
                     </div>
                     <button onClick={() => setIsPasswordModalOpen(true)} className="mt-4 sm:mt-0 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                       Ubah Password
                     </button>
                   </div>
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5">
                     <div>
                       <p className="font-semibold text-slate-800 dark:text-slate-200">Autentikasi Dua Langkah (2FA)</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gunakan aplikasi authenticator untuk keamanan ekstra</p>
                     </div>
                     <button onClick={() => setIs2FAEnabled(!is2FAEnabled)} className={`mt-4 sm:mt-0 px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 border ${is2FAEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-slate-50 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'}`}>
                       {is2FAEnabled ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
                       {is2FAEnabled ? 'Aktif' : 'Nonaktif'}
                     </button>
                   </div>
                 </div>
               </div>

               <div>
                 <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider">Kontak Pemulihan</h4>
                 <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl bg-transparent overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50">
                   <div className="flex justify-between items-center p-5">
                     <div>
                       <p className="font-semibold text-slate-800 dark:text-slate-200">Verifikasi Email</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user?.email || 'Belum diisi'}</p>
                     </div>
                     <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                       <CheckCircle2 size={16}/> Verified
                     </span>
                   </div>
                   <div className="flex justify-between items-center p-5">
                     <div>
                       <p className="font-semibold text-slate-800 dark:text-slate-200">Verifikasi No. HP</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{user?.phone ? `${user.phone.slice(0, 4)}****` : 'Belum diisi'}</p>
                     </div>
                     <span className="flex items-center gap-1.5 px-3 py-1 text-sm font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                       <CheckCircle2 size={16}/> Verified
                     </span>
                   </div>
                 </div>
               </div>

               <div>
                 <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider">Perangkat & Sesi Terhubung</h4>
                 <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl bg-transparent overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50">
                   <div className="flex justify-between items-center p-5 bg-slate-50/50 dark:bg-slate-800/30">
                     <div className="flex items-center gap-4">
                       <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full"><Laptop size={20}/></div>
                       <div>
                         <p className="font-semibold text-slate-800 dark:text-slate-200">Windows PC - Chrome</p>
                         <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Aktif Sekarang • Suruh, Indonesia</p>
                       </div>
                     </div>
                   </div>
                   <div className="flex justify-between items-center p-5">
                     <div className="flex items-center gap-4">
                       <div className="p-3 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-full"><Smartphone size={20}/></div>
                       <div>
                         <p className="font-semibold text-slate-800 dark:text-slate-200">Android - Chrome</p>
                         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Terakhir aktif: Kemarin, 14:00 • Suruh, Indonesia</p>
                       </div>
                     </div>
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-slate-900/30 flex justify-end">
                     <button className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-500 dark:hover:text-rose-400 transition-colors">
                       <LogOut size={16}/> Keluar dari semua perangkat lain
                     </button>
                   </div>
                 </div>
               </div>

               <div>
                 <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider">Kontrol Data Anda</h4>
                 <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl bg-transparent overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/50">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5">
                     <div>
                       <p className="font-semibold text-slate-800 dark:text-slate-200">Unduh Data Pribadi</p>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dapatkan salinan semua arsip dan data kependudukan Anda.</p>
                     </div>
                     <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                       <Download size={16}/> Unduh Arsip (.ZIP)
                     </button>
                   </div>
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-rose-50/30 dark:bg-rose-950/10">
                     <div>
                       <p className="font-semibold text-rose-700 dark:text-rose-400">Nonaktifkan / Hapus Akun</p>
                       <p className="text-sm text-rose-600/70 dark:text-rose-400/70 mt-1">Langkah ini bersifat permanen dan tidak dapat dibatalkan.</p>
                     </div>
                     <button className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/30 transition-colors">
                       <AlertTriangle size={16}/> Hapus Akun Saya
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}

        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Key className="text-[#0a5893]" size={18}/> Ubah Password
                </h3>
                <button onClick={() => setIsPasswordModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password Saat Ini</label>
                  <input type="password" placeholder="Masukkan password lama" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#0a5893]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password Baru</label>
                  <input type="password" placeholder="Minimal 8 karakter" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#0a5893]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Konfirmasi Password Baru</label>
                  <input type="password" placeholder="Ketik ulang password baru" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-[#0a5893]" />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800 flex justify-end gap-3">
                <button onClick={() => setIsPasswordModalOpen(false)} className="px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-bold shadow-sm">Batal</button>
                <button onClick={() => { alert('Password berhasil diubah!'); setIsPasswordModalOpen(false); }} className="px-5 py-2.5 bg-[#0a5893] text-white rounded-lg font-bold shadow-sm hover:bg-blue-800">Simpan Password</button>
              </div>
            </div>
          </div>
        )}

      </AnimatedPage>
    </DashboardLayout>
  );
}
