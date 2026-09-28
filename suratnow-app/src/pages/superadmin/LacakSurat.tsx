import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, X, FileText, UserCheck, PenTool, CheckCircle, RefreshCw } from 'lucide-react';
import { AnimatedPage } from "../../components/AnimatedPage";
import api from "../../lib/api";

const LacakSurat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTracking, setSelectedTracking] = useState<any>(null);
  
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-polling mechanism (Live Sync)
  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const response = await api.get('/letter-requests');
        const formattedData = response.data.map((item: any) => {
          let currentStep = 1;
          let statusText = 'Menunggu';
          
          if (item.status === 'pending') {
            currentStep = 2; // Proses Verifikasi Admin
            statusText = 'Verifikasi Admin';
          } else if (item.status === 'approved') {
            currentStep = 4; // Selesai
            statusText = 'Selesai & Dikirim';
          } else if (item.status === 'rejected') {
            currentStep = 1;
            statusText = 'Ditolak';
          } else if (item.status === 'returned') {
            currentStep = 1;
            statusText = 'Dikembalikan / Revisi';
          }

          return {
            ...item,
            idStr: `#surat-${item.id}`,
            type: item.letter_type?.name || 'Surat',
            applicantName: item.data?.nama_pemohon || item.user?.name || 'Unknown',
            date: new Date(item.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            currentStep,
            statusText,
          };
        });
        
        setData(formattedData);
      } catch (error) {
        console.error("Gagal mengambil data tracking:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTracking(); // Initial fetch
    
    const intervalId = setInterval(fetchTracking, 5000); // Poll every 5s

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  const filteredTrackings = data.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.idStr.toLowerCase().includes(query) ||
      item.applicantName.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );
  });

  return (
    <AnimatedPage className="p-6 md:p-8 min-h-screen">
      {/* Header & Search */}
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-[#0a5893] dark:text-blue-400 rounded-xl">
            <MapPin size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              Lacak Progress Surat (Live)
              {isLoading && data.length === 0 && <RefreshCw size={16} className="animate-spin text-slate-400" />}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pantau status dokumen warga yang sedang diproses dalam sistem secara real-time.</p>
          </div>
        </div>
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari ID Surat atau Nama Warga..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#0a5893] transition-all text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 min-h-[300px]">
        {filteredTrackings.length === 0 && !isLoading ? (
           <div className="col-span-full flex flex-col items-center justify-center text-center py-12">
             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
               <Search className="text-slate-400" size={32} />
             </div>
             <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Tidak Ditemukan</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tidak ada dokumen yang sesuai dengan kriteria pencarian.</p>
           </div>
        ) : (
          filteredTrackings.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-[#0a5893] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">{item.idStr}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {item.date}</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.applicantName}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 truncate">{item.type}</p>
              
              <div className="mt-auto">
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className={item.status === 'rejected' ? 'text-rose-500' : 'text-[#0a5893] dark:text-blue-400'}>
                    {item.statusText}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
                  <div 
                    className={`h-full ${item.currentStep === 4 ? 'bg-emerald-500' : item.status === 'rejected' ? 'bg-rose-500' : 'bg-[#0a5893] dark:bg-blue-500'} transition-all duration-500`} 
                    style={{ width: `${(item.currentStep / 4) * 100}%` }}
                  ></div>
                </div>
                <button 
                  onClick={() => setSelectedTracking(item)}
                  className="w-full py-2 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <MapPin size={16}/> Lihat Timeline
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Timeline Modal */}
      {selectedTracking && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedTracking(null)}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
              
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md rounded-t-2xl shrink-0">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100">Detail Tracking</h3>
                  <p className="text-xs text-[#0a5893] dark:text-blue-400 font-mono mt-0.5">{selectedTracking.idStr}</p>
                </div>
                <button 
                  onClick={() => setSelectedTracking(null)} 
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20}/>
                </button>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
                {selectedTracking.status === 'rejected' ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                     <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                       <X size={32} />
                     </div>
                     <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Pengajuan Ditolak</h3>
                     <p className="text-sm text-slate-500 mt-2">Dokumen tidak memenuhi persyaratan. Silakan hubungi admin desa untuk detail lebih lanjut.</p>
                  </div>
                ) : (
                  <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                    {[
                      { step: 1, title: 'Pengajuan Diterima', desc: 'Warga telah mengirimkan pengajuan.', icon: FileText },
                      { step: 2, title: 'Verifikasi Admin', desc: 'Admin memverifikasi kelengkapan berkas.', icon: UserCheck },
                      { step: 3, title: 'Penandatanganan TTE', desc: 'Proses TTE oleh Camat.', icon: PenTool },
                      { step: 4, title: 'Selesai & Dikirim', desc: 'Dokumen dikirim ke dasbor warga.', icon: CheckCircle }
                    ].map((s, idx) => {
                      const isCompleted = selectedTracking.currentStep > s.step || selectedTracking.currentStep === 4;
                      const isCurrent = selectedTracking.currentStep === s.step && selectedTracking.currentStep !== 4;
                      const Icon = s.icon;
                      
                      return (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 border-white dark:border-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2
                            ${isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-[#0a5893] text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                            <Icon size={16} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-bold text-xs sm:text-sm ${isCurrent ? 'text-[#0a5893] dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>{s.title}</h4>
                            </div>
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        </>
      )}
    </AnimatedPage>
  );
};

export default LacakSurat;
