import React from 'react';
import {
  Banknote,
  FileText,
  ShoppingCart,
  ShoppingBag,
  Grid,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Plus,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { ActiveTab } from '../components/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenAddMedicine: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenAddMedicine
}) => {
  const {
    sales,
    medicines,
    lowStockMedicines,
    selectedBranch,
    formatRupiah,
    currentUser,
    cart
  } = usePharmacy();

  // Metrics for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date.startsWith(todayStr));
  const todayTotalRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayInvoiceCount = todaySales.length;

  // Monthly metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthSales = sales.filter(s => {
    const d = new Date(s.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const monthItemsSold = monthSales.reduce((sum, s) => {
    return sum + s.items.reduce((iSum, item) => iSum + item.quantity, 0);
  }, 0);

  const monthInvoiceCount = monthSales.length;
  const totalMedicineSku = medicines.length;

  // Calculate top selling medicines
  const medicineSalesMap: Record<string, { code: string; name: string; soldQty: number; stock: number; unit: string }> = {};

  medicines.forEach(m => {
    medicineSalesMap[m.id] = {
      code: m.code,
      name: m.name,
      soldQty: 0,
      stock: m.stock,
      unit: m.unit
    };
  });

  sales.forEach(s => {
    s.items.forEach(it => {
      if (medicineSalesMap[it.medicineId]) {
        medicineSalesMap[it.medicineId].soldQty += it.quantity;
      } else {
        medicineSalesMap[it.medicineId] = {
          code: it.code,
          name: it.name,
          soldQty: it.quantity,
          stock: 0,
          unit: it.unit
        };
      }
    });
  });

  const topSellingMedicines = Object.values(medicineSalesMap)
    .sort((a, b) => b.soldQty - a.soldQty)
    .slice(0, 5);

  // Lowest stock medicines (sorted by stock ascending)
  const lowestStockMedicines = [...medicines]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  return (
    <div className="space-y-5 pb-16">
      {/* Title & Breadcrumbs - Exact layout from screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-slate-200/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-normal text-slate-500 tracking-tight">
          Dashboard <strong className="font-bold text-slate-800">{selectedBranch}</strong>
        </h1>

        <div className="text-xs text-slate-400 font-medium">
          <span className="text-teal-600 hover:underline cursor-pointer" onClick={() => onNavigate('dashboard')}>Home</span>
          <span className="mx-1.5">/</span>
          <span className="text-slate-500">Dashboard</span>
        </div>
      </div>

      {/* Reorder Alert Banner if any medicine is at or below minimum threshold */}
      {lowStockMedicines.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <strong className="text-amber-900 font-bold">
                Peringatan Reorder Stok ({lowStockMedicines.length} Obat Mencapai Batas Minimum):
              </strong>
              <span className="text-amber-800 ml-1.5">
                {lowStockMedicines.slice(0, 3).map(m => `${m.name} (${m.stock} ${m.unit})`).join(', ')}
                {lowStockMedicines.length > 3 ? ` dan ${lowStockMedicines.length - 3} lainnya` : ''}.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('medicines')}
              className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 rounded text-xs font-medium hover:bg-amber-100 transition-colors"
            >
              Lihat Data Obat
            </button>
            <button
              onClick={() => onNavigate('purchases')}
              className="px-2.5 py-1 bg-amber-600 text-white rounded text-xs font-bold hover:bg-amber-700 transition-colors shadow-2xs"
            >
              Buat PO Kulakan
            </button>
          </div>
        </div>
      )}

      {/* Row 1: Two Wide Hero Stat Cards (Exactly from screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Penjualan Hari ini (Cyan #5bc0de) */}
        <div className="bg-[#5bc0de] text-white rounded-lg p-5 relative overflow-hidden shadow-xs flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight">
              {formatRupiah(todayTotalRevenue)}
            </div>
            <p className="text-xs text-white/90 font-medium mt-1">
              Penjualan <strong className="text-white font-bold">Hari ini</strong>
            </p>
          </div>
          {/* Subtle Banknote Watermark Icon */}
          <div className="absolute right-4 bottom-2 text-white/20 pointer-events-none">
            <Banknote className="w-20 h-20 stroke-[1.2]" />
          </div>
        </div>

        {/* Card 2: Invoice Penjualan Cash Hari ini (Amber #f0ad4e) */}
        <div className="bg-[#f0ad4e] text-white rounded-lg p-5 relative overflow-hidden shadow-xs flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight">
              {todayInvoiceCount}
            </div>
            <p className="text-xs text-white/90 font-medium mt-1">
              Invoice Penjualan Cash <strong className="text-white font-bold">Hari ini</strong>
            </p>
          </div>
          {/* Subtle Invoice Document Watermark Icon */}
          <div className="absolute right-4 bottom-2 text-white/20 pointer-events-none">
            <FileText className="w-20 h-20 stroke-[1.2]" />
          </div>
        </div>
      </div>

      {/* Row 2: Three Stat Cards (White cards with colored icons, exactly from screenshot) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 3: Total Obat Terjual Bulan Ini */}
        <div className="bg-white rounded-lg border border-slate-200/80 p-5 relative overflow-hidden shadow-xs flex items-center justify-between">
          <div>
            <div className="font-mono text-3xl font-extrabold text-slate-800">
              {monthItemsSold}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              <strong className="text-slate-700 font-bold">Total</strong> Obat Terjual Bulan Ini
            </p>
          </div>
          <div className="text-[#5bc0de]">
            <ShoppingCart className="w-12 h-12 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 4: Jumlah Obat */}
        <div className="bg-white rounded-lg border border-slate-200/80 p-5 relative overflow-hidden shadow-xs flex items-center justify-between">
          <div>
            <div className="font-mono text-3xl font-extrabold text-slate-800">
              {totalMedicineSku}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Jumlah Obat (Katalog)
            </p>
          </div>
          <div className="text-[#5cb85c]">
            <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
          </div>
        </div>

        {/* Card 5: Total Invoice Penjualan Bulan ini */}
        <div className="bg-white rounded-lg border border-slate-200/80 p-5 relative overflow-hidden shadow-xs flex items-center justify-between">
          <div>
            <div className="font-mono text-3xl font-extrabold text-slate-800">
              {monthInvoiceCount}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              <strong className="text-slate-700 font-bold">Total</strong> Invoice Penjualan Bulan ini
            </p>
          </div>
          <div className="text-[#d9534f]">
            <Grid className="w-12 h-12 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Row 3: Two Data Tables (Exactly as shown in screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Table 1: Data Obat Terlaris */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-700 text-sm">
              Data Obat <span className="text-slate-500 font-normal">Terlaris</span>
            </h3>
            <button
              onClick={() => onNavigate('daily-report')}
              className="text-xs text-teal-600 hover:underline font-medium"
            >
              Lihat Laporan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-600 border-b border-slate-200 font-medium">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">No.</th>
                  <th className="py-2.5 px-4">Kode Obat</th>
                  <th className="py-2.5 px-4">Nama</th>
                  <th className="py-2.5 px-4 text-center">Terjual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topSellingMedicines.map((med, index) => (
                  <tr key={med.code} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 text-center text-slate-500 font-mono">{index + 1}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">{med.code}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{med.name}</td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-teal-800">
                      {med.soldQty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Data Stok Terkecil */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-700 text-sm">
              Data Stok <span className="text-slate-500 font-normal">Terkecil</span>
            </h3>
            <button
              onClick={() => onNavigate('medicines')}
              className="text-xs text-teal-600 hover:underline font-medium"
            >
              Semua Obat
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-600 border-b border-slate-200 font-medium">
                <tr>
                  <th className="py-2.5 px-4 w-12 text-center">No.</th>
                  <th className="py-2.5 px-4">Kode Barang</th>
                  <th className="py-2.5 px-4">Nama</th>
                  <th className="py-2.5 px-4 text-center">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowestStockMedicines.map((med, index) => {
                  const isUnderMin = med.stock <= med.minStock;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 text-center text-slate-500 font-mono">{index + 1}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-700">{med.code}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{med.name}</td>
                      <td className="py-2.5 px-4 text-center font-mono font-bold">
                        <span className={isUnderMin ? 'text-red-600' : 'text-slate-800'}>
                          {med.stock} {med.unit}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4: Data Piutang Jatuh Tempo Kurang dari 30 Hari (From screenshot) */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-slate-700 text-xs">
            Data Piutang <span className="text-slate-500 font-normal">Jatuh Tempo Kurang dari 30 Hari</span>
          </h4>
          {/* Pagination dots from screenshot */}
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 bg-[#5bc0de] rounded-full"></span>
            <span className="w-2.5 h-1.5 bg-slate-200 rounded-full"></span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Tidak ada tagihan atau piutang yang jatuh tempo dalam 30 hari ke depan. Semua pembayaran kasir lunas tunai & nontunai.
        </p>
      </div>
    </div>
  );
};
