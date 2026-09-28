'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { ProductForm } from '@/components/admin/ProductForm';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { getProductById, updateProduct, isHydrated } = useStore();
  const { showToast } = useToast();
  const product = getProductById(id);

  return (
    <AdminLayoutWrapper>
      <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-8">
        <Link href="/admin/products" className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Products
        </Link>
        {!isHydrated ? null : !product ? (
          <p className="py-10 text-center text-sm text-slate-400">Product not found.</p>
        ) : (
          <div className="space-y-5 rounded-3xl border border-slate-700/80 bg-slate-800/80 p-6">
            <div>
              <h1 className="text-xl font-bold text-white">Edit product</h1>
              <p className="text-xs text-slate-400">
                Last updated {product.updated_at ? new Date(product.updated_at).toLocaleString('en-IN') : '—'}
              </p>
            </div>
            <ProductForm
              key={product.id}
              initial={product}
              submitLabel="Save changes"
              onSubmit={(draft) => {
                updateProduct({ ...product, ...draft });
                showToast({ type: 'success', title: 'Product updated' });
                router.push('/admin/products');
              }}
            />
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
