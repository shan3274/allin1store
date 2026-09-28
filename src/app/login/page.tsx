'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { Logo } from '@/components/Logo';
import { isValidIndianMobile } from '@/lib/format';
import { safeRedirect } from '@/lib/safeRedirect';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safeRedirect(params.get('redirect'));
  const { requestOtp, isAuthenticated, isHydrated } = useAuth();
  const { settings } = useStore();
  const { showToast } = useToast();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isHydrated && isAuthenticated) router.replace(redirect);
  }, [isHydrated, isAuthenticated, redirect, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidIndianMobile(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setSubmitting(true);
    const code = requestOtp(phone);
    // No SMS gateway is connected yet — surface the code on screen (test mode).
    showToast({
      type: 'info',
      title: `Your ${settings.store_name} code is ${code}`,
      message: 'Test mode: SMS delivery isn’t connected yet.',
      duration: 12000,
    });
    router.push(`/verify-otp?redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <label htmlFor="phone" className="sr-only">
        Mobile number
      </label>
      <div className={`flex h-14 items-center rounded-2xl border bg-white px-4 transition focus-within:border-leaf-500 ${error ? 'border-rose-400' : 'border-line'}`}>
        <span className="mr-3 border-r border-line pr-3 text-base font-semibold text-ink-soft">+91</span>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          autoFocus
          maxLength={10}
          placeholder="Enter mobile number"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, ''));
            setError(null);
          }}
          className="tabular h-full flex-1 bg-transparent text-lg font-semibold tracking-wide text-ink placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-ink-faint focus:outline-none"
        />
      </div>
      {error && <p className="mt-2 text-left text-xs font-medium text-rose-600">{error}</p>}
      <button type="submit" disabled={phone.length !== 10 || submitting} className="btn-primary mt-4 h-14 w-full text-base">
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { settings } = useStore();
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="px-2 pt-2">
        <button onClick={() => router.back()} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-canvas" aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>
      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center px-6 pb-10 pt-6 text-center md:justify-center md:pt-0">
        <Logo name={settings.store_name} />
        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight text-ink">Your neighbourhood kirana, online</h1>
        <p className="mb-8 mt-2 text-[15px] text-ink-muted">Sign in with your mobile number</p>
        <Suspense fallback={<div className="h-[136px]" />}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-xs leading-relaxed text-ink-faint">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2">Terms of service</Link> &amp;{' '}
          <Link href="/privacy" className="underline underline-offset-2">Privacy policy</Link>
        </p>
      </main>
    </div>
  );
}
