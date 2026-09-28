import { useState, useEffect } from 'react';
import { Search, Eye, FileText, Trash2, CheckCircle, XCircle, AlertTriangle, File, Phone, X, RefreshCw } from 'lucide-react';
import { AnimatedPage } from "../../components/AnimatedPage";
import api from "../../lib/api";
import AttachmentPreviewModal from '../../components/AttachmentPreviewModal';

export default function RiwayatSurat() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-polling mechanism (Live Sync)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/letter-requests');
        const formattedData = response.data.map((item: any) => ({
          ...item,
          idStr: `#surat-${item.id}`,
          type: item.letter_type?.name || 'Surat',
          jenisSurat: item.letter_type?.name || 'Surat',
          applicantName: item.data?.nama_pemohon || item.user?.name || 'Unknown',
          date: new Date(item.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: item.status === 'pending' ? 'Pending' : item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : item.status === 'returned' ? 'Revisi' : item.status,
          phone: item.data?.no_wa || '-',
          alamat: item.data?.alamat || '-',
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 5000); // Poll every 5s

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus riwayat pengajuan ini?')) {
      alert('Fungsi hapus hanya tersedia via backend untuk menjaga audit trail.');
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.idStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Semua Status' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = data.length;
  const pendingCount = data.filter(d => d.status === 'Pending').length;

  return (
    <AnimatedPage className="p-6 md:p-8 min-h-screen">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Card Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Riwayat Surat (Live)</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pantau semua pengajuan surat secara real-time.</p>
          </div>
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-blue-50 text-[#0a5893] dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              {totalCount} Total
            </span>
            <span className="px-3 py-1 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              {pendingCount} Pending
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan jenis surat, pemohon atau ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100 transition-shadow" 
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100 cursor-pointer"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Pending">Menunggu Verifikasi</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading && data.length === 0 ? (
            <div className="flex justify-center items-center h-[400px]">
              <RefreshCw className="animate-spin text-slate-400" size={32} />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-slate-400" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Tidak ada riwayat ditemukan</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Coba sesuaikan kata kunci atau filter status.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Detail Pemohon</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Jenis Surat</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Tanggal & Waktu</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#0a5893] dark:text-blue-400 flex items-center justify-center font-bold">
                          {item.applicantName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.applicantName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{item.idStr}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {item.date}
                    </td>
                    <td className="px-6 py-4">
                      {item.status === 'Disetujui' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                          <CheckCircle size={14} /> Disetujui
                        </span>
                      )}
                      {item.status === 'Ditolak' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                          <XCircle size={14} /> Ditolak
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                          <AlertTriangle size={14} /> Menunggu Verif
                        </span>
                      )}
                      {item.status !== 'Disetujui' && item.status !== 'Ditolak' && item.status !== 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedDetail(item)}
                          className="p-2 text-slate-400 hover:text-[#0a5893] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Detail Informasi"
                        >
                          <Eye size={18} />
                        </button>
                        {item.status === 'Disetujui' && (
                          <button 
                            onClick={() => setPreviewData(item)}
                            className="p-2 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                            title="Pratinjau Surat"
                          >
                            <File size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete()}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          title="Hapus Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText size={18} className="text-[#0a5893]" /> Detail Pemohon
              </h3>
              <button 
                onClick={() => setSelectedDetail(null)}
                className="p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nama Lengkap</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{selectedDetail.applicantName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nomor Handphone (WA)</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{selectedDetail.phone}</p>
                    <a href={`https://wa.me/${selectedDetail.phone?.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-green-200">
                      <Phone size={12}/> Hubungi
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Alamat Lengkap</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                    {selectedDetail.alamat}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status Terakhir</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{selectedDetail.status}</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button 
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium rounded-lg transition-colors text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Preview Modal */}
      <AttachmentPreviewModal isOpen={!!previewData} onClose={() => setPreviewData(null)} data={previewData} />

    </AnimatedPage>
  );
}
