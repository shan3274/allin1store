'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import {
  Sparkles,
  Percent,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Flame,
  ShoppingBag,
  Zap,
  Tag,
  ArrowRight
} from 'lucide-react';

export default function StorefrontPage() {
  const { products, categories, settings } = useStore();
  const { freeDeliveryThreshold, amountNeededForFreeDelivery } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.barcode && product.barcode.includes(searchQuery));

    const matchesCategory =
      selectedCategory === 'all' ||
      product.category_id === selectedCategory ||
      product.category_id === `cat-${selectedCategory}`;

    return matchesSearch && matchesCategory;
  });

  const dealsProducts = products.filter((p) => {
    const discount = Math.round(((Number(p.mrp) - Number(p.selling_price)) / Number(p.mrp)) * 100);
    return discount >= 10;
  });

  const featuredProducts = products.filter((p) => p.is_featured);

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 space-y-6 flex-1">
        {/* FREE DELIVERY ALERT BAR */}
        {amountNeededForFreeDelivery > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-xs font-black shadow-xs">
                ⚡
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                Add <span className="text-emerald-700 font-black">₹{amountNeededForFreeDelivery}</span> more groceries for <span className="text-emerald-700 font-black">FREE 25-min delivery</span>!
              </p>
            </div>
            <Link
              href="/categories"
              className="text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 whitespace-nowrap pl-2"
            >
              Shop now <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* HERO BANNER SECTION */}
        {!searchQuery && selectedCategory === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
            {/* Primary Kirana Banner */}
            <div className="lg:col-span-2 bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-3 max-w-lg z-10">
                <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-emerald-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Aapki Apni Neighbourhood Dukaan
                </div>
                <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
                  Fresh Chakki Atta, Pure Desi Ghee & Daily Essentials
                </h1>
                <p className="text-green-100 text-xs sm:text-sm font-medium leading-relaxed">
                  Superfast doorstep delivery in 25–35 minutes right from your trusted local market with honest retail prices.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-6 z-10">
                <button
                  onClick={() => setSelectedCategory('atta-flour')}
                  className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Tag className="w-4 h-4" /> Shop Atta & Pulses
                </button>
                <Link
                  href="/admin"
                  className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 border border-white/20"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" /> Owner Operations
                </Link>
              </div>

              <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 pointer-events-none select-none">
                🌾
              </div>
            </div>

            {/* Quick Benefits Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                  Today's Store Offer
                </span>
                <div className="flex items-center gap-2 text-green-700 font-black text-2xl mt-1">
                  <Percent className="w-6 h-6 text-green-600" /> Up to 25% Off
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  Heavy discounts on packaged pulses, aromatic basmati rice & branded cooking oils.
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700 font-semibold">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>Store Hours: <strong>07:00 AM – 10:30 PM</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Free delivery on orders <strong>₹{freeDeliveryThreshold}+</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span>Real-time inventory directly with shop counter</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SHOP BY CATEGORY SECTION */}
        <section className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Explore Grocery Categories
              </h2>
              <p className="text-xs text-slate-500 font-medium">Everything your household needs, sorted cleanly</p>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-green-700 hover:text-green-800 font-black flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200"
              >
                View All Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {categories.map((cat) => {
              const slugKey = cat.slug.replace('cat-', '');
              const icon = categoryIconMap[slugKey] || '🛒';
              const isSelected = selectedCategory === cat.slug || selectedCategory === slugKey;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(slugKey)}
                  className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all duration-200 text-center group ${
                    isSelected
                      ? 'bg-green-50/90 border-green-600 text-green-900 font-black shadow-xs ring-2 ring-green-600/20'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700 font-bold'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform">
                    {icon}
                  </span>
                  <span className="text-[11px] leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* TODAY'S HOT DEALS SECTION */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-orange-100 text-orange-600 p-2 rounded-xl font-bold">
                  <Flame className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Today's Kirana Deals
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">Extra savings on essential daily staples</p>
                </div>
              </div>
              <span className="text-xs text-orange-700 font-black bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Min 10% Off
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {dealsProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* BEST SELLERS & ESSENTIALS */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Most Popular in Ghaziabad
                </h2>
                <p className="text-xs text-slate-500 font-medium">Bestselling atta, ghee, pulses & biscuits</p>
              </div>
              <Link
                href="/categories"
                className="text-xs text-green-700 font-bold hover:underline flex items-center gap-0.5"
              >
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {featuredProducts.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* MAIN PRODUCT CATALOG */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : selectedCategory === 'all'
                  ? 'All Grocery Essentials'
                  : categories.find((c) => c.slug.includes(selectedCategory))?.name || 'Category Groceries'}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Showing {filteredProducts.length} items available in stock
              </span>
            </div>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1 bg-white border border-slate-200 rounded-xl shadow-xs"
              >
                Reset Filter
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-lg">No products match your filter</h3>
                <p className="text-xs text-slate-500">
                  Try searching for another item like atta, ghee, dal, salt, oil, or tea.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer info */}
      <footer className="bg-white border-t border-slate-200/80 mt-12 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-bold text-slate-700">{settings.store_name} • {settings.tagline}</p>
        <p>{settings.address}, {settings.city}, {settings.state} - {settings.pincode}</p>
        <p className="text-[11px] text-slate-400">Production Quick-Commerce Kirana Experience • Real-time Store POS Sync</p>
      </footer>
    </div>
  );
}
