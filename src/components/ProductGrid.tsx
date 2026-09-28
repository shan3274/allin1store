import React from 'react';
import type { Product } from '@/types/database';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, dense = false }: { products: Product[]; dense?: boolean }) {
  return (
    <div
      className={`grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 ${
        dense ? 'md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
      }`}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
