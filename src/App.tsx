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

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [openAddMedicineDirectly, setOpenAddMedicineDirectly] = useState(false);

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
