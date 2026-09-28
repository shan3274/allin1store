'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductGrid } from '@/components/ProductGrid';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';

export default function FavoritesPage() {
  const { favorites } = useAuth();
  const { catalog } = useStore();
  const saved = catalog.filter((p) => favorites.includes(p.id));

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader hideOnMobile />
      <PageHeader title="Saved items" subtitle={saved.length ? `${saved.length} items` : undefined} backHref="/profile" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 pb-28 pt-3 md:px-6">
        {saved.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-9 w-9" />}
            title="No saved items yet"
            description="Tap the heart on any product to keep it here for quick re-ordering."
            action={{ label: 'Browse products', href: '/' }}
          />
        ) : (
          <ProductGrid products={saved} />
        )}
      </main>
    </div>
  );
}
