'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Store, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { loginWithPhone, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      showToast({
        type: 'error',
        title: 'Invalid Mobile Number',
        message: 'Please enter a valid 10-digit Indian phone number.',
      });
      return;
    }

    setIsSubmitting(true);
    await loginWithPhone(phone, fullName || 'Kirana Customer');
    router.push(`/verify-otp?phone=${encodeURIComponent(phone)}&redirect=${encodeURIComponent(redirect)}`);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    await loginWithGoogle();
    showToast({
      type: 'success',
      title: 'Google Login',
      message: 'Signed in securely with Google.',
    });
    router.push(redirect);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Mobile Number</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500">
            <span className="px-3.5 text-xs font-black text-slate-500 border-r border-slate-200 bg-slate-100/60 py-3">
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              autoFocus
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full text-xs font-bold p-3 bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Full Name (Optional)</label>
          <input
            type="text"
            placeholder="Rahul Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || phone.length < 10}
          className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2"
        >
          <span>Send OTP Verification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="relative py-2 flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="absolute bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Or continue with
        </span>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-2xl border border-slate-200 transition flex items-center justify-center gap-2"
      >
        <span className="text-base">🇬</span>
        <span>Continue with Google</span>
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-md mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-green-700 to-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome to Apni Kirana
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Enter your mobile number to get OTP for quick grocery ordering
          </p>
        </div>

        <Suspense fallback={<div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400">Loading form...</div>}>
          <LoginForm />
        </Suspense>

        <p className="text-[11px] text-center text-slate-400 font-medium">
          By signing in, you agree to our Terms of Service & Privacy Policy.
        </p>
      </main>
    </div>
  );
}
