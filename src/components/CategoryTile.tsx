import React from 'react';
import Link from 'next/link';
import type { Category } from '@/types/database';
import { ProductImage } from './ui/ProductImage';

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.slug}`} className="group flex flex-col items-center gap-2 text-center">
      <div className="aspect-square w-full max-w-[104px] overflow-hidden rounded-full bg-white p-1 shadow-card ring-1 ring-line transition group-hover:ring-2 group-hover:ring-leaf-500/60">
        <ProductImage
          src={category.image_url}
          alt={category.name}
          className="h-full w-full rounded-full object-cover transition duration-300 group-hover:scale-[1.05]"
          fallbackClassName="text-xl"
        />
      </div>
      <span className="line-clamp-2 text-xs font-medium leading-tight text-ink-soft sm:text-[13px]">{category.name}</span>
    </Link>
  );
}
