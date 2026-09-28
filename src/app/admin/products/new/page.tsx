'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { ProductForm } from '@/components/admin/ProductForm';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct, isHydrated } = useStore();
  const { showToast } = useToast();

  return (
    <AdminLayoutWrapper>
      <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-8">
        <Link href="/admin/products" className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Products
        </Link>
        <div className="space-y-5 rounded-3xl border border-slate-700/80 bg-slate-800/80 p-6">
          <div>
            <h1 className="text-xl font-bold text-white">Add product</h1>
            <p className="text-xs text-slate-400">It appears in the store as soon as you save (if marked visible).</p>
          </div>
          {isHydrated && (
            <ProductForm
              submitLabel="Add product"
              onSubmit={(draft) => {
                addProduct(draft);
                showToast({ type: 'success', title: `${draft.name} added` });
                router.push('/admin/products');
              }}
            />
          )}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
