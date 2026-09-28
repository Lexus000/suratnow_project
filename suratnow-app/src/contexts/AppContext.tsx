import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { isDemoMode } from '../lib/runtimeMode';

// --- TYPES ---
export type Surat = {
  id: string; type: string; applicantName: string; nik: string; phone: string; 
  status: 'Menunggu' | 'Verifikasi Admin' | 'Menunggu TTE Camat' | 'Disetujui' | 'Ditolak';
  purpose: string; date: string; attachments: number; rejectReason?: string;
};

export type User = {
  id: string; initials: string; name: string; isDemo: boolean; nik: string; 
  email: string; phone: string; role: string; pwdDays: number; pwdHash: string; registered: string;
};

type AppContextType = {
  suratList: Surat[];
  addSurat: (surat: Omit<Surat, 'id' | 'date'>) => void;
  updateSuratStatus: (id: string, newStatus: Surat['status'], reason?: string) => void;
  userList: User[];
  addUser: (user: Omit<User, 'id' | 'pwdDays' | 'pwdHash' | 'registered' | 'isDemo' | 'initials'>) => void;
  toggleUserRole: (id: string) => void;
};

// --- INITIAL MOCK DATA ---
const initialSurat: Surat[] = [
  { id: 'REQ-2026-001', type: 'Surat Keterangan Miskin (SKM)', applicantName: 'Siti Nurhalimah', nik: '3503054509940002', phone: '081234567890', status: 'Disetujui', purpose: 'Pengajuan beasiswa pendidikan tingkat Perguruan Tinggi', attachments: 2, date: '18 Jan 2026' },
  { id: 'REQ-2026-002', type: 'Surat Pergi Nikah', applicantName: 'Dewi Sartika', nik: '3503055005950001', phone: '083456789012', status: 'Menunggu TTE Camat', purpose: 'Persyaratan administrasi pernikahan di KUA', attachments: 3, date: '19 Jan 2026' },
  { id: 'REQ-2026-003', type: 'Surat Keterangan Usaha', applicantName: 'Budi Santoso', nik: '3503051122334455', phone: '085612345678', status: 'Menunggu', purpose: 'Pengajuan KUR Bank Jatim', attachments: 1, date: '20 Jan 2026' }
];

const initialUsers: User[] = [
  { id: 'usr-1', initials: 'DU-BS', name: 'Demo User - Budi Santoso', isDemo: true, nik: '3503051111110001', email: 'budi.admin@suruh.go.id', phone: '081234567890', role: 'Admin', pwdDays: 911, pwdHash: 'hashed_demo123...', registered: '1 Jan 2024' },
  { id: 'usr-2', initials: 'AS', name: 'Ahmad Sudrajat', isDemo: false, nik: '3503052222220002', email: 'ahmad@suruh.go.id', phone: '081234567890', role: 'Admin', pwdDays: 897, pwdHash: 'hashed_pwd123...', registered: '15 Jan 2024' },
  { id: 'usr-3', initials: 'AK', name: 'Admin Kecamatan', isDemo: false, nik: 'admin', email: 'admin@kecamatan.go.id', phone: '021-12345678', role: 'Admin', pwdDays: 1276, pwdHash: 'hashed_admin...', registered: '1 Jan 2023' },
  { id: 'usr-4', initials: 'SN', name: 'Siti Nurhaliza', isDemo: false, nik: '3503053333330003', email: 'siti@suruh.go.id', phone: '081234567891', role: 'Admin', pwdDays: 892, pwdHash: 'hashed_siti123...', registered: '20 Jan 2024' },
  { id: 'usr-5', initials: 'RW', name: 'Rina Wati (Warga)', isDemo: false, nik: '3503059988770005', email: 'rina.warga@example.com', phone: '085677889900', role: 'User', pwdDays: 12, pwdHash: 'hashed_rina123...', registered: '05 Mar 2024' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Demo fixtures remain available for presentations, but production builds must
  // never fall back to browser-local mock data. The API is the source of truth.
  const [suratList, setSuratList] = useState<Surat[]>(() => {
    const saved = localStorage.getItem('suratData_db');
    if (!isDemoMode) return [];
    return saved ? JSON.parse(saved) : initialSurat;
  });

  const [userList, setUserList] = useState<User[]>(() => {
    const saved = localStorage.getItem('userData_db');
    if (!isDemoMode) return [];
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // Local storage is only a demo sandbox. Real data must stay in the backend.
  useEffect(() => {
    if (isDemoMode) localStorage.setItem('suratData_db', JSON.stringify(suratList));
  }, [suratList]);
  useEffect(() => {
    if (isDemoMode) localStorage.setItem('userData_db', JSON.stringify(userList));
  }, [userList]);

  // --- ACTIONS ---
  const addSurat = (newSuratData: Omit<Surat, 'id' | 'date'>) => {
    const newSurat: Surat = { ...newSuratData, id: `REQ-2026-00${suratList.length + 1}`, date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) };
    setSuratList(prev => [newSurat, ...prev]);
  };

  const updateSuratStatus = (id: string, newStatus: Surat['status'], reason?: string) => {
    setSuratList(prev => prev.map(s => s.id === id ? { ...s, status: newStatus, rejectReason: reason } : s));
  };

  const addUser = (userData: Omit<User, 'id' | 'pwdDays' | 'pwdHash' | 'registered' | 'isDemo' | 'initials'>) => {
    const initials = userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'UN';
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`, initials, isDemo: false, pwdDays: 0, pwdHash: 'hashed_new123...',
      registered: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setUserList(prev => [newUser, ...prev]);
  };

  const toggleUserRole = (id: string) => {
    setUserList(prev => prev.map(u => u.id === id ? { ...u, role: u.role === 'Admin' ? 'User' : 'Admin' } : u));
  };

  return (
    <AppContext.Provider value={{ suratList, addSurat, updateSuratStatus, userList, addUser, toggleUserRole }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
