import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { 
  HelpCircle, AlertTriangle, FileText, Info, 
  MapPin, Mail, Clock, Lightbulb, 
  FileBadge, CheckCircle, Truck, Building2, MessageCircle
} from "lucide-react";

export function Bantuan() {
  return (
    <DashboardLayout>
      <AnimatedPage className="py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Main Container & Header */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-[#0a5893] dark:text-blue-400 rounded-lg">
                <HelpCircle size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Bantuan & Panduan</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Informasi lengkap tentang layanan surat kecamatan</p>
              </div>
            </div>

            <div className="mt-8 space-y-10">
              
              {/* SECTION 1: Cara Mengajukan Surat */}
              <section>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">1</span>
                  Cara Mengajukan Surat
                </h2>
                <ol className="list-decimal list-outside ml-5 space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Pastikan Anda sudah login ke akun warga Anda.</li>
                  <li>Buka menu "Ajukan Surat" di sidebar sebelah kiri.</li>
                  <li>Pilih jenis surat yang tersedia untuk pengajuan online.</li>
                  <li>Isi formulir dengan lengkap dan benar, serta unggah dokumen pendukung yang diminta (KTP, KK, dll).</li>
                  <li>Pantau status pengajuan Anda melalui menu "Status Pengajuan".</li>
                </ol>
              </section>

              {/* SECTION 2: Penting: Surat yang Harus Datang Langsung (Red Box) */}
              <section className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl p-6">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Penting: Surat yang Harus Datang Langsung
                </h2>
                <p className="text-red-800 dark:text-red-300 mb-4 text-sm font-medium">
                  Untuk jenis surat berikut, Anda WAJIB datang langsung ke kantor kecamatan:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-3 text-red-700 dark:text-red-300 mb-6 font-medium">
                  <li>Surat Dispensasi Nikah (Memerlukan verifikasi wali dan calon)</li>
                  <li>Surat Keterangan Ahli Waris (Memerlukan saksi dan tanda tangan basah)</li>
                  <li>Surat Keterangan Catatan Kepolisian (SKCK) tingkat Kecamatan</li>
                  <li>Surat Pengajuan Pencairan ADD & DD</li>
                </ul>
                
                <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-red-100 dark:border-red-800/30">
                  <h3 className="font-bold text-red-800 dark:text-red-300 mb-2 text-sm">Mengapa harus datang langsung?</h3>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-red-700 dark:text-red-400">
                    <li>Memerlukan verifikasi fisik dokumen asli.</li>
                    <li>Membutuhkan tanda tangan basah dan cap basah langsung dari pihak terkait.</li>
                    <li>Menghindari pemalsuan dokumen untuk urusan krusial/hukum.</li>
                  </ul>
                </div>
              </section>

              {/* SECTION 3: Jenis Surat yang Dapat Diajukan Online (Green Box) */}
              <section className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-6">
                <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  Jenis Surat yang Dapat Diajukan Online
                </h2>
                <ul className="space-y-3 text-emerald-800 dark:text-emerald-300 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-500" />
                    <span className="font-medium">Surat Keterangan Miskin (SKM)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={18} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-500" />
                    <span className="font-medium">Surat Pergi Nikah</span>
                  </li>
                </ul>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800/30">
                  <span className="font-bold">Catatan:</span> Untuk jenis surat lainnya yang tidak tercantum di atas, Anda harus datang langsung ke kantor kecamatan.
                </p>
              </section>

              {/* SECTION 4: Informasi Kontak & Jam Pelayanan */}
              <section>
                <h2 className="text-lg font-bold text-[#0a5893] dark:text-blue-400 mb-4 flex items-center gap-2">
                  <Info size={20} />
                  Informasi Kontak & Jam Pelayanan
                </h2>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                  <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-slate-800 dark:text-slate-200">Alamat:</span>
                        Jl. Panglima Sudirman No. 01, Suruh 66361
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MessageCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-slate-800 dark:text-slate-200">WhatsApp:</span>
                        <a href="https://wa.me/628563532414?text=Halo%20Tim%20IT%20Kecamatan%20Suruh,%20saya%20butuh%20bantuan%20teknis..." target="_blank" rel="noreferrer" className="text-[#0a5893] dark:text-blue-400 hover:underline">
                          +62 856-3532-414
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-slate-800 dark:text-slate-200">Email:</span>
                        <a href="mailto:suruhtrenggalek@gmail.com?subject=Bantuan%20Teknis%20SuratNow" className="text-[#0a5893] dark:text-blue-400 hover:underline">
                          suruhtrenggalek@gmail.com
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <HelpCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-slate-800 dark:text-slate-200">LIVE CHAT AI:</span>
                        <button onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))} className="text-[#0a5893] dark:text-blue-400 hover:underline font-medium">
                          Buka Asisten Virtual 24/7
                        </button>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-slate-800 dark:text-slate-200">Jam Operasional:</span>
                        Senin - Jumat: 08:00 - 15:00 WIB<br/>
                        (Istirahat: 12:00 - 13:00 WIB)
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 text-[#0a5893] dark:text-blue-300 p-4 rounded-lg text-sm flex items-start gap-3">
                  <Lightbulb size={18} className="shrink-0 mt-0.5 text-amber-500" />
                  <p>
                    <span className="font-bold">Tips:</span> Untuk pelayanan tatap muka, disarankan datang pada pagi hari untuk menghindari antrean panjang.
                  </p>
                </div>
              </section>

              {/* SECTION 5: Dokumen yang Perlu Disiapkan */}
              <section>
                <h2 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
                  <FileBadge size={20} />
                  Dokumen yang Perlu Disiapkan (Luring/Tatap Muka)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Surat Dispensasi Nikah</h3>
                    <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Fotokopi KTP calon pengantin</li>
                      <li>Fotokopi KK calon pengantin</li>
                      <li>Surat Pengantar dari Desa/Kelurahan</li>
                      <li>Fotokopi Akta Kelahiran</li>
                      <li>Surat Pernyataan Belum Menikah (bermaterai)</li>
                    </ul>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Surat Ahli Waris</h3>
                    <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <li>Surat Kematian dari Desa/Kelurahan</li>
                      <li>Fotokopi KK pewaris dan ahli waris</li>
                      <li>Fotokopi KTP seluruh ahli waris</li>
                      <li>Fotokopi Surat Nikah pewaris</li>
                      <li>Saksi minimal 2 orang (bawa KTP asli)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* SECTION 6: Pertanyaan Umum (FAQ) */}
              <section>
                <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
                  <HelpCircle size={20} />
                  Pertanyaan Umum (FAQ)
                </h2>
                <div className="space-y-3">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Berapa lama proses pengurusan surat secara online?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Proses verifikasi dan persetujuan biasanya memakan waktu 1x24 jam kerja (Senin-Jumat). Jika dokumen lengkap, surat bisa langsung dicetak melalui dashboard Anda.
                    </p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Apakah ada biaya pengurusan surat?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      TIDAK ADA. Seluruh layanan pengurusan surat di Kantor Kecamatan Suruh adalah GRATIS / tanpa dipungut biaya apapun.
                    </p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Bagaimana jika pengajuan saya ditolak?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Anda dapat melihat alasan penolakan pada menu "Riwayat Surat". Perbaiki dokumen yang kurang/salah, lalu ajukan permohonan baru.
                    </p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Apakah file PDF yang di-download sah secara hukum?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Ya. Surat yang diunduh dari sistem ini dilengkapi dengan Tanda Tangan Elektronik (TTE) / Barcode yang diakui sah dan resmi.
                    </p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-800 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Bisa cetak di kertas ukuran apa?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Surat format PDF kami telah disesuaikan secara default untuk dicetak pada kertas ukuran A4 atau F4 (Folio) dengan posisi tegak (Portrait).
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 7: Panduan Khusus Pelayanan Tatap Muka (Yellow Box) */}
              <section className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-6">
                <h2 className="text-lg font-bold text-amber-800 dark:text-amber-500 mb-4 flex items-center gap-2">
                  <Building2 size={20} />
                  Panduan Khusus Pelayanan Tatap Muka
                </h2>
                <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-amber-900 dark:text-amber-400 font-medium">
                  <li>Siapkan seluruh dokumen persyaratan dalam satu map bersih.</li>
                  <li>Datang ke Kantor Kecamatan berpakaian rapi dan sopan.</li>
                  <li>Ambil nomor antrean pada mesin KiosK di ruang tunggu utama.</li>
                  <li>Tunggu panggilan dari loket pelayanan yang bersangkutan.</li>
                  <li>Serahkan dokumen ke petugas loket untuk diverifikasi.</li>
                  <li>Tunggu proses pengetikan/pencetakan berkas.</li>
                  <li>Tanda tangani berkas di hadapan petugas jika diperlukan.</li>
                  <li>Terima dokumen yang telah disahkan secara langsung.</li>
                </ol>
              </section>

              {/* FOOTER INFO */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm mt-8">
                <Truck size={20} className="shrink-0 mt-0.5 text-slate-400" />
                <p>
                  <strong className="text-slate-700 dark:text-slate-300">Informasi Penting:</strong> Sistem pelayanan digital ini bertujuan untuk mempermudah masyarakat mengakses layanan dasar. Harap manfaatkan dengan bijak dan gunakan data identitas asli Anda.
                </p>
              </div>

            </div>
          </div>
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
}
