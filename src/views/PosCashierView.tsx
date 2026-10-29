import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  QrCode,
  DollarSign,
  User,
  FileCheck2,
  AlertCircle,
  Pill,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { Medicine, PaymentMethod, SaleTransaction } from '../types/pharmacy';
import { ReceiptModal } from '../components/ReceiptModal';

export const PosCashierView: React.FC = () => {
  const {
    medicines,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    processSale,
    formatRupiah,
    currentUser
  } = usePharmacy();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customerType, setCustomerType] = useState<'Umum' | 'Resep Dokter' | 'Langganan'>('Umum');
  const [customerName, setCustomerName] = useState('Pelanggan Umum');
  const [doctorName, setDoctorName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [transactionNotes, setTransactionNotes] = useState('');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<SaleTransaction | null>(null);

  const categories = [
    'all',
    'Bebas',
    'Bebas Terbatas',
    'Keras / Resep',
    'Generik',
    'Suplemen & Vitamin',
    'Antibiotik'
  ];

  // Filter medicines for quick picker
  const filteredMedicines = medicines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.includes(searchQuery) ||
      m.shelfLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + item.medicine.sellPrice * item.quantity, 0);
  const totalAmount = Math.max(0, subtotal - discountAmount);
  const change = paymentMethod === 'Tunai' ? Math.max(0, cashTendered - totalAmount) : 0;

  const handleAddToCart = (medicine: Medicine) => {
    if (medicine.stock <= 0) {
      setCheckoutError(`Obat ${medicine.name} sedang habis.`);
      setTimeout(() => setCheckoutError(null), 3000);
      return;
    }
    const success = addToCart(medicine, 1);
    if (!success) {
      setCheckoutError(`Stok ${medicine.name} tidak mencukupi di keranjang.`);
      setTimeout(() => setCheckoutError(null), 3000);
    }
  };

  const setExactCash = () => {
    setCashTendered(totalAmount);
  };

  const addQuickTender = (nominal: number) => {
    setCashTendered(nominal);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (cart.length === 0) {
      setCheckoutError('Keranjang masih kosong!');
      return;
    }

    if (paymentMethod === 'Tunai' && cashTendered < totalAmount) {
      setCheckoutError(`Uang diterima (${formatRupiah(cashTendered)}) kurang dari total (${formatRupiah(totalAmount)})`);
      return;
    }

    const result = processSale({
      customerName: customerName.trim() || 'Pelanggan Umum',
      customerType,
      doctorName: customerType === 'Resep Dokter' ? doctorName : undefined,
      discount: Number(discountAmount),
      tax: 0,
      paymentMethod,
      cashTendered: paymentMethod === 'Tunai' ? Number(cashTendered) : totalAmount,
      notes: transactionNotes
    });

    if (result.success && result.transaction) {
      setLastTransaction(result.transaction);
      // Reset form
      setCashTendered(0);
      setDiscountAmount(0);
      setCustomerName('Pelanggan Umum');
      setCustomerType('Umum');
      setDoctorName('');
      setTransactionNotes('');
    } else {
      setCheckoutError(result.error || 'Gagal memproses transaksi.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Product Selection Grid (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Header & Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              <span>Pilih Obat / Scan Barcode</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {filteredMedicines.length} obat ditemukan
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ketik nama obat, kode barcode, atau rak (cth: Paramex / 63634634)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Category Chips (Interactive filter buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Semua Obat' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {filteredMedicines.map(med => {
            const inCart = cart.find(c => c.medicine.id === med.id);
            const isOutOfStock = med.stock <= 0;
            const isLowStock = med.stock <= med.minStock;

            return (
              <div
                key={med.id}
                onClick={() => !isOutOfStock && handleAddToCart(med)}
                className={`p-3.5 bg-white rounded-xl border transition-all text-left flex flex-col justify-between ${
                  isOutOfStock
                    ? 'border-slate-200 opacity-50 cursor-not-allowed bg-slate-50'
                    : 'border-slate-200 hover:border-teal-500 hover:shadow-sm cursor-pointer active:scale-[0.99]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400 font-medium">{med.code}</span>
                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                      {med.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-1 leading-snug">
                    {med.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {med.dosage || med.shelfLocation}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">Harga / {med.unit}</span>
                    <div className="font-mono font-bold text-sm text-teal-800">
                      {formatRupiah(med.sellPrice)}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Sisa Stok</span>
                    <div className="flex items-center gap-1 font-mono">
                      <strong className={`text-xs font-bold ${
                        isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-600' : 'text-slate-700'
                      }`}>
                        {med.stock} {med.unit}
                      </strong>
                    </div>
                  </div>
                </div>

                {inCart && (
                  <div className="mt-2 text-center bg-teal-50 text-teal-800 text-[11px] font-bold py-1 rounded border border-teal-200">
                    {inCart.quantity} {med.unit} di keranjang
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Shopping Cart & Checkout (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
          {/* Cart Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 rounded-t-xl">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Keranjang Transaksi</h3>
                <p className="text-[11px] text-slate-500">Kasir: {currentUser.fullName}</p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 p-1"
                title="Kosongkan keranjang"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>
            )}
          </div>

          {/* Checkout Error Alert */}
          {checkoutError && (
            <div className="m-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[280px] divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShoppingCart className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                <p className="text-xs">Keranjang masih kosong</p>
                <p className="text-[11px] text-slate-400">Klik obat di sebelah kiri untuk menambah pesanan</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.medicine.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate">{item.medicine.name}</p>
                    <p className="text-slate-500 font-mono text-[11px]">
                      {formatRupiah(item.medicine.sellPrice)} / {item.medicine.unit}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.medicine.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.medicine.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                      title={item.quantity >= item.medicine.stock ? 'Mencapai stok maksimal' : undefined}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="text-right shrink-0 min-w-[70px]">
                    <div className="font-mono font-bold text-slate-900">
                      {formatRupiah(item.medicine.sellPrice * item.quantity)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.medicine.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Customer & Doctor details */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Jenis Penjualan</label>
                <select
                  value={customerType}
                  onChange={e => setCustomerType(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500"
                >
                  <option value="Umum">Umum (Bebas / OTC)</option>
                  <option value="Resep Dokter">Resep Dokter</option>
                  <option value="Langganan">Pasien Langganan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Pasien / Pembeli</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  placeholder="Nama Pasien..."
                />
              </div>
            </div>

            {customerType === 'Resep Dokter' && (
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Dokter Penulis Resep</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="w-full p-2 bg-white border border-teal-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Contoh: dr. Sp.A Hendrawan"
                />
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Metode Pembayaran</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Tunai', 'QRIS', 'Debit', 'Transfer'] as PaymentMethod[]).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method);
                      if (method !== 'Tunai') setCashTendered(totalAmount);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-colors ${
                      paymentMethod === method
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Tender & Quick Buttons if Tunai */}
            {paymentMethod === 'Tunai' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-600 font-semibold">Uang Tunai Diterima (Rp)</label>
                  <button
                    type="button"
                    onClick={setExactCash}
                    className="text-[11px] text-teal-700 hover:underline font-semibold"
                  >
                    Uang Pas
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={cashTendered || ''}
                  onChange={e => setCashTendered(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-base font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                />
                {/* Fast Cash Shortcut Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {[20000, 50000, 100000, 200000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => addQuickTender(val)}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-700 hover:bg-slate-100"
                    >
                      {formatRupiah(val)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Totals */}
            <div className="pt-2 border-t border-slate-200 space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} item):</span>
                <span>{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Diskon (Rp):</span>
                <input
                  type="number"
                  min="0"
                  value={discountAmount || ''}
                  onChange={e => setDiscountAmount(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-24 p-1 text-right bg-white border border-slate-200 rounded text-xs font-mono"
                />
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL BAYAR:</span>
                <span className="text-teal-800 text-base">{formatRupiah(totalAmount)}</span>
              </div>
              {paymentMethod === 'Tunai' && (
                <div className="flex justify-between font-bold text-xs pt-1 text-emerald-800">
                  <span>Kembalian:</span>
                  <span>{formatRupiah(change)}</span>
                </div>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                cart.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.99]'
              }`}
            >
              <span>Bayar & Cetak Struk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Thermal Receipt Print Modal */}
      {lastTransaction && (
        <ReceiptModal
          transaction={lastTransaction}
          onClose={() => setLastTransaction(null)}
        />
      )}
    </div>
  );
};
