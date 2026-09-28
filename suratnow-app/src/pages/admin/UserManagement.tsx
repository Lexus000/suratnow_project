import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AnimatedPage } from "../../components/AnimatedPage";
import { UserPlus, X, Search, MoreVertical, ShieldAlert, FileEdit, Trash2, Eye, EyeOff } from "lucide-react";
import api from "../../lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  nik: string | null;
  role: string;
  created_at: string;
  phone?: string | null;
}

type EditableUser = User & { password?: string };

export default function UserManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<EditableUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "" });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteAlertOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/superadmin/users/${userToDelete.id}`);
      setIsDeleteAlertOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Gagal menghapus pengguna", error);
      alert("Terjadi kesalahan saat menghapus pengguna.");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await api.put(`/superadmin/users/${editingUser.id}`, editingUser);
      setIsEditModalOpen(false);
      setEditingUser(null);
      setShowEditPassword(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user", error);
      alert("Gagal memperbarui pengguna.");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/superadmin/users", newUser);
      setIsAddModalOpen(false);
      setNewUser({ name: "", email: "", password: "", role: "" });
      setShowAddPassword(false);
      fetchUsers();
    } catch (error) {
        console.error("Error creating user", error);
        alert("Gagal menambahkan pengguna. Pastikan email belum terdaftar.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/superadmin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.nik && user.nik.includes(searchQuery))
  );

  return (
    <DashboardLayout>
      <AnimatedPage className="space-y-6 pb-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Manajemen Pengguna</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Kelola akses, peran, dan data pengguna sistem</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a5893] hover:bg-[#08487a] text-white rounded-lg shadow-sm font-medium transition-colors sm:w-auto"
          >
            <UserPlus size={18} />
            <span>Tambah Pengguna</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Cari nama, email, atau NIK..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select className="w-full sm:w-auto px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50">
              <option value="">Semua Peran</option>
              <option value="superadmin">Superadmin</option>
              <option value="admin">Admin</option>
              <option value="user">Warga/User</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
                  <th className="px-6 py-4">Nama & Email</th>
                  <th className="px-6 py-4">NIK</th>
                  <th className="px-6 py-4">Peran (Role)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      Memuat data pengguna...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                      Tidak ada pengguna ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{u.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{u.nik || "-"}</td>
                      <td className="px-6 py-4">
                        {u.role === 'superadmin' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            <ShieldAlert size={12} /> Superadmin
                          </span>
                        ) : u.role === 'admin' ? (
                          <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                            Warga
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Aktif
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button 
                          onClick={() => setOpenDropdownId(openDropdownId === u.id ? null : u.id)}
                          className="p-1 text-slate-400 hover:text-[#0a5893] transition-colors rounded focus:outline-none"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openDropdownId === u.id && (
                          <div className="absolute right-10 top-10 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700/50 z-50 overflow-hidden text-left">
                            <button 
                              onClick={() => { 
                                setEditingUser(u);
                                setIsEditModalOpen(true);
                                setOpenDropdownId(null); 
                              }}
                              className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                            >
                              <FileEdit size={14} className="text-slate-400" /> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(u)}
                              className="w-full px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2 transition-colors"
                            >
                              <Trash2 size={14} className="text-rose-500" /> Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>Menampilkan {filteredUsers.length} pengguna</span>
          </div>
        </div>

        {/* Modal: Tambah Pengguna */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Tambah Pengguna Baru</h3>
                <button 
                  onClick={() => { setIsAddModalOpen(false); setShowAddPassword(false); }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleAddSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Masukkan nama lengkap" 
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="nama@email.com" 
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showAddPassword ? "text" : "password"} 
                        required
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="••••••••" 
                        className="w-full px-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowAddPassword(!showAddPassword)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showAddPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Role / Peran <span className="text-rose-500">*</span>
                    </label>
                    <select 
                      required
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
                    >
                      <option value="" disabled>Pilih hak akses</option>
                      <option value="superadmin">Superadmin</option>
                      <option value="admin">Admin</option>
                      <option value="user">Warga / User</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 pt-2 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                  <button 
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setNewUser({ name: "", email: "", password: "", role: "" }); setShowAddPassword(false); }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-[#0a5893] hover:bg-[#08487a] rounded-lg shadow-sm shadow-[#0a5893]/20 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Modal: Edit Pengguna */}
        {isEditModalOpen && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Edit Pengguna</h3>
                <button 
                  onClick={() => { setIsEditModalOpen(false); setEditingUser(null); setShowEditPassword(false); }}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleEditSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      placeholder="Masukkan nama lengkap" 
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      required
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      placeholder="nama@email.com" 
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <input 
                        type={showEditPassword ? "text" : "password"} 
                        onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value } as any)}
                        placeholder="Biarkan kosong jika tidak diubah" 
                        className="w-full px-4 pr-10 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowEditPassword(!showEditPassword)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showEditPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Role / Peran <span className="text-rose-500">*</span>
                    </label>
                    <select 
                      required
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0a5893]/50 focus:border-[#0a5893]"
                    >
                      <option value="" disabled>Pilih hak akses</option>
                      <option value="superadmin">Superadmin</option>
                      <option value="admin">Admin</option>
                      <option value="user">Warga / User</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 pt-2 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                  <button 
                    type="button"
                    onClick={() => { setIsEditModalOpen(false); setEditingUser(null); setShowEditPassword(false); }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-[#0a5893] hover:bg-[#08487a] rounded-lg shadow-sm shadow-[#0a5893]/20 transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Modal: Konfirmasi Hapus */}
        {isDeleteAlertOpen && userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 text-center">
              <div className="p-6 pt-8">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Hapus Pengguna?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.name}</strong>? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex items-center p-4 gap-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50">
                <button 
                  onClick={() => { setIsDeleteAlertOpen(false); setUserToDelete(null); }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm shadow-rose-600/20 transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatedPage>
    </DashboardLayout>
  );
}
