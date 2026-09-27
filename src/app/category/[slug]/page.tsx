'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { ArrowLeft, ShoppingBag, SlidersHorizontal } from 'lucide-react';

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const resolvedParams = use(params);
  const { categories, products } = useStore();
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high'>('popular');

  const slug = resolvedParams.slug;
  const currentCategory = categories.find(
    (c) => c.slug === slug || c.slug === `cat-${slug}` || c.slug.replace('cat-', '') === slug
  );

  const matchedProducts = products.filter(
    (p) =>
      p.category_id === currentCategory?.id ||
      p.category_id === `cat-${slug}` ||
      p.category_id === slug ||
      (currentCategory?.id && p.category_id === currentCategory.id)
  );

  const sortedProducts = [...matchedProducts].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.selling_price) - Number(b.selling_price);
    if (sortBy === 'price-high') return Number(b.selling_price) - Number(a.selling_price);
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        {/* Header and sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/categories" className="hover:text-green-700 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> All Categories
              </Link>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentCategory?.name || 'Category Products'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Showing {sortedProducts.length} fresh products in this category
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold text-slate-700 bg-white border border-slate-200/90 rounded-xl px-3 py-2 shadow-2xs outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="popular">Sort by: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-base">No items found in this section</h3>
            <p className="text-xs text-slate-500">More groceries are being stocked for this category.</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-green-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Browse All Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {sortedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
