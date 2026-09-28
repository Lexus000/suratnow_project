import { useState, useEffect } from "react";
import { AnimatedPage } from "../../components/AnimatedPage";
import { Printer, Search, CheckCircle, RefreshCw, Eye, Download } from "lucide-react";
import api from "../../lib/api";
import DocumentPreviewModal from '../../components/DocumentPreviewModal';
import AttachmentPreviewModal from '../../components/AttachmentPreviewModal';

export default function CetakSurat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const [attachmentPreviewData, setAttachmentPreviewData] = useState<any>(null);

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-polling mechanism (Live Sync)
  useEffect(() => {
    const fetchPrintable = async () => {
      try {
        const response = await api.get('/letter-requests?status=approved');
        const formattedData = response.data.map((item: any) => ({
          ...item,
          idStr: `#surat-${item.id}`,
          type: item.letter_type?.name || 'Surat',
          jenisSurat: item.letter_type?.name || 'Surat',
          applicantName: item.data?.nama_pemohon || item.user?.name || 'Unknown',
          date: new Date(item.updated_at || item.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error("Gagal mengambil data cetak surat admin:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrintable(); // Initial fetch
    
    const intervalId = setInterval(fetchPrintable, 5000); // Poll every 5s

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  const filteredDocs = data.filter(doc => 
    doc.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.idStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatedPage className="p-6 md:p-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Printer size={24} className="text-[#0a5893]" />
            Cetak Surat Resmi
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Dasbor Superadmin untuk mencetak fisik dokumen seluruh surat warga yang telah disetujui.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari ID atau Pemohon..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
        {isLoading && data.length === 0 ? (
          <div className="flex justify-center items-center h-[400px]">
            <RefreshCw className="animate-spin text-slate-400" size={32} />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Printer size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Tidak ada surat untuk dicetak</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Belum ada permohonan yang disetujui, atau pencarian tidak ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">ID Berkas</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Nama Pemohon</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Jenis Surat</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Tanggal Disetujui</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Aksi Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {doc.idStr}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">
                      {doc.applicantName}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {doc.type}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-emerald-500" />
                        {doc.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setAttachmentPreviewData(doc)}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                          title="Preview"
                        >
                          <Eye size={14} /> Preview
                        </button>
                        <button 
                          onClick={() => alert(`Fitur unduh PDF untuk ${doc.idStr} segera hadir!`)}
                          className="flex items-center justify-center p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                          title="Download PDF"
                        >
                          <Download size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            setPreviewData(doc);
                            setTimeout(() => window.print(), 500);
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                          title="Print"
                        >
                          <Printer size={14} /> Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Petunjuk Cetak Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Petunjuk Cetak</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
              <Printer size={16} className="text-blue-600" /> 
              Cara Mencetak
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
              <li>Klik tombol <strong>"Preview"</strong> untuk melihat surat</li>
              <li>Klik tombol <strong>"Print"</strong> (ikon printer) untuk mencetak langsung</li>
              <li>Pilih printer dan atur pengaturan cetak</li>
              <li>Pastikan orientasi kertas adalah <strong>Portrait</strong></li>
              <li>Klik "Print" di kotak dialog browser untuk mencetak</li>
            </ol>
          </div>
          
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
              <Download size={16} className="text-blue-600" /> 
              Cara Download PDF
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
              <li>Klik tombol <strong>"Download PDF"</strong> (ikon unduh)</li>
              <li>File PDF akan otomatis terdownload</li>
              <li>Simpan di lokasi yang aman</li>
              <li>Buat backup digital untuk keamanan</li>
              <li>File dapat dicetak kapan saja diperlukan</li>
            </ol>
          </div>
        </div>
      </div>

      <DocumentPreviewModal isOpen={!!previewData} onClose={() => setPreviewData(null)} data={previewData} />
      <AttachmentPreviewModal isOpen={!!attachmentPreviewData} onClose={() => setAttachmentPreviewData(null)} data={attachmentPreviewData} />

    </AnimatedPage>
  );
}
