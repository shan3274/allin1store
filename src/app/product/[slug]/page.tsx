'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft,
  Heart,
  Plus,
  Minus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const { getProductBySlug, products } = useStore();
  const { items, addToCart, updateQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useAuth();

  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="max-w-lg mx-auto w-full px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
          <p className="text-xs text-slate-500">The grocery item you are looking for may have been moved or discontinued.</p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition"
          >
            Back to Store
          </Link>
        </main>
      </div>
    );
  }

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isFav = isFavorite(product.id);

  const discountPercent = Math.round(
    ((Number(product.mrp) - Number(product.selling_price)) / Number(product.mrp)) * 100
  );

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.min_stock_alert;

  // Similar products from same category
  const similarProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-3 sm:px-6 py-4 space-y-6 flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <Link href="/" className="hover:text-green-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>
          <span>/</span>
          <span className="truncate max-w-[200px] text-slate-800 font-bold">{product.name}</span>
        </div>

        {/* Product Main Display Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Left: Product Image */}
          <div className="relative bg-slate-50 rounded-2xl p-6 flex items-center justify-center min-h-[300px] border border-slate-100 overflow-hidden">
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-xs uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition shadow-xs ${
                isFav
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white hover:bg-slate-100 text-slate-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="max-h-72 w-full object-contain rounded-xl"
              />
            ) : (
              <div className="w-32 h-32 bg-green-100 rounded-3xl flex items-center justify-center text-green-700 font-black text-4xl">
                {product.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Right: Details & Order Controls */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-green-800 bg-green-50 px-2.5 py-0.5 rounded-md border border-green-200">
                  {product.brand || 'Authentic Kirana Item'}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" /> 25-35 mins
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {product.name}
              </h1>

              <div className="text-sm font-bold text-slate-600">
                Quantity: <span className="text-slate-900">{product.weight_volume || product.unit}</span>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-black text-slate-900">
                  ₹{Number(product.selling_price)}
                </span>
                {Number(product.mrp) > Number(product.selling_price) && (
                  <span className="text-base text-slate-400 line-through font-semibold">
                    MRP ₹{Number(product.mrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    You save ₹{Number(product.mrp) - Number(product.selling_price)}
                  </span>
                )}
              </div>

              {/* Stock Status Alert */}
              <div className="pt-1">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Currently out of stock at your local store</span>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center gap-2 text-amber-800 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Hurry! Only {product.stock_quantity} left in stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>In Stock • Ready for immediate packing</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Product Details
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {product.description || '100% genuine packaged grocery item directly sourced from verified manufacturers.'}
                </p>
              </div>

              {/* Assurances */}
              <div className="grid grid-cols-2 gap-2 pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                  <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-[11px] font-semibold">25m Quick Delivery</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-[11px] font-semibold">100% Genuine Quality</span>
                </div>
              </div>
            </div>

            {/* Bottom Add to Cart CTA */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
              {isOutOfStock ? (
                <button
                  disabled
                  className="w-full py-3 bg-slate-100 text-slate-400 font-bold rounded-2xl text-sm cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : quantity > 0 ? (
                <div className="flex items-center justify-between w-full bg-green-700 text-white rounded-2xl p-1.5 shadow-md">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-2 hover:bg-green-800 rounded-xl transition active:scale-95"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-black text-base">{quantity} in Basket</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-2 hover:bg-green-800 rounded-xl transition active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl transition shadow-md shadow-green-700/20 flex items-center justify-center gap-2 active:scale-98"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" />
                  Add to Cart • ₹{Number(product.selling_price)}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Similar items section */}
        {similarProducts.length > 0 && (
          <section className="space-y-3 pt-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Frequently Bought Together
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
