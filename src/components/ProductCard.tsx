'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/database';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Plus, Minus, Heart, Sparkles, Clock } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useAuth();

  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isFav = isFavorite(product.id);

  const discountPercent = Math.round(
    ((Number(product.mrp) - Number(product.selling_price)) / Number(product.mrp)) * 100
  );

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.min_stock_alert;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative hover:border-green-300">
      {/* Top badges & Favorite button */}
      <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {discountPercent > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-xs tracking-wider uppercase">
              {discountPercent}% OFF
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
              Only {product.stock_quantity} left
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`w-7 h-7 rounded-full flex items-center justify-center pointer-events-auto backdrop-blur-xs transition shadow-xs ${
            isFav
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700'
          }`}
          title={isFav ? 'Remove from wishlist' : 'Save for later'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Link */}
      <Link
        href={`/product/${product.slug}`}
        className="relative p-3 bg-slate-50/70 flex items-center justify-center h-44 overflow-hidden"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-black text-2xl">
            {product.name.charAt(0)}
          </div>
        )}
      </Link>

      {/* Product Info Section */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{product.brand || 'Kirana'}</span>
            <span>•</span>
            <span className="text-emerald-700 flex items-center gap-0.5">
              <Clock className="w-3 h-3" /> 25m
            </span>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug mt-0.5 hover:text-green-700 transition">
              {product.name}
            </h3>
          </Link>

          <span className="text-xs text-slate-500 font-semibold block mt-1">
            {product.weight_volume || product.unit}
          </span>
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-900">
                ₹{Number(product.selling_price)}
              </span>
              {Number(product.mrp) > Number(product.selling_price) && (
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{Number(product.mrp)}
                </span>
              )}
            </div>
          </div>

          {/* ADD / Quantity Counter Button */}
          {isOutOfStock ? (
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              Out of stock
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-green-700 text-white rounded-xl shadow-xs">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="p-1.5 sm:p-2 hover:bg-green-800 transition rounded-l-xl active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-black text-xs min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="p-1.5 sm:p-2 hover:bg-green-800 transition rounded-r-xl active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="px-3.5 py-1.5 sm:py-2 bg-green-50 hover:bg-green-600 text-green-700 hover:text-white border border-green-300 hover:border-green-600 rounded-xl text-xs font-black transition flex items-center gap-1 shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
