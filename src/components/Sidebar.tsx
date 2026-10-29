import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Truck,
  Database,
  ClipboardCheck,
  TrendingUp,
  FileText,
  Save,
  Users,
  Store,
  Tag,
  AlertTriangle,
  LogOut,
  Pill,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { UserRole } from '../types/pharmacy';

export type ActiveTab =
  | 'dashboard'
  | 'pos'
  | 'transactions'
  | 'purchases'
  | 'medicines'
  | 'price-history'
  | 'stock-opname'
  | 'profit'
  | 'daily-report'
  | 'backup'
  | 'users'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) => {
  const { currentUser, lowStockMedicines, logout, cart } = usePharmacy();

  const isAllowed = (allowedRoles: UserRole[]): boolean => {
    return allowedRoles.includes(currentUser.role);
  };

  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowed: ['kasir', 'manajer', 'owner'] as UserRole[],
      badge: lowStockMedicines.length > 0 ? `${lowStockMedicines.length} Reorder` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
    },
    {
      id: 'pos' as ActiveTab,
      label: 'Kasir (POS)',
      icon: ShoppingCart,
      allowed: ['kasir', 'manajer', 'owner'] as UserRole[],
      badge: cart.length > 0 ? `${cart.length}` : null,
      badgeColor: 'bg-teal-500 text-white font-bold'
    },
    {
      id: 'transactions' as ActiveTab,
      label: 'Riwayat Penjualan',
      icon: Receipt,
      allowed: ['kasir', 'manajer', 'owner'] as UserRole[]
    },
    {
      id: 'purchases' as ActiveTab,
      label: 'Pembelian (PBF)',
      icon: Truck,
      allowed: ['manajer', 'owner'] as UserRole[]
    },
    {
      id: 'medicines' as ActiveTab,
      label: 'Master Obat (CRUD)',
      icon: Pill,
      allowed: ['kasir', 'manajer', 'owner'] as UserRole[],
      badge: lowStockMedicines.length > 0 ? `${lowStockMedicines.length}` : null,
      badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30'
    },
    {
      id: 'price-history' as ActiveTab,
      label: 'Perubahan Harga',
      icon: Tag,
      allowed: ['manajer', 'owner'] as UserRole[]
    },
    {
      id: 'stock-opname' as ActiveTab,
      label: 'Stock Opname',
      icon: ClipboardCheck,
      allowed: ['manajer', 'owner'] as UserRole[]
    },
    {
      id: 'profit' as ActiveTab,
      label: 'Laba Bersih & Margin',
      icon: TrendingUp,
      allowed: ['manajer', 'owner'] as UserRole[]
    },
    {
      id: 'daily-report' as ActiveTab,
      label: 'Laporan Penjualan',
      icon: FileText,
      allowed: ['kasir', 'manajer', 'owner'] as UserRole[]
    },
    {
      id: 'backup' as ActiveTab,
      label: 'Backup & Restore',
      icon: Save,
      allowed: ['owner'] as UserRole[]
    }
  ];

  const settingsItems = [
    {
      id: 'users' as ActiveTab,
      label: 'Kelola Users',
      icon: Users,
      allowed: ['owner'] as UserRole[]
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Pengaturan Toko',
      icon: Store,
      allowed: ['manajer', 'owner'] as UserRole[]
    }
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Owner</span>;
      case 'manajer':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Manajer</span>;
      case 'kasir':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">Kasir</span>;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#343a40] text-slate-200 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-700/50 shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-700/60 bg-[#2d3238]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-black tracking-wider text-sm shadow-md">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
                POS - APOTEK
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Sistem Farmasi Terpadu</p>
            </div>
          </div>
        </div>

        {/* User Card - Exactly like screenshot */}
        <div className="px-5 py-4 border-b border-slate-700/50 bg-[#2d3238]/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'}
                alt={currentUser.fullName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/60 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#2d3238] rounded-full"></span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{currentUser.fullName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {getRoleBadge(currentUser.role)}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 text-sm scrollbar-thin scrollbar-thumb-slate-700">
          {navItems.map(item => {
            const hasAccess = isAllowed(item.allowed);
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (hasAccess) {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }
                }}
                disabled={!hasAccess}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all text-left font-medium ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : hasAccess
                    ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    : 'text-slate-500 opacity-40 cursor-not-allowed'
                }`}
                title={!hasAccess ? `Fitur khusus ${item.allowed.join(' / ')}` : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* SETTINGS Header */}
          <div className="pt-4 pb-1.5 px-3">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              SETTINGS
            </p>
          </div>

          {settingsItems.map(item => {
            const hasAccess = isAllowed(item.allowed);
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (hasAccess) {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }
                }}
                disabled={!hasAccess}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg transition-all text-left font-medium ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : hasAccess
                    ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    : 'text-slate-500 opacity-40 cursor-not-allowed'
                }`}
                title={!hasAccess ? `Fitur khusus ${item.allowed.join(' / ')}` : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Role / Info */}
        <div className="p-3 border-t border-slate-700/60 bg-[#2d3238] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="truncate">Hak: <strong className="text-white capitalize">{currentUser.role}</strong></span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-slate-300 hover:text-red-400 transition-colors p-1 rounded"
            title="Keluar / Ganti Akun"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};
