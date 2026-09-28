'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Product } from '@/types/database';
import { useAuth } from '@/context/AuthContext';
import { discountPercent, formatINR } from '@/lib/format';
import { ProductImage } from './ui/ProductImage';
import { QuantityStepper } from './ui/QuantityStepper';

interface ProductCardProps {
  product: Product;
  /** Fixed-width card for horizontal rails. */
  rail?: boolean;
}

export function ProductCard({ product, rail = false }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useAuth();
  const isFav = isFavorite(product.id);
  const off = discountPercent(product.mrp, product.selling_price);
  const soldOut = product.stock_quantity <= 0;
  const lowStock = !soldOut && product.stock_quantity <= Math.min(product.min_stock_alert, 5);

  return (
    <div
      className={`group relative flex flex-col rounded-2xl bg-white p-2 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop ${
        rail ? 'w-[150px] shrink-0 sm:w-[176px]' : ''
      }`}
    >
      <Link href={`/product/${product.slug}`} className="relative block" aria-label={product.name}>
        <div className="relative aspect-[4/3.6] overflow-hidden rounded-xl bg-tile">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] ${soldOut ? 'opacity-50 grayscale' : ''}`}
          />
          {off > 0 && !soldOut && (
            <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-offer shadow-xs">
              {off}% off
            </span>
          )}
          {soldOut && (
            <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-white">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink-faint shadow-xs transition hover:text-offer"
        aria-label={isFav ? 'Remove from saved items' : 'Save item'}
        aria-pressed={isFav}
      >
        <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-offer text-offer' : ''}`} />
      </button>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-2.5">
        {product.brand && <p className="mb-0.5 truncate text-[11px] font-medium uppercase tracking-wide text-ink-faint">{product.brand}</p>}
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5em] text-[13px] font-medium leading-[1.25] text-ink">{product.name}</h3>
        </Link>
        <p className="mt-1 text-xs text-ink-muted">
          {product.weight_volume || product.unit}
          {lowStock && <span className="font-medium text-offer"> · {product.stock_quantity} left</span>}
        </p>

        <div className="mt-auto flex items-end justify-between gap-1 pt-3">
          <div className="leading-tight">
            <p className="tabular text-[15px] font-bold text-ink">{formatINR(product.selling_price)}</p>
            {off > 0 && <p className="tabular text-[11px] text-ink-faint line-through">{formatINR(product.mrp)}</p>}
          </div>
          <QuantityStepper product={product} size="sm" />
        </div>
      </div>
    </div>
  );
}
