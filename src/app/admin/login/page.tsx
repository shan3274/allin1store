'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ShieldCheck, ArrowRight, Store, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuth();
  const { showToast } = useToast();

  const [passcode, setPasscode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(passcode);
    if (success) {
      showToast({
        type: 'success',
        title: 'Owner Authenticated',
        message: 'Welcome to Kirana Store Management & POS.',
      });
      router.push('/admin');
    } else {
      showToast({
        type: 'error',
        title: 'Authentication Failed',
        message: 'Invalid owner passcode. Try "admin123" or "123456".',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-400 text-slate-950 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-green-500/20 font-black">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Owner & POS Portal</h1>
          <p className="text-xs text-slate-400">
            Secure administrative console for billing, stock control and orders
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Enter Store Passcode</label>
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden px-3.5 py-3">
              <Lock className="w-4 h-4 text-slate-500 mr-2" />
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter passcode (demo: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full text-xs font-bold bg-transparent outline-none text-white placeholder-slate-500"
              />
            </div>
            <p className="text-[11px] text-green-400 font-semibold pt-1">
              Demo passcode: <strong>admin123</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>Access Owner Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white font-semibold">
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
