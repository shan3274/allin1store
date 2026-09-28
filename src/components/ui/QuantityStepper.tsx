'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Product } from '@/types/database';
import { useCart } from '@/context/CartContext';

interface QuantityStepperProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  /** Label for the empty state button. */
  addLabel?: string;
  className?: string;
}

const SIZES = {
  sm: { box: 'h-8 min-w-[72px] text-[13px]', icon: 'h-3.5 w-3.5', btn: 'w-7' },
  md: { box: 'h-9 min-w-[88px] text-sm', icon: 'h-4 w-4', btn: 'w-8' },
  lg: { box: 'h-12 min-w-[148px] text-base', icon: 'h-5 w-5', btn: 'w-12' },
};

/** Quick-commerce style ADD button that turns into a − qty + stepper. */
export function QuantityStepper({ product, size = 'sm', addLabel = 'Add', className = '' }: QuantityStepperProps) {
  const { getQuantity, addToCart, updateQuantity } = useCart();
  const qty = getQuantity(product.id);
  const s = SIZES[size];

  if (product.stock_quantity <= 0) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full bg-canvas px-3 font-medium text-ink-faint ${s.box} ${className}`}
      >
        Sold out
      </span>
    );
  }

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addToCart(product);
        }}
        className={`inline-flex items-center justify-center gap-1 rounded-full border border-leaf-500/40 bg-white px-3 font-semibold text-leaf-600 transition hover:border-leaf-500 hover:bg-leaf-50 active:scale-95 ${s.box} ${className}`}
        aria-label={`Add ${product.name} to cart`}
      >
        <Plus className={s.icon} strokeWidth={2.5} />
        {addLabel}
      </button>
    );
  }

  const atMax = qty >= product.stock_quantity;

  return (
    <div
      className={`inline-flex items-stretch justify-between overflow-hidden rounded-full bg-leaf-500 font-semibold text-white ${s.box} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button
        type="button"
        onClick={() => updateQuantity(product.id, qty - 1)}
        className={`flex items-center justify-center transition hover:bg-leaf-600 active:bg-leaf-700 ${s.btn}`}
        aria-label={`Remove one ${product.name}`}
      >
        <Minus className={s.icon} strokeWidth={3} />
      </button>
      <span className="tabular flex min-w-[1.5rem] items-center justify-center" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => updateQuantity(product.id, qty + 1)}
        disabled={atMax}
        className={`flex items-center justify-center transition hover:bg-leaf-600 active:bg-leaf-700 disabled:opacity-50 ${s.btn}`}
        aria-label={`Add one more ${product.name}`}
      >
        <Plus className={s.icon} strokeWidth={3} />
      </button>
    </div>
  );
}
