import React from 'react';
import { TrendingUp, DollarSign, PieChart, ArrowUpRight, BarChart3, ShieldCheck } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const ProfitView: React.FC = () => {
  const { sales, formatRupiah, currentUser } = usePharmacy();

  // Aggregate Metrics
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCost = sales.reduce((sum, s) => sum + s.totalCost, 0);
  const totalGrossProfit = totalRevenue - totalCost;
  const overallMarginPercent = totalCost > 0 ? Math.round((totalGrossProfit / totalCost) * 100) : 0;

  // Group by category profit
  const categoryProfitMap: Record<string, { revenue: number; cost: number; profit: number }> = {};

  sales.forEach(s => {
    s.items.forEach(it => {
      if (!categoryProfitMap[it.category]) {
        categoryProfitMap[it.category] = { revenue: 0, cost: 0, profit: 0 };
      }
      categoryProfitMap[it.category].revenue += it.subtotal;
      categoryProfitMap[it.category].cost += it.buyPrice * it.quantity;
      categoryProfitMap[it.category].profit += it.profit;
    });
  });

  const categoryProfits = Object.entries(categoryProfitMap).map(([category, data]) => ({
    category,
    ...data,
    margin: data.cost > 0 ? Math.round((data.profit / data.cost) * 100) : 0
  })).sort((a, b) => b.profit - a.profit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <span>Analisis Laba Bersih & Profitabilitas Apotek</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Perhitungan akurat margin keuntungan (Penjualan dikurangi HPP obat) untuk evaluasi Owner & Manajer.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Akumulasi Omzet</span>
          <div className="font-mono text-2xl font-bold text-slate-900 mt-2">
            {formatRupiah(totalRevenue)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Bruto penjualan seluruh transaksi</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Beban Pokok (HPP)</span>
          <div className="font-mono text-2xl font-bold text-slate-700 mt-2">
            {formatRupiah(totalCost)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Modal beli obat ke distributor PBF</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700">Total Laba Bersih (Margin)</span>
          <div className="font-mono text-2xl font-bold text-emerald-700 mt-2">
            {formatRupiah(totalGrossProfit)}
          </div>
          <p className="text-xs text-emerald-600 font-bold mt-1">
            Rata-rata Margin: +{overallMarginPercent}%
          </p>
        </div>
      </div>

      {/* Profit by Medicine Category */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <PieChart className="w-4 h-4 text-teal-600" />
            <span>Kontribusi Keuntungan per Kategori Obat</span>
          </h3>
          <span className="text-xs text-slate-500">Urut berdasarkan kontribusi profit tertinggi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Kategori Obat</th>
                <th className="py-3 px-4 text-right">Total Penjualan</th>
                <th className="py-3 px-4 text-right">Total HPP Modal</th>
                <th className="py-3 px-4 text-right">Laba Bersih</th>
                <th className="py-3 px-4 text-center">Margin %</th>
                <th className="py-3 px-4">Pangsa Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categoryProfits.map(item => {
                const sharePercent = totalGrossProfit > 0
                  ? Math.round((item.profit / totalGrossProfit) * 100)
                  : 0;

                return (
                  <tr key={item.category} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.category}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-800">
                      {formatRupiah(item.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {formatRupiah(item.cost)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {formatRupiah(item.profit)}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-teal-800">
                      +{item.margin}%
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-teal-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, sharePercent))}%` }}
                          />
                        </div>
                        <span className="font-mono font-semibold text-slate-600 text-[11px]">
                          {sharePercent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
