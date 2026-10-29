import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, Key, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { UserAccount, UserRole } from '../types/pharmacy';

export const UsersView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = usePharmacy();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    role: 'kasir' as UserRole,
    pin: '1234',
    phone: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.fullName) return;

    addUser({
      username: formData.username.trim(),
      fullName: formData.fullName.trim(),
      role: formData.role,
      pin: formData.pin.trim() || '1234',
      phone: formData.phone.trim()
    });

    setShowAddModal(false);
    setFormData({
      username: '',
      fullName: '',
      role: 'kasir',
      pin: '1234',
      phone: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Kelola Pengguna Sistem (Kasir, Manajer, Owner)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen hak akses, PIN keamanan kasir, dan penambahan akun petugas apotek.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map(user => {
          const isMe = user.id === currentUser.id;
          return (
            <div
              key={user.id}
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between ${
                isMe ? 'border-teal-500 ring-1 ring-teal-500/30' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    user.role === 'owner'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'manajer'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {user.role}
                  </span>
                  {isMe && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                      Sedang Aktif
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-base border border-slate-200">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{user.fullName}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">@{user.username}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>PIN Masuk:</span>
                    <span className="font-mono font-bold text-slate-800">•••• ({user.pin})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Telepon:</span>
                    <span>{user.phone || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {user.role === 'owner' ? 'Akses Penuh Seluruh Sistem' : user.role === 'manajer' ? 'Akses Master Obat & Laporan' : 'Akses Transaksi POS & Stok'}
                </span>

                {!isMe && users.length > 1 && (
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Hapus Pengguna"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Tambah Akun Pengguna</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Petugas *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Contoh: Rina Andriani, A.Md.Farm"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username Login *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Contoh: kasir2"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Peran / Hak Akses (Role) *</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-semibold"
                >
                  <option value="kasir">Kasir (Transaksi POS & Cek Stok)</option>
                  <option value="manajer">Manajer (CRUD Obat, Perubahan Harga, Kulakan)</option>
                  <option value="owner">Owner (Akses Penuh, Laba Bersih, Pengaturan)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PIN Kasir (4 Digit) *</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={formData.pin}
                  onChange={e => setFormData({ ...formData, pin: e.target.value })}
                  placeholder="1234"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono text-center tracking-widest text-base font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-2xs"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
