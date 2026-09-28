import React from 'react';
import { X, Printer, FileText, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const DocumentPreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const isApproved = data.status === 'Disetujui' || data.status === 'approved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm print:bg-white print:p-0 animate-in fade-in duration-200">
      {/* CSS Khusus Cetak */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; box-shadow: none; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="bg-slate-200 dark:bg-slate-900 rounded-xl w-full max-w-4xl h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 print:h-auto print:shadow-none print:bg-white print:rounded-none">
        
        {/* Header Modal - Sembunyi saat dicetak */}
        <div className="p-4 bg-slate-800 flex justify-between items-center text-white shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <FileText size={18}/>
            <span className="font-medium">Pratinjau Dokumen {data.id ? `- ${data.id}` : ''}</span>
          </div>
          <div className="flex items-center gap-3">
            {isApproved ? (
              <button onClick={() => window.print()} className="bg-[#0a5893] hover:bg-blue-700 px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                <Printer size={16}/> Cetak / PDF
              </button>
            ) : (
              <span className="text-xs text-slate-300">Cetak tersedia setelah disetujui</span>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={20}/>
            </button>
          </div>
        </div>
        
        {/* Area Kertas (Scrollable) */}
        <div className="flex-1 overflow-auto flex flex-col items-center p-4 sm:p-8 print:p-0 custom-scrollbar relative">
          
          {/* Status Banners */}
          {(data.status === 'Disetujui' || data.status === 'approved') && data.nomor_registrasi && (
            <div className="w-[210mm] max-w-full bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg mb-4 flex items-start gap-3 shrink-0 print:hidden">
              <CheckCircle className="shrink-0 mt-0.5 text-emerald-600" size={20} />
              <div>
                <p className="font-bold">Permohonan Disetujui</p>
                <p className="text-sm mt-1">Nomor Registrasi Kecamatan: <strong>{data.nomor_registrasi}</strong></p>
              </div>
            </div>
          )}

          {(data.status === 'Ditolak' || data.status === 'rejected') && data.admin_notes && (
            <div className="w-[210mm] max-w-full bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg mb-4 flex items-start gap-3 shrink-0 print:hidden">
              <XCircle className="shrink-0 mt-0.5 text-rose-600" size={20} />
              <div>
                <p className="font-bold">Permohonan Ditolak</p>
                <p className="text-sm mt-1">Catatan Admin: <strong>{data.admin_notes}</strong></p>
              </div>
            </div>
          )}

          {(data.status === 'Dikembalikan' || data.status === 'returned') && data.admin_notes && (
            <div className="w-[210mm] max-w-full bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg mb-4 flex items-start gap-3 shrink-0 print:hidden">
              <RefreshCw className="shrink-0 mt-0.5 text-amber-600" size={20} />
              <div>
                <p className="font-bold">Perlu Perbaikan</p>
                <p className="text-sm mt-1">Catatan Admin: <strong>{data.admin_notes}</strong></p>
              </div>
            </div>
          )}

          {/* KERTAS A4 VIRTUAL */}
          <div className={`${isApproved ? 'print-area' : 'print:hidden'} bg-white w-[210mm] min-h-[297mm] shadow-xl p-[15mm] sm:p-[20mm] text-black flex flex-col shrink-0 print:shadow-none`}>
            
            {/* Kop Surat */}
            <div className="border-b-4 border-double border-black pb-4 mb-8 text-center shrink-0">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide">Pemerintah Kabupaten Trenggalek</h2>
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider mt-1">Kecamatan Suruh</h1>
              <p className="text-xs sm:text-sm mt-2">Jl. Raya Suruh - Dongko, Suruh, Kec. Suruh, Kabupaten Trenggalek, Jawa Timur</p>
            </div>
            
            {/* Isi Surat */}
            <div className="flex-1 text-sm sm:text-base leading-relaxed">
              <h3 className="text-lg font-bold text-center underline mb-8 uppercase tracking-wide">
                {data.type || data.jenisSurat || 'Surat Keterangan'}
              </h3>
              
              <p className="mb-4 text-justify">Yang bertanda tangan di bawah ini Camat Suruh, Kabupaten Trenggalek, menerangkan dengan sebenarnya bahwa:</p>
              
              <table className="mb-6 w-full ml-4 sm:ml-8">
                <tbody>
                  <tr>
                    <td className="w-40 sm:w-48 pb-3 align-top">Nama Lengkap</td>
                    <td className="w-4 pb-3 align-top">:</td>
                    <td className="pb-3 align-top font-bold uppercase">{data?.data?.nama_pemohon || data?.user?.name || data?.namaPemohon || data?.applicantName || '-'}</td>
                  </tr>
                  <tr>
                    <td className="w-40 sm:w-48 pb-3 align-top">NIK</td>
                    <td className="w-4 pb-3 align-top">:</td>
                    <td className="pb-3 align-top tracking-widest">{data?.data?.nik || data?.nik || '-'}</td>
                  </tr>
                  <tr>
                    <td className="w-40 sm:w-48 pb-3 align-top">Alamat Lengkap</td>
                    <td className="w-4 pb-3 align-top">:</td>
                    <td className="pb-3 align-top leading-relaxed">{data?.data?.alamat || data?.user?.address || '-'}</td>
                  </tr>
                  <tr>
                    <td className="w-40 sm:w-48 pb-3 align-top">Keperluan</td>
                    <td className="w-4 pb-3 align-top">:</td>
                    <td className="pb-3 align-top">{data?.data?.tujuan_penggunaan || data?.purpose || data?.tujuan || '-'}</td>
                  </tr>
                  <tr>
                    <td className="w-40 sm:w-48 pb-3 align-top">Status Dokumen</td>
                    <td className="w-4 pb-3 align-top">:</td>
                    <td className="pb-3 align-top uppercase font-semibold text-slate-600">{data.status || 'Draft'}</td>
                  </tr>
                  {(data.status === 'Disetujui' || data.status === 'approved') && data.nomor_registrasi && (
                  <tr>
                    <td className="w-40 sm:w-48 pb-3 align-top">Nomor Registrasi</td>
                    <td className="w-4 pb-3 align-top">:</td>
                    <td className="pb-3 align-top font-bold text-emerald-700">{data.nomor_registrasi}</td>
                  </tr>
                  )}
                </tbody>
              </table>
              
              {(data.type || data.jenisSurat) === 'Surat Keterangan Miskin (SKM)' && (
                <p className="mb-4 text-justify">
                  Nama tersebut di atas adalah benar-benar warga yang berdomisili di alamat tersebut di atas dan berdasarkan data serta verifikasi lingkungan, yang bersangkutan tergolong keluarga kurang mampu (miskin).
                </p>
              )}

              {data?.data?.keterangan && (
                <p className="mb-4 text-justify">
                  <strong>Catatan/Keterangan:</strong> {data.data.keterangan}
                </p>
              )}
              
              <p className="mb-8 text-justify">Demikian surat keterangan ini dibuat dengan sesungguhnya untuk dapat dipergunakan sebagaimana mestinya dan penuh tanggung jawab.</p>
            </div>

            {/* Tanda Tangan */}
            <div className="w-full flex justify-end shrink-0 mt-8">
              <div className="text-center w-64">
                <p className="mb-1">Suruh, {data.date || data.tanggal || new Date().toLocaleDateString('id-ID')}</p>
                <p className="mb-16 font-bold">Camat Suruh</p>
                
                {data.status === 'Disetujui' || data.status === 'Selesai' || data.status === 'approved' ? (
                  <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg p-2 mb-2 text-xs text-blue-700 font-bold">
                    Telah Ditandatangani Elektronik (TTE)
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-2 mb-2 text-xs text-slate-400">
                    Menunggu Tanda Tangan
                  </div>
                )}
                
                <p className="font-bold underline uppercase">HARI ANDHIKO, AP., M.Si.</p>
                <p className="text-sm">NIP. 19730701 199403 1 007</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
