'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { formatClock } from '@/lib/storeHours';

export function SiteFooter() {
  const { settings, categories } = useStore();
  const year = new Date().getFullYear();
  const cats = categories.filter((c) => c.slug !== 'all' && c.is_active).slice(0, 12);

  return (
    <footer className="mt-10 border-t border-line bg-canvas/60 pb-28 pt-10 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1.2fr_2fr] md:px-6">
        <div className="space-y-3 text-sm text-ink-muted">
          <p className="text-base font-bold text-ink">{settings.store_name}</p>
          <p>
            {settings.address}, {settings.city}, {settings.state} {settings.pincode}
          </p>
          <p>
            Open {formatClock(settings.opening_time)} – {formatClock(settings.closing_time)} ·{' '}
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="font-medium text-ink-soft hover:text-ink">
              {settings.phone}
            </a>
          </p>
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="block hover:text-ink">
              {settings.email}
            </a>
          )}
        </div>
        <div className="hidden md:block">
          <p className="mb-3 text-sm font-bold text-ink">Categories</p>
          <ul className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm text-ink-muted">
            {cats.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-ink">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-line px-4 pt-6 text-xs text-ink-faint md:flex-row md:items-center md:justify-between md:px-6">
        <p>© {year} {settings.store_name}. All rights reserved.</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/help" className="hover:text-ink">Help</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/refund-policy" className="hover:text-ink">Cancellation &amp; refunds</Link>
          <Link href="/admin/login" className="hover:text-ink">Store owner login</Link>
        </nav>
      </div>
    </footer>
  );
}
