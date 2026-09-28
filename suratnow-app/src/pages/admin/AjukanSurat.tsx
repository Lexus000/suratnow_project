import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, UploadCloud, AlertCircle, MapPin, Clock, CheckCircle, File, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const AjukanSurat = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [, setIsSubmitting] = useState(false);
  const [letterTypes, setLetterTypes] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    type: '', 
    nama_pemohon: '', 
    nik: '', 
    no_wa: '', 
    alamat: '', 
    judul_permohonan: '', 
    tujuan_penggunaan: '', 
    keterangan: '' 
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    // Ambil mapping jenis surat dari backend agar kita tahu ID-nya saat dikirim
    api.get("/letter-types").then(res => {
      setLetterTypes(res.data);
    }).catch(err => console.error("Failed to load letter types", err));
  }, []);

  useEffect(() => {
    if (formData.type) {
      setFormData(prev => ({
        ...prev,
        judul_permohonan: `Permohonan ${formData.type}`
      }));
    }
  }, [formData.type]);

  const handleNext = () => {
    if (step === 1 && !formData.type) return alert('Silakan pilih jenis surat terlebih dahulu.');
    if (step === 2 && (!formData.nama_pemohon || !formData.nik || !formData.tujuan_penggunaan || !formData.no_wa || !formData.alamat || !formData.judul_permohonan)) {
      return alert('Harap lengkapi semua data wajib (Identitas Pemohon dan Detail Permohonan).');
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const addPdfFile = (file?: File) => {
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      alert('Lampiran harus berupa file PDF.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file PDF maksimal 2MB.');
      return;
    }
    setUploadedFiles([file]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addPdfFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    addPdfFile(e.dataTransfer.files?.[0]);
  };

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    // Cari id berdasar nama
    const backendType = letterTypes.find(t => t.name === formData.type);
    if (!backendType) {
      alert(`Jenis surat "${formData.type}" belum didukung di database.`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!uploadedFiles[0]) {
        alert('Harap unggah satu file PDF sebelum mengirim pengajuan.');
        return;
      }

      const payload = new FormData();
      payload.append('letter_type_id', backendType.id.toString());
      payload.append('nama_pemohon', formData.nama_pemohon);
      payload.append('nik', formData.nik);
      payload.append('berkas_desa', uploadedFiles[0]);
      payload.append('data[nama_pemohon]', formData.nama_pemohon);
      payload.append('data[nik]', formData.nik);
      payload.append('data[no_wa]', formData.no_wa);
      payload.append('data[alamat]', formData.alamat);
      payload.append('data[judul_permohonan]', formData.judul_permohonan);
      payload.append('data[tujuan_penggunaan]', formData.tujuan_penggunaan);
      payload.append('data[keterangan]', formData.keterangan);

      await api.post("/letter-requests", payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Permohonan berhasil dikirim dan masuk ke antrean!');
      navigate('/admin/status');
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan data pengajuan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-6">
        <button onClick={() => navigate('/admin')} className="text-sm font-medium text-[#0a5893] hover:underline flex items-center gap-1">
          <ChevronLeft size={16}/> Kembali ke Dashboard
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Ajukan Surat Keterangan</h2>
            <p className="text-sm text-slate-500">Langkah {step} dari 3</p>
          </div>
          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">
            {Math.round((step / 3) * 100)}% Selesai
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div className="bg-[#0a5893] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm min-h-[400px]">
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-in fade-in duration-300">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Pilih Jenis Surat</h3>
              <p className="text-slate-500 mt-1">Pilih jenis surat keterangan yang ingin diajukan</p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-5 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20}/>
                <div>
                  <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-1">Perhatian:</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                    Untuk surat seperti <strong>SKCK</strong>, <strong>Dispensasi Nikah</strong>, <strong>Ahli Waris</strong>, dan <strong>Pencairan ADD & DD</strong>, warga harus datang langsung ke kantor kecamatan karena memerlukan verifikasi khusus.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-orange-200 dark:border-orange-800 text-sm text-orange-700 dark:text-orange-400 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin size={16}/> Alamat: Jl. Raya Suruh - Dongko, Suruh</span>
                    <span className="flex items-center gap-1.5"><Clock size={16}/> Jam: 08:00 - 15:00 WIB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'Surat Keterangan Miskin (SKM)', desc: 'Surat keterangan ekonomi tidak mampu', docs: ['KTP', 'KK', 'Pengantar RT/RW', 'Foto Rumah'] },
                { id: 'Surat Pergi Nikah', desc: 'Surat pengantar untuk pernikahan di KUA', docs: ['KTP Calon', 'KK', 'Akta Kelahiran'] },
                { id: 'Surat Keterangan Usaha (SKU)', desc: 'Surat pengantar pendirian/legalitas usaha', docs: ['KTP', 'KK', 'Foto Usaha'] },
                { id: 'Surat Keterangan Domisili', desc: 'Surat bukti tempat tinggal sementara', docs: ['KTP Asal', 'Pengantar RT/RW'] }
              ].map(item => (
                <div key={item.id} onClick={() => setFormData({...formData, type: item.id})} className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${formData.type === item.id ? 'border-[#0a5893] bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#0a5893]/50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.id}</h4>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    {formData.type === item.id && <CheckCircle className="text-[#0a5893]" size={20}/>}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-500 mb-2">Dokumen yang diperlukan:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.docs.map((doc, idx) => <span key={idx} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-1 rounded-full font-medium">{doc}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handleNext} className="flex items-center gap-2 bg-[#0a5893] hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-lg transition-colors">Selanjutnya <ChevronRight size={18}/></button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Isi Data Detail</h3>
              <p className="text-slate-500 mt-1">Lengkapi informasi untuk permohonan surat Anda</p>
            </div>
            <div className="space-y-8">
              {/* Bagian 1: Identitas Pemohon */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">1. Identitas Pemohon</h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span></label>
                    <input type="text" value={formData.nama_pemohon} onChange={e => setFormData({...formData, nama_pemohon: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white outline-none" placeholder="Masukkan nama pemohon" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span></label>
                      <input type="text" maxLength={16} value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white outline-none" placeholder="16 Digit NIK" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">No. WhatsApp Aktif <span className="text-rose-500">*</span></label>
                      <input type="text" value={formData.no_wa} onChange={e => setFormData({...formData, no_wa: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white outline-none" placeholder="Contoh: 08123456789" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alamat Lengkap <span className="text-rose-500">*</span></label>
                    <textarea rows={3} value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white outline-none resize-none" placeholder="Isi dengan detail RT/RW, Dusun, Desa..."></textarea>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Detail Permohonan Surat */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">2. Detail Permohonan Surat</h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Judul Permohonan <span className="text-rose-500">*</span></label>
                    <input type="text" value={formData.judul_permohonan} onChange={e => setFormData({...formData, judul_permohonan: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white outline-none" placeholder="Contoh: Permohonan Surat Keterangan Miskin (SKM)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tujuan Penggunaan <span className="text-rose-500">*</span></label>
                    <textarea rows={2} value={formData.tujuan_penggunaan} onChange={e => setFormData({...formData, tujuan_penggunaan: e.target.value})} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white outline-none resize-none" placeholder="Jelaskan tujuan pembuatan surat ini..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Keterangan Tambahan <span className="text-slate-400 font-normal text-xs ml-1">(Opsional)</span></label>
                    <textarea rows={2} value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-[#0a5893] dark:bg-slate-800 dark:text-white outline-none resize-none" placeholder="Catatan atau informasi tambahan jika diperlukan..."></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handlePrev} className="flex items-center gap-2 text-slate-600 font-medium px-4 py-2 border rounded-lg"><ChevronLeft size={18}/> Sebelumnya</button>
              <button onClick={handleNext} className="flex items-center gap-2 bg-[#0a5893] text-white font-medium px-6 py-2 rounded-lg">Selanjutnya <ChevronRight size={18}/></button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Upload Lampiran</h3>
              <p className="text-slate-500 mt-1">Unggah dokumen pendukung yang diperlukan</p>
            </div>

            <label onDragOver={e => e.preventDefault()} onDrop={handleDrop} className="block border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer mb-4">
              <input type="file" onChange={handleFileChange} accept=".pdf,application/pdf" className="hidden" />
              <UploadCloud className="mx-auto text-slate-400 mb-3" size={40}/>
              <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">Drag & drop file atau klik untuk pilih</p>
              <p className="text-sm text-slate-500 mb-2">Satu file PDF, ukuran maksimal 2MB</p>
            </label>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mb-6">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg text-[#0a5893]"><File size={16}/></div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile(idx)} className="p-2 text-slate-400 hover:text-rose-500"><X size={18}/></button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-3">Ringkasan Permohonan:</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold w-24 inline-block text-slate-600">Jenis Surat</span>: {formData.type}</p>
                <p><span className="font-semibold w-24 inline-block text-slate-600">Pemohon</span>: {formData.nama_pemohon}</p>
                <p><span className="font-semibold w-24 inline-block text-slate-600">Tujuan</span>: {formData.tujuan_penggunaan}</p>
                <p><span className="font-semibold w-24 inline-block text-slate-600">Lampiran</span>: {uploadedFiles.length} file</p>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
              <button onClick={handlePrev} className="flex items-center gap-2 text-slate-600 font-medium px-4 py-2 border rounded-lg"><ChevronLeft size={18}/> Sebelumnya</button>
              <button onClick={handleSubmit} className="bg-[#0a5893] text-white font-medium px-8 py-2.5 rounded-lg shadow-md">Kirim Permohonan</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AjukanSurat;
