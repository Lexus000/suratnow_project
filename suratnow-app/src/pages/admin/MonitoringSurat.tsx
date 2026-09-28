import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  ShieldAlert,
  Search,
  Filter
} from "lucide-react";
import api from "../../lib/api";

export default function MonitoringSurat() {
  const [monitoringData, setMonitoringData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'overdue', 'normal'

  useEffect(() => {
    let isMounted = true;

    const fetchMonitoring = async () => {
      try {
        const response = await api.get('/letter-requests');
        const now = Date.now();
        const activeRequests = response.data
          .filter((request: any) => ['pending', 'returned'].includes(request.status))
          .map((request: any) => {
            const elapsedHours = Math.max(0, Math.floor((now - new Date(request.created_at).getTime()) / (1000 * 60 * 60)));
            const days = Math.floor(elapsedHours / 24);
            const hours = elapsedHours % 24;

            return {
              id: `#surat-${request.id}`,
              userName: request.user?.name || request.data?.nama_pemohon || 'Pemohon',
              type: request.letter_type?.name || 'Jenis surat belum tersedia',
              waitTime: days > 0 ? `${days} Hari${hours > 0 ? ` ${hours} Jam` : ''}` : `${hours} Jam`,
              isOverdue: elapsedHours > 24,
            };
          });

        if (isMounted) setMonitoringData(activeRequests);
      } catch (error) {
        console.error('Gagal mengambil data monitoring surat:', error);
        if (isMounted) setMonitoringData([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMonitoring();
    const intervalId = setInterval(fetchMonitoring, 5000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const filteredData = monitoringData.filter(item => {
    const matchSearch = item.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchFilter = true;
    if (filter === 'overdue') matchFilter = item.isOverdue === true;
    if (filter === 'normal') matchFilter = item.isOverdue === false;
    
    return matchSearch && matchFilter;
  });

  const overdueCount = monitoringData.filter(item => item.isOverdue).length;

  return (
    <DashboardLayout>
      <AnimatedPage className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity size={24} className="text-[#0a5893]" />
              Monitoring Surat (SLA)
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Dasbor supervisi untuk memantau waktu tunggu (SLA) pengajuan yang belum diproses.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari pemohon..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
              />
            </div>
            <div className="relative">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50"
              >
                <option value="all">Semua Antrean</option>
                <option value="normal">Dalam SLA (&lt; 24 Jam)</option>
                <option value="overdue">Terlambat (&gt; 24 Jam)</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Antrean Aktif</p>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{monitoringData.length}</h4>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Melewati Batas SLA</p>
              <h4 className="text-2xl font-bold text-rose-600 dark:text-rose-400">{overdueCount}</h4>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-slate-500">Memuat data monitoring...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center px-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Tidak Ada Data</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Belum ada pengajuan surat yang tersendat.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">ID Berkas</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Pemohon</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Jenis Surat</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Waktu Tunggu</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status SLA</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-right">Tindakan Khusus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                        {item.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 dark:text-slate-100">{item.userName}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {item.type}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${item.isOverdue ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                          <Clock size={12} />
                          {item.waitTime}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.isOverdue ? (
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                            <AlertTriangle size={14} /> Terlambat (&gt; 24 Jam)
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            Normal (Sesuai SLA)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {item.isOverdue && (
                          <button 
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm focus:ring-2 focus:ring-rose-500/50"
                            onClick={() => alert(`Peringatan tingkat lanjut (Eskalasi) telah dikirim untuk antrean ${item.id}!`)}
                          >
                            <ShieldAlert size={14} /> Tegur Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
}
