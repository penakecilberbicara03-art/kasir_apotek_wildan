import React, { useState } from 'react';
import { Tag, History, Search, ArrowRight, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { Medicine } from '../types/pharmacy';

export const PriceHistoryView: React.FC = () => {
  const { medicines, priceHistories, updateMedicinePrice, currentUser, formatRupiah } = usePharmacy();

  const [selectedMedId, setSelectedMedId] = useState<string>(medicines[0]?.id || '');
  const [newBuyPrice, setNewBuyPrice] = useState<number>(medicines[0]?.buyPrice || 0);
  const [newSellPrice, setNewSellPrice] = useState<number>(medicines[0]?.sellPrice || 0);
  const [reason, setReason] = useState<string>('Kenaikan HPP distributor PBF');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedMed = medicines.find(m => m.id === selectedMedId) || medicines[0];

  const handleSelectMed = (id: string) => {
    setSelectedMedId(id);
    const m = medicines.find(med => med.id === id);
    if (m) {
      setNewBuyPrice(m.buyPrice);
      setNewSellPrice(m.sellPrice);
    }
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed) return;

    updateMedicinePrice(selectedMed.id, Number(newBuyPrice), Number(newSellPrice), reason);
    setSuccessMsg(`Harga untuk ${selectedMed.name} berhasil diperbarui dan dicatat ke riwayat.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const currentMargin = selectedMed && selectedMed.buyPrice > 0
    ? Math.round(((selectedMed.sellPrice - selectedMed.buyPrice) / selectedMed.buyPrice) * 100)
    : 0;

  const newMargin = newBuyPrice > 0
    ? Math.round(((newSellPrice - newBuyPrice) / newBuyPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Tag className="w-5 h-5 text-amber-600" />
          <span>Manajemen & Riwayat Perubahan Harga Obat</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Perbarui harga beli (HPP) dan harga jual eceran obat, serta audit riwayat penyesuaian harga.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <span>✓</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Adjust Price Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-600" />
          <span>Form Penyesuaian Harga Obat</span>
        </h3>

        <form onSubmit={handleSavePrice} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pilih Obat yang Ingin Diubah
              </label>
              <select
                value={selectedMedId}
                onChange={e => handleSelectMed(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-teal-500"
              >
                {medicines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.code}) - {formatRupiah(m.sellPrice)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Harga Beli Baru (Modal / HPP)
              </label>
              <input
                type="number"
                min="0"
                required
                value={newBuyPrice || ''}
                onChange={e => setNewBuyPrice(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
                Harga Beli Lama: {selectedMed ? formatRupiah(selectedMed.buyPrice) : '-'}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Harga Jual Baru (Eceran)
              </label>
              <input
                type="number"
                min="0"
                required
                value={newSellPrice || ''}
                onChange={e => setNewSellPrice(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 bg-white border border-teal-500 rounded-lg font-mono text-sm font-bold text-teal-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
                Harga Jual Lama: {selectedMed ? formatRupiah(selectedMed.sellPrice) : '-'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alasan Penyesuaian Harga *
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Contoh: Kenaikan harga dari PBF Kalbe / Kebijakan Direksi"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="bg-teal-50/60 border border-teal-200 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-teal-900 font-semibold">Estimasi Margin Keuntungan:</p>
                <p className="text-[11px] text-teal-700">
                  Margin Saat Ini: <strong className="font-mono">+{currentMargin}%</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-teal-600 block">Margin Baru</span>
                <span className="font-mono text-lg font-bold text-teal-900">
                  +{newMargin}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-2xs"
            >
              Simpan & Terapkan Perubahan Harga
            </button>
          </div>
        </form>
      </div>

      {/* Price Change Audit History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-slate-800 text-sm">
              Log Riwayat Perubahan Harga Obat ({priceHistories.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">Tercatat permanen untuk audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Tanggal & Waktu</th>
                <th className="py-2.5 px-4">Kode Obat</th>
                <th className="py-2.5 px-4">Nama Obat</th>
                <th className="py-2.5 px-4 text-right">Harga Beli Lama → Baru</th>
                <th className="py-2.5 px-4 text-right">Harga Jual Lama → Baru</th>
                <th className="py-2.5 px-4">Alasan</th>
                <th className="py-2.5 px-4">Diubah Oleh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {priceHistories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada riwayat perubahan harga obat.
                  </td>
                </tr>
              ) : (
                priceHistories.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-slate-500">
                      {new Date(item.changedAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-700">{item.medicineCode}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{item.medicineName}</td>
                    <td className="py-2.5 px-4 text-right font-mono">
                      <span className="text-slate-400 line-through mr-1">{formatRupiah(item.oldBuyPrice)}</span>
                      <span className="text-slate-800 font-semibold">{formatRupiah(item.newBuyPrice)}</span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">
                      <span className="text-slate-400 line-through mr-1">{formatRupiah(item.oldSellPrice)}</span>
                      <span className="text-teal-800 font-bold">{formatRupiah(item.newSellPrice)}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 max-w-xs truncate">{item.reason}</td>
                    <td className="py-2.5 px-4">
                      <span className="font-medium text-slate-800">{item.changedBy}</span>
                      <span className="text-[10px] text-slate-400 block capitalize">({item.changedByRole})</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
