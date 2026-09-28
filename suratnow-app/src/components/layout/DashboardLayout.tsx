import { useState, useEffect, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Home, 
  FileEdit, 
  FileText,
  Clock, 
  History,
  Printer,
  HelpCircle,
  Building2,
  MapPin,
  Mail,
  Moon,
  Sun,
  Menu,
  User,
  Users,
  Settings,
  LogOut,
  Activity,
} from "lucide-react";
import { cn } from "../../lib/utils";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const userInitials = getInitials(user?.name);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  let navItems = [];

  if (role === 'superadmin') {
    navItems = [
      { icon: Home, label: "Beranda", path: "/superadmin" },
      { icon: MapPin, label: "Lacak Surat", path: "/superadmin/lacak-surat" },
      { icon: History, label: "Riwayat Surat", path: "/superadmin/riwayat" },
      { icon: Printer, label: "Cetak Surat", path: "/superadmin/cetak" },
      { icon: Activity, label: "Monitoring Surat", path: "/superadmin/monitoring" },
      { icon: Users, label: "Manajemen Pengguna", path: "/superadmin/pengguna" },
      { icon: HelpCircle, label: "Bantuan", path: "/superadmin/bantuan" }
    ];
  } else if (role === 'admin') {
    navItems = [
      { icon: Home, label: "Beranda", path: "/admin" },
      { icon: FileText, label: "Ajukan Surat", path: "/admin/ajukan" },
      { icon: Clock, label: "Status Pengajuan", path: "/admin/status" },
      { icon: History, label: "Riwayat Surat", path: "/admin/history" },
      { icon: Printer, label: "Cetak Surat", path: "/admin/print" },
      { icon: HelpCircle, label: "Bantuan", path: "/admin/help" }
    ];
  } else {
    navItems = [
      { icon: Home, label: "Beranda", path: "/user" },
      { icon: FileEdit, label: "Ajukan Surat", path: "/user/request" },
      { icon: Clock, label: "Status Pengajuan", path: "/user/status" },
      { icon: History, label: "Riwayat Surat", path: "/user/history" },
      { icon: Printer, label: "Cetak Surat", path: "/user/print" },
      { icon: HelpCircle, label: "Bantuan", path: "/user/help" }
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col h-screen sticky top-0">
        
        <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-[#0a5893] text-white" 
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                )
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700/50">
          <div className="bg-[#0a5893] text-white rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 font-semibold text-sm mb-2">
              <Building2 size={16} />
              <span>Kec. Suruh</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100 mb-1.5">
              <MapPin size={14} />
              <span>Trenggalek, Jawa Timur</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-100">
              <Mail size={14} />
              <span>suruhtrenggalek@gmail.com</span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm shrink-0">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || "No Email"}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0 px-4 md:px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0a5893] rounded-lg flex items-center justify-center text-white">
                <Building2 size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">Kantor Kecamatan Suruh</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sistem Pelayanan Digital</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isDarkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-[#0a5893] text-white flex items-center justify-center font-semibold text-sm focus:outline-none hover:bg-[#08487a] transition-colors"
              >
                {userInitials}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700/50 py-1 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <p className="text-[15px] font-medium text-slate-800 dark:text-slate-100">{user?.name || "User"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user?.email || "Email belum tersedia"}</p>
                  </div>
                  
                  <div className="py-1">
                    <button onClick={() => navigate(role === 'superadmin' ? '/superadmin/profile' : '/profile')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left">
                      <User size={18} className="text-slate-400" />
                      Profil
                    </button>
                    <button onClick={() => navigate(role === 'superadmin' ? '/superadmin/settings' : '/settings')} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left">
                      <Settings size={18} className="text-slate-400" />
                      Pengaturan
                    </button>
                  </div>
                  
                  <div className="py-1 border-t border-slate-100 dark:border-slate-700/50">
                    <button 
                      onClick={signOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900 transition-colors text-left"
                    >
                      <LogOut size={18} className="text-slate-400" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
