import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, AlertCircle, CheckCircle, 
  MapPin, Clock, Phone, Upload, Info, FileText, X
} from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";

export function AjukanSurat() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [letterTypes, setLetterTypes] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    jenisSurat: "",
    nama_pemohon: "",
    nik: "",
    berkas_desa: null as File | null
  });

  useEffect(() => {
    // Ambil mapping jenis surat dari backend agar kita tahu ID-nya saat dikirim
    api.get("/letter-types").then(res => {
      setLetterTypes(res.data);
    }).catch(err => console.error("Failed to load letter types", err));
    
    // Auto-fill dari auth user
    if (user) {
      setFormData(prev => ({
        ...prev,
        nama_pemohon: user.name || '',
        nik: user.nik || '',
      }));
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep === 1 && !formData.jenisSurat) {
      alert("Silakan pilih jenis surat terlebih dahulu.");
      return;
    }
    
    if (currentStep === 2) {
      if (!formData.nama_pemohon || !formData.nik) {
        alert("Harap lengkapi semua data wajib (Identitas Pemohon).");
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/user');
    }
  };

  const handleSubmit = async () => {
    // Cari id berdasar nama
    const backendType = letterTypes.find(t =>
      t.name === formData.jenisSurat ||
      (formData.jenisSurat === 'Surat Pergi Nikah' && t.name === 'Surat Pengantar Nikah')
    );
    if (!backendType) {
      alert(`Jenis surat "${formData.jenisSurat}" belum didukung di database.`);
      return;
    }

    if (!formData.berkas_desa) {
      alert("Harap unggah Surat dari Desa terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('letter_type_id', backendType.id.toString());
      payload.append('nama_pemohon', formData.nama_pemohon);
      payload.append('nik', formData.nik);
      payload.append('berkas_desa', formData.berkas_desa);

      await api.post("/letter-requests", payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Berhasil! Pengajuan Anda telah terkirim.');
      navigate('/user/status'); 
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat mengirim pengajuan. Pastikan server merespon dengan baik.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      alert('Lampiran harus berupa file PDF.');
      e.target.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file PDF maksimal 2MB.');
      e.target.value = '';
      return;
    }

    setFormData(prev => ({ ...prev, berkas_desa: file }));
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      berkas_desa: null
    }));
  };

  const progressPercentage = currentStep === 1 ? '33%' : currentStep === 2 ? '67%' : '100%';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 font-sans text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/user')}
          className="flex items-center gap-2 text-[#0a5893] hover:text-blue-800 font-medium text-sm transition-colors"
        >
          <ChevronLeft size={16} /> Kembali ke Dashboard
        </button>

        {/* Progress Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">Ajukan Surat Keterangan</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Langkah {currentStep} dari 3</p>
            </div>
            <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-600">
              {progressPercentage} Selesai
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-[#0a5893] h-2.5 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: progressPercentage }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
          
          {/* STEP 1: Pilih Jenis Surat */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">Pilih Jenis Surat</h3>
                <p className="text-slate-500 dark:text-slate-400">Pilih jenis surat keterangan yang ingin Anda ajukan</p>
              </div>

              <div className="space-y-6 mb-8">
                {/* Blue Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
                    <div className="space-y-3">
                      <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm">Pengajuan Online Tersedia:</p>
                      <p className="text-blue-800 dark:text-blue-400 text-sm leading-relaxed">
                        Pengajuan online dengan upload dokumen digital saat ini tersedia untuk <br/>
                        <strong className="text-blue-900 dark:text-blue-300">Surat Keterangan Miskin (SKM)</strong>, <strong className="text-blue-900 dark:text-blue-300">Surat Pergi Nikah</strong>, <strong className="text-blue-900 dark:text-blue-300">Surat Keterangan Usaha (SKU)</strong>, dan <strong className="text-blue-900 dark:text-blue-300">Surat Keterangan Domisili</strong>.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                        <CheckCircle size={16} />
                        Dapat diajukan secara online dengan upload dokumen digital
                      </div>
                    </div>
                  </div>
                </div>

                {/* Orange Warning Box */}
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-5 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-orange-900 dark:text-orange-300 text-sm mb-3">Harus Datang ke Kantor:</p>
                      <ul className="space-y-3 text-sm text-orange-800 dark:text-orange-400 mb-5">
                        <li className="flex gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-orange-500 shrink-0"></span>
                          <div>
                            <strong className="block text-orange-900 dark:text-orange-300">Surat Keterangan Catatan Kepolisian (SKCK)</strong>
                            <span>- Memerlukan verifikasi kepolisian</span>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-orange-500 shrink-0"></span>
                          <div>
                            <strong className="block text-orange-900 dark:text-orange-300">Surat Pengajuan Pencairan ADD & DD</strong>
                            <span>- Memerlukan verifikasi proposal dan anggaran</span>
                          </div>
                        </li>
                        <li className="flex gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-orange-500 shrink-0"></span>
                          <div>
                            <strong className="block text-orange-900 dark:text-orange-300">Surat Keterangan Ahli Waris</strong>
                            <span>- Memerlukan verifikasi dokumen keluarga</span>
                          </div>
                        </li>
                      </ul>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-orange-700 dark:text-orange-500 pt-3 border-t border-orange-200 dark:border-orange-800/50">
                        <div className="flex items-center gap-1.5"><MapPin size={14} className="text-orange-500" /> Alamat: Jl. Panglima Sudirman No. 01, Suruh 66361</div>
                        <div className="flex items-center gap-1.5"><Clock size={14} className="text-orange-500" /> Jam Pelayanan: Senin-Jumat 08:00-15:00 WIB</div>
                        <div className="flex items-center gap-1.5"><Phone size={14} className="text-orange-500" /> Telp: (0355) 796438</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selectable Cards (Unifikasi dengan admin) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'Surat Keterangan Miskin (SKM)', desc: 'Surat keterangan ekonomi tidak mampu', docs: ['KTP', 'KK', 'Pengantar RT/RW', 'Foto Rumah'] },
                    { id: 'Surat Pergi Nikah', desc: 'Surat pengantar untuk pernikahan di KUA', docs: ['KTP Calon', 'KK', 'Akta Kelahiran'] },
                    { id: 'Surat Keterangan Usaha (SKU)', desc: 'Surat pengantar pendirian/legalitas usaha', docs: ['KTP', 'KK', 'Foto Usaha'] },
                    { id: 'Surat Keterangan Domisili', desc: 'Surat bukti tempat tinggal sementara', docs: ['KTP Asal', 'Pengantar RT/RW'] }
                  ].map(item => (
                    <button 
                      data-testid={`letter-type-${item.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}
                      key={item.id}
                      onClick={() => setFormData({...formData, jenisSurat: item.id})}
                      className={`text-left relative p-5 rounded-xl border-2 transition-all ${
                        formData.jenisSurat === item.id 
                          ? "border-[#0a5893] bg-blue-50/50 dark:bg-blue-900/10 shadow-sm" 
                          : "border-slate-200 dark:border-slate-700 hover:border-[#0a5893]/50 bg-white dark:bg-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{item.id}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{item.desc}</p>
                        </div>
                        {formData.jenisSurat === item.id && <CheckCircle className="text-[#0a5893] shrink-0" size={20}/>}
                      </div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Dokumen yang diperlukan:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.docs.map((doc, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[11px] font-medium">{doc}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Isi Data Detail */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">Isi Data Detail</h3>
                <p className="text-slate-500 dark:text-slate-400">Lengkapi informasi untuk permohonan surat Anda</p>
              </div>

              {/* Form 2 Bagian */}
              <div className="space-y-8">
                
                {/* Bagian 1: Identitas Pemohon */}
                <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Identitas Pemohon</h4>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="letter-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span></label>
                      <input id="letter-name" data-testid="letter-name" type="text" value={formData.nama_pemohon} onChange={e => setFormData({...formData, nama_pemohon: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white outline-none" placeholder="Masukkan nama pemohon" />
                    </div>
                    <div>
                      <label htmlFor="letter-nik" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span></label>
                      <input id="letter-nik" data-testid="letter-nik" type="text" maxLength={16} value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white outline-none" placeholder="16 Digit NIK" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Lampiran */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">Upload Lampiran</h3>
                <p className="text-slate-500 dark:text-slate-400">Unggah dokumen pendukung yang diperlukan</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <label className="block relative border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input 
                    data-testid="letter-pdf-input"
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    onChange={handleFileChange} 
                    accept=".pdf,application/pdf"
                  />
                  <Upload className="mx-auto text-slate-400 mb-4 group-hover:text-blue-500 transition-colors" size={40}/>
                  <h3 className="font-medium text-slate-800 text-lg mb-2">Unggah Surat dari Desa (TTD Kades & Stempel)</h3>
                  <p className="text-slate-500 text-sm mb-4">Format PDF saja, maksimal 2MB</p>
                </label>

                {formData.berkas_desa && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-700 text-sm">File Terpilih:</h4>
                    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <FileText size={20}/>
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium text-slate-800 truncate">{formData.berkas_desa.name}</p>
                          <p className="text-xs text-slate-500">{(formData.berkas_desa.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button data-testid="letter-remove-file"
                        type="button" 
                        onClick={(e) => { e.preventDefault(); removeFile(); }} 
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                      >
                        <X size={18}/>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <h3 className="font-bold text-slate-800 mb-4">Ringkasan Permohonan:</h3>
                  <ul className="space-y-3 text-sm">
                    <li><span className="font-bold text-slate-700 inline-block w-28">Jenis Surat:</span> <span className="text-slate-600">{formData.jenisSurat || "-"}</span></li>
                    <li><span className="font-bold text-slate-700 inline-block w-28">Pemohon:</span> <span className="text-slate-600">{formData.nama_pemohon || "-"}</span></li>
                    <li><span className="font-bold text-slate-700 inline-block w-28">NIK:</span> <span className="text-slate-600">{formData.nik || "-"}</span></li>
                    <li><span className="font-bold text-slate-700 inline-block w-28">Lampiran Desa:</span> <span className="text-slate-800 font-bold">{formData.berkas_desa ? 'Telah diunggah' : 'Belum diunggah'}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={16} /> 
              {currentStep === 1 ? 'Kembali ke Dashboard' : 'Sebelumnya'}
            </button>
            
            <button data-testid="letter-next"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#0a5893] rounded-lg hover:bg-blue-800 hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengirim...
                </>
              ) : currentStep === 3 ? (
                'Kirim Permohonan'
              ) : (
                <>Selanjutnya <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
