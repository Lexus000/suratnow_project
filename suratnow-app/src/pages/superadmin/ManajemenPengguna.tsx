import React, { useState, useEffect } from 'react';
import { LogIn, Users, Search, Mail, Phone, User, Shield, AlertCircle, Calendar, MoreHorizontal, Info, Key, Eye, UserX, X, UserPlus, UserCog, CheckCircle, PenTool, Trash2 } from 'lucide-react';
import { AnimatedPage } from "../../components/AnimatedPage";
import api from "../../lib/api";
import { isDemoMode } from "../../lib/runtimeMode";

export default function ManajemenPengguna() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua Role');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [newUser, setNewUser] = useState({
    name: '', nik: '', email: '', phone: '', role: 'admin'
  });
  
  const [editUser, setEditUser] = useState({
    id: 0, name: '', nik: '', email: '', phone: '', role: 'admin'
  });

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/superadmin/users');
      setData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
    };

    if (activeMenuId !== null) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenuId]);

  const filteredUsers = data.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (u.nik && u.nik.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'Semua Role' || u.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/superadmin/users', newUser);
      setIsAddModalOpen(false);
      setNewUser({ name: '', nik: '', email: '', phone: '', role: 'admin' });
      alert(response.data.message || 'Pengguna baru berhasil ditambahkan. Tautan pengaturan password dikirim ke email pengguna.');
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Gagal menambahkan pengguna');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/superadmin/users/${editUser.id}`, {
        name: editUser.name,
        nik: editUser.nik,
        email: editUser.email,
        phone: editUser.phone
      });
      setIsEditModalOpen(false);
      alert('Data pengguna berhasil diperbarui!');
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Gagal memperbarui pengguna');
    }
  };

  const handleToggleRole = async (id: number, newRole: string) => {
    if (window.confirm(`Apakah Anda yakin ingin mengubah role pengguna ini menjadi ${newRole}?`)) {
      try {
        await api.patch(`/superadmin/users/${id}/role`, { role: newRole });
        setActiveMenuId(null);
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert('Gagal mengubah role');
      }
    }
  };

  const handleResetPassword = async (id: number, name: string) => {
    if (window.confirm(`Reset password pengguna ${name}? Password sementara baru akan dibuat oleh server.`)) {
      try {
        const response = await api.post(`/superadmin/users/${id}/reset-password`);
        setActiveMenuId(null);
        alert(response.data.message || 'Tautan pengaturan password dikirim ke email pengguna.');
      } catch (error) {
        console.error(error);
        alert('Gagal mereset password');
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean, name: string) => {
    const action = currentStatus ? 'menonaktifkan' : 'mengaktifkan';
    if (window.confirm(`Apakah Anda yakin ingin ${action} akun ${name}?`)) {
      try {
        await api.patch(`/superadmin/users/${id}/status`);
        setActiveMenuId(null);
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert(`Gagal ${action} pengguna`);
      }
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Nonaktifkan akun ${name}? Riwayat pengajuan akan tetap dipertahankan.`)) {
      try {
        await api.delete(`/superadmin/users/${id}`);
        setActiveMenuId(null);
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert('Gagal menonaktifkan pengguna');
      }
    }
  };

  return (
    <AnimatedPage className="p-6 md:p-8 min-h-screen">


      {/* Page Header & Global Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manajemen Pengguna</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola akun pengguna, reset password, dan monitor aktivitas</p>
        </div>
        <button data-testid="user-management-demo" disabled={!isDemoMode} title={isDemoMode ? 'Buka sandbox demo' : 'Sandbox demo nonaktif pada mode produksi'} className="bg-[#2563eb] text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm">
          <LogIn size={18} />
          Lihat sebagai Demo User
        </button>
      </div>

      {/* Card Wrapper & Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Card Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h2 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
            <Users size={18} className="text-slate-600 dark:text-slate-400" /> Data Pengguna
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Total {filteredUsers.length} pengguna terdaftar
          </p>
        </div>

        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex gap-4 items-center w-full flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama, email, atau NIK..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-800 dark:text-slate-100 transition-shadow" 
              />
            </div>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#2563eb] text-slate-800 dark:text-slate-100 cursor-pointer shadow-sm"
            >
              <option value="Semua Role">Semua Role</option>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Superadmin">Superadmin</option>
            </select>
            <button data-testid="user-management-add"
              onClick={() => setIsAddModalOpen(true)}
              className="ml-auto flex items-center justify-center gap-2 bg-[#0a5893] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg font-medium transition-colors w-full sm:w-auto shrink-0"
            >
              <UserPlus size={18}/>
              <span className="hidden sm:inline">Tambah Pengguna</span>
            </button>
          </div>
        </div>

        {/* Responsive Table Without Horizontal Overflow */}
        <div className="w-full min-h-[420px] pb-56">
          <table className="w-full table-auto text-left text-sm whitespace-normal break-words border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-5 font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">Informasi Pengguna</th>
                <th className="py-4 px-5 font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">Role</th>
                <th className="py-4 px-5 font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">Status Keamanan</th>
                <th className="py-4 px-5 font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">Terdaftar</th>
                <th className="py-4 px-5 font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 w-16">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">Memuat data pengguna...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">Pengguna tidak ditemukan.</td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const isBottomRow = index >= filteredUsers.length - 2;
                  
                  return (
                  <tr data-testid={`user-row-${user.id}`} key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Informasi Pengguna (Consolidated) */}
                    <td className="py-4 px-5 border-b border-slate-100 dark:border-slate-800 align-middle">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-[#0a5893] text-[13px] shrink-0 shadow-sm mt-1">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col gap-1 w-full min-w-[200px]">
                          {/* Nama Lengkap */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">{user.name}</span>
                            {user.role === 'superadmin' && (
                              <span className="flex items-center gap-1 border border-amber-200 text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium">
                                <Shield size={12} /> Root
                              </span>
                            )}
                          </div>
                          
                          {/* NIK / ID */}
                          <span className="text-xs text-gray-500 font-mono block">NIK: {user.nik || `ID-${user.id}`}</span>
                          
                          {/* Email & No WA */}
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                              <Mail size={13} className="shrink-0 text-slate-400" /> {user.email}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                              <Phone size={13} className="shrink-0 text-slate-400" /> {user.phone || '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-5 border-b border-slate-100 dark:border-slate-800 align-middle">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0a5893] text-white text-[12px] font-medium shadow-sm">
                          <Shield size={12} /> Admin
                        </span>
                      ) : user.role === 'superadmin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-white text-[12px] font-medium shadow-sm">
                          <Shield size={12} /> Superadmin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[12px] font-medium border border-slate-200 dark:border-slate-700">
                          <User size={12} /> User
                        </span>
                      )}
                    </td>

                    {/* Status Keamanan */}
                    <td className="py-4 px-5 border-b border-slate-100 dark:border-slate-800 align-middle">
                      {user.is_active !== false && user.is_active !== 0 ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[13px]">
                          <CheckCircle size={14} /> Aktif
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium text-[13px]">
                          <AlertCircle size={14} /> Nonaktif
                        </span>
                      )}
                    </td>

                    {/* Terdaftar */}
                    <td className="py-4 px-5 border-b border-slate-100 dark:border-slate-800 align-middle">
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[13px] font-medium whitespace-nowrap">
                        <Calendar size={14} /> {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 border-b border-slate-100 dark:border-slate-800 align-middle text-right">
                      <div className="relative inline-block text-left">
                         <button data-testid={`user-actions-${user.id}`} aria-label={`Aksi pengguna ${user.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === user.id ? null : user.id);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors relative z-50"
                        >
                          <MoreHorizontal size={18} className="text-slate-400 dark:text-slate-500" />
                        </button>
                        
                        {activeMenuId === user.id && (
                          <div className={`absolute right-0 ${isBottomRow ? 'bottom-full mb-1 origin-bottom-right' : 'top-full mt-1 origin-top-right'} w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200`}>
                            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">Aksi</div>
                            
                            {/* 1. Lihat Detail */}
                             <button data-testid={`user-detail-${user.id}`}
                              onClick={() => { setSelectedUser(user); setIsDetailModalOpen(true); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left whitespace-nowrap"
                            >
                              <Eye size={16} className="text-slate-400 dark:text-slate-500" /> Lihat Detail
                            </button>

                            {/* 2. Edit Pengguna */}
                             <button data-testid={`user-edit-${user.id}`}
                              onClick={() => { setEditUser(user); setIsEditModalOpen(true); setActiveMenuId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left whitespace-nowrap"
                            >
                              <PenTool size={16} className="text-slate-400 dark:text-slate-500" /> Edit Pengguna
                            </button>
                            
                            {/* 3. Reset Password */}
                             <button data-testid={`user-reset-${user.id}`}
                              onClick={() => handleResetPassword(user.id, user.name)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left whitespace-nowrap"
                            >
                              <Key size={16} className="text-slate-400 dark:text-slate-500" /> Reset Password
                            </button>
                            
                            {/* 4. Ubah Role (Jadikan Admin & Jadikan Superadmin) */}
                            {user.role !== 'admin' && user.role !== 'superadmin' && (
                               <button data-testid={`user-role-admin-${user.id}`}
                                onClick={() => handleToggleRole(user.id, 'admin')}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#0a5893] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium text-left whitespace-nowrap"
                              >
                                <UserCog size={16} /> Jadikan Admin
                              </button>
                            )}
                            {user.role === 'admin' && (
                              <button
                                onClick={() => handleToggleRole(user.id, 'user')}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left whitespace-nowrap"
                              >
                                <User size={16} className="text-slate-400 dark:text-slate-500" /> Jadikan User
                              </button>
                            )}
                            {user.role !== 'superadmin' && (
                             <button
                                onClick={() => handleToggleRole(user.id, 'superadmin')}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors font-medium text-left whitespace-nowrap"
                              >
                                <Shield size={16} /> Jadikan Superadmin
                              </button>
                            )}
                            
                            {/* 5. Nonaktifkan Akun */}
                            <button data-testid={`user-status-toggle-${user.id}`}
                              onClick={() => handleToggleStatus(user.id, user.is_active !== false && user.is_active !== 0, user.name)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left mt-1 border-t border-slate-100 dark:border-slate-700 whitespace-nowrap"
                            >
                              {user.is_active !== false && user.is_active !== 0 ? (
                                <><UserX size={16} className="text-slate-400 dark:text-slate-500" /> Nonaktifkan Akun</>
                              ) : (
                                <><CheckCircle size={16} className="text-emerald-500" /> Aktifkan Akun</>
                              )}
                            </button>

                            {/* 6. Hapus Akun */}
                            <button 
                              onClick={() => handleDelete(user.id, user.name)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-left whitespace-nowrap"
                            >
                              <Trash2 size={16} /> Hapus Akun
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal Placeholder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <UserPlus size={18} className="text-[#0a5893]" /> Tambah Pengguna Baru
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form data-testid="user-management-form" onSubmit={handleAddUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                   <input data-testid="user-management-name" type="text" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Contoh: Budi Santoso" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                   <input data-testid="user-management-email" type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="budi@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                   <select data-testid="user-management-role" required value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                    <option value="user">User Warga</option>
                    <option value="admin">Admin Desa</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium">Batal</button>
                 <button data-testid="user-management-submit" type="submit" className="px-4 py-2 bg-[#0a5893] hover:bg-blue-800 text-white rounded-lg text-sm font-medium">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <PenTool size={18} className="text-[#0a5893]" /> Edit Pengguna
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form data-testid="user-management-edit-form" onSubmit={handleEditUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                   <input data-testid="user-management-edit-name" type="text" required value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">NIK</label>
                  <input type="text" value={editUser.nik || ''} onChange={e => setEditUser({...editUser, nik: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" required value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp</label>
                  <input type="text" value={editUser.phone || ''} onChange={e => setEditUser({...editUser, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div className="mt-6 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium">Batal</button>
                 <button data-testid="user-management-edit-submit" type="submit" className="px-4 py-2 bg-[#0a5893] hover:bg-blue-800 text-white rounded-lg text-sm font-medium">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail User Modal */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Info size={18} className="text-[#0a5893]" /> Detail Pengguna
              </h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold bg-[#0a5893] text-2xl shadow-md mb-3">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{selectedUser.name}</h4>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                    {selectedUser.role}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${selectedUser.is_active !== false && selectedUser.is_active !== 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                    {selectedUser.is_active !== false && selectedUser.is_active !== 0 ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">NIK</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{selectedUser.nik || '-'}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">No. WhatsApp</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{selectedUser.phone || '-'}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Terdaftar</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{new Date(selectedUser.created_at).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50 flex justify-between items-center">
                <div>
                  <h5 className="font-semibold text-blue-900 dark:text-blue-300 text-sm">Total Pengajuan Surat</h5>
                  <p className="text-xs text-blue-700/80 dark:text-blue-400/80 mt-0.5">Sepanjang waktu berjalan</p>
                </div>
                <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {selectedUser.letter_requests_count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
