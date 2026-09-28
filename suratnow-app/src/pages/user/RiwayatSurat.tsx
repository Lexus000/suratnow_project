import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { Filter, Search, FileText, Clock, CheckCircle, XCircle, Eye, Download, RefreshCw } from "lucide-react";
import AttachmentPreviewModal from '../../components/AttachmentPreviewModal';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export function RiwayatSurat() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [jenisFilter, setJenisFilter] = useState("Semua Jenis");
  const [sortOrder, setSortOrder] = useState("Terbaru");

  const [previewData, setPreviewData] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/letter-requests');
        const formattedData = response.data.map((item: any) => ({
          ...item,
          idStr: `#surat-${item.id}`,
          jenis: item.letter_type?.name || 'Surat',
          type: item.letter_type?.name || 'Surat',
          detail: item.data?.judul_permohonan || `Permohonan ${item.letter_type?.name || 'Surat'}`,
          status: item.status === 'pending' ? 'Pending' : item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : item.status === 'returned' ? 'Revisi' : item.status,
          tujuan: item.data?.tujuan_penggunaan || '-',
          tanggal: new Date(item.updated_at || item.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        }));
        
        // Filter out pending and returned requests for History view
        // The user specifically requested Disetujui, Ditolak, or Selesai
        const historyData = formattedData.filter((item: any) => 
          item.status === 'Disetujui' || item.status === 'Ditolak' || item.status === 'Selesai'
        );

        setData(historyData);
      } catch (error) {
        console.error("Gagal mengambil data riwayat pengajuan:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchHistory();
      const intervalId = window.setInterval(fetchHistory, 5000);
      return () => window.clearInterval(intervalId);
    }
  }, [user]);

  const filteredHistory = data.filter(item => {
    const matchesSearch = item.jenis.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.idStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua Status" || item.status === statusFilter;
    const matchesJenis = jenisFilter === "Semua Jenis" || item.jenis.includes(jenisFilter);
    return matchesSearch && matchesStatus && matchesJenis;
  });

  const sortedHistory = filteredHistory.sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at).getTime();
    const dateB = new Date(b.updated_at || b.created_at).getTime();
    return sortOrder === "Terbaru" ? dateB - dateA : dateA - dateB;
  });

  return (
    <DashboardLayout>
      <AnimatedPage className="py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Riwayat Surat</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola dan pantau semua pengajuan surat Anda</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#0a5893] bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
            <FileText size={16} /> {sortedHistory.length} pengajuan selesai
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700 dark:text-slate-200">
            <Filter size={18} /> Filter & Pencarian
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Cari Pengajuan</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari berdasarkan jenis surat..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Filter Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a5893]"
              >
                <option>Semua Status</option>
                <option>Disetujui</option>
                <option>Ditolak</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Filter Jenis</label>
              <select 
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a5893]"
              >
                <option>Semua Jenis</option>
                <option>Surat Keterangan Miskin (SKM)</option>
                <option>Surat Pergi Nikah</option>
                <option>Surat Keterangan Usaha (SKU)</option>
                <option>Surat Keterangan Domisili</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Urutan</label>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a5893]"
              >
                <option>Terbaru</option>
                <option>Terlama</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("Semua Status");
                setJenisFilter("Semua Jenis");
                setSortOrder("Terbaru");
              }}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <RefreshCw className="animate-spin text-slate-400" size={32} />
            </div>
          ) : sortedHistory.length > 0 ? (
            sortedHistory.map((item, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4"
              >
                {/* Bagian Info Kiri */}
                <div className="flex-1 flex gap-4">
                  <div className="hidden sm:flex shrink-0 w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-lg items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                        {item.idStr}
                      </span>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">{item.jenis}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 whitespace-pre-line">{item.detail}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Clock size={14}/> Selesai: {item.tanggal}</span>
                    </div>
                  </div>
                </div>

                {/* Bagian Status Kanan */}
                <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-4 sm:min-w-[140px]">
                  {item.status === 'Disetujui' ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1 rounded-full font-semibold text-sm w-fit md:w-auto">
                      <CheckCircle size={16} />
                      Disetujui
                    </div>
                  ) : item.status === 'Ditolak' ? (
                    <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 px-3 py-1 rounded-full font-semibold text-sm w-fit md:w-auto">
                      <XCircle size={16} />
                      Ditolak
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 px-3 py-1 rounded-full font-semibold text-sm w-fit md:w-auto">
                      <CheckCircle size={16} />
                      {item.status}
                    </div>
                  )}

                  <div className="flex w-full md:w-auto gap-2 mt-4">
                    <button 
                      onClick={() => setPreviewData(item)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye size={16} />
                      Lihat
                    </button>
                    {item.status === 'Disetujui' && (
                      <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0a5893] hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <Download size={16} />
                        Unduh
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Belum Ada Riwayat</h3>
              <p className="text-slate-500">Pengajuan surat yang sudah disetujui atau ditolak akan muncul di sini.</p>
            </div>
          )}
        </div>

        <AttachmentPreviewModal isOpen={!!previewData} onClose={() => setPreviewData(null)} data={previewData} />

      </AnimatedPage>
    </DashboardLayout>
  );
}
