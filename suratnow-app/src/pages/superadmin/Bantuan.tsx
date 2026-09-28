import { useState } from 'react';
import { LifeBuoy, BookOpen, MessageSquare, Phone, ChevronDown, Mail } from 'lucide-react';
import { AnimatedPage } from "../../components/AnimatedPage";

export default function Bantuan() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: "Bagaimana cara mereset password Admin?", a: "Pilih menu Manajemen Pengguna, cari akun admin yang bersangkutan, klik ikon Edit, lalu pilih opsi 'Reset Password'. Sistem akan mengirimkan tautan reset ke email yang terdaftar." },
    { q: "Apa yang terjadi jika SLA terlewat?", a: "Sistem akan otomatis memberikan penanda 'Kritis' pada dokumen tersebut di menu Monitoring SLA. Anda disarankan untuk segera menghubungi Petugas Verifikator yang menangani dokumen terkait untuk percepatan layanan." },
    { q: "Bagaimana cara menambah jenis surat baru?", a: "Modul penambahan jenis surat masih dalam tahap pengembangan (Coming Soon). Saat ini jenis surat telah terkonfigurasi secara baku berdasarkan regulasi." },
    { q: "Bisakah saya mengunduh laporan bulanan?", a: "Ya. Buka menu Riwayat Surat, gunakan alat bantu pencarian atau filter, kemudian Anda dapat menggunakan fitur cetak PDF untuk mengamankan data pengajuan warga." }
  ];

  return (
    <AnimatedPage className="p-6 md:p-8 min-h-screen space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-[#0a5893] dark:text-blue-400">
          <LifeBuoy size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pusat Bantuan</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Panduan penggunaan sistem dan dukungan teknis khusus Super Admin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: FAQ */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm h-full">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-[#0a5893] dark:text-blue-400" /> FAQ & Panduan Praktis
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden transition-all bg-slate-50/50 dark:bg-slate-800/30 shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4.5 flex justify-between items-center text-left hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-[#0a5893] dark:text-blue-400' : ''}`} />
                  </button>
                  <div className={`px-4.5 text-sm text-slate-600 dark:text-slate-400 transition-all duration-300 ${openFaq === idx ? 'pb-4.5 max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50 leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Kontak Dukungan */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-[#0a5893] to-[#08487a] dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-transparent dark:border-slate-700 text-white flex flex-col h-full relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-8 opacity-[0.07] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <LifeBuoy size={200} />
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <h2 className="text-xl font-bold mb-3">Butuh Bantuan Teknis?</h2>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed opacity-90">Tim IT Kecamatan siap membantu Anda menyelesaikan kendala sistem dengan cepat.</p>
              
              <div className="space-y-5 mb-10 mt-auto">
                <div onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))} className="flex items-center gap-4 group/item cursor-pointer">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm group-hover/item:bg-white/20 transition-colors">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-200 uppercase tracking-widest font-bold mb-0.5">LIVE CHAT AI</p>
                    <p className="text-sm font-semibold">Asisten Virtual 24/7</p>
                  </div>
                </div>
                <a href="https://wa.me/628563532414?text=Halo%20Tim%20IT%20Kecamatan%20Suruh,%20saya%20butuh%20bantuan%20teknis..." target="_blank" rel="noreferrer" className="flex items-center gap-4 group/item cursor-pointer">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm group-hover/item:bg-white/20 transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-200 uppercase tracking-widest font-bold mb-0.5">WhatsApp</p>
                    <p className="text-sm font-semibold">+62 856-3532-414</p>
                  </div>
                </a>
                <a href="mailto:suruhtrenggalek@gmail.com?subject=Bantuan%20Teknis%20SuratNow" className="flex items-center gap-4 group/item cursor-pointer">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm group-hover/item:bg-white/20 transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-200 uppercase tracking-widest font-bold mb-0.5">Email</p>
                    <p className="text-sm font-semibold">suruhtrenggalek@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>
            
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))} className="w-full py-3.5 bg-white text-[#0a5893] dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all relative z-10 flex items-center justify-center gap-2">
              <Phone size={18} /> Hubungi Dukungan
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
