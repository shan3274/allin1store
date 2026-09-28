'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { formatPhone } from '@/lib/format';
import { safeRedirect } from '@/lib/safeRedirect';

const LENGTH = 6;
const RESEND_SECONDS = 30;

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));
  const { verifyOtp, requestOtp, pendingPhone, isHydrated } = useAuth();
  const { settings } = useStore();
  const { showToast } = useToast();

  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isHydrated && !pendingPhone && !verifying) router.replace(`/login?redirect=${encodeURIComponent(redirect)}`);
  }, [isHydrated, pendingPhone, verifying, router, redirect]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const submit = (code: string) => {
    if (code.length !== LENGTH || verifying) return;
    setVerifying(true);
    const res = verifyOtp(code);
    if (res.ok) {
      router.replace(res.isNewUser ? `/profile/setup?redirect=${encodeURIComponent(redirect)}` : redirect);
      return;
    }
    setVerifying(false);
    setError(res.error);
    setDigits(Array(LENGTH).fill(''));
    inputs.current[0]?.focus();
  };

  const setAt = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }
    // Handles typing a digit as well as pasting / SMS autofill of the full code.
    const next = [...digits];
    clean
      .slice(0, LENGTH - index)
      .split('')
      .forEach((d, i) => (next[index + i] = d));
    setDigits(next);
    setError(null);
    const focusAt = Math.min(index + clean.length, LENGTH - 1);
    inputs.current[focusAt]?.focus();
    if (next.every(Boolean)) submit(next.join(''));
  };

  const resend = () => {
    if (!pendingPhone) return;
    const code = requestOtp(pendingPhone);
    setTimer(RESEND_SECONDS);
    setError(null);
    showToast({
      type: 'info',
      title: `Your ${settings.store_name} code is ${code}`,
      message: 'Test mode: SMS delivery isn’t connected yet.',
      duration: 12000,
    });
  };

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Enter verification code</h1>
      <p className="mt-2 text-[15px] text-ink-muted">
        Sent to <span className="font-semibold text-ink">{pendingPhone ? formatPhone(pendingPhone) : '…'}</span>
      </p>

      <div className="mt-8 flex justify-center gap-2.5" role="group" aria-label="One-time code">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={d}
            onChange={(e) => setAt(i, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
            }}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            autoFocus={i === 0}
            maxLength={LENGTH}
            aria-label={`Digit ${i + 1}`}
            className={`tabular h-14 w-12 rounded-xl border bg-white text-center text-xl font-bold text-ink transition focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/15 ${
              error ? 'border-rose-400' : 'border-line'
            }`}
          />
        ))}
      </div>

      <div className="mt-4 min-h-[20px] text-sm">
        {verifying ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-leaf-500" />
        ) : error ? (
          <p className="font-medium text-rose-600">{error}</p>
        ) : null}
      </div>

      <div className="mt-6 text-sm text-ink-muted">
        {timer > 0 ? (
          <span>
            Resend code in <span className="tabular font-semibold text-ink">{timer}s</span>
          </span>
        ) : (
          <button onClick={resend} className="font-semibold text-leaf-600">
            Resend code
          </button>
        )}
      </div>
    </>
  );
}

export default function VerifyOtpPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="px-2 pt-2">
        <button onClick={() => router.back()} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-canvas" aria-label="Change number">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col px-6 pb-10 pt-6 text-center md:justify-center md:pt-0">
        <Suspense fallback={null}>
          <VerifyForm />
        </Suspense>
      </main>
    </div>
  );
}
