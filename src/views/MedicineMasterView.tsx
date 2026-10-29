import React, { useState, useMemo } from 'react';
import {
  Pill,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Tag,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
  Calendar,
  Layers,
  Archive,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { Medicine, MedicineCategory, MedicineUnit } from '../types/pharmacy';

interface MedicineMasterViewProps {
  initialFilter?: 'all' | 'low-stock';
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const MedicineMasterView: React.FC<MedicineMasterViewProps> = ({
  initialFilter = 'all',
  isAddModalOpen = false,
  onCloseAddModal
}) => {
  const {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    updateMedicinePrice,
    restockMedicine,
    currentUser,
    formatRupiah
  } = usePharmacy();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>(initialFilter);
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(isAddModalOpen);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [deletingMedicine, setDeletingMedicine] = useState<Medicine | null>(null);
  const [pricingMedicine, setPricingMedicine] = useState<Medicine | null>(null);
  const [restockingMedicine, setRestockingMedicine] = useState<Medicine | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Bebas' as MedicineCategory,
    unit: 'Strip' as MedicineUnit,
    shelfLocation: 'Rak A-01',
    stock: 10,
    minStock: 5,
    buyPrice: 5000,
    sellPrice: 7500,
    expiryDate: '2028-01-01',
    supplier: 'PT Kimia Farma Trading',
    batchNumber: 'BATCH-001',
    dosage: '3x1 sesudah makan',
    description: ''
  });

  // Price adjustment form state
  const [priceForm, setPriceForm] = useState({
    newBuyPrice: 0,
    newSellPrice: 0,
    reason: 'Penyesuaian kenaikan harga distributor PBF'
  });

  // Quick Restock form state
  const [restockQty, setRestockQty] = useState(10);

  const categories: MedicineCategory[] = [
    'Bebas',
    'Bebas Terbatas',
    'Keras / Resep',
    'Generik',
    'Suplemen & Vitamin',
    'Alat Kesehatan',
    'Antibiotik'
  ];

  const units: MedicineUnit[] = [
    'Strip',
    'Tablet',
    'Botol',
    'Box',
    'Tube',
    'Ampul',
    'Sachet',
    'Pcs'
  ];

  const canManageMedicines = currentUser.role === 'manajer' || currentUser.role === 'owner';

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.supplier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || med.category === selectedCategory;

      let matchesStock = true;
      if (stockStatusFilter === 'low-stock') {
        matchesStock = med.stock <= med.minStock;
      } else if (stockStatusFilter === 'out-of-stock') {
        matchesStock = med.stock === 0;
      } else if (stockStatusFilter === 'safe') {
        matchesStock = med.stock > med.minStock;
      }

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [medicines, searchQuery, selectedCategory, stockStatusFilter]);

  const handleOpenAdd = () => {
    setFormData({
      code: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      name: '',
      category: 'Bebas',
      unit: 'Strip',
      shelfLocation: 'Rak A-01',
      stock: 20,
      minStock: 8,
      buyPrice: 5000,
      sellPrice: 7500,
      expiryDate: '2028-12-31',
      supplier: 'PT Kimia Farma Trading',
      batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      dosage: '3 kali sehari 1 tablet sesudah makan',
      description: ''
    });
    setEditingMedicine(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    setFormData({
      code: med.code,
      name: med.name,
      category: med.category,
      unit: med.unit,
      shelfLocation: med.shelfLocation,
      stock: med.stock,
      minStock: med.minStock,
      buyPrice: med.buyPrice,
      sellPrice: med.sellPrice,
      expiryDate: med.expiryDate,
      supplier: med.supplier,
      batchNumber: med.batchNumber,
      dosage: med.dosage || '',
      description: med.description || ''
    });
    setEditingMedicine(med);
    setShowAddModal(true);
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    if (editingMedicine) {
      updateMedicine(editingMedicine.id, formData);
    } else {
      addMedicine(formData);
    }
    setShowAddModal(false);
    setEditingMedicine(null);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleDelete = () => {
    if (deletingMedicine) {
      deleteMedicine(deletingMedicine.id);
      setDeletingMedicine(null);
    }
  };

  const handleOpenPriceModal = (med: Medicine) => {
    setPricingMedicine(med);
    setPriceForm({
      newBuyPrice: med.buyPrice,
      newSellPrice: med.sellPrice,
      reason: 'Penyesuaian kenaikan harga distributor PBF'
    });
  };

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (pricingMedicine) {
      updateMedicinePrice(
        pricingMedicine.id,
        Number(priceForm.newBuyPrice),
        Number(priceForm.newSellPrice),
        priceForm.reason
      );
      setPricingMedicine(null);
    }
  };

  const handleOpenRestockModal = (med: Medicine) => {
    setRestockingMedicine(med);
    // Recommend restock to bring stock up to double minStock
    const recommended = Math.max(10, (med.minStock * 2) - med.stock);
    setRestockQty(recommended);
  };

  const handleSaveRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (restockingMedicine && restockQty > 0) {
      restockMedicine(restockingMedicine.id, Number(restockQty));
      setRestockingMedicine(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            <span>Master Data Obat & Inventori</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola katalog obat apotek, pantau stok minimum reorder, dan lakukan perubahan harga.
          </p>
        </div>

        {canManageMedicines ? (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Obat Baru</span>
          </button>
        ) : (
          <div className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
            Akses Kasir: Hanya dapat melihat stok & harga
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama obat, kode barcode, rak simpan, atau supplier..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="all">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Stock Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setStockStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                stockStatusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({medicines.length})
            </button>
            <button
              onClick={() => setStockStatusFilter('low-stock')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                stockStatusFilter === 'low-stock'
                  ? 'bg-red-50 text-red-700 font-bold shadow-2xs'
                  : 'text-red-600 hover:text-red-700'
              }`}
            >
              <span>Reorder</span>
              <span className="font-mono text-[10px] bg-red-200/60 px-1.5 py-0.2 rounded-full">
                {medicines.filter(m => m.stock <= m.minStock).length}
              </span>
            </button>
            <button
              onClick={() => setStockStatusFilter('safe')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                stockStatusFilter === 'safe'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aman
            </button>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No.</th>
                <th className="py-3 px-4">Kode Barcode</th>
                <th className="py-3 px-4">Nama Obat</th>
                <th className="py-3 px-4">Kategori & Satuan</th>
                <th className="py-3 px-4">Lokasi Rak</th>
                <th className="py-3 px-4 text-center">Stok / Min</th>
                <th className="py-3 px-4 text-right">Harga Beli</th>
                <th className="py-3 px-4 text-right">Harga Jual</th>
                <th className="py-3 px-4 text-center">Margin</th>
                <th className="py-3 px-4 text-center">Kedaluwarsa</th>
                <th className="py-3 px-4 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    Tidak ada obat yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med, index) => {
                  const isUnderMin = med.stock <= med.minStock;
                  const marginPercent = med.buyPrice > 0
                    ? Math.round(((med.sellPrice - med.buyPrice) / med.buyPrice) * 100)
                    : 0;

                  return (
                    <tr
                      key={med.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isUnderMin ? 'bg-red-50/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-mono text-slate-400">{index + 1}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{med.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{med.name}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {med.dosage || med.supplier}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-medium">{med.category}</span>
                        <span className="text-slate-400 mx-1">·</span>
                        <span className="text-slate-500 font-mono">{med.unit}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{med.shelfLocation}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 font-mono">
                          <strong className={`text-sm ${isUnderMin ? 'text-red-600 font-black' : 'text-slate-800'}`}>
                            {med.stock}
                          </strong>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-500 text-[11px]">{med.minStock}</span>
                        </div>
                        {isUnderMin && (
                          <div className="text-[10px] text-red-600 font-semibold mt-0.5">
                            Reorder Diperlukan
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {formatRupiah(med.buyPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-teal-800">
                        {formatRupiah(med.sellPrice)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-700">
                        +{marginPercent}%
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">
                        {med.expiryDate}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Quick Restock Action */}
                          <button
                            onClick={() => handleOpenRestockModal(med)}
                            className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                            title="Restock Cepat"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          {canManageMedicines && (
                            <>
                              {/* Price Change Action */}
                              <button
                                onClick={() => handleOpenPriceModal(med)}
                                className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                                title="Ubah Harga"
                              >
                                <Tag className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Medicine */}
                              <button
                                onClick={() => handleOpenEdit(med)}
                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit Data Obat"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Medicine */}
                              <button
                                onClick={() => setDeletingMedicine(med)}
                                className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Hapus Obat"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingMedicine ? 'Edit Data Obat' : 'Tambah Obat Baru'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Barcode / Kode Obat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                    placeholder="Contoh: 63634634"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Obat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                    placeholder="Contoh: Paramex / Amoxicillin 500mg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Obat
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as MedicineCategory })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Satuan Terkecil
                  </label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value as MedicineUnit })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-medium"
                  >
                    {units.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Lokasi Rak / Lemari
                  </label>
                  <input
                    type="text"
                    value={formData.shelfLocation}
                    onChange={e => setFormData({ ...formData, shelfLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                    placeholder="Contoh: Rak A-02 / Etalase Depan"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Kedaluwarsa (Expired)
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Stok Saat Ini
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Batas Minimum Reorder *</span>
                    <span className="text-[10px] text-amber-600 font-bold">Picu Notifikasi Otomatis</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStock}
                    onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-amber-300 bg-amber-50/30 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Beli / HPP Modal (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.buyPrice}
                    onChange={e => setFormData({ ...formData, buyPrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Jual Eceran (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.sellPrice}
                    onChange={e => setFormData({ ...formData, sellPrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono font-bold text-teal-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Supplier / Distributor PBF
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                    placeholder="Contoh: PT Kimia Farma Trading"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Batch Pabrik
                  </label>
                  <input
                    type="text"
                    value={formData.batchNumber}
                    onChange={e => setFormData({ ...formData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  Aturan Pakai / Dosis Singkat
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 text-xs"
                  placeholder="Contoh: 3x sehari 1 tablet sesudah makan"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-2xs"
                >
                  {editingMedicine ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 text-center">
              Hapus Barang Ini?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              Anda akan menghapus <strong className="text-slate-800">{deletingMedicine.name}</strong> (Kode: {deletingMedicine.code}) dari master data obat apotek.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingMedicine(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-2xs"
              >
                Ya, Hapus Barang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Adjustment Modal - Explicit Feature Request */}
      {pricingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Perubahan Harga Obat</h3>
              </div>
              <button
                onClick={() => setPricingMedicine(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <p className="font-bold text-slate-900">{pricingMedicine.name}</p>
              <p className="text-slate-500 font-mono mt-0.5">
                Kode: {pricingMedicine.code} · Satuan: {pricingMedicine.unit}
              </p>
            </div>

            <form onSubmit={handleSavePrice} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-500 mb-1">
                    Harga Beli Lama
                  </label>
                  <div className="p-2 bg-slate-100 rounded border border-slate-200 font-mono text-slate-700">
                    {formatRupiah(pricingMedicine.buyPrice)}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Beli Baru *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={priceForm.newBuyPrice}
                    onChange={e => setPriceForm({ ...priceForm, newBuyPrice: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-500 mb-1">
                    Harga Jual Lama
                  </label>
                  <div className="p-2 bg-slate-100 rounded border border-slate-200 font-mono text-slate-700">
                    {formatRupiah(pricingMedicine.sellPrice)}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Harga Jual Baru *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={priceForm.newSellPrice}
                    onChange={e => setPriceForm({ ...priceForm, newSellPrice: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-teal-500 rounded font-mono font-bold text-teal-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Realtime margin indicator */}
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-100 flex items-center justify-between">
                <span className="text-teal-900 font-medium">Margin Keuntungan Baru:</span>
                <span className="font-mono font-bold text-teal-700 text-sm">
                  {priceForm.newBuyPrice > 0
                    ? `+${Math.round(((priceForm.newSellPrice - priceForm.newBuyPrice) / priceForm.newBuyPrice) * 100)}%`
                    : '0%'}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alasan Perubahan Harga (Tercatat di Audit Log) *
                </label>
                <input
                  type="text"
                  required
                  value={priceForm.reason}
                  onChange={e => setPriceForm({ ...priceForm, reason: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-teal-500"
                  placeholder="Contoh: Kenaikan HPP dari supplier Kimia Farma"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPricingMedicine(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 shadow-2xs"
                >
                  Terapkan & Simpan Riwayat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Restock Modal */}
      {restockingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Stok (Restock)</h3>
              <button
                onClick={() => setRestockingMedicine(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 text-xs">
              <p className="font-bold text-slate-900">{restockingMedicine.name}</p>
              <p className="text-slate-500 mt-0.5">
                Stok saat ini: <span className="font-mono font-bold text-slate-800">{restockingMedicine.stock}</span> {restockingMedicine.unit}
              </p>
              <p className="text-slate-500">
                Batas reorder: <span className="font-mono">{restockingMedicine.minStock}</span> {restockingMedicine.unit}
              </p>
            </div>

            <form onSubmit={handleSaveRestock} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jumlah Tambahan Stok ({restockingMedicine.unit}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={e => setRestockQty(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-base font-bold text-teal-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRestockingMedicine(null)}
                  className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 shadow-2xs"
                >
                  Tambah ke Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
