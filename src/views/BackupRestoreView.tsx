import React, { useState } from 'react';
import { Save, Download, Upload, RotateCcw, CheckCircle2, AlertTriangle, FileJson } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const BackupRestoreView: React.FC = () => {
  const { exportData, importData, resetToDemo, medicines, sales, priceHistories } = usePharmacy();
  const [importText, setImportText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportDownload = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_pos_apotek_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ type: 'success', text: 'File cadangan JSON berhasil diunduh ke komputer Anda.' });
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const success = importData(importText);
    if (success) {
      setStatusMsg({ type: 'success', text: 'Database berhasil dipulihkan dari data cadangan JSON.' });
      setImportText('');
    } else {
      setStatusMsg({ type: 'error', text: 'Format data JSON tidak valid atau rusak.' });
    }
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh database apotek kembali ke data demo awal?')) {
      resetToDemo();
      setStatusMsg({ type: 'success', text: 'Seluruh database telah direset ke data awal demo apotek.' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Save className="w-5 h-5 text-teal-600" />
          <span>Cadangkan & Pulihkan Database (Backup & Restore)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Amankan seluruh data transaksi kasir, master obat, riwayat harga, dan akun ke format JSON.
        </p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          statusMsg.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Database Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-slate-500">Master Data Obat</span>
          <p className="font-mono text-xl font-bold text-slate-800 mt-1">{medicines.length} SKU</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-slate-500">Transaksi Penjualan</span>
          <p className="font-mono text-xl font-bold text-slate-800 mt-1">{sales.length} Nota</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-slate-500">Riwayat Perubahan Harga</span>
          <p className="font-mono text-xl font-bold text-slate-800 mt-1">{priceHistories.length} Audit Log</p>
        </div>
      </div>

      {/* Action 1: Export Data */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Download className="w-4 h-4 text-teal-600" />
          <span>Unduh Cadangan Lengkap (Backup JSON)</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Menyimpan seluruh tabel obat, stok fisik, transaksi penjualan kasir, riwayat perubahan harga, dan profil apotek ke dalam satu file berkas JSON portabel.
        </p>
        <button
          onClick={handleExportDownload}
          className="px-5 py-2.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-2xs flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Berkas Backup .JSON</span>
        </button>
      </div>

      {/* Action 2: Import Data */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Upload className="w-4 h-4 text-blue-600" />
          <span>Pulihkan Database (Restore JSON)</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Tempelkan teks data JSON dari berkas backup yang sebelumnya telah disimpan untuk memulihkan seluruh inventori apotek.
        </p>

        <form onSubmit={handleImportSubmit} className="space-y-3">
          <textarea
            rows={4}
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder="Paste string JSON hasil backup di sini..."
            className="w-full p-3 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500 text-slate-800"
          />
          <button
            type="submit"
            disabled={!importText.trim()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs disabled:bg-slate-200 disabled:text-slate-400"
          >
            Pulihkan Data Sekarang
          </button>
        </form>
      </div>

      {/* Action 3: Reset to Demo */}
      <div className="bg-red-50/50 rounded-xl border border-red-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
          <RotateCcw className="w-4 h-4 text-red-600" />
          <span>Reset ke Data Demo Awal</span>
        </div>
        <p className="text-xs text-red-700 leading-relaxed">
          Mengembalikan seluruh data obat (Paramex, Lameson-16, dll), transaksi contoh, dan pengguna demo ke kondisi awal aplikasi.
        </p>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-2xs"
        >
          Reset Seluruh Data
        </button>
      </div>
    </div>
  );
};
