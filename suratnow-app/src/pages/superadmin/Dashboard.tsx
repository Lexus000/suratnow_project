import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Activity, Users, FileText, CheckCircle, XCircle, Clock, ArrowRight, TrendingUp, UserCheck, Search, X } from 'lucide-react';
import { AnimatedPage } from "../../components/AnimatedPage";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import api from '../../lib/api';

const chartData = [
  { name: 'Sen', total: 40 },
  { name: 'Sel', total: 30 },
  { name: 'Rab', total: 20 },
  { name: 'Kam', total: 27 },
  { name: 'Jum', total: 18 },
  { name: 'Sab', total: 23 },
  { name: 'Min', total: 34 },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/superadmin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Gagal memuat statistik", error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalSurat = stats.total;
  const approvedSurat = stats.approved;
  const pendingSurat = stats.pending;
  const rejectedSurat = stats.rejected;

  const persetujuanRate = totalSurat === 0 ? 0 : Math.round((approvedSurat / totalSurat) * 100);
  const prosesRate = totalSurat === 0 ? 0 : Math.round((pendingSurat / totalSurat) * 100);

  const getPercentageData = (admin: any) => {
    const totalProcessed = admin.processed || admin.total_processed || admin.total_diajukan || 0;
    const approved = admin.approved || admin.selesai || 0;
    const percentage = totalProcessed > 0 ? Math.round((approved / totalProcessed) * 100) : 0;
    
    let badgeClass = 'bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-semibold';
    let text = totalProcessed > 0 ? `${percentage}%` : '0%';
    
    if (totalProcessed > 0) {
      if (percentage >= 80) badgeClass = 'bg-green-100 text-green-800 border border-green-200 px-2.5 py-1 rounded-full font-semibold text-xs';
      else if (percentage >= 50) badgeClass = 'bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-semibold text-xs';
      else badgeClass = 'bg-red-100 text-red-800 border border-red-200 px-2.5 py-1 rounded-full font-semibold text-xs';
    }
    
    return { percentage, badgeClass, text };
  };

  const [adminPerformance, setAdminPerformance] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');
  const [modalFilterRole, setModalFilterRole] = useState('Semua');

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await api.get('/superadmin/users-performance');
        const data = response.data?.data || response.data || response || [];
        setAdminPerformance(Array.isArray(data) ? data : Object.values(data));
      } catch (error) {
        console.error("Gagal memuat performa admin:", error);
      }
    };

    fetchPerformance();
    const interval = setInterval(fetchPerformance, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatedPage className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Super Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Ringkasan sistem secara menyeluruh</p>
      </div>

      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Permohonan</span>
            <FileText size={18} className="text-[#0a5893] dark:text-blue-400" />
          </div>
          <div className="mt-auto">
            <h3 data-testid="superadmin-stat-total" className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{totalSurat}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Menunggu Persetujuan</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <div className="mt-auto">
            <h3 data-testid="superadmin-stat-pending" className="text-3xl font-bold text-amber-500 mb-1">{pendingSurat}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Selesai</span>
            <CheckCircle size={18} className="text-emerald-500" />
          </div>
          <div className="mt-auto">
            <h3 data-testid="superadmin-stat-approved" className="text-3xl font-bold text-emerald-500 mb-1">{approvedSurat}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Ditolak</span>
            <XCircle size={18} className="text-rose-500" />
          </div>
          <div className="mt-auto">
            <h3 data-testid="superadmin-stat-rejected" className="text-3xl font-bold text-rose-500 mb-1">{rejectedSurat}</h3>
          </div>
        </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Statistik Permohonan Mingguan</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a5893" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0a5893" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-slate-800)' }}
                  cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="total" stroke="#0a5893" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={20} className="text-slate-700 dark:text-slate-200" />
            <h3 className="text-slate-800 dark:text-slate-100 font-bold text-lg">Progress Pengajuan</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Tingkat persetujuan pengajuan surat</p>
          
          <div className="space-y-6 mt-auto mb-auto">
            <div>
              <div className="flex justify-between text-sm mb-2 font-bold text-slate-700 dark:text-slate-200">
                <span>Tingkat Persetujuan</span>
                <span>{persetujuanRate}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 mb-6">
                <div className="bg-[#0a5893] h-3 rounded-full" style={{ width: `${persetujuanRate}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-bold text-slate-700 dark:text-slate-200">
                <span>Sedang Diproses</span>
                <span>{prosesRate}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                <div className="bg-slate-300 dark:bg-slate-600 h-3 rounded-full" style={{ width: `${prosesRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performa & Aktivitas Admin Section */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <UserCheck className="text-[#0a5893]" size={20}/>
              Aktivitas Staf Admin & Warga
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pantau tingkat eksekusi admin dan pengajuan oleh warga terbaru.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="text-sm text-[#0a5893] hover:underline font-medium">Lihat Semua</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 px-2 font-medium">Pengguna</th>
                <th className="pb-3 px-2 font-medium">Aktivitas Utama</th>
                <th className="pb-3 px-2 font-medium">Status Berhasil</th>
                <th className="pb-3 px-2 font-medium">Status Tertunda/Gagal</th>
                <th className="pb-3 px-2 font-medium">Persentase Sukses</th>
                <th className="pb-3 px-2 font-medium">Rata-rata Waktu</th>
                <th className="pb-3 px-2 font-medium">Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {adminPerformance.slice(0, 5).map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                        {admin.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{admin.name || admin.nama}</div>
                        <div className="text-xs mt-0.5">
                          {admin.role === 'Warga' ? (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Warga</span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-[#0a5893] rounded text-[10px] font-bold">{admin.role}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-xs text-slate-400 mb-0.5">{admin.role === 'Warga' ? 'Total Diajukan' : 'Total Diproses'}</div>
                    <div className="font-bold text-slate-700 dark:text-slate-300">{admin.processed || admin.total_processed || admin.total_diajukan || 0}</div>
                  </td>
                  <td className="py-4 px-2 text-emerald-600">
                    <div className="text-xs text-emerald-600/60 mb-0.5">{admin.role === 'Warga' ? 'Selesai' : 'Disetujui'}</div>
                    <div className="font-semibold">{admin.approved || admin.selesai || 0}</div>
                  </td>
                  <td className="py-4 px-2 text-rose-600">
                    <div className="text-xs text-rose-600/60 mb-0.5">{admin.role === 'Warga' ? 'Pending/Proses' : 'Ditolak'}</div>
                    <div className="font-semibold">{admin.rejected || admin.pending_rejected || admin.ditolak || 0}</div>
                  </td>
                  <td className="py-4 px-2">
                    {(() => {
                      const pData = getPercentageData(admin);
                      return (
                        <span className={pData.badgeClass}>
                          {pData.text}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="py-4 px-2 text-slate-600 dark:text-slate-400">
                    {(admin.avgSla || admin.avg_time) !== '-' ? (
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock size={14} className="text-slate-400"/> {admin.avgSla || admin.avg_time || '0 mnt'}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      (admin.status === 'Online' || admin.is_online)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'
                    }`}>
                      {admin.status || (admin.is_online ? 'Online' : 'Offline')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. AKSI CEPAT */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">Aksi Cepat</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Akses cepat ke fitur manajemen utama</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div 
            onClick={() => navigate('/superadmin/lacak-surat')} 
            className="cursor-pointer hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 group"
          >
            <div className="mb-3 p-2.5 bg-blue-100 dark:bg-blue-900/30 text-[#0a5893] dark:text-blue-400 w-fit rounded-lg group-hover:scale-110 transition-transform">
              <MapPin size={20} /> 
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Lacak Surat</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
              Pantau dokumen warga
              <ArrowRight className="text-[#0a5893] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" size={14} />
            </p>
          </div>

          <div 
            onClick={() => navigate('/superadmin/monitoring')} 
            className="cursor-pointer hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 group"
          >
            <div className="mb-3 p-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 w-fit rounded-lg group-hover:scale-110 transition-transform">
              <Activity size={20} />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Monitoring SLA</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
              Pantau durasi penyelesaian
              <ArrowRight className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" size={14} />
            </p>
          </div>

          <div 
            onClick={() => navigate('/superadmin/pengguna')} 
            className="cursor-pointer hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 group"
          >
            <div className="mb-3 p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-fit rounded-lg group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Manajemen Pengguna</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
              Kelola akses sistem
              <ArrowRight className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" size={14} />
            </p>
          </div>
        </div>
      </div>

      {/* Modal Lihat Semua Aktivitas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Laporan Lengkap Aktivitas Staf & Warga</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50 dark:bg-slate-800/20">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari nama atau NIK..." 
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/20 focus:border-[#0a5893] transition-all"
                />
              </div>
              <div className="flex gap-2">
                {['Semua', 'Khusus Admin', 'Khusus Warga'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setModalFilterRole(filter)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                      modalFilterRole === filter 
                        ? 'bg-[#0a5893] text-white border-[#0a5893]' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-3 px-4 font-medium">Pengguna</th>
                      <th className="py-3 px-4 font-medium">Aktivitas Utama</th>
                      <th className="py-3 px-4 font-medium text-emerald-600">Status Berhasil</th>
                      <th className="py-3 px-4 font-medium text-rose-600">Status Tertunda/Gagal</th>
                      <th className="py-3 px-4 font-medium">Persentase Sukses</th>
                      <th className="py-3 px-4 font-medium">Rata-rata Waktu</th>
                      <th className="py-3 px-4 font-medium">Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {adminPerformance
                      .filter((admin) => {
                        const matchesSearch = admin.name.toLowerCase().includes(modalSearch.toLowerCase());
                        if (modalFilterRole === 'Khusus Admin') return matchesSearch && admin.role !== 'Warga';
                        if (modalFilterRole === 'Khusus Warga') return matchesSearch && admin.role === 'Warga';
                        return matchesSearch;
                      })
                      .map((admin) => (
                      <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                              {admin.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200">{admin.name || admin.nama}</div>
                              <div className="text-xs mt-0.5">
                                {admin.role === 'Warga' ? (
                                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Warga</span>
                                ) : (
                                  <span className="px-1.5 py-0.5 bg-blue-100 text-[#0a5893] rounded text-[10px] font-bold">{admin.role}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs text-slate-400 mb-0.5">{admin.role === 'Warga' ? 'Total Diajukan' : 'Total Diproses'}</div>
                          <div className="font-bold text-slate-700 dark:text-slate-300">{admin.processed || admin.total_processed || admin.total_diajukan || 0}</div>
                        </td>
                        <td className="py-4 px-4 text-emerald-600">
                          <div className="text-xs text-emerald-600/60 mb-0.5">{admin.role === 'Warga' ? 'Selesai' : 'Disetujui'}</div>
                          <div className="font-semibold">{admin.approved || admin.selesai || 0}</div>
                        </td>
                        <td className="py-4 px-4 text-rose-600">
                          <div className="text-xs text-rose-600/60 mb-0.5">{admin.role === 'Warga' ? 'Pending/Proses' : 'Ditolak'}</div>
                          <div className="font-semibold">{admin.rejected || admin.pending_rejected || admin.ditolak || 0}</div>
                        </td>
                        <td className="py-4 px-4">
                          {(() => {
                            const pData = getPercentageData(admin);
                            return (
                              <span className={pData.badgeClass}>
                                {pData.text}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                          {(admin.avgSla || admin.avg_time) !== '-' ? (
                            <div className="flex items-center gap-1.5 font-medium">
                              <Clock size={14} className="text-slate-400"/> {admin.avgSla || admin.avg_time || '0 mnt'}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            (admin.status === 'Online' || admin.is_online)
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800' 
                              : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700'
                          }`}>
                            {admin.status || (admin.is_online ? 'Online' : 'Offline')}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {adminPerformance.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">Belum ada data aktivitas ditemukan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
