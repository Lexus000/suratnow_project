import { 
  FileText, Clock, CheckCircle2, XCircle, 
  Calendar, Target, Printer, ArrowRight, TrendingUp, CheckSquare, X, FilePlus
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatedPage } from "../../components/AnimatedPage";
import api from "../../lib/api";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

const chartData = [
  { name: 'Sen', total: 40 },
  { name: 'Sel', total: 30 },
  { name: 'Rab', total: 20 },
  { name: 'Kam', total: 27 },
  { name: 'Jum', total: 18 },
  { name: 'Sab', total: 23 },
  { name: 'Min', total: 34 },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);

        const recentRes = await api.get('/letter-requests');
        setRecentRequests(recentRes.data.slice(0, 4));
      } catch (error) {
        console.error("Gagal memuat data admin dashboard", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <AnimatedPage className="space-y-6 pb-8">
        {/* ROW 1: 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Permohonan</span>
              <FileText size={18} className="text-slate-400" />
            </div>
            <div className="mt-auto">
               <h3 data-testid="admin-stat-total" className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{stats.total}</h3>
              <p className="text-xs text-slate-400">Total semua permohonan</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Menunggu Persetujuan</span>
              <Clock size={18} className="text-amber-500" />
            </div>
            <div className="mt-auto">
               <h3 data-testid="admin-stat-pending" className="text-3xl font-bold text-amber-500 mb-1">{stats.pending}</h3>
              <p className="text-xs text-slate-400">Sedang diproses</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Selesai</span>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
            <div className="mt-auto">
               <h3 data-testid="admin-stat-approved" className="text-3xl font-bold text-emerald-500 mb-1">{stats.approved}</h3>
              <p className="text-xs text-slate-400">Siap untuk dicetak</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Ditolak</span>
              <XCircle size={18} className="text-rose-500" />
            </div>
            <div className="mt-auto">
               <h3 data-testid="admin-stat-rejected" className="text-3xl font-bold text-rose-500 mb-1">{stats.rejected}</h3>
              <p className="text-xs text-slate-400">Perlu diperbaiki</p>
            </div>
          </div>
        </div>

        {/* ROW 2: Chart & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section (col-span-2) */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Statistik Permohonan Mingguan</h3>
            </div>
            <div className="flex-1 w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0a5893" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0a5893" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{stroke: '#e2e8f0', strokeWidth: 2}}
                  />
                  <Area type="monotone" dataKey="total" stroke="#0a5893" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Pengajuan (col-span-1) */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={20} className="text-slate-700 dark:text-slate-200" />
              <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-lg">Progress Pengajuan</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Tingkat persetujuan pengajuan surat</p>
            
            <div className="space-y-6 mt-auto mb-auto">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700 dark:text-slate-200">Tingkat Persetujuan</span>
                  <span className="text-slate-800 dark:text-slate-100">
                    {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div className="bg-[#0a5893] h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700 dark:text-slate-200">Sedang Diproses</span>
                  <span className="text-slate-800 dark:text-slate-100">
                    {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div className="bg-[#0a5893]/20 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Recent Activity (Pengajuan Terbaru) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm w-full flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 font-semibold text-lg text-slate-800 dark:text-slate-100 mb-1">
                <Calendar size={20} className="text-slate-700 dark:text-slate-200" />
                Pengajuan Terbaru
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Daftar pengajuan surat terbaru oleh warga</p>
            </div>
            <button 
              onClick={() => navigate('/admin/history')}
              className="text-sm font-semibold text-[#0a5893] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors mt-1"
            >
              Lihat Semua <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentRequests.length > 0 ? recentRequests.map((req, idx) => (
              <div key={req.id || idx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-emerald-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">{req.letter_type?.name || 'Surat'}</h4>
                    <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded border ${
                      req.status === 'approved' || req.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      req.status === 'pending' || req.status === 'Menunggu' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {req.status === 'approved' ? 'Disetujui' : req.status === 'pending' ? 'Menunggu' : req.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">REQ-{req.id}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Pemohon: {req.user?.name || 'Warga'}</p>
                <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 dark:text-slate-400 mb-5">
                  <div className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {new Date(req.created_at).toLocaleDateString('id-ID')}</div>
                  <div className="flex items-center gap-1.5"><Target size={14} className="text-slate-400" /> {req.data?.tujuan || 'Pengajuan'}</div>
                </div>
                <button 
                  onClick={() => {
                     setSelectedSurat(req);
                     setIsPreviewModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                >
                  <CheckCircle2 size={14} /> Tindak Lanjut
                </button>
              </div>
            )) : (
              <div className="col-span-2 text-center text-slate-500 p-10 border border-slate-200 rounded-xl">
                Belum ada pengajuan surat.
              </div>
            )}
          </div>
        </div>

        {/* ROW 4: Aksi Cepat */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm mb-6 w-full">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-1">Aksi Cepat</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Tindakan administratif yang sering dilakukan</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
          {/* Card Ajukan Surat */}
          <div 
            onClick={() => navigate('/admin/ajukan')}
            className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md hover:border-[#0a5893]/50 dark:hover:border-blue-500/50 transition-all cursor-pointer bg-white dark:bg-slate-900 group"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-[#0a5893] dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <FilePlus size={24}/>
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Ajukan Surat</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Buat pengajuan dokumen baru untuk warga</p>
          </div>

            <div 
              onClick={() => navigate('/admin/status')} 
              className="group cursor-pointer p-5 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="mb-3 p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-fit rounded-lg group-hover:scale-110 transition-transform">
                <CheckSquare size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Kelola Antrean</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
                Review progress pengajuan warga
                <ArrowRight className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" size={14} />
              </p>
            </div>

            <div 
              onClick={() => navigate('/admin/print')} 
              className="group cursor-pointer p-5 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-amber-500 hover:shadow-md transition-all bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="mb-3 p-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 w-fit rounded-lg group-hover:scale-110 transition-transform">
                <Printer size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Cetak Surat</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
                Cetak dokumen yang telah disetujui
                <ArrowRight className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" size={14} />
              </p>
            </div>
          </div>
        </div>

        {/* Modal Tindak Lanjut */}
        {isPreviewModalOpen && selectedSurat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Tindak Lanjut Pengajuan</h3>
                <button 
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Anda akan memproses <strong>{selectedSurat.name}</strong> atas nama <strong>{selectedSurat.user}</strong> ({selectedSurat.id}).
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      navigate('/admin/status');
                    }}
                    className="flex-1 py-2.5 bg-[#0a5893] text-white font-semibold rounded-xl text-sm hover:bg-[#08487a] transition-colors"
                  >
                    Proses Sekarang
                  </button>
                  <button 
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </AnimatedPage>
    </DashboardLayout>
  );
}
