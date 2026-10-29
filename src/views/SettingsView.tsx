import React, { useState } from 'react';
import { Store, Save, CheckCircle2, Building, Shield } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';

export const SettingsView: React.FC = () => {
  const { profile, updateProfile } = usePharmacy();
  const [formData, setFormData] = useState(profile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Store className="w-5 h-5 text-teal-600" />
          <span>Pengaturan Profil Apotek & Format Struk</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Kelola data legalitas apotek, nomor SIPA, APA, dan teks footer pada nota transaksi kasir.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan apotek berhasil disimpan ke database lokal.</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Resmi Apotek *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Cabang
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Apoteker Pengelola Apotek (APA) *
              </label>
              <input
                type="text"
                required
                value={formData.pharmacistName}
                onChange={e => setFormData({ ...formData, pharmacistName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor SIPA (Surat Izin Praktik Apoteker) *
              </label>
              <input
                type="text"
                required
                value={formData.sipa}
                onChange={e => setFormData({ ...formData, sipa: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor SIA (Surat Izin Apotek)
              </label>
              <input
                type="text"
                value={formData.sia}
                onChange={e => setFormData({ ...formData, sia: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp Kasir
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Alamat Lengkap Apotek
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Pesan Footer Struk Kasir Termal
            </label>
            <textarea
              rows={2}
              value={formData.receiptFooter}
              onChange={e => setFormData({ ...formData, receiptFooter: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-2xs"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
