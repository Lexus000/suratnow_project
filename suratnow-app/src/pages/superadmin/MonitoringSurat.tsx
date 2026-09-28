import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Clock, CheckCircle, Search, Filter, RefreshCw } from 'lucide-react';
import { AnimatedPage } from "../../components/AnimatedPage";
import api from "../../lib/api";

export default function MonitoringSurat() {
  const [searchQuery, setSearchQuery] = useState('');
  const [warnedIds, setWarnedIds] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // SLA Stats States
  const [avgProcessTimeStr, setAvgProcessTimeStr] = useState("0 Jam");
  const [slaPercentage, setSlaPercentage] = useState(100);
  const [delayedDocs, setDelayedDocs] = useState<any[]>([]);

  // Auto-polling mechanism (Live Sync)
  useEffect(() => {
    const fetchSlaData = async () => {
      try {
        const response = await api.get('/letter-requests');
        const allRequests = response.data;
        
        setData(allRequests);
        
        // Calculate SLA Metrics dynamically
        const targetMs = 2 * 24 * 60 * 60 * 1000; // 2 Days in ms
        let totalCompletedTime = 0;
        let completedCount = 0;
        let metSlaCount = 0;
        let totalProcessed = 0;
        
        const lateDocs: any[] = [];

        allRequests.forEach((req: any) => {
          const createdTime = new Date(req.created_at).getTime();
          
          if (req.status === 'approved' || req.status === 'rejected') {
            const updatedTime = new Date(req.updated_at).getTime();
            const durationMs = updatedTime - createdTime;
            
            totalCompletedTime += durationMs;
            completedCount++;
            totalProcessed++;
            
            if (durationMs <= targetMs) {
              metSlaCount++;
            } else {
              // Completed but late
              const delayDays = Math.floor((durationMs - targetMs) / (1000 * 60 * 60 * 24));
              const delayHours = Math.floor(((durationMs - targetMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              lateDocs.push({
                ...req,
                idStr: `#surat-${req.id}`,
                pic: req.status === 'approved' ? 'Camat (Selesai)' : 'Admin (Selesai)',
                delay: delayDays > 0 ? `${delayDays} Hari` : `${delayHours} Jam`,
                statusLevel: delayDays > 1 ? 'Kritis' : 'Waspada'
              });
            }
          } else {
            // Still pending/verifying
            const currentTime = new Date().getTime();
            const durationMs = currentTime - createdTime;
            
            if (durationMs > targetMs) {
              totalProcessed++; // Only count pending docs against SLA if they are already late
              const delayDays = Math.floor((durationMs - targetMs) / (1000 * 60 * 60 * 24));
              const delayHours = Math.floor(((durationMs - targetMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              lateDocs.push({
                ...req,
                idStr: `#surat-${req.id}`,
                pic: req.status === 'pending' ? 'Admin Desa' : 'Kasi Pelayanan',
                delay: delayDays > 0 ? `${delayDays} Hari` : `${delayHours} Jam`,
                statusLevel: delayDays > 1 ? 'Kritis' : 'Waspada'
              });
            } else {
              // Not late yet, count as met SLA for now
              totalProcessed++;
              metSlaCount++;
            }
          }
        });

        // 1. Calculate Average Process Time
        if (completedCount > 0) {
          const avgMs = totalCompletedTime / completedCount;
          const avgDays = Math.floor(avgMs / (1000 * 60 * 60 * 24));
          const avgHours = Math.floor((avgMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          if (avgDays > 0) {
            setAvgProcessTimeStr(`${avgDays} Hari ${avgHours} Jam`);
          } else {
            setAvgProcessTimeStr(`${avgHours} Jam`);
          }
        }

        // 2. Calculate SLA Percentage
        if (totalProcessed > 0) {
          setSlaPercentage(Math.round((metSlaCount / totalProcessed) * 100));
        }

        // 3. Set Delayed Docs
        setDelayedDocs(lateDocs);

      } catch (error) {
        console.error("Gagal mengambil data SLA:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlaData(); // Initial fetch
    
    const intervalId = setInterval(fetchSlaData, 5000); // Poll every 5s
    return () => clearInterval(intervalId); // Cleanup
  }, []);

  const handleWarn = (id: string, petugas: string) => {
    alert(`Notifikasi peringatan berhasil dikirim ke petugas: ${petugas}`);
    setWarnedIds((prev) => [...prev, id]);
  };

  const filteredDocs = delayedDocs.filter(doc => 
    doc.idStr?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.letter_type?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatedPage className="p-6 md:p-8 min-h-screen space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Monitoring SLA & Performa (Live)
            {isLoading && data.length === 0 && <RefreshCw size={16} className="animate-spin text-slate-400" />}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pantau durasi layanan dan target Service Level Agreement operasional secara dinamis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Rata-rata Waktu Proses</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Clock size={20} className="text-[#0a5893] dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{avgProcessTimeStr}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Sesuai target standar (Maks. 2 Hari)</p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Memenuhi Target SLA</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
              <CheckCircle size={20} className="text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <h3 className={`text-2xl font-bold ${slaPercentage < 75 ? 'text-amber-500' : 'text-slate-800 dark:text-slate-100'}`}>
            {slaPercentage}%
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <Activity size={14}/> Diupdate secara real-time
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Melewati Batas SLA</span>
            <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-lg">
              <AlertTriangle size={20} className="text-rose-500 dark:text-rose-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-rose-500 dark:text-rose-400">{delayedDocs.length} Surat</h3>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium">Perlu tindakan peringatan segera</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[300px]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Dokumen Melewati Batas SLA (Kritis)</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daftar pengajuan yang terlambat dari target penyelesaian (2 Hari).</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari ID Surat atau Jenis..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-[#0a5893] text-slate-800 dark:text-slate-100" 
              />
            </div>
            <button className="p-2 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        {delayedDocs.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-emerald-500" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">SLA Terkendali Sempurna</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tidak ada dokumen yang melewati batas SLA saat ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-semibold whitespace-nowrap">ID Pengajuan</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Jenis Surat</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Posisi Terakhir</th>
                  <th className="p-4 font-semibold whitespace-nowrap">Waktu Keterlambatan</th>
                  <th className="p-4 font-semibold whitespace-nowrap text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredDocs.map((req, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{req.idStr}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{req.letter_type?.name || 'Surat'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{req.pic}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-fit ${req.statusLevel === 'Kritis' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'}`}>
                        <AlertTriangle size={14}/> Telat {req.delay}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleWarn(req.idStr, req.pic)}
                        disabled={warnedIds.includes(req.idStr)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm ${
                          warnedIds.includes(req.idStr) 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50'
                        }`}
                      >
                        {warnedIds.includes(req.idStr) ? 'Terkirim' : 'Kirim Peringatan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
