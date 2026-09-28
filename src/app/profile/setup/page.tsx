'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { RequireAuth } from '@/components/ui/RequireAuth';
import { SiteHeader } from '@/components/SiteHeader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { safeRedirect } from '@/lib/safeRedirect';

function ProfileForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect');
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const isOnboarding = !user?.full_name;

  const [name, setName] = useState(user?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Please enter your name';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    setErrors(next);
    if (Object.keys(next).length) return;
    updateProfile({ full_name: name.trim(), email: email.trim() || null });
    if (!isOnboarding) showToast({ type: 'success', title: 'Profile updated' });
    router.replace(safeRedirect(redirect, isOnboarding ? '/' : '/profile'));
  };

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 pb-10 pt-4">
      {isOnboarding && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink">Welcome! What should we call you?</h2>
          <p className="mt-1 text-sm text-ink-muted">We’ll use this on your orders and delivery updates.</p>
        </div>
      )}
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label className="field-label" htmlFor="p-name">Full name *</label>
          <input id="p-name" autoFocus className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          {errors.name && <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="p-email">Email (optional)</label>
          <input id="p-email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          {errors.email && <p className="mt-1 text-xs font-medium text-rose-600">{errors.email}</p>}
        </div>
        <div>
          <label className="field-label" htmlFor="p-phone">Mobile number</label>
          <input id="p-phone" className="field bg-canvas text-ink-muted" value={user?.phone ?? ''} disabled />
          <p className="mt-1 text-xs text-ink-faint">Your login number can’t be changed.</p>
        </div>
        <button type="submit" className="btn-primary h-12 w-full">
          {isOnboarding ? 'Continue' : 'Save changes'}
        </button>
      </form>
    </main>
  );
}

export default function ProfileSetupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader hideOnMobile />
      <PageHeader title="Your details" backHref="/profile" />
      <RequireAuth>
        <Suspense fallback={null}>
          <ProfileForm />
        </Suspense>
      </RequireAuth>
    </div>
  );
}
