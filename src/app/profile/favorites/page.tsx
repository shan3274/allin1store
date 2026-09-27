'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { Heart, ArrowLeft, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useAuth();
  const { products } = useStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <Link href="/profile" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
          </Link>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Saved Grocery Essentials
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Quickly re-order the items your kitchen uses frequently
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3 shadow-2xs">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto text-2xl">
              ❤️
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No saved staples yet</h3>
            <p className="text-xs text-slate-500">
              Tap the heart icon on any product to save it here for fast re-ordering.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
            >
              Explore Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {favoriteProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
