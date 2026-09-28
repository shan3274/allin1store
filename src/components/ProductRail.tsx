import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types/database';
import { ProductCard } from './ProductCard';

interface ProductRailProps {
  title: string;
  products: Product[];
  seeAllHref?: string;
}

/** Horizontally scrolling product row with a "see all" link. */
export function ProductRail({ title, products, seeAllHref }: ProductRailProps) {
  if (products.length === 0) return null;
  return (
    <section className="py-3">
      <div className="mb-3 flex items-center justify-between px-4 md:px-0">
        <h2 className="section-title">{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="inline-flex items-center gap-1 text-sm font-medium text-leaf-600 hover:text-leaf-700">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="no-scrollbar -my-2 flex gap-3 overflow-x-auto px-4 pb-4 pt-2 md:px-0">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} rail />
        ))}
      </div>
    </section>
  );
}
