import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Truck,
  Repeat,
  Package,
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
  ShieldCheck,
  Building2
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
      hasArrow: false,
      badge: lowStockMedicines.length > 0 ? `${lowStockMedicines.length} Reorder` : null,
      badgeColor: 'bg-amber-400 text-slate-900 font-bold'
    },
    {
      id: 'pos' as ActiveTab,
      label: 'Penjualan (Kasir POS)',
      icon: ShoppingCart,
      allowed: ['kasir', 'manajer', 'owner'] as UserRole[],
      hasArrow: true,
      badge: cart.length > 0 ? `${cart.length}` : null,
      badgeColor: 'bg-[#5bc0de] text-white font-bold'
    },
    {
      id: 'transactions' as ActiveTab,
      label: 'Riwayat Penjualan',
      icon: Receipt,
      allowed: ['kasir', 'manajer', 'owner'] as UserRole[],
      hasArrow: false
    },
    {
      id: 'purchases' as ActiveTab,
      label: 'Pembelian',
      icon: Truck,
      allowed: ['manajer', 'owner'] as UserRole[],
      hasArrow: true
    },
    {
      id: 'medicines' as ActiveTab,
      label: 'Master Data Obat',
      icon: Pill,
      allowed: ['kasir', 'manajer', 'owner'] as UserRole[],
      hasArrow: true,
      badge: lowStockMedicines.length > 0 ? `${lowStockMedicines.length}` : null,
      badgeColor: 'bg-red-500 text-white font-bold'
    },
    {
      id: 'price-history' as ActiveTab,
      label: 'Perubahan Harga',
      icon: Tag,
      allowed: ['manajer', 'owner'] as UserRole[],
      hasArrow: false
    },
    {
      id: 'stock-opname' as ActiveTab,
      label: 'Stock Opname',
      icon: ClipboardCheck,
      allowed: ['manajer', 'owner'] as UserRole[],
      hasArrow: true
    },
    {
      id: 'profit' as ActiveTab,
      label: 'Laba Bersih',
      icon: TrendingUp,
      allowed: ['manajer', 'owner'] as UserRole[],
      hasArrow: true
    },
    {
      id: 'daily-report' as ActiveTab,
      label: 'Laporan Penjualan',
      icon: FileText,
      allowed: ['kasir', 'manajer', 'owner'] as UserRole[],
      hasArrow: true
    },
    {
      id: 'backup' as ActiveTab,
      label: 'Backup & Restore',
      icon: Save,
      allowed: ['owner'] as UserRole[],
      hasArrow: true
    }
  ];

  const settingsItems = [
    {
      id: 'users' as ActiveTab,
      label: 'Users',
      icon: Users,
      allowed: ['owner'] as UserRole[]
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Toko',
      icon: Store,
      allowed: ['manajer', 'owner'] as UserRole[]
    }
  ];

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
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#545b62] text-slate-100 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-600 shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header - Exact style from screenshot */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-600/80 bg-[#4e555b]">
          <div className="w-9 h-9 rounded-full bg-[#5bc0de] text-white flex items-center justify-center font-black tracking-wider text-sm shadow-sm ring-2 ring-white/20">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider text-white">
              POS - APOTEK
            </h1>
            <p className="text-[10px] text-slate-300 font-medium tracking-wide">
              Sistem Kasir Farmasi
            </p>
          </div>
        </div>

        {/* User Card - Matching "Seniman Koding" from screenshot */}
        <div className="px-5 py-4 border-b border-slate-600/70 bg-[#495057]/70">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-emerald-400 flex items-center justify-center text-amber-900 font-bold overflow-hidden shadow-sm">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.fullName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-base font-bold text-slate-800">SK</span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-slate-800 rounded-full"></span>
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-bold text-white truncate leading-snug">
                {currentUser.fullName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.2 rounded bg-white/20 text-white">
                  {currentUser.role}
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-2.5 px-2.5 space-y-0.5 text-xs scrollbar-thin scrollbar-thumb-slate-600">
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all text-left font-medium ${
                  isActive
                    ? 'bg-[#3e444a] text-white shadow-xs font-semibold'
                    : hasAccess
                    ? 'text-slate-200 hover:bg-[#495057] hover:text-white'
                    : 'text-slate-400 opacity-40 cursor-not-allowed'
                }`}
                title={!hasAccess ? `Fitur khusus ${item.allowed.join(' / ')}` : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5bc0de]' : 'text-slate-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.hasArrow && (
                    <span className="text-[11px] text-slate-400 font-mono opacity-80">‹</span>
                  )}
                </div>
              </button>
            );
          })}

          {/* SETTINGS Category Label - Exactly from screenshot */}
          <div className="pt-3.5 pb-1 px-3">
            <p className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all text-left font-medium ${
                  isActive
                    ? 'bg-[#3e444a] text-white shadow-xs font-semibold'
                    : hasAccess
                    ? 'text-slate-200 hover:bg-[#495057] hover:text-white'
                    : 'text-slate-400 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5bc0de]' : 'text-slate-300'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-slate-600 bg-[#495057] flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5bc0de]" />
            <span className="truncate capitalize font-medium">{currentUser.fullName.split(' ')[0]} ({currentUser.role})</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1 text-slate-200 hover:text-red-300 transition-colors p-1 rounded font-medium"
            title="Keluar"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
