import { useEffect, useState } from 'react';
import { AlertCircle, Download, FileText, LoaderCircle, X } from 'lucide-react';
import api from '../lib/api';

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

/** Preview the original uploaded PDF through the authenticated attachment endpoint. */
export default function AttachmentPreviewModal({ isOpen, onClose, data }: AttachmentPreviewModalProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !data?.id) {
      setFileUrl(null);
      setError(null);
      return;
    }

    let isMounted = true;
    let objectUrl: string | null = null;

    if (!data.berkas_desa) {
      setFileUrl(null);
      setError('Pengajuan ini tidak memiliki lampiran PDF.');
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    setError(null);

    api.get<Blob>(`/letter-requests/${data.id}/attachment`, { responseType: 'blob' })
      .then((response) => {
        if (!isMounted) return;
        objectUrl = URL.createObjectURL(response.data);
        setFileUrl(objectUrl);
      })
      .catch(() => {
        if (isMounted) setError('Dokumen yang diunggah tidak dapat dibuka.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setFileUrl(null);
    };
  }, [isOpen, data?.id]);

  if (!isOpen || !data) return null;

  return (
    <div data-testid="attachment-preview-modal" className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-100 dark:bg-slate-900 rounded-xl w-full max-w-6xl h-[92vh] shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-800 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={18} />
            <div className="min-w-0">
              <p className="font-medium truncate">Preview Lampiran Pengajuan #{data.id}</p>
              <p className="text-xs text-slate-300 truncate">{data.letter_type?.name || data.type || 'Dokumen PDF'} • File asli yang diunggah</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {fileUrl && (
              <a
                href={fileUrl}
                download={`lampiran-pengajuan-${data.id}.pdf`}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium"
              >
                <Download size={16} /> Unduh
              </a>
            )}
            <button data-testid="attachment-preview-close" onClick={onClose} className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg" aria-label="Tutup preview">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center p-3 sm:p-5">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <LoaderCircle className="animate-spin" size={32} />
              <span>Membuka dokumen yang diunggah...</span>
            </div>
          )}
          {!isLoading && error && (
            <div data-testid="attachment-preview-error" className="flex flex-col items-center gap-3 text-rose-600 text-center">
              <AlertCircle size={36} />
              <span>{error}</span>
            </div>
          )}
          {!isLoading && !error && fileUrl && (
            <iframe
              data-testid="attachment-preview-frame"
              src={fileUrl}
              title={`Preview lampiran pengajuan ${data.id}`}
              sandbox="allow-same-origin"
              className="w-full h-full rounded-lg border border-slate-300 bg-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
