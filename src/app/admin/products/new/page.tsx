'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, Plus, Check } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct, categories } = useStore();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('cat-atta');
  const [mrp, setMrp] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [minAlert, setMinAlert] = useState('10');
  const [unit, setUnit] = useState('kg');
  const [weightVolume, setWeightVolume] = useState('1 kg');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sellingPrice) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    addProduct({
      name,
      slug: `${slug}-${Date.now().toString(36)}`,
      brand: brand || null,
      category_id: categoryId,
      description: description || null,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
      barcode: barcode || `890103${Math.floor(100000 + Math.random() * 900000)}`,
      sku: `KIRANA-${Math.floor(1000 + Math.random() * 9000)}`,
      hsn_code: '1905',
      unit,
      weight_volume: weightVolume,
      mrp: Number(mrp) || Number(sellingPrice),
      selling_price: Number(sellingPrice),
      cost_price: Number(costPrice) || Math.round(Number(sellingPrice) * 0.85),
      gst_rate: 0,
      stock_quantity: Number(stockQuantity) || 0,
      min_stock_alert: Number(minAlert) || 5,
      is_active: true,
      is_featured: false,
    });

    showToast({
      type: 'success',
      title: 'Product Created',
      message: `${name} has been added to grocery store catalog.`,
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
            <h1 className="text-xl sm:text-2xl font-black text-white">Add New Product to Store</h1>
            <p className="text-xs text-slate-400">Specify retail prices, barcodes and starting counter inventory</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aashirvaad Select Sharbati Atta 5kg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Aashirvaad / Amul / Tata"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Category *</label>
                <select
                  value={categoryId}
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
                <label className="font-bold text-slate-300">Weight / Volume *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 kg or 1 L or 500 g"
                  value={weightVolume}
                  onChange={(e) => setWeightVolume(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">MRP (Print Price ₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="280"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Selling Price (Discounted ₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="249"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none font-bold text-green-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Stock Quantity (In Stock)</label>
                <input
                  type="number"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Barcode / EAN</label>
                <input
                  type="text"
                  placeholder="890103000001"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="font-bold text-slate-300">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Description</label>
              <textarea
                rows={3}
                placeholder="Key highlights, grain quality, ingredients..."
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
                <Plus className="w-4 h-4" /> Save Product
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
