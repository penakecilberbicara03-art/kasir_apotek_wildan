import React, { useState } from 'react';
import { ClipboardCheck, Search, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const StockOpnameView: React.FC = () => {
  const { medicines, updateMedicine, currentUser } = usePharmacy();
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [adjustedMsg, setAdjustedMsg] = useState<string | null>(null);

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.code.includes(search) ||
    m.shelfLocation.toLowerCase().includes(search.toLowerCase())
  );

  const handleSetPhysical = (id: string, val: number) => {
    setCounts(prev => ({ ...prev, [id]: val }));
  };

  const handleSetReason = (id: string, val: string) => {
    setReasons(prev => ({ ...prev, [id]: val }));
  };

  const handleAdjust = (medicineId: string) => {
    const med = medicines.find(m => m.id === medicineId);
    const physical = counts[medicineId];
    if (med === undefined || physical === undefined) return;

    updateMedicine(medicineId, {
      stock: physical,
      lastUpdated: new Date().toISOString()
    });

    setAdjustedMsg(`Stok ${med.name} berhasil disesuaikan menjadi ${physical} ${med.unit}.`);
    setTimeout(() => setAdjustedMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-teal-600" />
          <span>Stock Opname & Penyesuaian Fisik Obat</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Audit berkala jumlah fisik obat di rak apotek dan sinkronkan dengan database sistem.
        </p>
      </div>

      {adjustedMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{adjustedMsg}</span>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari obat atau lokasi rak untuk opname..."
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
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Nama Obat</th>
                <th className="py-3 px-4">Lokasi Rak</th>
                <th className="py-3 px-4 text-center">Stok Sistem</th>
                <th className="py-3 px-4 text-center">Hitung Fisik</th>
                <th className="py-3 px-4 text-center">Selisih</th>
                <th className="py-3 px-4">Alasan Selisih</th>
                <th className="py-3 px-4 text-center">Aksi Penyesuaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(med => {
                const physical = counts[med.id] !== undefined ? counts[med.id] : med.stock;
                const difference = physical - med.stock;

                return (
                  <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">{med.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{med.name}</td>
                    <td className="py-3 px-4 text-slate-600">{med.shelfLocation}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                      {med.stock} {med.unit}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={physical}
                        onChange={e => handleSetPhysical(med.id, parseInt(e.target.value) || 0)}
                        className="w-20 p-1 text-center border border-slate-300 rounded font-mono font-bold text-xs focus:outline-none focus:border-teal-500"
                      />
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {difference === 0 ? (
                        <span className="text-slate-400">0 (Sesuai)</span>
                      ) : difference > 0 ? (
                        <span className="text-emerald-600">+{difference} (Lebih)</span>
                      ) : (
                        <span className="text-red-600">{difference} (Kurang)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Contoh: Obat rusak / Kadaluwarsa / Salah hitung"
                        value={reasons[med.id] || ''}
                        onChange={e => handleSetReason(med.id, e.target.value)}
                        className="w-full p-1 border border-slate-200 rounded text-xs"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleAdjust(med.id)}
                        disabled={difference === 0}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                          difference === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-teal-600 text-white hover:bg-teal-700 shadow-2xs'
                        }`}
                      >
                        Sesuaikan
                      </button>
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
