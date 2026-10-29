import React, { useState } from 'react';
import { PharmacyProvider } from './context/PharmacyContext';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './views/DashboardView';
import { PosCashierView } from './views/PosCashierView';
import { MedicineMasterView } from './views/MedicineMasterView';
import { PriceHistoryView } from './views/PriceHistoryView';
import { DailyReportView } from './views/DailyReportView';
import { PurchasesView } from './views/PurchasesView';
import { StockOpnameView } from './views/StockOpnameView';
import { ProfitView } from './views/ProfitView';
import { TransactionsView } from './views/TransactionsView';
import { UsersView } from './views/UsersView';
import { SettingsView } from './views/SettingsView';
import { BackupRestoreView } from './views/BackupRestoreView';

import { ShoppingCart } from 'lucide-react';
import { usePharmacy } from './context/PharmacyContext';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [openAddMedicineDirectly, setOpenAddMedicineDirectly] = useState(false);
  const { cart } = usePharmacy();

  const handleNavigate = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddMedicine = () => {
    setActiveTab('medicines');
    setOpenAddMedicineDirectly(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigate={handleNavigate}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />

        {/* View Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onOpenAddMedicine={handleOpenAddMedicine}
            />
          )}

          {activeTab === 'pos' && <PosCashierView />}

          {activeTab === 'transactions' && <TransactionsView />}

          {activeTab === 'purchases' && <PurchasesView />}

          {activeTab === 'medicines' && (
            <MedicineMasterView
              isAddModalOpen={openAddMedicineDirectly}
              onCloseAddModal={() => setOpenAddMedicineDirectly(false)}
            />
          )}

          {activeTab === 'price-history' && <PriceHistoryView />}

          {activeTab === 'stock-opname' && <StockOpnameView />}

          {activeTab === 'profit' && <ProfitView />}

          {activeTab === 'daily-report' && <DailyReportView />}

          {activeTab === 'backup' && <BackupRestoreView />}

          {activeTab === 'users' && <UsersView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Floating Action Button (FAB) from screenshot */}
      {activeTab !== 'pos' && (
        <button
          onClick={() => handleNavigate('pos')}
          className="fixed bottom-6 right-6 z-30 w-13 h-13 rounded-full bg-[#5bc0de] hover:bg-[#46b8da] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all no-print cursor-pointer"
          title="Buka Kasir POS"
          aria-label="Buka Kasir POS"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
              {cart.length}
            </span>
          )}
        </button>
      )}

      {/* Login / Switch Account Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <PharmacyProvider>
      <MainLayout />
    </PharmacyProvider>
  );
}
