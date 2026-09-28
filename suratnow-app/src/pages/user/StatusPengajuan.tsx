import { useState, useEffect } from "react";
import api from "../../lib/api";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { 
  FileText, Clock, CheckSquare, XSquare, 
  Search, ChevronDown, Calendar, Eye, Info 
} from "lucide-react";
import AttachmentPreviewModal from '../../components/AttachmentPreviewModal';

export function UserStatusPengajuan() {
  const [previewData, setPreviewData] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [sortFilter, setSortFilter] = useState("Terbaru");

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/letter-requests');
        const formattedData = response.data.map((item: any) => ({
          ...item,
          date: new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
          type: item.letter_type?.name || 'Surat',
          title: item.data?.judul_permohonan || `Permohonan ${item.letter_type?.name || 'Surat'}`,
          status: item.status === 'pending' ? 'Pending' : item.status === 'returned' ? 'Dikembalikan' : item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : item.status
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Gagal mengambil data pengajuan:", error);
      } finally {
      }
    };
    fetchRequests();
    const intervalId = window.setInterval(fetchRequests, 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  // Tambahkan pengaman (!item dan item?.) agar tidak crash saat data kosong
  const filteredData = data.filter(item => {
    if (!item) return false;
    const typeMatch = (item?.type || "").toLowerCase().includes(searchQuery.toLowerCase());
    const titleMatch = (item?.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua Status" || item?.status === statusFilter;
    
    return (typeMatch || titleMatch) && matchesStatus;
  });

  const totalPengajuan = data.length;
  const totalPending = data.filter(item => item?.status === 'Pending' || item?.status === 'Dikembalikan').length;
  const totalDisetujui = data.filter(item => item?.status === 'Disetujui').length;
  const totalDitolak = data.filter(item => item?.status === 'Ditolak').length;

  return (
    <DashboardLayout>
      <AnimatedPage className="py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Status Pengajuan</h2>
          <p className="text-slate-500 dark:text-slate-400">Pantau progress dan kelola pengajuan surat Anda</p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalPengajuan}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalPending}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
              <CheckSquare size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Disetujui</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalDisetujui}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500">
              <XSquare size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Ditolak</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalDitolak}</h3>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan jenis surat atau judul..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative w-40">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50"
              >
                <option>Semua Status</option>
                <option>Pending</option>
                <option>Dikembalikan</option>
                <option>Disetujui</option>
                <option>Ditolak</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="relative w-32">
              <select 
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50"
              >
                <option>Terbaru</option>
                <option>Terlama</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm mb-6">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <FileText size={20} className="text-slate-700 dark:text-slate-300" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Daftar Pengajuan ({filteredData.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 w-16">No</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 w-40">Tanggal</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Jenis Surat</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Judul</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 w-32">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredData.map((item, index) => (
                   <tr data-testid={`user-status-row-${item.id}`} key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Calendar size={14} className="text-slate-400" />
                        {item.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{item.type}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{item.title}</td>
                    <td className="px-6 py-4">
                         <span data-testid={`user-status-badge-${item.id}`} className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                        item.status === 'Pending' || item.status === 'Dikembalikan' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' : 
                        item.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                        'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button data-testid={`user-status-preview-${item.id}`} 
                        onClick={() => setPreviewData(item)}
                        className="p-2 text-slate-500 hover:text-[#0a5893] hover:bg-blue-50 rounded-lg transition-all mx-auto block" 
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex gap-3">
            <Info className="text-slate-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Tips:</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pengajuan dengan status "Pending" masih dapat diedit atau dibatalkan. Surat yang telah disetujui dapat dicetak melalui menu "Cetak Surat".
              </p>
            </div>
          </div>
        </div>

        <AttachmentPreviewModal isOpen={!!previewData} onClose={() => setPreviewData(null)} data={previewData} />
      </AnimatedPage>
    </DashboardLayout>
  );
}
