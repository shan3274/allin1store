'use client';

import React, { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { PackageSearch, Search } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductImage } from '@/components/ui/ProductImage';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStore } from '@/context/StoreContext';
import { discountPercent } from '@/lib/format';

type SortKey = 'relevance' | 'price-low' | 'price-high' | 'discount';

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price-low', label: 'Price: low to high' },
  { id: 'price-high', label: 'Price: high to low' },
  { id: 'discount', label: 'Discount' },
];

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { categories, catalog, isHydrated } = useStore();
  const [sort, setSort] = useState<SortKey>('relevance');
  const [brand, setBrand] = useState<string | null>(null);

  const aisles = categories
    .filter((c) => c.slug !== 'all' && c.is_active)
    .sort((a, b) => a.display_order - b.display_order);
  const current = categories.find((c) => c.slug === slug);

  const inCategory = useMemo(
    () => catalog.filter((p) => (slug === 'all' ? true : p.category_id === current?.id)),
    [catalog, current, slug]
  );

  const brands = useMemo(
    () => Array.from(new Set(inCategory.map((p) => p.brand).filter(Boolean) as string[])).sort(),
    [inCategory]
  );

  const products = useMemo(() => {
    const list = inCategory.filter((p) => !brand || p.brand === brand);
    return [...list].sort((a, b) => {
      const stock = Number(b.stock_quantity > 0) - Number(a.stock_quantity > 0);
      if (stock !== 0) return stock;
      if (sort === 'price-low') return a.selling_price - b.selling_price;
      if (sort === 'price-high') return b.selling_price - a.selling_price;
      if (sort === 'discount')
        return discountPercent(b.mrp, b.selling_price) - discountPercent(a.mrp, a.selling_price);
      return Number(b.is_featured) - Number(a.is_featured);
    });
  }, [inCategory, brand, sort]);

  const title = slug === 'all' ? 'All products' : current?.name ?? 'Category';

  if (isHydrated && !current && slug !== 'all') {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <EmptyState
          icon={<PackageSearch className="h-9 w-9" />}
          title="Category not found"
          description="This aisle may have been renamed or removed."
          action={{ label: 'Browse categories', href: '/categories' }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader hideOnMobile />
      <div className="md:hidden">
        <PageHeader
          title={title}
          subtitle={`${products.length} items`}
          backHref="/categories"
          right={
            <Link href="/search" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-canvas" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          }
        />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 md:gap-6 md:px-6 md:pt-6">
        {/* Aisle sidebar */}
        <aside className="no-scrollbar sticky top-[57px] h-[calc(100vh-57px)] w-[84px] shrink-0 overflow-y-auto border-r border-line bg-white pb-24 md:top-[92px] md:h-[calc(100vh-110px)] md:w-60 md:rounded-2xl md:border md:pb-2">
          {aisles.map((c) => {
            const active = c.slug === slug;
            return (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                replace
                className={`relative flex flex-col items-center gap-1.5 px-1.5 py-3 text-center transition md:flex-row md:gap-3 md:px-3 md:py-2.5 md:text-left ${
                  active ? 'bg-leaf-50' : 'hover:bg-canvas'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span className={`h-12 w-12 shrink-0 overflow-hidden rounded-full md:h-10 md:w-10 ${active ? 'ring-2 ring-leaf-500 ring-offset-2 ring-offset-leaf-50' : 'bg-tile'}`}>
                  <ProductImage src={c.image_url} alt={c.name} className="h-full w-full rounded-full object-cover" fallbackClassName="text-sm" />
                </span>
                <span className={`line-clamp-2 text-[11px] leading-tight md:text-sm ${active ? 'font-semibold text-leaf-700' : 'text-ink-soft'}`}>
                  {c.name}
                </span>
              </Link>
            );
          })}
        </aside>

        <main className="min-w-0 flex-1 px-2.5 pb-28 pt-3 md:bg-transparent md:px-0 md:pb-10 md:pt-0">
          <div className="mb-3 hidden items-end justify-between md:flex">
            <div>
              <h1 className="section-title">{title}</h1>
              <p className="text-sm text-ink-muted">{products.length} items</p>
            </div>
          </div>

          <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] font-medium text-ink-soft"
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
            {brands.length > 1 &&
              brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrand(brand === b ? null : b)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
                    brand === b ? 'border-leaf-500 bg-leaf-50 text-leaf-700' : 'border-line bg-white text-ink-soft'
                  }`}
                >
                  {b}
                </button>
              ))}
          </div>

          {products.length === 0 ? (
            <EmptyState
              icon={<PackageSearch className="h-9 w-9" />}
              title="Nothing here yet"
              description="We’re restocking this aisle. Check back soon."
              action={{ label: 'Browse all categories', href: '/categories' }}
            />
          ) : (
            <ProductGrid products={products} dense />
          )}
        </main>
      </div>
    </div>
  );
}
