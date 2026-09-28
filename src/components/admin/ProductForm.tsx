'use client';

import React, { useState } from 'react';
import type { Product } from '@/types/database';
import { useStore } from '@/context/StoreContext';

export type ProductDraft = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

interface ProductFormProps {
  initial?: Product;
  submitLabel: string;
  onSubmit: (draft: ProductDraft) => void;
}

const input = 'w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500';
const label = 'mb-1 block font-bold text-slate-300';

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

export function ProductForm({ initial, submitLabel, onSubmit }: ProductFormProps) {
  const { categories, products } = useStore();
  const cats = categories.filter((c) => c.slug !== 'all');

  const [f, setF] = useState({
    name: initial?.name ?? '',
    brand: initial?.brand ?? '',
    category_id: initial?.category_id ?? cats[0]?.id ?? '',
    description: initial?.description ?? '',
    image_url: initial?.image_url ?? '',
    barcode: initial?.barcode ?? '',
    sku: initial?.sku ?? '',
    unit: initial?.unit ?? 'pcs',
    weight_volume: initial?.weight_volume ?? '',
    mrp: initial ? String(initial.mrp) : '',
    selling_price: initial ? String(initial.selling_price) : '',
    cost_price: initial ? String(initial.cost_price) : '',
    gst_rate: initial ? String(initial.gst_rate) : '0',
    stock_quantity: initial ? String(initial.stock_quantity) : '0',
    min_stock_alert: initial ? String(initial.min_stock_alert) : '5',
    is_active: initial?.is_active ?? true,
    is_featured: initial?.is_featured ?? false,
  });
  const [error, setError] = useState<string | null>(null);
  const [imgOk, setImgOk] = useState(true);

  const set = (k: keyof typeof f, v: string | boolean) => {
    setF((prev) => ({ ...prev, [k]: v }));
    setError(null);
    if (k === 'image_url') setImgOk(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const mrp = Number(f.mrp);
    const price = Number(f.selling_price);
    const cost = f.cost_price ? Number(f.cost_price) : 0;
    const stock = Number(f.stock_quantity);
    const minAlert = Number(f.min_stock_alert);

    if (f.name.trim().length < 2) return setError('Enter a product name.');
    if (!f.category_id) return setError('Choose a category.');
    if (!(price > 0)) return setError('Selling price must be more than 0.');
    if (!(mrp > 0) || mrp < price) return setError('MRP must be at least the selling price.');
    if (cost < 0 || Number.isNaN(cost)) return setError('Cost price must be 0 or more.');
    if (!Number.isInteger(stock) || stock < 0) return setError('Stock must be a whole number (0 or more).');
    if (!Number.isInteger(minAlert) || minAlert < 0) return setError('Low-stock alert must be a whole number.');
    const barcode = f.barcode.trim();
    if (barcode && products.some((p) => p.barcode === barcode && p.id !== initial?.id))
      return setError('Another product already uses this barcode.');
    if (f.image_url && !/^https?:\/\//.test(f.image_url.trim())) return setError('Image URL must start with https://');

    const baseSlug = initial?.slug ?? slugify(`${f.name} ${f.weight_volume}`);
    let slug = baseSlug || `item-${Date.now().toString(36)}`;
    if (!initial && products.some((p) => p.slug === slug)) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    onSubmit({
      name: f.name.trim(),
      slug,
      brand: f.brand.trim() || null,
      category_id: f.category_id,
      description: f.description.trim() || null,
      image_url: f.image_url.trim() || null,
      barcode: barcode || null,
      sku: f.sku.trim() || null,
      hsn_code: initial?.hsn_code ?? null,
      unit: f.unit.trim() || 'pcs',
      weight_volume: f.weight_volume.trim() || null,
      mrp,
      selling_price: price,
      cost_price: cost,
      gst_rate: Number(f.gst_rate) || 0,
      stock_quantity: stock,
      min_stock_alert: minAlert,
      is_active: f.is_active,
      is_featured: f.is_featured,
    });
  };

  const margin = Number(f.selling_price) && Number(f.cost_price) ? Number(f.selling_price) - Number(f.cost_price) : null;

  return (
    <form onSubmit={submit} noValidate className="space-y-5 text-xs">
      <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label}>Product name *</label>
            <input className={input} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Aashirvaad Whole Wheat Atta" />
          </div>
          <div>
            <label className={label}>Brand</label>
            <input className={input} value={f.brand} onChange={(e) => set('brand', e.target.value)} />
          </div>
          <div>
            <label className={label}>Category *</label>
            <select className={input} value={f.category_id ?? ''} onChange={(e) => set('category_id', e.target.value)}>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Pack size (shown to customers)</label>
            <input className={input} value={f.weight_volume} onChange={(e) => set('weight_volume', e.target.value)} placeholder="5 kg, 1 L, 12 pcs" />
          </div>
          <div>
            <label className={label}>Unit</label>
            <input className={input} value={f.unit} onChange={(e) => set('unit', e.target.value)} placeholder="kg, g, L, pcs" />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Image URL</label>
            <input className={input} value={f.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://…" />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>Description</label>
            <textarea rows={3} className={input} value={f.description} onChange={(e) => set('description', e.target.value)} />
          </div>
        </div>
        <div>
          <span className={label}>Preview</span>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
            {f.image_url && imgOk ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.image_url} alt="" className="h-full w-full object-cover" onError={() => setImgOk(false)} />
            ) : (
              <span className="px-4 text-center text-slate-500">{f.image_url ? 'Image failed to load' : 'No image'}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-700/60 pt-5 sm:grid-cols-4">
        <div>
          <label className={label}>MRP (₹) *</label>
          <input type="number" min={0} step="0.01" className={input} value={f.mrp} onChange={(e) => set('mrp', e.target.value)} />
        </div>
        <div>
          <label className={label}>Selling price (₹) *</label>
          <input type="number" min={0} step="0.01" className={input} value={f.selling_price} onChange={(e) => set('selling_price', e.target.value)} />
        </div>
        <div>
          <label className={label}>Cost price (₹)</label>
          <input type="number" min={0} step="0.01" className={input} value={f.cost_price} onChange={(e) => set('cost_price', e.target.value)} />
          {margin !== null && (
            <p className={`mt-1 ${margin < 0 ? 'text-rose-400' : 'text-slate-500'}`}>Margin ₹{margin.toFixed(2)}</p>
          )}
        </div>
        <div>
          <label className={label}>GST %</label>
          <select className={input} value={f.gst_rate} onChange={(e) => set('gst_rate', e.target.value)}>
            {['0', '5', '12', '18', '28'].map((g) => (
              <option key={g} value={g}>
                {g}%
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Stock on hand *</label>
          <input type="number" min={0} step="1" className={input} value={f.stock_quantity} onChange={(e) => set('stock_quantity', e.target.value)} />
        </div>
        <div>
          <label className={label}>Low-stock alert at</label>
          <input type="number" min={0} step="1" className={input} value={f.min_stock_alert} onChange={(e) => set('min_stock_alert', e.target.value)} />
        </div>
        <div>
          <label className={label}>Barcode (EAN)</label>
          <input className={input} inputMode="numeric" value={f.barcode} onChange={(e) => set('barcode', e.target.value.replace(/\s/g, ''))} placeholder="Scan or type" />
        </div>
        <div>
          <label className={label}>SKU</label>
          <input className={input} value={f.sku} onChange={(e) => set('sku', e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-5 border-t border-slate-700/60 pt-5 text-sm text-slate-200">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={f.is_active} onChange={(e) => set('is_active', e.target.checked)} className="h-4 w-4 accent-emerald-500" />
          Visible in store
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={f.is_featured} onChange={(e) => set('is_featured', e.target.checked)} className="h-4 w-4 accent-emerald-500" />
          Show in Bestsellers
        </label>
      </div>

      {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}
      <button type="submit" className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-500">
        {submitLabel}
      </button>
    </form>
  );
}
