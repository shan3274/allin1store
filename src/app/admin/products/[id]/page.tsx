'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, Save } from 'lucide-react';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getProductById, updateProduct, categories } = useStore();
  const { showToast } = useToast();

  const product = getProductById(resolvedParams.id);

  const [name, setName] = useState(product?.name || '');
  const [brand, setBrand] = useState(product?.brand || '');
  const [categoryId, setCategoryId] = useState(product?.category_id || 'cat-atta');
  const [mrp, setMrp] = useState(String(product?.mrp || ''));
  const [sellingPrice, setSellingPrice] = useState(String(product?.selling_price || ''));
  const [stockQuantity, setStockQuantity] = useState(String(product?.stock_quantity ?? ''));
  const [weightVolume, setWeightVolume] = useState(product?.weight_volume || '');
  const [description, setDescription] = useState(product?.description || '');

  if (!product) {
    return (
      <AdminLayoutWrapper>
        <div className="p-8 text-center text-slate-400">
          <p>Product not found.</p>
          <Link href="/admin/products" className="text-green-400 underline text-xs">
            Back to Catalog
          </Link>
        </div>
      </AdminLayoutWrapper>
    );
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct({
      ...product,
      name,
      brand: brand || null,
      category_id: categoryId,
      mrp: Number(mrp),
      selling_price: Number(sellingPrice),
      stock_quantity: Number(stockQuantity),
      weight_volume: weightVolume,
      description: description || null,
      updated_at: new Date().toISOString(),
    });

    showToast({
      type: 'success',
      title: 'Product Updated',
      message: `${name} has been updated in database.`,
    });

    router.push('/admin/products');
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-4xl w-full mx-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            href="/admin/products"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
        </div>

        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 shadow-sm space-y-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Edit Product Details</h1>
            <p className="text-xs text-slate-400">Update pricing, current counter stock and description</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Category</label>
                <select
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Weight / Volume</label>
                <input
                  type="text"
                  required
                  value={weightVolume}
                  onChange={(e) => setWeightVolume(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">MRP (₹)</label>
                <input
                  type="number"
                  required
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none font-bold text-green-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Update Product
              </button>
              <Link
                href="/admin/products"
                className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
