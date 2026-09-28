'use client';

import React from 'react';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import { PageHeader } from './ui/PageHeader';
import { useStore } from '@/context/StoreContext';
import type { StoreSettings } from '@/types/database';

export interface LegalSection {
  heading: string;
  body: (s: StoreSettings) => React.ReactNode;
}

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  const { settings } = useStore();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader hideOnMobile />
      <PageHeader title={title} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10 pt-4 md:px-6">
        <p className="mb-6 text-sm text-ink-muted">Last updated {updated}</p>
        <div className="space-y-6">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-2 text-base font-bold text-ink">{s.heading}</h2>
              <div className="space-y-2 text-[15px] leading-relaxed text-ink-soft">{s.body(settings)}</div>
            </section>
          ))}
          <section>
            <h2 className="mb-2 text-base font-bold text-ink">Contact</h2>
            <p className="text-[15px] leading-relaxed text-ink-soft">
              {settings.store_name}, {settings.address}, {settings.city}, {settings.state} {settings.pincode}. Phone{' '}
              {settings.phone}
              {settings.email ? `, email ${settings.email}` : ''}.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
