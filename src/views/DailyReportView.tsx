import React, { useState, useMemo } from 'react';
import {
  FileText,
  Calendar,
  Printer,
  Download,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter
} from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { SaleTransaction } from '../types/pharmacy';
import { ReceiptModal } from '../components/ReceiptModal';

export const DailyReportView: React.FC = () => {
  const { sales, medicines, profile, formatRupiah, currentUser } = usePharmacy();

  // Date selection state (defaults to today)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>('all');
  const [viewingTransaction, setViewingTransaction] = useState<SaleTransaction | null>(null);

  // Filter sales for the selected date
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const matchDate = s.date.startsWith(selectedDate);
      const matchPayment = selectedPaymentFilter === 'all' || s.paymentMethod === selectedPaymentFilter;
      return matchDate && matchPayment;
    });
  }, [sales, selectedDate, selectedPaymentFilter]);

  // Aggregate Metrics
  const totalOmzet = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCost = filteredSales.reduce((sum, s) => sum + s.totalCost, 0);
  const totalProfit = filteredSales.reduce((sum, s) => sum + s.totalProfit, 0);
  const totalInvoices = filteredSales.length;

  const totalItemsSold = filteredSales.reduce((sum, s) => {
    return sum + s.items.reduce((iSum, it) => iSum + it.quantity, 0);
  }, 0);

  const profitMarginPercent = totalCost > 0 ? Math.round((totalProfit / totalCost) * 100) : 0;
  const avgTicket = totalInvoices > 0 ? Math.round(totalOmzet / totalInvoices) : 0;

  // Breakdown by payment methods
  const paymentBreakdown = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {
      Tunai: { count: 0, total: 0 },
      QRIS: { count: 0, total: 0 },
      Debit: { count: 0, total: 0 },
      Transfer: { count: 0, total: 0 }
    };
    filteredSales.forEach(s => {
      if (map[s.paymentMethod]) {
        map[s.paymentMethod].count += 1;
        map[s.paymentMethod].total += s.totalAmount;
      }
    });
    return map;
  }, [filteredSales]);

  // Integrated Stock Impact Summary: Which medicines were sold on this day, qty deducted, and current stock remaining
  const stockImpact = useMemo(() => {
    const itemMap: Record<string, {
      id: string;
      code: string;
      name: string;
      category: string;
      unit: string;
      qtySold: number;
      revenue: number;
      currentStock: number;
      minStock: number;
    }> = {};

    filteredSales.forEach(s => {
      s.items.forEach(it => {
        if (!itemMap[it.medicineId]) {
          const med = medicines.find(m => m.id === it.medicineId);
          itemMap[it.medicineId] = {
            id: it.medicineId,
            code: it.code,
            name: it.name,
            category: it.category,
            unit: it.unit,
            qtySold: 0,
            revenue: 0,
            currentStock: med ? med.stock : 0,
            minStock: med ? med.minStock : 0
          };
        }
        itemMap[it.medicineId].qtySold += it.quantity;
        itemMap[it.medicineId].revenue += it.subtotal;
      });
    });

    return Object.values(itemMap).sort((a, b) => b.qtySold - a.qtySold);
  }, [filteredSales, medicines]);

  // Export to CSV function
  const handleExportCSV = () => {
    const rows = [
      ['No Invoice', 'Waktu', 'Kasir', 'Pelanggan', 'Tipe', 'Dokter', 'Metode', 'Total Bayar', 'HPP', 'Laba Bersih'],
      ...filteredSales.map(s => [
        s.invoiceNumber,
        new Date(s.date).toLocaleTimeString('id-ID'),
        s.cashierName,
        s.customerName,
        s.customerType,
        s.doctorName || '-',
        s.paymentMethod,
        s.totalAmount,
        s.totalCost,
        s.totalProfit
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Penjualan_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const displayDateStr = new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <span>Laporan Penjualan Harian & Integrasi Stok</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit rekap omset harian, keuntungan margin, dan dampaknya terhadap pengurangan stok fisik obat.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-4 h-4 text-teal-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none font-mono text-xs cursor-pointer"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan Resmi</span>
          </button>
        </div>
      </div>

      {/* Formal Header for Print */}
      <div className="hidden print:block text-center pb-4 border-b-2 border-black mb-6">
        <h1 className="text-xl font-bold uppercase tracking-wider">{profile.name}</h1>
        <p className="text-xs">{profile.branchName} · {profile.address}</p>
        <p className="text-xs">{profile.sipa} · Telp: {profile.phone}</p>
        <h2 className="text-sm font-bold uppercase mt-3 underline">
          LAPORAN REKAPITULASI PENJUALAN HARIAN DAN MUTASI STOK
        </h2>
        <p className="text-xs font-mono mt-0.5">Hari / Tanggal: {displayDateStr}</p>
      </div>

      {/* KPI Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Omzet Penjualan</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 mt-2">
            {formatRupiah(totalOmzet)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Dari <strong className="font-mono text-slate-700">{totalInvoices}</strong> nota transaksi
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total HPP / Modal Obat</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-700 mt-2">
            {formatRupiah(totalCost)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Beban pokok perolehan obat
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Laba Bersih / Margin</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-700 mt-2">
            {formatRupiah(totalProfit)}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Margin keuntungan bersih: +{profitMarginPercent}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Obat Terpotong</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-blue-800 mt-2">
            {totalItemsSold} <span className="text-sm font-normal text-slate-500">Unit</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Rata-rata nota: {formatRupiah(avgTicket)}
          </p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Rincian Berdasarkan Metode Pembayaran
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(paymentBreakdown).map(([method, data]) => (
            <div key={method} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="flex items-center justify-between text-slate-600 font-semibold">
                <span>{method}</span>
                <span className="font-mono text-[11px] text-slate-400">{data.count} Transaksi</span>
              </div>
              <div className="font-mono text-base font-bold text-slate-900 mt-1">
                {formatRupiah(data.total)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Stock Impact Table (Laporan Terintegrasi Stok Obat) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-teal-600" />
              <span>Integrasi Pengurangan Stok Obat (Hari Ini)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar seluruh obat yang dikeluarkan kasir dan sisa stok fisik saat ini di apotek.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
            {stockImpact.length} SKU Berputar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">No.</th>
                <th className="py-2.5 px-4">Kode Obat</th>
                <th className="py-2.5 px-4">Nama Obat</th>
                <th className="py-2.5 px-4">Kategori & Satuan</th>
                <th className="py-2.5 px-4 text-right">Qty Terjual</th>
                <th className="py-2.5 px-4 text-right">Total Nilai Jual</th>
                <th className="py-2.5 px-4 text-center">Sisa Stok Fisik</th>
                <th className="py-2.5 px-4 text-center">Status Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockImpact.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Belum ada obat yang terjual pada tanggal yang dipilih.
                  </td>
                </tr>
              ) : (
                stockImpact.map((item, index) => {
                  const isLow = item.currentStock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 text-center font-mono text-slate-400">{index + 1}</td>
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-700">{item.code}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">
                        {item.category} · {item.unit}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-teal-800">
                        -{item.qtySold} {item.unit}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-800">
                        {formatRupiah(item.revenue)}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono font-bold">
                        <span className={isLow ? 'text-red-600' : 'text-slate-800'}>
                          {item.currentStock} {item.unit}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {isLow ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                            Reorder
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section: Detailed Transaction History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-slate-800 text-sm">
              Rincian Nota Transaksi Kasir ({filteredSales.length})
            </h3>
          </div>

          <div className="no-print">
            <select
              value={selectedPaymentFilter}
              onChange={e => setSelectedPaymentFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Metode Pembayaran</option>
              <option value="Tunai">Tunai</option>
              <option value="QRIS">QRIS</option>
              <option value="Debit">Debit</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Kasir</th>
                <th className="py-3 px-4">Pelanggan / Dokter</th>
                <th className="py-3 px-4">Rincian Obat</th>
                <th className="py-3 px-4 text-center">Metode</th>
                <th className="py-3 px-4 text-right">Total Nilai</th>
                <th className="py-3 px-4 text-right">Laba Bersih</th>
                <th className="py-3 px-4 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Tidak ada transaksi penjualan pada tanggal {displayDateStr}.
                  </td>
                </tr>
              ) : (
                filteredSales.map(trx => (
                  <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {trx.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(trx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {trx.cashierName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{trx.customerName}</div>
                      <div className="text-[11px] text-slate-500">
                        {trx.customerType}
                        {trx.doctorName && ` · Dr: ${trx.doctorName}`}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 max-w-xs">
                        {trx.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] text-slate-700">
                            • {it.name} <span className="font-mono text-slate-500 font-semibold">x{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {trx.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-teal-900">
                      {formatRupiah(trx.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                      +{formatRupiah(trx.totalProfit)}
                    </td>
                    <td className="py-3 px-4 text-center no-print">
                      <button
                        onClick={() => setViewingTransaction(trx)}
                        className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                        title="Lihat / Cetak Struk"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature block for formal print report */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-slate-300 text-xs">
        <div className="text-center">
          <p>Petugas Kasir,</p>
          <div className="h-16"></div>
          <p className="font-bold underline">{currentUser.fullName}</p>
        </div>
        <div className="text-center">
          <p>Apoteker Penanggung Jawab (APA),</p>
          <div className="h-16"></div>
          <p className="font-bold underline">{profile.pharmacistName}</p>
          <p className="text-[10px] text-slate-600">{profile.sipa}</p>
        </div>
      </div>

      {/* Struk Modal */}
      {viewingTransaction && (
        <ReceiptModal
          transaction={viewingTransaction}
          onClose={() => setViewingTransaction(null)}
        />
      )}
    </div>
  );
};
