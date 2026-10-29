import React from 'react';
import { Printer, CheckCircle, X, Download } from 'lucide-react';
import { SaleTransaction, PharmacyProfile } from '../types/pharmacy';
import { usePharmacy } from '../context/PharmacyContext';

interface ReceiptModalProps {
  transaction: SaleTransaction;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const { profile, formatRupiah } = usePharmacy();

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(transaction.date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Top Bar */}
        <div className="bg-teal-700 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-200" />
            <div>
              <h3 className="font-bold text-sm">Transaksi Berhasil!</h3>
              <p className="text-[11px] text-teal-100">Stok obat telah otomatis terpotong</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="p-6 bg-slate-50 overflow-y-auto max-h-[70vh]">
          <div className="printable-receipt bg-white p-5 rounded-lg border border-slate-200 shadow-xs font-mono text-[11px] text-slate-800 leading-relaxed max-w-[320px] mx-auto">
            {/* Header Apotek */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <h2 className="font-bold text-sm tracking-wide text-black uppercase">
                {profile.name}
              </h2>
              <p className="text-[10px] text-slate-600 mt-0.5">{profile.branchName}</p>
              <p className="text-[9px] text-slate-500">{profile.address}</p>
              <p className="text-[9px] text-slate-500">Telp: {profile.phone}</p>
              <p className="text-[8px] text-slate-400 mt-1">{profile.sipa}</p>
              <p className="text-[8px] text-slate-400">APA: {profile.pharmacistName}</p>
            </div>

            {/* Transaction Metadata */}
            <div className="py-2.5 border-b border-dashed border-slate-400 text-[10px] space-y-0.5">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold">{transaction.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{transaction.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span>{transaction.customerName} ({transaction.customerType})</span>
              </div>
              {transaction.doctorName && (
                <div className="flex justify-between text-teal-800 font-semibold">
                  <span>Dokter:</span>
                  <span>{transaction.doctorName}</span>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="py-3 border-b border-dashed border-slate-400 space-y-2">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-black flex justify-between">
                    <span className="truncate pr-1">{item.name}</span>
                    <span>{formatRupiah(item.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>
                      {item.quantity} {item.unit} x {formatRupiah(item.sellPrice)}
                    </span>
                  </div>
                  {item.instructions && (
                    <div className="text-[9px] text-slate-600 italic">
                      ↳ Aturan: {item.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Totals & Payments */}
            <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Diskon:</span>
                  <span>-{formatRupiah(transaction.discount)}</span>
                </div>
              )}
              {transaction.tax > 0 && (
                <div className="flex justify-between">
                  <span>PPN:</span>
                  <span>+{formatRupiah(transaction.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-1 text-black border-t border-slate-200">
                <span>TOTAL AKHIR:</span>
                <span>{formatRupiah(transaction.totalAmount)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Metode:</span>
                <span className="uppercase font-semibold">{transaction.paymentMethod}</span>
              </div>
              {transaction.paymentMethod === 'Tunai' && (
                <>
                  <div className="flex justify-between">
                    <span>Uang Diterima:</span>
                    <span>{formatRupiah(transaction.cashTendered)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-teal-800">
                    <span>Kembalian:</span>
                    <span>{formatRupiah(transaction.change)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 text-center text-[9px] text-slate-500 leading-tight">
              <p className="font-medium">{profile.receiptFooter}</p>
              <p className="mt-2 text-[8px] text-slate-400">Simpan struk ini sebagai bukti pembayaran yang sah.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Tutup & Transaksi Baru
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk Kasir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
