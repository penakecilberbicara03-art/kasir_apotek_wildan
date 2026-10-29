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
    logout
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
      <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between shadow-2xs">
        {/* Left Section: Hamburger & "Pusat" (Exactly like screenshot) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 text-sm tracking-wide">
              Pusat
            </span>
          </div>
        </div>

        {/* Right Section: Pindah Cabang button, Notifications, Role Switcher, Logout (Exactly like screenshot) */}
        <div className="flex items-center gap-2.5">
          {/* Reorder Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className={`relative p-1.5 rounded transition-colors ${
                lowStockMedicines.length > 0
                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="Peringatan Reorder Stok"
            >
              <Bell className="w-4 h-4" />
              {lowStockMedicines.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
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
                    <span className="font-bold text-xs text-slate-800">Peringatan Reorder Stok</span>
                  </div>
                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    {lowStockMedicines.length} Item Menipis
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {lowStockMedicines.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500">
                      Seluruh persediaan obat di atas batas minimum.
                    </div>
                  ) : (
                    lowStockMedicines.map(med => (
                      <div key={med.id} className="p-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-slate-900">{med.name}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5 font-mono">
                            Kode: {med.code} · Min: {med.minStock} {med.unit}
                          </p>
                          <p className="text-red-600 font-medium text-[11px] mt-0.5">
                            Sisa Stok: <strong className="font-mono">{med.stock}</strong> {med.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setShowNotificationDropdown(false);
                            onNavigate('purchases');
                          }}
                          className="shrink-0 px-2.5 py-1 bg-teal-600 text-white rounded text-xs font-semibold hover:bg-teal-700 transition-colors"
                        >
                          Restock
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
                      Buka Master Data Obat →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-700"
            >
              <span className="capitalize font-semibold text-slate-800">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 text-xs">
                <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ganti Akun Demo
                </div>
                <button
                  onClick={() => handleRoleChange('kasir')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    currentUser.role === 'kasir' ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Kasir (Budi)</span>
                  {currentUser.role === 'kasir' && <UserCheck className="w-3.5 h-3.5 text-teal-600" />}
                </button>
                <button
                  onClick={() => handleRoleChange('manajer')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    currentUser.role === 'manajer' ? 'font-bold text-blue-700 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Manajer (Siti, S.Farm)</span>
                  {currentUser.role === 'manajer' && <UserCheck className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => handleRoleChange('owner')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    currentUser.role === 'owner' ? 'font-bold text-purple-700 bg-purple-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>Owner (Seniman Koding)</span>
                  {currentUser.role === 'owner' && <UserCheck className="w-3.5 h-3.5 text-purple-600" />}
                </button>
                <div className="pt-1 mt-1 border-t border-slate-100 px-3">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onOpenLoginModal();
                    }}
                    className="w-full text-center text-xs text-teal-700 hover:underline py-1 font-semibold"
                  >
                    Form Login Manual (PIN) →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pindah Cabang Button - Exact Green button from screenshot */}
          <button
            onClick={() => setShowBranchModal(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded bg-[#5cb85c] hover:bg-[#4cae4c] text-white shadow-2xs transition-colors whitespace-nowrap"
          >
            Pindah Cabang
          </button>

          {/* Logout Button with Exit Icon - Exact from screenshot */}
          <button
            onClick={logout}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 px-2 py-1.5 transition-colors font-medium"
            title="Keluar dari akun"
          >
            <span>Logout</span>
            <LogOut className="w-3.5 h-3.5" />
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
                <h3 className="font-bold text-slate-900 text-sm">Pindah Cabang Apotek</h3>
              </div>
              <button
                onClick={() => setShowBranchModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3 mb-4">
              Pilih cabang operasional untuk melihat inventori dan transaksi:
            </p>

            <div className="space-y-2 text-xs">
              {branches.map(branch => (
                <button
                  key={branch}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setShowBranchModal(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border font-medium flex items-center justify-between transition-colors ${
                    selectedBranch === branch
                      ? 'border-[#5cb85c] bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{branch}</span>
                  {selectedBranch === branch && (
                    <span className="text-[10px] bg-[#5cb85c] text-white px-2 py-0.5 rounded">Aktif</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowBranchModal(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded transition-colors"
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
