'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { Search, ArrowLeft, X, TrendingUp, Clock, ShoppingBag } from 'lucide-react';

export default function SearchPage() {
  const { products } = useStore();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'atta',
    'desi ghee',
    'toor dal',
    'tata salt',
    'maggi',
  ]);

  const popularTags = ['Aashirvaad Atta', 'Amul Ghee', 'Basmati Rice', 'Parle-G', 'Mustard Oil', 'Vim Gel'];

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) ||
          (p.description && p.description.toLowerCase().includes(query.toLowerCase())) ||
          (p.barcode && p.barcode.includes(query))
      )
    : [];

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev.slice(0, 4)]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar searchQuery={query} onSearchChange={setQuery} />

      <main className="max-w-4xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        {/* Dedicated Search Header Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by brand, item name, barcode, or Hindi keyword..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500 border border-slate-200"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* When Query is empty: Show Recent & Popular Suggestions */}
        {!query.trim() ? (
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent Searches
                  </span>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-slate-400 hover:text-rose-600 font-bold"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectSearch(term)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <span className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Popular in Store
              </span>

              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectSearch(tag)}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Search className="w-3 h-3 text-emerald-600" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-800">
                Found {filtered.length} products for "{query}"
              </h2>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-extrabold text-slate-800 text-base">No matches found</h3>
                <p className="text-xs text-slate-500">
                  Try searching for keywords like "atta", "dal", "oil", "sugar", or "ghee".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
