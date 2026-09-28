import { DashboardLayout } from "../components/layout/DashboardLayout";

import { 
  FileText, Clock, CheckCircle2, XCircle, 
  Calendar, Target, Printer, ArrowRight, TrendingUp 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../lib/api";
import { openLetterPdf } from "../lib/printLetter";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        const [statsResponse, requestsResponse] = await Promise.all([
          api.get('/user/stats'),
          api.get('/my-requests'),
        ]);

        if (!mounted) return;
        setStats(statsResponse.data);
        setRecentRequests(requestsResponse.data.slice(0, 3));
      } catch (error) {
        console.error('Gagal memuat dashboard user', error);
      }
    };

    fetchDashboard();
    const intervalId = window.setInterval(fetchDashboard, 5000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const handlePrint = async (letterId: number) => {
    try {
      await openLetterPdf(letterId);
    } catch {
      window.alert('Surat belum tersedia atau sesi Anda sudah berakhir.');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        
        {/* Welcome Banner */}
        <div className="bg-[#0a5893] rounded-2xl p-6 md:p-8 text-white shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user?.name || 'Warga'}!</h2>
          <p className="text-blue-100/90 text-sm md:text-base">Kelola pengajuan surat Anda dengan mudah melalui sistem digital kecamatan.</p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Pengajuan</span>
              <FileText size={18} className="text-slate-400" />
            </div>
            <div className="mt-auto">
              <h3 data-testid="user-stat-total" className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{stats.total}</h3>
              <p className="text-xs text-slate-400">Total semua pengajuan</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Menunggu Persetujuan</span>
              <Clock size={18} className="text-amber-500" />
            </div>
            <div className="mt-auto">
              <h3 data-testid="user-stat-pending" className="text-3xl font-bold text-amber-500 mb-1">{stats.pending}</h3>
              <p className="text-xs text-slate-400">Sedang diproses</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Disetujui</span>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
            <div className="mt-auto">
              <h3 data-testid="user-stat-approved" className="text-3xl font-bold text-emerald-500 mb-1">{stats.approved}</h3>
              <p className="text-xs text-slate-400">Siap untuk dicetak</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Ditolak</span>
              <XCircle size={18} className="text-rose-500" />
            </div>
            <div className="mt-auto">
              <h3 data-testid="user-stat-rejected" className="text-3xl font-bold text-rose-500 mb-1">{stats.rejected}</h3>
              <p className="text-xs text-slate-400">Perlu diperbaiki</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Progress & Terbaru */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Progress Pengajuan */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={20} className="text-slate-700 dark:text-slate-200" />
              <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-lg">Progress Pengajuan</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Tingkat persetujuan pengajuan surat Anda</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700 dark:text-slate-200">Tingkat Persetujuan</span>
                  <span className="text-slate-800 dark:text-slate-100">{stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div className="bg-[#0a5893] h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700 dark:text-slate-200">Sedang Diproses</span>
                  <span className="text-slate-800 dark:text-slate-100">{stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div className="bg-[#0a5893]/20 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pengajuan Terbaru */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 font-semibold text-lg text-slate-800 dark:text-slate-100 mb-1">
                  <Calendar size={20} className="text-slate-700 dark:text-slate-200" />
                  Pengajuan Terbaru
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{recentRequests.length} pengajuan surat terbaru Anda</p>
              </div>
              <button onClick={() => navigate('/user/status')} className="text-sm font-medium text-[#0a5893] flex items-center gap-1 hover:underline mt-1 cursor-pointer hover:text-[#08487a] transition-colors">
                Lihat Semua <ArrowRight size={16} />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {recentRequests.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">Belum ada pengajuan surat.</p>
              ) : recentRequests.map((request) => {
                const isApproved = request.status === 'approved';
                const statusLabel = isApproved ? 'Disetujui' : request.status === 'rejected' ? 'Ditolak' : request.status === 'returned' ? 'Perlu Perbaikan' : 'Menunggu';
                const statusClass = isApproved
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : request.status === 'rejected'
                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100';

                return (
                  <div key={request.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-emerald-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100">{request.letter_type?.name || 'Surat'}</h4>
                        <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded border ${statusClass}`}>{statusLabel}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">REQ-{request.id}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{request.data?.tujuan_penggunaan || request.data?.tujuan || 'Pengajuan surat'}</p>
                    <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 dark:text-slate-400 mb-5">
                      <div className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {new Date(request.created_at).toLocaleDateString('id-ID')}</div>
                      <div className="flex items-center gap-1.5"><Target size={14} className="text-slate-400" /> Status {statusLabel}</div>
                    </div>
                    {isApproved && (
                      <button
                        onClick={() => void handlePrint(request.id)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-600 bg-white dark:bg-slate-800 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors"
                      >
                        <Printer size={14} /> Cetak Surat
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Aksi Cepat (Full Width Row) */}
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm w-full">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 mb-1">Aksi Cepat</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Tindakan yang sering dilakukan</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button 
              onClick={() => navigate('/user/request')}
              className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl text-left hover:border-[#0a5893]/50 hover:shadow-md transition-all group flex flex-col min-h-[140px]"
            >
              <FileText size={22} className="text-[#0a5893] mb-4" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5 text-sm">Ajukan Surat Baru</h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Buat pengajuan surat keterangan baru</p>
              <div className="mt-auto text-[#0a5893] flex justify-end">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/user/status')}
              className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl text-left hover:border-[#0a5893]/50 hover:shadow-md transition-all group flex flex-col min-h-[140px] cursor-pointer"
            >
              <Clock size={22} className="text-[#0a5893] mb-4" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5 text-sm">Cek Status</h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Pantau progress pengajuan Anda</p>
              <div className="mt-auto text-[#0a5893] flex justify-end">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button 
              onClick={() => navigate('/user/print')}
              className="p-5 border border-slate-200 dark:border-slate-700 rounded-2xl text-left hover:border-[#0a5893]/50 hover:shadow-md transition-all group flex flex-col min-h-[140px] cursor-pointer"
            >
              <Printer size={22} className="text-[#0a5893] mb-4" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5 text-sm">Cetak Surat</h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Download surat yang telah disetujui</p>
              <div className="mt-auto text-[#0a5893] flex justify-end">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
