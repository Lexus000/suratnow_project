import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { FileText, Clock, CheckCircle2, XCircle, Calendar, Target, Printer, ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import api from "../../lib/api";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { openLetterPdf } from "../../lib/printLetter";

export function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePrint = async (letterId: number) => {
    try {
      await openLetterPdf(letterId);
    } catch {
      window.alert('Surat belum tersedia atau sesi Anda sudah berakhir.');
    }
  };
  
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsResponse, requestsResponse] = await Promise.all([
          api.get('/user/stats'),
          api.get('/my-requests'),
        ]);
        setStats(statsResponse.data);
        setRecentRequests(requestsResponse.data.slice(0, 3));
      } catch (error) {
        console.error("Gagal memuat statistik", error);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <AnimatedPage className="space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-[#0a5893] rounded-xl p-6 md:p-8 text-white shadow-md">
          <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user?.name || 'Warga'}!</h2>
          <p className="text-blue-100">Kelola pengajuan surat Anda dengan mudah melalui sistem digital kecamatan.</p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-600">Total Pengajuan</span>
              <FileText size={18} className="text-slate-400" />
            </div>
            <div className="mt-auto">
              <h3 data-testid="user-stat-total" className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</h3>
              <p className="text-xs text-slate-500">Total semua pengajuan</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-600">Menunggu Persetujuan</span>
              <Clock size={18} className="text-amber-500" />
            </div>
            <div className="mt-auto">
              <h3 data-testid="user-stat-pending" className="text-3xl font-bold text-amber-500 mb-1">{stats.pending}</h3>
              <p className="text-xs text-slate-500">Sedang diproses</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-600">Disetujui</span>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
            <div className="mt-auto">
              <h3 data-testid="user-stat-approved" className="text-3xl font-bold text-emerald-500 mb-1">{stats.approved}</h3>
              <p className="text-xs text-slate-500">Siap untuk dicetak</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-600">Ditolak</span>
              <XCircle size={18} className="text-rose-500" />
            </div>
            <div className="mt-auto">
              <h3 data-testid="user-stat-rejected" className="text-3xl font-bold text-rose-500 mb-1">{stats.rejected}</h3>
              <p className="text-xs text-slate-500">Perlu diperbaiki</p>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Pengajuan */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-slate-700 font-semibold text-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-slate-600" />
                Progress Pengajuan
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-8">Tingkat persetujuan pengajuan surat Anda</p>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700">Tingkat Persetujuan</span>
                  <span className="text-slate-800">{stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-[#0a5893] h-2 rounded-full" style={{ width: `${stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700">Sedang Diproses</span>
                  <span className="text-slate-800">{stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-300 h-2 rounded-full" style={{ width: `${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pengajuan Terbaru */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 font-semibold text-lg text-slate-800 mb-1">
                  <Calendar size={20} className="text-slate-600" />
                  Pengajuan Terbaru
                </div>
                <p className="text-sm text-slate-500">3 pengajuan surat terbaru Anda</p>
              </div>
              <button onClick={() => navigate('/user/status')} className="text-sm font-medium text-[#0a5893] flex items-center gap-1 hover:underline">
                Lihat Semua <ArrowRight size={16} />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              {recentRequests.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">Belum ada pengajuan surat.</p>
              ) : recentRequests.map((request) => {
                const isApproved = request.status === 'approved';
                const statusLabel = isApproved ? 'Disetujui' : request.status === 'rejected' ? 'Ditolak' : request.status === 'returned' ? 'Perlu Perbaikan' : 'Menunggu';
                return (
                  <div key={request.id} className="border border-slate-100 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800">{request.letter_type?.name || 'Surat'}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${isApproved ? 'bg-emerald-100 text-emerald-700' : request.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{statusLabel}</span>
                      </div>
                      <span className="text-xs text-slate-400">REQ-{request.id}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{request.data?.tujuan_penggunaan || request.data?.tujuan || 'Pengajuan surat'}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4">
                      <div className="flex items-center gap-1"><Calendar size={14} className="text-indigo-400" /> {new Date(request.created_at).toLocaleDateString('id-ID')}</div>
                      <div className="flex items-center gap-1"><Target size={14} className="text-rose-400" /> Status {statusLabel}</div>
                    </div>
                    {isApproved && (
                      <button
                        onClick={() => void handlePrint(request.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-white border border-emerald-200 rounded-md hover:bg-emerald-50 transition-colors"
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

        {/* Bottom Section: Aksi Cepat */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-lg text-slate-800 mb-1">Aksi Cepat</h3>
          <p className="text-sm text-slate-500 mb-6">Tindakan yang sering dilakukan</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/user/request')}
              className="p-4 border border-slate-100 rounded-xl text-left hover:border-[#0a5893] hover:shadow-md transition-all group flex flex-col h-full"
            >
              <FileText size={20} className="text-[#0a5893] mb-3" />
              <h4 className="font-semibold text-slate-800 mb-1">Ajukan Surat Baru</h4>
              <p className="text-xs text-slate-500 mb-4">Buat pengajuan surat keterangan baru</p>
              <div className="mt-auto text-[#0a5893] flex justify-end">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <button className="p-4 border border-slate-100 rounded-xl text-left hover:border-[#0a5893] hover:shadow-md transition-all group flex flex-col h-full">
              <Clock size={20} className="text-[#0a5893] mb-3" />
              <h4 className="font-semibold text-slate-800 mb-1">Cek Status</h4>
              <p className="text-xs text-slate-500 mb-4">Pantau progress pengajuan Anda</p>
              <div className="mt-auto text-[#0a5893] flex justify-end">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button className="p-4 border border-slate-100 rounded-xl text-left hover:border-[#0a5893] hover:shadow-md transition-all group flex flex-col h-full">
              <Printer size={20} className="text-[#0a5893] mb-3" />
              <h4 className="font-semibold text-slate-800 mb-1">Cetak Surat</h4>
              <p className="text-xs text-slate-500 mb-4">Download surat yang telah disetujui</p>
              <div className="mt-auto text-[#0a5893] flex justify-end">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

      </AnimatedPage>
    </DashboardLayout>
  );
}
