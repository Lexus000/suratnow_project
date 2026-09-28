import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { CheckSquare } from "lucide-react";

export function PetugasDashboard() {
  return (
    <DashboardLayout>
      <AnimatedPage>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Dasbor Petugas</h2>
          <p className="text-slate-500">Tinjau dan proses permohonan surat warga.</p>
        </div>
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <CheckSquare size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada permohonan</h3>
          <p className="text-slate-500 max-w-md">
            Saat ini tidak ada permohonan surat yang perlu diproses. Silakan kembali lagi nanti.
          </p>
        </div>
      </AnimatedPage>
    </DashboardLayout>
  );
}
