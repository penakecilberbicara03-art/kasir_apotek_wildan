import React, { useState } from 'react';
import {
  Menu,
  Building2,
  Bell,
  ShoppingCart,
  UserCheck,
  LogOut,
  AlertTriangle,
  ChevronDown,
  ArrowRight,
  Plus
} from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { UserRole } from '../types/pharmacy';
import { ActiveTab } from './Sidebar';

interface TopNavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onOpenLoginModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleSidebar,
  onNavigate,
  onOpenLoginModal
}) => {
  const {
    currentUser,
    switchUserRole,
    lowStockMedicines,
    selectedBranch,
    setSelectedBranch,
    cart,
    formatRupiah
  } = usePharmacy();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const branches = [
    'Pusat Surabaya Jawa Timur',
    'Cabang Rungkut Surabaya Timur',
    'Cabang Darmo Park Surabaya Selatan',
    'Cabang Manyar Kertoarjo'
  ];

  const handleRoleChange = (role: UserRole) => {
    switchUserRole(role);
    setShowRoleDropdown(false);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between shadow-xs">
        {/* Left Section: Hamburger & Branch Selector */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Branch Indicator - Matching Screenshot */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200/80">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span className="truncate max-w-[200px]">{selectedBranch}</span>
            </div>

            <button
              onClick={() => setShowBranchModal(true)}
              className="text-xs font-medium px-2.5 py-1.5 rounded bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors whitespace-nowrap"
            >
              Pindah Cabang
            </button>
          </div>
        </div>

        {/* Right Section: Low Stock Alert, Role Switcher & POS CTA */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Reorder Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className={`relative p-2 rounded-lg transition-colors ${
                lowStockMedicines.length > 0
                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Notifikasi Reorder Stok"
            >
              <Bell className="w-5 h-5" />
              {lowStockMedicines.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center animate-bounce shadow-sm">
                  {lowStockMedicines.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 text-slate-800">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-sm text-slate-800">Peringatan Reorder Stok</span>
                  </div>
                  <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    {lowStockMedicines.length} Item Menipis
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {lowStockMedicines.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      Seluruh persediaan obat dalam kondisi aman di atas batas minimum.
                    </div>
                  ) : (
                    lowStockMedicines.map(med => (
                      <div key={med.id} className="p-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-slate-900">{med.name}</p>
                          <p className="text-slate-500 mt-0.5">
                            Kode: <span className="font-mono">{med.code}</span> · Min: {med.minStock} {med.unit}
                          </p>
                          <p className="text-red-600 font-medium mt-0.5">
                            Sisa Stok: <strong className="font-mono text-sm">{med.stock}</strong> {med.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowNotificationDropdown(false);
                            onNavigate('purchases');
                          }}
                          className="shrink-0 px-2.5 py-1.5 bg-teal-600 text-white rounded text-xs font-medium hover:bg-teal-700 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Restock</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {lowStockMedicines.length > 0 && (
                  <div className="pt-2 px-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowNotificationDropdown(false);
                        onNavigate('medicines');
                      }}
                      className="w-full text-center text-xs font-semibold text-teal-700 hover:text-teal-800 py-1"
                    >
                      Lihat Semua di Master Obat →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-700"
            >
              <div className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="hidden sm:inline">Role:</span>
              <strong className="capitalize text-teal-800">{currentUser.role}</strong>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Ganti Akun Demo
                </div>
                <button
                  onClick={() => handleRoleChange('kasir')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentUser.role === 'kasir' ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">Kasir (Budi)</p>
                    <p className="text-[11px] text-slate-500">Akses: Transaksi POS, Cek Stok</p>
                  </div>
                  {currentUser.role === 'kasir' && <UserCheck className="w-4 h-4 text-teal-600" />}
                </button>

                <button
                  onClick={() => handleRoleChange('manajer')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentUser.role === 'manajer' ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">Manajer (Siti Nurhaliza)</p>
                    <p className="text-[11px] text-slate-500">Akses: Kelola Obat, Harga, Kulakan</p>
                  </div>
                  {currentUser.role === 'manajer' && <UserCheck className="w-4 h-4 text-blue-600" />}
                </button>

                <button
                  onClick={() => handleRoleChange('owner')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentUser.role === 'owner' ? 'font-bold text-purple-700 bg-purple-50/50' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">Owner (Dr. Hendra / Seniman Koding)</p>
                    <p className="text-[11px] text-slate-500">Akses: Penuh + Laba Bersih & Settings</p>
                  </div>
                  {currentUser.role === 'owner' && <UserCheck className="w-4 h-4 text-purple-600" />}
                </button>

                <div className="pt-1.5 mt-1 border-t border-slate-100 px-3">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onOpenLoginModal();
                    }}
                    className="w-full text-center text-xs text-slate-600 hover:text-slate-900 py-1 font-medium"
                  >
                    Form Login Lengkap (PIN / Password) →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick POS Cashier Action Button */}
          <button
            onClick={() => onNavigate('pos')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors text-xs font-semibold shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Kasir POS</span>
            {cart.length > 0 && (
              <span className="bg-white text-teal-800 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Pindah Cabang Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Pindah Cabang Apotek</h3>
              </div>
              <button
                onClick={() => setShowBranchModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3 mb-4">
              Pilih cabang apotek untuk mengelola transaksi kasir dan memonitor stok obat lokasi terkait:
            </p>

            <div className="space-y-2">
              {branches.map(branch => (
                <button
                  key={branch}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setShowBranchModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedBranch === branch
                      ? 'border-teal-500 bg-teal-50/60 text-teal-900 font-semibold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{branch}</span>
                  {selectedBranch === branch && (
                    <span className="text-[11px] bg-teal-600 text-white px-2 py-0.5 rounded">Aktif</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowBranchModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
