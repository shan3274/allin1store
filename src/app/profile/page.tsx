'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Heart, HelpCircle, LogOut, MapPin, Package, Pencil, ShieldCheck, Smartphone } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { RequireAuth } from '@/components/ui/RequireAuth';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';

function ProfileView() {
  const router = useRouter();
  const { user, addresses, favorites, logout } = useAuth();
  const { orders } = useStore();
  const { showToast } = useToast();
  const myOrders = orders.filter((o) => o.user_id === user?.id);

  const rows = [
    { href: '/orders', icon: Package, label: 'Your orders', hint: myOrders.length ? `${myOrders.length} orders` : undefined },
    { href: '/profile/addresses', icon: MapPin, label: 'Address book', hint: addresses.length ? `${addresses.length} saved` : undefined },
    { href: '/profile/favorites', icon: Heart, label: 'Saved items', hint: favorites.length ? `${favorites.length}` : undefined },
    { href: '/help', icon: HelpCircle, label: 'Help & support' },
  ];

  const info = [
    { href: '/privacy', icon: ShieldCheck, label: 'Privacy policy' },
    { href: '/terms', icon: ShieldCheck, label: 'Terms of service' },
  ];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-3 pb-28 pt-3 md:px-6 md:pt-2">
      <section className="card flex items-center gap-4 px-4 py-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sun-400 text-xl font-extrabold text-ink">
          {user?.full_name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-ink">{user?.full_name || 'Add your name'}</p>
          <p className="text-sm text-ink-muted">{user?.phone}</p>
          {user?.email && <p className="truncate text-sm text-ink-muted">{user.email}</p>}
        </div>
        <Link href="/profile/setup" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-canvas" aria-label="Edit profile">
          <Pencil className="h-4 w-4 text-ink-soft" />
        </Link>
      </section>

      {[rows, info].map((group, gi) => (
        <section key={gi} className="card mt-3 overflow-hidden">
          {gi === 1 && <p className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">More</p>}
          <ul className="divide-y divide-line">
            {group.map(({ href, icon: Icon, label, hint }: { href: string; icon: typeof Package; label: string; hint?: string }) => (
              <li key={href}>
                <Link href={href} className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-canvas/60">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas">
                    <Icon className="h-[18px] w-[18px] text-ink-soft" />
                  </span>
                  <span className="flex-1 text-[15px] text-ink">{label}</span>
                  {hint && <span className="text-sm text-ink-faint">{hint}</span>}
                  <ChevronRight className="h-4 w-4 text-ink-faint" />
                </Link>
              </li>
            ))}
            {gi === 1 && (
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('trigger-pwa-install'))}
                  className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left hover:bg-canvas/60"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas">
                    <Smartphone className="h-[18px] w-[18px] text-ink-soft" />
                  </span>
                  <span className="flex-1 text-[15px] text-ink">Install the app</span>
                  <ChevronRight className="h-4 w-4 text-ink-faint" />
                </button>
              </li>
            )}
          </ul>
        </section>
      ))}

      <button
        onClick={() => {
          logout();
          showToast({ type: 'info', title: 'You’ve been logged out' });
          router.replace('/');
        }}
        className="card mt-3 flex w-full items-center gap-3.5 px-4 py-3.5 text-left text-[15px] text-rose-600 hover:bg-rose-50/50"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50">
          <LogOut className="h-[18px] w-[18px]" />
        </span>
        Log out
      </button>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader hideOnMobile />
      <PageHeader title="Account" />
      <RequireAuth>
        <ProfileView />
      </RequireAuth>
    </div>
  );
}
