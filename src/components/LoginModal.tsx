import React, { useState } from 'react';
import { ShieldCheck, Key, User, X, CheckCircle, ArrowRight } from 'lucide-react';
import { usePharmacy } from '../context/PharmacyContext';
import { UserRole } from '../types/pharmacy';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { users, currentUser, login, switchUserRole } = usePharmacy();
  const [username, setUsername] = useState('kasir1');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = login(username, pin);
    if (success) {
      onClose();
    } else {
      setError('Username atau PIN kasir salah. Silakan coba lagi.');
    }
  };

  const handleQuickRole = (role: UserRole) => {
    switchUserRole(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-[#2d3238] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">Masuk Sistem POS Apotek</h3>
              <p className="text-xs text-slate-400">Pilih peran akun (Kasir, Manajer, Owner)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 1-Click Quick Select for Evaluation / Demo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Masuk Cepat Demo (1-Klik)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickRole('kasir')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentUser.role === 'kasir'
                    ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  Kasir
                </span>
                <p className="font-bold text-slate-900 text-xs mt-2">Budi</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">PIN: 1234</p>
                <p className="text-[10px] text-teal-700 font-medium mt-1">POS & Cek Stok</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('manajer')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentUser.role === 'manajer'
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Manajer
                </span>
                <p className="font-bold text-slate-900 text-xs mt-2">Siti, S.Farm</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">PIN: 2345</p>
                <p className="text-[10px] text-blue-700 font-medium mt-1">CRUD & Harga</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('owner')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentUser.role === 'owner'
                    ? 'border-purple-500 bg-purple-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  Owner
                </span>
                <p className="font-bold text-slate-900 text-xs mt-2">Seniman Koding</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">PIN: 3456</p>
                <p className="text-[10px] text-purple-700 font-medium mt-1">Full Akses & Laba</p>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-xs uppercase font-medium">
              Atau Masuk dengan PIN Manual
            </span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* Manual Form */}
          <form onSubmit={handleManualLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username Petugas</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="kasir1 / manajer / owner"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">PIN Keamanan (4 Digit)</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 font-mono text-slate-800 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 text-white rounded-lg font-bold text-xs hover:bg-teal-700 transition-colors shadow-2xs flex items-center justify-center gap-2 mt-4"
            >
              <span>Verifikasi & Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
