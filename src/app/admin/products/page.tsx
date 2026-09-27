'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  ChevronRight
} from 'lucide-react';

export default function AdminProductsPage() {
  const { products, deleteProduct } = useStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');

  const filtered = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) ||
      (p.barcode && p.barcode.includes(search));

    if (filterStock === 'low') return matchesSearch && p.stock_quantity > 0 && p.stock_quantity <= p.min_stock_alert;
    if (filterStock === 'out') return matchesSearch && p.stock_quantity === 0;
    return matchesSearch;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove ${name} from grocery store?`)) {
      deleteProduct(id);
      showToast({
        type: 'info',
        title: 'Product Deleted',
        message: `${name} has been removed.`,
      });
    }
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-green-400" /> Products & Grocery Catalog
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Manage inventory pricing, barcodes, MRPs and active product availability
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products/new"
              className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Grocery Item
            </Link>
          </div>
        </div>

        {/* Search & Stock Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products by title or barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-xs rounded-xl text-white outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <button
              onClick={() => setFilterStock('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                filterStock === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setFilterStock('low')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                filterStock === 'low'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setFilterStock('out')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                filterStock === 'out'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 border-b border-slate-700/80 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Brand / Weight</th>
                  <th className="p-3.5">MRP</th>
                  <th className="p-3.5">Selling Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl p-1 shrink-0 flex items-center justify-center">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <span className="font-black text-green-400">{p.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-snug">{p.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{p.barcode || p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-slate-300 block">{p.brand || '—'}</span>
                      <span className="text-[11px] text-slate-500">{p.weight_volume || p.unit}</span>
                    </td>

                    <td className="p-3.5 text-slate-400 line-through">₹{p.mrp}</td>
                    <td className="p-3.5 font-black text-green-400 text-sm">₹{p.selling_price}</td>

                    <td className="p-3.5">
                      <span className="font-bold text-white text-sm">{p.stock_quantity}</span>
                    </td>

                    <td className="p-3.5">
                      {p.stock_quantity === 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-black text-[10px]">
                          Out of Stock
                        </span>
                      ) : p.stock_quantity <= p.min_stock_alert ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px]">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px]">
                          In Stock
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 hover:bg-slate-700 rounded-lg inline-block text-slate-400 hover:text-white"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 hover:bg-slate-700 rounded-lg inline-block text-slate-400 hover:text-rose-400"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
