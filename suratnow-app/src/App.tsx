import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import MonitoringSurat from "./pages/admin/MonitoringSurat";
import { StatusPengajuan } from "./pages/admin/StatusPengajuan";
import { History } from "./pages/admin/History";
import { CetakSurat } from "./pages/admin/CetakSurat";
import { Bantuan } from "./pages/admin/Bantuan";
import AdminAjukanSurat from './pages/admin/AjukanSurat';
import { AjukanSurat } from "./pages/user/AjukanSurat";
import { UserStatusPengajuan } from "./pages/user/StatusPengajuan";
import { RiwayatSurat as UserRiwayatSurat } from "./pages/user/RiwayatSurat";
import { CetakSurat as UserCetakSurat } from "./pages/user/CetakSurat";
import { Bantuan as UserBantuan } from "./pages/user/Bantuan";
import { PetugasDashboard } from "./pages/petugas/PetugasDashboard";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { UserSettings } from "./pages/user/Settings";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import SuperAdminLacakSurat from "./pages/superadmin/LacakSurat";
import SuperAdminRiwayatSurat from "./pages/superadmin/RiwayatSurat";
import SuperAdminCetakSurat from "./pages/superadmin/CetakSurat";
import SuperAdminMonitoringSurat from "./pages/superadmin/MonitoringSurat";
import SuperAdminManajemenPengguna from "./pages/superadmin/ManajemenPengguna";
import SuperAdminBantuan from "./pages/superadmin/Bantuan";
import SuperAdminProfile from "./pages/superadmin/Profile";
import SuperAdminSettings from "./pages/superadmin/Settings";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { FloatingAiChatbot } from "./components/FloatingAiChatbot";

// Root redirector
function RootRedirect() {
  const { user, role, isLoading } = useAuth();
  
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  
  if (role === 'superadmin') return <Navigate to="/superadmin" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'petugas') return <Navigate to="/petugas" replace />;
  return <Navigate to="/user" replace />;
}

function SuperAdminLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<RootRedirect />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Super Admin Routes */}
          <Route element={<SuperAdminLayout />}>
            <Route path="/superadmin" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/lacak-surat" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminLacakSurat />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/riwayat" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminRiwayatSurat />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/cetak" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminCetakSurat />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/monitoring" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminMonitoringSurat />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/pengguna" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminManajemenPengguna />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/bantuan" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminBantuan />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/profile" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminProfile />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/settings" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminSettings />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <UserManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/monitoring" element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <MonitoringSurat />
            </ProtectedRoute>
          } />

          <Route path="/admin/status" element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <StatusPengajuan />
            </ProtectedRoute>
          } />

          <Route path="/admin/history" element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <History />
            </ProtectedRoute>
          } />

          <Route path="/admin/ajukan" element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <AdminAjukanSurat />
            </ProtectedRoute>
          } />

          <Route path="/admin/print" element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <CetakSurat />
            </ProtectedRoute>
          } />

          <Route path="/admin/help" element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
              <Bantuan />
            </ProtectedRoute>
          } />
          
          <Route path="/petugas" element={
            <ProtectedRoute allowedRoles={['petugas']}>
              <PetugasDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={['user']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/user/request" element={
            <ProtectedRoute allowedRoles={['user']}>
              <AjukanSurat />
            </ProtectedRoute>
          } />

          <Route path="/user/status" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserStatusPengajuan />
            </ProtectedRoute>
          } />

          <Route path="/user/history" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserRiwayatSurat />
            </ProtectedRoute>
          } />

          <Route path="/user/print" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserCetakSurat />
            </ProtectedRoute>
          } />

          <Route path="/user/help" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserBantuan />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          } />
        </Routes>
        <FloatingAiChatbot />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
