import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { 
  Printer, Search, FileText, CheckCircle2, 
  Eye, RefreshCw, Download 
} from "lucide-react";
import DocumentPreviewModal from '../../components/DocumentPreviewModal';
import AttachmentPreviewModal from '../../components/AttachmentPreviewModal';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export function CetakSurat() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [jenisFilter, setJenisFilter] = useState("Semua Jenis");

  const [previewData, setPreviewData] = useState<any>(null);
  const [attachmentPreviewData, setAttachmentPreviewData] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [printError, setPrintError] = useState('');

  const downloadApprovedLetter = async (letterId: number, filename: string) => {
    setPrintError('');
    try {
      const response = await api.get<Blob>(`/letters/${letterId}/print`, { responseType: 'blob' });
      const fileUrl = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
    } catch {
      setPrintError('Surat hanya dapat diunduh setelah disetujui dan saat server dapat diakses.');
    }
  };

  useEffect(() => {
    const fetchPrintable = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/letter-requests?status=approved');
        const formattedData = response.data.map((item: any) => ({
          ...item,
          idStr: `#surat-${item.id}`,
          type: item.letter_type?.name || 'Surat',
          jenisSurat: item.letter_type?.name || 'Surat',
          title: item.data?.judul_permohonan || `Permohonan ${item.letter_type?.name || 'Surat'}`,
          applicant: item.data?.nama_pemohon || item.user?.name || 'Unknown',
          purpose: item.data?.tujuan_penggunaan || '-',
          date: new Date(item.updated_at || item.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error("Gagal mengambil data cetak surat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchPrintable();
      const intervalId = window.setInterval(fetchPrintable, 5000);
      return () => window.clearInterval(intervalId);
    }
  }, [user]);

  // LOGIKA FILTER
  const filteredData = data.filter(item => {
    const matchesSearch = item.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJenis = jenisFilter === "Semua Jenis" || item.type === jenisFilter;
    return matchesSearch && matchesJenis;
  });

  return (
    <DashboardLayout>
      <AnimatedPage className="py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Cetak Surat</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Download dan cetak surat yang telah disetujui</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#0a5893] bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
            <Printer size={16} /> {filteredData.length} surat siap cetak
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <span className="font-semibold">Informasi:</span> Hanya surat yang telah disetujui yang dapat dicetak. Pastikan untuk menyimpan salinan digital surat Anda.
          </p>
        </div>
        {printError && <p data-testid="print-error" className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{printError}</p>}

        {/* Filter Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">Filter Surat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Cari Surat</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari berdasarkan jenis surat..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Filter Jenis</label>
              <select 
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0a5893]"
              >
                <option>Semua Jenis</option>
                <option>Surat Keterangan Miskin (SKM)</option>
                <option>Surat Pergi Nikah</option>
                <option>Surat Keterangan Usaha (SKU)</option>
                <option>Surat Keterangan Domisili</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <RefreshCw className="animate-spin text-slate-400" size={32} />
            </div>
          ) : filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-all flex flex-col md:flex-row gap-5 items-start md:items-center"
              >
                <div className="flex-1 flex gap-4">
                  <div className="hidden sm:flex shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg items-center justify-center text-[#0a5893] dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg mb-1">{item.type}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{item.title}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                      <span>Pemohon: <strong className="text-slate-700 dark:text-slate-300">{item.applicant}</strong></span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>Disetujui: <strong className="text-slate-700 dark:text-slate-300">{item.date}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex w-full md:w-auto gap-3 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                  <button data-testid={`print-preview-${item.id}`}
                    onClick={() => setAttachmentPreviewData(item)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Eye size={18} />
                    Preview
                  </button>
                  <button data-testid={`print-download-${item.id}`}
                    onClick={() => void downloadApprovedLetter(item.id, `Surat-Kecamatan-Suruh-${item.id}.pdf`)}
                    className="flex items-center justify-center p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    title="Download PDF"
                  >
                    <Download size={18} />
                  </button>
                  <button data-testid={`print-document-${item.id}`}
                    onClick={() => {
                      setPreviewData(item);
                      setTimeout(() => window.print(), 500);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    <Printer size={18} />
                    Print
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Printer className="text-slate-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">Belum Ada Surat Disetujui</h3>
              <p className="text-slate-500">Surat yang telah selesai diproses oleh admin akan muncul di sini untuk dicetak.</p>
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
                <li>Klik tombol <strong>"Print"</strong> di dalam modal preview</li>
                <li>Pilih printer dan atur pengaturan cetak</li>
                <li>Pastikan orientasi kertas adalah <strong>Portrait</strong></li>
                <li>Klik "Print" untuk mencetak</li>
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

        {/* Global Preview Modal */}
        <DocumentPreviewModal isOpen={!!previewData} onClose={() => setPreviewData(null)} data={previewData} />
        <AttachmentPreviewModal isOpen={!!attachmentPreviewData} onClose={() => setAttachmentPreviewData(null)} data={attachmentPreviewData} />

      </AnimatedPage>
    </DashboardLayout>
  );
}
