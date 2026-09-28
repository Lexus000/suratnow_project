import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { Clock, Search, FileText, Inbox, X, CheckCircle, XCircle, RefreshCw, Eye } from "lucide-react";
import api from '../../lib/api';
import AttachmentPreviewModal from '../../components/AttachmentPreviewModal';
import { openLetterAttachment } from '../../lib/openAttachment';

export function StatusPengajuan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [catatan, setCatatan] = useState('');
  const [nomorRegistrasi, setNomorRegistrasi] = useState('');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/letter-requests');
      const formattedData = response.data.map((item: any) => ({
        ...item,
        date: new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: item.letter_type?.name || 'Surat',
        applicantName: item.data?.nama_pemohon || item.user?.name || 'Unknown',
        title: item.data?.judul_permohonan || `Permohonan ${item.letter_type?.name || 'Surat'}`,
        rawStatus: item.status,
        status: item.status === 'pending' ? 'Pending' : item.status === 'returned' ? 'Dikembalikan' : item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : item.status
      }));
      setRequests(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data pengajuan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const intervalId = window.setInterval(fetchRequests, 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  const pendingDocs = requests.filter(s => ['Pending', 'Dikembalikan'].includes(s.status));

  const filteredRequests = pendingDocs.filter(req => 
    (req.applicantName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateSuratStatus = async (id: number, action: 'approve' | 'reject' | 'returnRequest', reason?: string, nomorReg?: string) => {
    try {
      if (action === 'approve') {
        await api.post(`/letter-requests/${id}/approve`, { admin_notes: reason, nomor_registrasi: nomorReg });
      } else if (action === 'reject') {
        await api.post(`/letter-requests/${id}/reject`, { rejection_reason: reason, admin_notes: reason });
      } else if (action === 'returnRequest') {
        await api.post(`/letter-requests/${id}/return`, { admin_notes: reason });
      }
      alert('Status surat berhasil diperbarui!');
      fetchRequests();
    } catch (error) {
      console.error(error);
      setActionError('Terjadi kesalahan saat memperbarui status surat.');
      alert('Terjadi kesalahan saat memperbarui status surat.');
    }
  };

  const handleOpenAttachment = async (id: number) => {
    try {
      await openLetterAttachment(id);
    } catch {
      alert('Berkas tidak dapat dibuka atau sesi Anda sudah berakhir.');
    }
  };

  return (
    <DashboardLayout>
      <AnimatedPage className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Antrean Pengajuan Surat</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Daftar permohonan warga yang menunggu proses verifikasi dan persetujuan.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama pemohon..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <RefreshCw className="animate-spin text-slate-400" size={32} />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                <Inbox size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Hore! Tidak ada antrean surat saat ini.</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Semua permohonan warga telah selesai diproses.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Tanggal Masuk</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Nama Pemohon</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Jenis Surat</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                  {filteredRequests.map((doc) => (
                     <tr data-testid={`admin-status-row-${doc.id}`} key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-700 dark:text-slate-300">
                          {doc.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                            {doc.applicantName.substring(0, 2).toUpperCase()}
                          </div>
                          {doc.applicantName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" />
                        {doc.type}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                          <Clock size={12} />
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center justify-end gap-2">
                         <button data-testid={`admin-preview-${doc.id}`} 
                          onClick={() => setPreviewData(doc)}
                          className="p-2 text-slate-500 hover:text-[#0a5893] hover:bg-blue-50 rounded-lg transition-all" 
                          title="Pratinjau Surat"
                        >
                          <Eye size={18} />
                        </button>
                         <button data-testid={`admin-process-${doc.id}`} 
                          onClick={() => setSelectedDoc(doc)}
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm focus:ring-2 focus:ring-blue-500/50"
                        >
                          Proses Surat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div data-testid="admin-process-modal" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2"><FileText size={18}/> Proses Pengajuan</h3>
                 <button data-testid="admin-process-close" onClick={() => { setSelectedDoc(null); setCatatan(''); setNomorRegistrasi(''); setIsApprovalDialogOpen(false); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Nama Pemohon</p>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-lg">{selectedDoc.applicantName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 mb-1">Jenis Surat</p>
                  <p className="font-semibold text-[#0a5893] dark:text-blue-400">{selectedDoc.type}</p>
                  
                  {selectedDoc.berkas_desa && (
                    <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Lampiran Dokumen:</p>
                       <button data-testid={`admin-attachment-${selectedDoc.id}`} type="button" onClick={() => void handleOpenAttachment(selectedDoc.id)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a5893] bg-blue-100/80 hover:bg-blue-200 px-4 py-2 rounded-lg transition-colors border border-blue-200">
                        <FileText size={16} /> Lihat Berkas Desa
                      </button>
                    </div>
                  )}
                </div>
          {/* Note Input Section */}
          <div className="mb-4 mt-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Catatan Verifikasi <span className="text-rose-500">*</span>
            </label>
             <textarea data-testid="admin-notes"
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white resize-none text-sm placeholder:text-slate-400"
              placeholder="Wajib diisi jika menolak atau mengembalikan berkas..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
            <button 
              onClick={() => {
                if (!catatan.trim()) {
                   alert('Mohon isi Catatan Verifikasi terlebih dahulu untuk memberikan alasan pengembalian.');
                   setActionError('Catatan verifikasi wajib diisi.');
                  return;
                }
                updateSuratStatus(selectedDoc.id, 'returnRequest', catatan);
                setSelectedDoc(null);
                setCatatan('');
              }}
              className="flex-1 flex justify-center items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <RefreshCw size={16}/> Kembalikan
            </button>
            <button 
              onClick={() => {
                 if (!catatan.trim()) {
                  alert('Mohon isi Catatan Verifikasi terlebih dahulu untuk memberikan alasan penolakan.');
                  return;
                }
                 updateSuratStatus(selectedDoc.id, 'reject', catatan);
                setSelectedDoc(null);
                setCatatan('');
              }}
              className="flex-1 flex justify-center items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <XCircle size={16}/> Tolak
            </button>
            <button 
              onClick={() => {
                 setActionError('');
                 setIsApprovalDialogOpen(true);
              }}
              className="flex-1 sm:flex-[1.5] flex justify-center items-center gap-1.5 bg-[#0a5893] hover:bg-blue-800 text-white px-3 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
               <CheckCircle size={16}/> Setujui Surat
             </button>
           </div>
           {actionError && <p data-testid="admin-action-error" className="mt-3 text-sm text-rose-600">{actionError}</p>}
           {isApprovalDialogOpen && (
             <div data-testid="admin-approval-dialog" className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
               <label htmlFor="admin-registration-number" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Nomor Registrasi Kecamatan</label>
               <input
                 id="admin-registration-number"
                 data-testid="admin-registration-number"
                 value={nomorRegistrasi}
                 onChange={(event) => setNomorRegistrasi(event.target.value)}
                 className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                 autoFocus
               />
               <div className="mt-3 flex justify-end gap-2">
                 <button type="button" data-testid="admin-approval-cancel" onClick={() => setIsApprovalDialogOpen(false)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">Batal</button>
                 <button
                   type="button"
                   data-testid="admin-approval-confirm"
                   onClick={() => {
                     if (!nomorRegistrasi.trim()) {
                       setActionError('Nomor registrasi wajib diisi untuk menyetujui berkas.');
                       return;
                     }
                     updateSuratStatus(selectedDoc.id, 'approve', catatan, nomorRegistrasi.trim());
                     setSelectedDoc(null);
                     setCatatan('');
                     setNomorRegistrasi('');
                     setIsApprovalDialogOpen(false);
                   }}
                   className="rounded-lg bg-[#0a5893] px-3 py-2 text-sm font-medium text-white"
                 >Simpan Persetujuan</button>
               </div>
             </div>
           )}
              </div>
            </div>
          </div>
        )}

        <AttachmentPreviewModal isOpen={!!previewData} onClose={() => setPreviewData(null)} data={previewData} />
      </AnimatedPage>
    </DashboardLayout>
  );
}
