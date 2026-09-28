'use client';

import React, { useState } from 'react';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { Package, Search } from 'lucide-react';

export default function AdminInventoryPage() {
  const { products, updateStock } = useStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  const filtered = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search)) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));

    if (filter === 'low') return matchesSearch && p.stock_quantity > 0 && p.stock_quantity <= p.min_stock_alert;
    if (filter === 'out') return matchesSearch && p.stock_quantity === 0;
    return matchesSearch;
  });

  const handleAdjustStock = (productId: string, current: number, change: number) => {
    const next = Math.max(0, current + change);
    updateStock(productId, next);
    showToast({
      type: 'success',
      title: 'Stock Updated',
      message: `Quantity adjusted to ${next}`,
    });
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-green-400" /> Inventory & Stock Ledger
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Synchronized counter & online stock. Changes reflect immediately across all customer sessions.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by product, barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-xs rounded-xl text-white outline-none focus:ring-1 focus:ring-green-500 w-56 sm:w-64"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'all' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Stock Items ({products.length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'low' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Low Stock Alerts
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'out' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Zero Stock Items
          </button>
        </div>

        {/* Inventory Control Table */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 border-b border-slate-700/80 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="p-3.5">Grocery Item</th>
                  <th className="p-3.5">SKU / Barcode</th>
                  <th className="p-3.5">Selling Price</th>
                  <th className="p-3.5">Threshold</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5 text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {filtered.map((p) => {
                  const isOut = p.stock_quantity === 0;
                  const isLow = !isOut && p.stock_quantity <= p.min_stock_alert;

                  return (
                    <tr key={p.id} className="hover:bg-slate-700/30 transition">
                      <td className="p-3.5">
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[11px] text-slate-500">{p.weight_volume || p.unit}</span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-400">
                        {p.barcode || p.sku}
                      </td>

                      <td className="p-3.5 font-bold text-green-400">
                        ₹{p.selling_price}
                      </td>

                      <td className="p-3.5 text-slate-400">
                        Alert at &lt; {p.min_stock_alert}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`font-black text-sm px-2.5 py-1 rounded-lg inline-block ${
                            isOut
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : isLow
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {p.stock_quantity} units
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleAdjustStock(p.id, p.stock_quantity, -1)}
                          disabled={p.stock_quantity === 0}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded-lg text-white font-bold"
                          title="Reduce by 1"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, p.stock_quantity, +1)}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-bold"
                          title="Add 1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, p.stock_quantity, +10)}
                          className="px-2.5 py-1 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold text-[11px]"
                          title="Restock Case (+10)"
                        >
                          +10 Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
