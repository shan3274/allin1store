'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, CheckCircle2, RotateCw } from 'lucide-react';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '9876543210';
  const redirect = searchParams.get('redirect') || '/';
  const { verifyOtp } = useAuth();
  const { showToast } = useToast();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      showToast({
        type: 'error',
        title: 'Incomplete OTP',
        message: 'Please enter all 6 digits of your OTP.',
      });
      return;
    }

    setIsVerifying(true);
    const isValid = await verifyOtp(otpValue);

    if (isValid) {
      showToast({
        type: 'success',
        title: 'Verification Successful!',
        message: 'Welcome to your Kirana store.',
      });
      router.push(redirect);
    } else {
      showToast({
        type: 'error',
        title: 'Invalid OTP',
        message: 'Incorrect OTP. Try 123456.',
      });
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Verify Mobile Number
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Enter 6-digit verification code sent to <strong className="text-slate-900">+91 {phone}</strong>
        </p>
        <p className="text-[11px] text-green-700 font-semibold bg-green-50 py-1 rounded-md inline-block px-2">
          Demo OTP: <strong>123456</strong>
        </p>
      </div>

      <form onSubmit={handleVerify} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        {/* 6 Digit Input Group */}
        <div className="flex justify-between gap-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-digit-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoFocus={idx === 0}
              value={digit}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-14 text-center font-black text-lg bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 transition shadow-inner"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isVerifying || otp.join('').length < 6}
          className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2"
        >
          {isVerifying ? 'Verifying Code...' : 'Confirm & Continue'}
        </button>

        <div className="text-center pt-2">
          {timer > 0 ? (
            <span className="text-xs text-slate-400 font-medium">
              Resend OTP in <strong>{timer}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setTimer(30)}
              className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1 mx-auto"
            >
              <RotateCw className="w-3 h-3" /> Resend OTP
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-md mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center space-y-6">
        <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 self-start">
          <ArrowLeft className="w-3.5 h-3.5" /> Change Phone Number
        </Link>

        <Suspense fallback={<div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400">Loading verification...</div>}>
          <VerifyOtpForm />
        </Suspense>
      </main>
    </div>
  );
}
