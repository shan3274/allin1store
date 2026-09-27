'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useStore } from '@/context/StoreContext';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function CategoriesHubPage() {
  const { categories, products } = useStore();

  const categoryIconMap: Record<string, string> = {
    'atta-flour': '🌾',
    'rice-grains': '🍚',
    'pulses-dal': '🍲',
    'oil-ghee': '🛢️',
    'spices-masala': '🌶️',
    'salt-sugar': '🧂',
    'dairy-bread': '🥛',
    'biscuits-snacks': '🍪',
    'tea-coffee': '☕',
    'instant-food': '🍜',
    'dry-fruits': '🥜',
    'cleaning-household': '🧼',
    'personal-care': '🧴',
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              All Grocery Categories
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Browse staples, pantry items, dairy, snacks & household cleaning
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories
            .filter((c) => c.slug !== 'all')
            .map((cat) => {
              const slugKey = cat.slug.replace('cat-', '');
              const icon = categoryIconMap[slugKey] || '🛒';
              const itemCount = products.filter(
                (p) => p.category_id === cat.id || p.category_id === `cat-${slugKey}` || p.category_id === slugKey
              ).length;

              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all hover:border-green-400 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl sm:text-4xl p-2 bg-slate-50 group-hover:bg-green-50 rounded-2xl transition-colors">
                      {icon}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-green-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-green-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">
                      {itemCount} products available
                    </span>
                  </div>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
}
