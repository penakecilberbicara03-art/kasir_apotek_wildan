import React, { useState } from 'react';
import { Truck, Plus, AlertTriangle, CheckCircle, Package, Calendar, Clock } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { Medicine } from '../types/pharmacy';

export const PurchasesView: React.FC = () => {
  const {
    purchases,
    medicines,
    lowStockMedicines,
    createPurchaseOrder,
    currentUser,
    formatRupiah
  } = usePharmacy();

  const [showNewPOModal, setShowNewPOModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('PT Kimia Farma Trading');
  const [poNotes, setPoNotes] = useState('');
  const [poItems, setPoItems] = useState<{ medicineId: string; quantity: number; buyPrice: number }[]>([]);

  const suppliers = [
    'PT Kimia Farma Trading & Distribution',
    'PT Enseval Putera Megatrading (Kalbe Group)',
    'PT Anugrah Argon Medica (Dexa Group)',
    'PT Mensa Bina Sukses',
    'PT Parit Padang Global',
    'PT Lapi Laboratories'
  ];

  // Auto-generate PO from all low stock medicines
  const handleAutoReorderAll = () => {
    if (lowStockMedicines.length === 0) return;

    const items = lowStockMedicines.map(m => {
      // Order amount to reach double the minStock
      const qtyToOrder = Math.max(10, (m.minStock * 2) - m.stock);
      return {
        medicineId: m.id,
        quantity: qtyToOrder,
        buyPrice: m.buyPrice
      };
    });

    setPoItems(items);
    setPoNotes('Restock otomatis untuk obat yang mencapai batas minimum');
    setShowNewPOModal(true);
  };

  const handleOpenSingleReorder = (medicine: Medicine) => {
    const qtyToOrder = Math.max(10, (medicine.minStock * 2) - medicine.stock);
    setPoItems([{
      medicineId: medicine.id,
      quantity: qtyToOrder,
      buyPrice: medicine.buyPrice
    }]);
    setPoNotes(`Restock ${medicine.name}`);
    setShowNewPOModal(true);
  };

  const handleAddItemRow = () => {
    const firstMed = medicines[0];
    if (!firstMed) return;
    setPoItems(prev => [...prev, { medicineId: firstMed.id, quantity: 10, buyPrice: firstMed.buyPrice }]);
  };

  const handleRemoveItemRow = (idx: number) => {
    setPoItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateItemRow = (idx: number, field: string, value: any) => {
    setPoItems(prev => prev.map((item, i) => {
      if (i === idx) {
        if (field === 'medicineId') {
          const med = medicines.find(m => m.id === value);
          return {
            ...item,
            medicineId: value,
            buyPrice: med ? med.buyPrice : item.buyPrice
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSubmitPO = (e: React.FormEvent) => {
    e.preventDefault();
    if (poItems.length === 0) return;

    const processedItems = poItems.map(item => {
      const med = medicines.find(m => m.id === item.medicineId);
      const buyPrice = Number(item.buyPrice);
      const quantity = Number(item.quantity);
      return {
        medicineId: item.medicineId,
        name: med ? med.name : 'Obat',
        quantity,
        buyPrice,
        subtotal: quantity * buyPrice
      };
    });

    const totalAmount = processedItems.reduce((sum, it) => sum + it.subtotal, 0);

    createPurchaseOrder({
      supplier: selectedSupplier,
      status: 'Diterima', // Directly updates stock
      items: processedItems,
      totalAmount,
      recordedBy: currentUser.fullName,
      notes: poNotes
    });

    setShowNewPOModal(false);
    setPoItems([]);
    setPoNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-600" />
            <span>Pembelian Obat & Kulakan Restock PBF</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemesanan obat ke distributor Pedagang Besar Farmasi (PBF) dan penambahan stok gudang otomatis.
          </p>
        </div>

        <button
          onClick={() => {
            handleAddItemRow();
            setShowNewPOModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-2xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat PO Kulakan Baru</span>
        </button>
      </div>

      {/* Low Stock Reorder Recommendations Banner */}
      {lowStockMedicines.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-sm">
                  {lowStockMedicines.length} Obat Perlu Segera Direorder (Stok ≤ Batas Minimum)
                </h3>
                <p className="text-xs text-amber-800 mt-1">
                  Sistem merekomendasikan pembelian restock agar apotek tidak mengalami kehabisan stok bagi pasien.
                </p>
              </div>
            </div>

            <button
              onClick={handleAutoReorderAll}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors shadow-2xs shrink-0 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Buat PO Kulakan Otomatis ({lowStockMedicines.length} Obat)</span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockMedicines.map(med => {
              const recommendedQty = Math.max(10, (med.minStock * 2) - med.stock);
              return (
                <div key={med.id} className="bg-white p-3 rounded-lg border border-amber-200 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{med.name}</p>
                    <p className="text-slate-500 text-[11px] font-mono">
                      Sisa: <strong className="text-red-600">{med.stock}</strong> / Min: {med.minStock} {med.unit}
                    </p>
                    <p className="text-teal-700 font-semibold text-[11px] mt-0.5">
                      Saran Order: +{recommendedQty} {med.unit}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenSingleReorder(med)}
                    className="px-2.5 py-1.5 bg-teal-50 text-teal-800 hover:bg-teal-100 rounded text-xs font-semibold border border-teal-200"
                  >
                    + Order
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PO History List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">
            Riwayat Pembelian & Kulakan Gudang ({purchases.length})
          </h3>
          <span className="text-xs text-slate-500">Status 'Diterima' langsung menambah stok</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">No. PO</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Distributor PBF</th>
                <th className="py-3 px-4">Rincian Obat Restock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Total Biaya Kulakan</th>
                <th className="py-3 px-4">Petugas / Perekam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    Belum ada data pembelian tercatat.
                  </td>
                </tr>
              ) : (
                purchases.map(po => (
                  <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{po.poNumber}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(po.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{po.supplier}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {po.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] text-slate-700">
                            • {it.name} <strong className="font-mono text-teal-800">+{it.quantity}</strong> @ {formatRupiah(it.buyPrice)}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        <span>{po.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(po.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{po.recordedBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Order Modal */}
      {showNewPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">Buat Surat Pesanan (PO) Kulakan</h3>
              </div>
              <button
                onClick={() => setShowNewPOModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPO} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Distributor / Pedagang Besar Farmasi (PBF) *
                </label>
                <select
                  value={selectedSupplier}
                  onChange={e => setSelectedSupplier(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-teal-500"
                >
                  {suppliers.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Daftar Obat yang Dipesan *</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {poItems.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <label className="text-[10px] text-slate-500 block mb-0.5">Nama Obat</label>
                        <select
                          value={item.medicineId}
                          onChange={e => handleUpdateItemRow(idx, 'medicineId', e.target.value)}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-medium"
                        >
                          {medicines.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name} (Stok: {m.stock})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-slate-500 block mb-0.5">Jumlah Order</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => handleUpdateItemRow(idx, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded font-mono text-xs font-bold"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-slate-500 block mb-0.5">Harga Beli Satuan (Rp)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.buyPrice}
                          onChange={e => handleUpdateItemRow(idx, 'buyPrice', parseInt(e.target.value) || 0)}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded font-mono text-xs"
                        />
                      </div>

                      <div className="col-span-1 text-center pt-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="text-slate-400 hover:text-red-600 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Pesanan</label>
                <input
                  type="text"
                  value={poNotes}
                  onChange={e => setPoNotes(e.target.value)}
                  placeholder="Catatan nomor faktur, pengiriman, atau termin pembayaran..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              {/* Total Summary */}
              <div className="p-3 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-between font-mono">
                <span className="font-semibold text-teal-900">Total Nilai Pembelian:</span>
                <span className="text-base font-bold text-teal-800">
                  {formatRupiah(poItems.reduce((sum, it) => sum + (it.quantity * it.buyPrice), 0))}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPOModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={poItems.length === 0}
                  className="px-5 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-2xs"
                >
                  Terima Barang & Tambah Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
