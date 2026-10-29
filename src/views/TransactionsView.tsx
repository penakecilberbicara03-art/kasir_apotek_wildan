import React, { useState } from 'react';
import { Receipt, Search, Eye, Calendar, Printer, Filter } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { SaleTransaction } from '../types/pharmacy';
import { ReceiptModal } from '../components/ReceiptModal';

export const TransactionsView: React.FC = () => {
  const { sales, formatRupiah } = usePharmacy();
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState<SaleTransaction | null>(null);

  const filtered = sales.filter(s =>
    s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase()) ||
    s.cashierName.toLowerCase().includes(search.toLowerCase()) ||
    (s.doctorName && s.doctorName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            <span>Riwayat Transaksi Penjualan Kasir</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh nota penjualan, status pembayaran, dan cetak ulang bukti transaksi.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nomor nota, nama pasien, dokter atau kasir..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none text-slate-800"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Kasir</th>
                <th className="py-3 px-4">Pasien / Resep</th>
                <th className="py-3 px-4">Daftar Obat</th>
                <th className="py-3 px-4 text-center">Metode</th>
                <th className="py-3 px-4 text-right">Total Bayar</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada riwayat transaksi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{s.invoiceNumber}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(s.date).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{s.cashierName}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{s.customerName}</div>
                      <div className="text-[11px] text-slate-500">
                        {s.customerType} {s.doctorName ? `· Dr: ${s.doctorName}` : ''}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5 max-w-xs">
                        {s.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] text-slate-700 truncate">
                            • {it.name} <span className="font-mono text-slate-500 font-semibold">x{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-teal-900">
                      {formatRupiah(s.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedTx(s)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold text-xs transition-colors flex items-center gap-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Struk</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTx && (
        <ReceiptModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
};
