'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { CreditCard } from 'lucide-react';

export default function AdminPaymentsPage() {
  const { orders } = useStore();
  const [filter, setFilter] = useState<'all' | 'upi' | 'cod' | 'cash_pos'>('all');

  const filtered = orders.filter((o) => {
    if (filter === 'all') return true;
    return o.payment_method === filter;
  });

  const totalCollected = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingCod = orders
    .filter((o) => o.payment_method === 'cod' && o.status !== 'delivered' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const failedCount = orders.filter((o) => o.payment_status === 'failed').length;

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-emerald-400" /> Payments, Settlements & Refunds
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Monitor UPI transactions, cash counter collections, COD settlements, and refund logs
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Settled Funds</span>
            <div className="text-2xl font-black text-emerald-400">₹{totalCollected}</div>
            <p className="text-[10px] text-slate-500 font-medium">Paid via UPI, Card and Counter Cash</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending COD to Collect</span>
            <div className="text-2xl font-black text-amber-400">₹{pendingCod}</div>
            <p className="text-[10px] text-slate-500 font-medium">Cash to be collected upon doorstep delivery</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Failed / Cancelled</span>
            <div className="text-2xl font-black text-rose-400">{failedCount}</div>
            <p className="text-[10px] text-slate-500 font-medium">Transactions cancelled or timed out</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Transactions ({orders.length})
          </button>
          <button
            onClick={() => setFilter('upi')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'upi' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            UPI Payments
          </button>
          <button
            onClick={() => setFilter('cod')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'cod' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Cash on Delivery
          </button>
          <button
            onClick={() => setFilter('cash_pos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'cash_pos' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            POS Counter Cash
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="p-3.5">Transaction ID / Order</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-white block">
                        {ord.payment_transaction_id || `ORD-${ord.order_number}`}
                      </span>
                      <span className="text-[10px] text-slate-500">Order #{ord.order_number}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-white block">{ord.shipping_name || 'Walk-in'}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{ord.shipping_phone}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="uppercase text-[10px] font-black px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {ord.payment_method.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-3.5 font-black text-white text-sm">
                      ₹{ord.total_amount}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          ord.payment_status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : ord.payment_status === 'failed'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ord.payment_status}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-400 text-xs">
                      {new Date(ord.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    <td className="p-3.5 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-xs font-bold text-slate-400 hover:text-white"
                      >
                        Details →
                      </Link>
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
