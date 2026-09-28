import { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  MessageCircle 
} from "lucide-react";

export function Bantuan() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Bagaimana cara memproses surat dari antrean warga?',
      answer: 'Buka menu "Status Pengajuan". Cari nama warga yang bersangkutan, klik "Proses Surat", periksa kelengkapan datanya. Jika sesuai, klik "Setujui Surat". Dokumen otomatis akan pindah ke menu "Cetak Surat".'
    },
    {
      question: 'Warga datang langsung tanpa HP, bagaimana cara inputnya?',
      answer: 'Gunakan menu "Ajukan Surat" di bilah kiri. Isi data KTP pemohon, pilih jenis surat, dan lampirkan foto/scan dokumen fisik mereka jika ada. Setelah disimpan, data akan masuk ke antrean sistem.'
    },
    {
      question: 'Apa bedanya "Ditolak" dan "Kembalikan" saat verifikasi?',
      answer: '"Kembalikan" berarti ada data yang salah input atau lampiran kurang jelas sehingga warga bisa mengeditnya. "Ditolak" berarti permohonan tersebut secara prinsip melanggar aturan atau warga bukan penduduk domisili setempat.'
    },
    {
      question: 'Mengapa surat yang sudah disetujui tidak muncul di menu Cetak?',
      answer: 'Pastikan Anda telah me-refresh halaman, atau coba cari menggunakan kotak pencarian NIK. Jika masih tidak muncul, kemungkinan surat tersebut telah dicetak sebelumnya oleh Admin lain dan statusnya berubah menjadi "Selesai".'
    }
  ];



  return (
    <DashboardLayout>
      <AnimatedPage className="py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle size={28} className="text-[#0a5893]" />
            Pusat Bantuan & FAQ
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Temukan panduan penggunaan sistem SuratNow atau hubungi tim dukungan teknis.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Accordion Section */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Pertanyaan Seputar Dasbor Admin</h3>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex justify-between items-center p-5 text-left focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className={`font-medium ${openFaq === index ? 'text-[#0a5893] dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="text-[#0a5893] dark:text-blue-400 shrink-0" size={18}/>
                    ) : (
                      <ChevronDown className="text-slate-400 shrink-0" size={18}/>
                    )}
                  </button>

                  {/* Accordion Content */}
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Hubungi Dukungan Teknis</h3>
            
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Mengalami masalah sistem yang tidak tercantum di FAQ? Segera hubungi Tim IT Kecamatan.
              </p>
              
              <a href="mailto:suruhtrenggalek@gmail.com?subject=Bantuan%20Teknis%20SuratNow" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-blue-50 hover:border-blue-100 dark:hover:bg-slate-700/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Email IT Support</h4>
                  <p className="text-xs text-slate-500 mt-0.5">suruhtrenggalek@gmail.com</p>
                </div>
              </a>

              <a href="https://wa.me/628563532414?text=Halo%20Tim%20IT%20Kecamatan%20Suruh,%20saya%20butuh%20bantuan%20teknis..." target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-emerald-50 hover:border-emerald-100 dark:hover:bg-slate-700/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">WhatsApp Helpdesk</h4>
                  <p className="text-xs text-slate-500 mt-0.5">+62 856-3532-414</p>
                </div>
              </a>

              <div onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))} className="cursor-pointer flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-blue-50 hover:border-blue-100 dark:hover:bg-slate-700/50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">LIVE CHAT AI</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Asisten Virtual 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </AnimatedPage>
    </DashboardLayout>
  );
}
