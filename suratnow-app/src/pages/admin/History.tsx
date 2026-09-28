import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Printer,
  MessageSquare,
  X,
  RotateCcw,
  BarChart2, List, Calendar
} from "lucide-react";
import api from "../../lib/api";
import AttachmentPreviewModal from '../../components/AttachmentPreviewModal';
import { Eye } from "lucide-react";

export function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); 
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState({ title: '', content: '' });
  const [viewMode, setViewMode] = useState<'daftar' | 'rekapan'>('daftar');
  const [rekapType, setRekapType] = useState<'mingguan' | 'bulanan' | 'tahunan'>('bulanan');
  const [previewData, setPreviewData] = useState<any>(null);

  const [historyDocs, setHistoryDocs] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/letter-requests');
        const formattedData = response.data.map((item: any) => ({
          ...item,
          idStr: `#surat-${item.id}`,
          applicantName: item.data?.nama_pemohon || item.user?.name || 'Unknown',
          type: item.letter_type?.name || 'Surat',
          jenisSurat: item.letter_type?.name || 'Surat',
          status: item.status === 'pending' ? 'Pending' : item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : item.status === 'returned' ? 'Revisi' : item.status,
          date: new Date(item.updated_at || item.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          completedAt: item.completed_at
            ? new Date(item.completed_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : null,
          note: item.admin_notes || item.rejection_reason || ''
        }));
        
        // Filter out pending requests for History view
        const data = formattedData.filter((item: any) => 
          item.status === 'Disetujui' || item.status === 'Ditolak' || item.status === 'Revisi' || item.status === 'Selesai'
        );

        setHistoryDocs(data);
      } catch (error) {
        console.error("Gagal mengambil data riwayat admin:", error);
      } finally {
      }
    };
    fetchHistory();
    const intervalId = window.setInterval(fetchHistory, 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  const filteredHistory = historyDocs.filter(doc => {
    const matchSearch = doc.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        doc.idStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || 
                        (statusFilter === "approved" && doc.status === "Disetujui") || 
                        (statusFilter === "rejected" && doc.status === "Ditolak") || 
                        (statusFilter === "returned" && doc.status === "Revisi");
    return matchSearch && matchStatus;
  });


  // Filter only processed/archived documents for the report
  const reportData = historyDocs.filter(s => s.status === 'Disetujui' || s.status === 'Ditolak' || s.status === 'Selesai');

  // Helper to simulate grouping based on the requested type
  const getGroupedData = () => {
    const groups: Record<string, typeof reportData> = {};

    reportData.forEach(surat => {
      let groupKey = '';
      if (rekapType === 'mingguan') {
        // Group by exact Date & Day
        groupKey = `Tanggal: ${surat.date}`; 
      } else if (rekapType === 'bulanan') {
        // Mock grouping by Week
        const dayMatch = surat.date.match(/\d+/);
        const day = dayMatch ? parseInt(dayMatch[0]) : 1;
        const week = Math.ceil(day / 7);
        groupKey = `Minggu ke-${week > 4 ? 4 : week} (${surat.date.split(' ')[1]} ${surat.date.split(' ')[2]})`;
      } else {
        // Group by Month & Year
        const parts = surat.date.split(' ');
        groupKey = `Bulan: ${parts[1] || ''} ${parts[2] || ''}`;
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(surat);
    });

    // Sort keys alphabetically/numerically for neatness
    return Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key];
      return acc;
    }, {} as Record<string, typeof reportData>);
  };

  const groupedReport = getGroupedData();

  return (
    <DashboardLayout>
      <AnimatedPage className="py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <HistoryIcon size={24} className="text-[#0a5893]" />
              Riwayat & Laporan
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Arsip permanen dan rekapitulasi pelayanan surat.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex inline-flex">
            <button 
              onClick={() => setViewMode('daftar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'daftar' ? 'bg-white dark:bg-slate-700 text-[#0a5893] dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <List size={16} /> Daftar Riwayat
            </button>
            <button 
              onClick={() => setViewMode('rekapan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'rekapan' ? 'bg-white dark:bg-slate-700 text-[#0a5893] dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
            >
              <BarChart2 size={16} /> Rekapitulasi
            </button>
          </div>
        </div>

        {viewMode === 'daftar' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-3 w-full">
              <div className="relative flex-1 w-full md:w-64 md:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari ID atau Pemohon..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
                />
              </div>
              <div className="relative w-full md:w-auto">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-auto pl-10 pr-8 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50"
                >
                  <option value="all">Semua Status</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                  <option value="returned">Revisi</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                    <HistoryIcon size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Arsip Kosong</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Belum ada riwayat permohonan yang tuntas terproses.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">ID Berkas</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Tanggal Selesai</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Nama Pemohon</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Jenis Surat</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                        <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                      {filteredHistory.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                            {doc.idStr}
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                            {doc.date}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">
                            {doc.applicantName}
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            {doc.type}
                          </td>
                          <td className="px-6 py-4">
                            {doc.status === 'Disetujui' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                                <CheckCircle size={12} />
                                Disetujui
                              </span>
                            )}
                            {doc.status === 'Ditolak' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                                <XCircle size={12} />
                                Ditolak
                              </span>
                            )}
                            {doc.status === 'Revisi' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                <RotateCcw size={12} />
                                Revisi
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {doc.status === 'Disetujui' ? (
                              <button 
                                onClick={() => setPreviewData(doc)}
                                className="inline-flex items-center justify-center p-2 text-[#0a5893] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" 
                                title="Lihat Pratinjau"
                              >
                                <Eye size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedNote({
                                    title: doc.status === 'Ditolak' ? 'Alasan Penolakan' : 'Catatan Revisi',
                                    content: doc.rejectReason || 'Tidak ada catatan yang dilampirkan.'
                                  });
                                  setIsNoteModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-3 py-1.5 rounded-md transition-colors"
                              >
                                <MessageSquare size={14} /> Lihat Catatan
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'rekapan' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <style>{`
              @media print {
                body * { visibility: hidden; }
                .print-area, .print-area * { visibility: visible; }
                .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; }
                @page { size: A4 portrait; margin: 20mm; }
              }
            `}</style>
            
            {/* Report Controls */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><Calendar size={16}/> Filter Rekapan:</span>
                <select 
                  value={rekapType} 
                  onChange={(e) => setRekapType(e.target.value as any)}
                  className="border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0a5893] flex-1"
                >
                  <option value="mingguan">Mingguan (Per Hari)</option>
                  <option value="bulanan">Bulanan (Per Minggu)</option>
                  <option value="tahunan">Tahunan (Per Bulan)</option>
                </select>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => window.print()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0a5893] hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Printer size={16} /> Cetak Laporan
                </button>
              </div>
            </div>

            {/* The Printable Report Wrapper */}
            <div className="print-area bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">

              {/* Official Report Header */}
              <div className="p-6 border-b-2 border-slate-800 text-center hidden print:block mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wide text-black">Pemerintah Kabupaten Trenggalek</h2>
                <h1 className="text-2xl font-extrabold uppercase mt-1 text-black">Kecamatan Suruh</h1>
                <p className="text-sm mt-2 text-black">Laporan Rekapitulasi Pelayanan Surat Administratif Terpadu</p>
              </div>

              <div className="p-6 text-center print:hidden border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Laporan Rekapitulasi Pelayanan Surat</h3>
                <p className="text-sm text-slate-500 mt-1 capitalize">Format: {rekapType}</p>
              </div>

              {/* Grouped Data Rendering */}
              <div className="p-4 sm:p-6 space-y-8">
                {Object.entries(groupedReport).map(([groupTitle, items]) => (
                  <div key={groupTitle} className="break-inside-avoid">

                    {/* Section Header */}
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border-l-4 border-[#0a5893] p-3 rounded-r-lg mb-4">
                      <h4 className="font-bold text-[#0a5893] dark:text-blue-400 print:text-black">{groupTitle}</h4>
                      <span className="text-xs font-bold bg-[#0a5893] text-white px-2.5 py-1 rounded-full print:border print:border-black print:text-black print:bg-transparent">{items.length} Pengajuan</span>
                    </div>

                    {/* Detailed Data Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <th className="p-3 border border-slate-200 dark:border-slate-700 font-semibold w-12 text-center text-black print:text-black">No</th>
                            <th className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-black print:text-black">Pemohon & NIK</th>
                            <th className="p-3 border border-slate-200 dark:border-slate-700 font-semibold text-black print:text-black">Jenis Surat & Keperluan</th>
                            <th className="p-3 border border-slate-200 dark:border-slate-700 font-semibold w-32 text-black print:text-black">Tgl Masuk</th>
                            <th className="p-3 border border-slate-200 dark:border-slate-700 font-semibold w-32 text-black print:text-black">Status / ACC</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((surat, idx) => (
                            <tr key={surat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-3 border border-slate-200 dark:border-slate-700 text-center text-slate-500 print:text-black">{idx + 1}</td>
                              <td className="p-3 border border-slate-200 dark:border-slate-700">
                                <div className="font-bold text-slate-800 dark:text-slate-200 print:text-black">{surat.applicantName}</div>
                                <div className="text-xs text-slate-500 font-mono mt-0.5 print:text-black">{surat.nik}</div>
                              </td>
                              <td className="p-3 border border-slate-200 dark:border-slate-700">
                                <div className="font-semibold text-[#0a5893] dark:text-blue-400 print:text-black">{surat.type}</div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic print:text-black">"{surat.purpose}"</div>
                              </td>
                              <td className="p-3 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 print:text-black">
                                {surat.date}
                              </td>
                              <td className="p-3 border border-slate-200 dark:border-slate-700">
                                <span className={`inline-block px-2 py-1 rounded text-[11px] font-bold ${surat.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700 print:bg-transparent print:text-black print:border print:border-black' : 'bg-rose-100 text-rose-700 print:bg-transparent print:text-black print:border print:border-black'}`}>
                                  {surat.status}
                                </span>
                                <div className="text-[10px] text-slate-400 mt-1 print:text-black">Selesai: {surat.completedAt || '-'}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                {Object.keys(groupedReport).length === 0 && (
                  <div className="text-center py-12 text-slate-500 print:text-black">Tidak ada data untuk filter ini.</div>
                )}
              </div>
            </div>
          </div>
        )}
        <AttachmentPreviewModal isOpen={!!previewData} onClose={() => setPreviewData(null)} data={previewData} />
      </AnimatedPage>

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare size={20} className="text-[#0a5893]" />
                {selectedNote.title}
              </h3>
              <button 
                onClick={() => setIsNoteModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-800 dark:text-amber-300 text-sm leading-relaxed">
                {selectedNote.content}
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
              <button 
                onClick={() => setIsNoteModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
