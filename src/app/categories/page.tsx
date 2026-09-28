'use client';

import React from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CategoryTile } from '@/components/CategoryTile';
import { useStore } from '@/context/StoreContext';

export default function CategoriesPage() {
  const { categories, catalog } = useStore();
  const list = categories
    .filter((c) => c.slug !== 'all' && c.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 pt-5 md:px-6 md:pt-8">
        <h1 className="section-title mb-1">All categories</h1>
        <p className="mb-6 text-sm text-ink-muted">{catalog.length} products across {list.length} aisles</p>
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-5 lg:grid-cols-8">
          {list.map((c) => (
            <CategoryTile key={c.id} category={c} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
