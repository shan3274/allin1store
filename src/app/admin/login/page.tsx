'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { LogoMark } from '@/components/Logo';

function OwnerLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const target = next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin';

  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not sign in.');
        setLoading(false);
        return;
      }
      router.replace(target);
      router.refresh();
    } catch {
      setError('Network error. Check your connection.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="passcode" className="mb-1.5 block text-xs font-semibold text-slate-300">
          Owner passcode
        </label>
        <div className="flex h-12 items-center rounded-xl border border-slate-700 bg-slate-900 px-3.5 focus-within:border-emerald-500">
          <Lock className="mr-2.5 h-4 w-4 text-slate-500" />
          <input
            id="passcode"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setError(null);
            }}
            className="h-full flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Enter passcode"
          />
        </div>
        {error && <p className="mt-2 text-xs font-medium text-rose-400">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={!passcode || loading}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-5 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <LogoMark className="mx-auto mb-5 h-12 w-12" />
          <h1 className="text-xl font-bold">Owner console</h1>
          <p className="mt-1 text-sm text-slate-400">Orders, billing, stock and store settings</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <Suspense fallback={null}>
            <OwnerLoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300">
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
