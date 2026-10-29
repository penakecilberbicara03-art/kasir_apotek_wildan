import React from 'react';
import {
  Banknote,
  FileText,
  ShoppingCart,
  Package,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
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
    currentUser
  } = usePharmacy();

  // Calculate metrics for today
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
  const medicineSalesMap: Record<string, { code: string; name: string; soldQty: number; category: string; stock: number }> = {};
  
  // Seed with all medicines so even zero-sales ones can be tracked
  medicines.forEach(m => {
    medicineSalesMap[m.id] = {
      code: m.code,
      name: m.name,
      soldQty: 0,
      category: m.category,
      stock: m.stock
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
          category: it.category,
          stock: 0
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
    <div className="space-y-6">
      {/* Header & Breadcrumb - Matching Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-baseline gap-2">
            <span>Dashboard</span>
            <span className="font-extrabold text-teal-800">{selectedBranch}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ringkasan operasional kasir, perputaran stok, dan peringatan reorder obat.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {currentUser.role !== 'kasir' && (
            <button
              onClick={onOpenAddMedicine}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-teal-600" />
              <span>Tambah Obat Baru</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('pos')}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-2xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buka Kasir POS</span>
          </button>
        </div>
      </div>

      {/* Reorder Alert Banner if any medicine is at or below minimum threshold */}
      {lowStockMedicines.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Peringatan Stok Obat Menipis ({lowStockMedicines.length} Item Mencapai Batas Reorder)
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Obat seperti <strong className="font-semibold">{lowStockMedicines.slice(0, 3).map(m => m.name).join(', ')}</strong> {lowStockMedicines.length > 3 ? `dan ${lowStockMedicines.length - 3} lainnya` : ''} telah mencapai atau berada di bawah batas minimum pemesanan kembali.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('medicines')}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              Cek Master Obat
            </button>
            <button
              onClick={() => onNavigate('purchases')}
              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors shadow-2xs"
            >
              Buat PO Kulakan
            </button>
          </div>
        </div>
      )}

      {/* 5 Stat Cards - Exactly matching the user's screenshot layout & color scheme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Penjualan Hari Ini (Cyan Theme) */}
        <div className="bg-[#17a2b8] text-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight">
              {formatRupiah(todayTotalRevenue)}
            </div>
            <p className="text-xs text-cyan-100 mt-1 font-medium">
              Penjualan <strong className="text-white">Hari ini</strong>
            </p>
          </div>
          <div className="absolute right-3 bottom-2 text-white/20 pointer-events-none">
            <Banknote className="w-14 h-14" />
          </div>
        </div>

        {/* Card 2: Invoice Penjualan Hari Ini (Yellow Theme) */}
        <div className="bg-[#ffc107] text-slate-900 rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight">
              {todayInvoiceCount}
            </div>
            <p className="text-xs text-slate-800 mt-1 font-medium">
              Invoice Penjualan Cash <strong className="font-bold">Hari ini</strong>
            </p>
          </div>
          <div className="absolute right-3 bottom-2 text-slate-900/15 pointer-events-none">
            <FileText className="w-14 h-14" />
          </div>
        </div>

        {/* Card 3: Total Obat Terjual Bulan Ini (Light Blue Theme) */}
        <div className="bg-[#20c997] text-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">
              {monthItemsSold}
            </div>
            <p className="text-xs text-emerald-100 mt-1 font-medium">
              <strong className="text-white">Total</strong> Obat Terjual Bulan Ini
            </p>
          </div>
          <div className="absolute right-3 bottom-2 text-white/20 pointer-events-none">
            <ShoppingCart className="w-14 h-14" />
          </div>
        </div>

        {/* Card 4: Jumlah Obat / SKU (Green Theme) */}
        <div className="bg-[#28a745] text-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">
              {totalMedicineSku}
            </div>
            <p className="text-xs text-green-100 mt-1 font-medium">
              Jumlah Obat (SKU)
            </p>
          </div>
          <div className="absolute right-3 bottom-2 text-white/20 pointer-events-none">
            <Package className="w-14 h-14" />
          </div>
        </div>

        {/* Card 5: Total Invoice Penjualan Bulan Ini (Coral/Red Theme) */}
        <div className="bg-[#e83e8c] text-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight">
              {monthInvoiceCount}
            </div>
            <p className="text-xs text-pink-100 mt-1 font-medium">
              <strong className="text-white">Total</strong> Invoice Penjualan Bulan ini
            </p>
          </div>
          <div className="absolute right-3 bottom-2 text-white/20 pointer-events-none">
            <Calendar className="w-14 h-14" />
          </div>
        </div>
      </div>

      {/* Two Tables Grid: Data Obat Terlaris & Data Stok Terkecil / Reorder Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Data Obat Terlaris */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Data Obat <span className="text-slate-500 font-normal">Terlaris</span>
              </h3>
            </div>
            <button
              onClick={() => onNavigate('daily-report')}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              <span>Laporan Lengkap</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold w-12 text-center">No.</th>
                  <th className="py-2.5 px-4 font-semibold">Kode Obat</th>
                  <th className="py-2.5 px-4 font-semibold">Nama Obat</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Sisa Stok</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Terjual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topSellingMedicines.map((med, index) => (
                  <tr key={med.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 text-center text-slate-500 font-mono">{index + 1}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-700 font-medium">{med.code}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{med.name}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`font-mono px-2 py-0.5 rounded text-[11px] font-semibold ${
                        med.stock <= 5 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {med.stock}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-teal-700">
                      {med.soldQty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Data Stok Terkecil / Reorder Alert */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-800 text-sm">
                Data Stok <span className="text-slate-500 font-normal">Terkecil (Batas Reorder)</span>
              </h3>
            </div>
            <button
              onClick={() => onNavigate('medicines')}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              <span>Master Obat</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-semibold w-12 text-center">No.</th>
                  <th className="py-2.5 px-4 font-semibold">Kode Barang</th>
                  <th className="py-2.5 px-4 font-semibold">Nama Obat</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Min Stok</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Stok Fisik</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowestStockMedicines.map((med, index) => {
                  const isUnderMin = med.stock <= med.minStock;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 text-center text-slate-500 font-mono">{index + 1}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-700 font-medium">{med.code}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{med.name}</td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-500">{med.minStock} {med.unit}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold">
                        <span className={isUnderMin ? 'text-red-600' : 'text-slate-800'}>
                          {med.stock} {med.unit}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {isUnderMin ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                            Reorder
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick POS & Cash Flow Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Integrasi Penjualan & Pemotongan Stok Otomatis
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Setiap transaksi kasir langsung memotong stok obat pada sistem secara atomik dan mencatat HPP untuk pelaporan margin laba bersih harian.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('daily-report')}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-teal-600" />
              <span>Lihat Laporan Penjualan Hari Ini</span>
            </button>

            <button
              onClick={() => onNavigate('pos')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Mulai Transaksi Kasir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
