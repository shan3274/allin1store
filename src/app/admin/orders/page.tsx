'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter,
  Truck,
  RotateCcw
} from 'lucide-react';
import { OrderStatus } from '@/types/database';

export default function AdminOrdersListPage() {
  const { orders, updateOrderStatus } = useStore();
  const { showToast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchesSearch =
      search === '' ||
      String(o.order_number).includes(search) ||
      (o.shipping_name && o.shipping_name.toLowerCase().includes(search.toLowerCase())) ||
      (o.shipping_phone && o.shipping_phone.includes(search));
    return matchesStatus && matchesSearch;
  });

  const handleAdvanceStatus = (orderId: string, current: OrderStatus) => {
    const nextStatusMap: Record<OrderStatus, OrderStatus | null> = {
      pending: 'confirmed',
      confirmed: 'packed',
      packed: 'out_for_delivery',
      out_for_delivery: 'delivered',
      delivered: null,
      cancelled: null,
      returned: null,
    };

    const next = nextStatusMap[current];
    if (next) {
      updateOrderStatus(orderId, next);
      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Order transitioned to ${next.replace(/_/g, ' ')}`,
      });
    }
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-green-400" /> Customer Deliveries & Orders
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Accept, pack, dispatch and track online orders and POS counter bills
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by order #, phone, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-xs rounded-xl text-white outline-none focus:ring-1 focus:ring-green-500 w-56 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'packed', label: 'Packed' },
            { id: 'out_for_delivery', label: 'Out for Delivery' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                filterStatus === tab.id
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 border-b border-slate-700/80 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="p-3.5">Order</th>
                  <th className="p-3.5">Customer & Phone</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-medium">
                {filtered.map((ord) => {
                  return (
                    <tr key={ord.id} className="hover:bg-slate-700/30 transition">
                      <td className="p-3.5">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="font-mono font-black text-white hover:text-green-400 flex items-center gap-1"
                        >
                          #{ord.order_number}
                        </Link>
                        <span className="text-[10px] text-slate-500 block">
                          {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-white">{ord.shipping_name || 'Walk-in Customer'}</p>
                        <p className="text-[11px] text-slate-400">{ord.shipping_phone || '—'}</p>
                      </td>

                      <td className="p-3.5">
                        <span>{ord.items?.length || 0} products</span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                          {ord.items?.[0]?.product_name}
                        </span>
                      </td>

                      <td className="p-3.5 font-black text-white">
                        ₹{ord.total_amount}
                      </td>

                      <td className="p-3.5">
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                          {ord.payment_method}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : ord.status === 'out_for_delivery'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : ord.status === 'cancelled'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        {ord.status === 'pending' && (
                          <button
                            onClick={() => handleAdvanceStatus(ord.id, 'pending')}
                            className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-[11px]"
                          >
                            Confirm
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => handleAdvanceStatus(ord.id, 'confirmed')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px]"
                          >
                            Mark Packed
                          </button>
                        )}
                        {ord.status === 'packed' && (
                          <button
                            onClick={() => handleAdvanceStatus(ord.id, 'packed')}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px]"
                          >
                            Dispatch 🛵
                          </button>
                        )}
                        {ord.status === 'out_for_delivery' && (
                          <button
                            onClick={() => handleAdvanceStatus(ord.id, 'out_for_delivery')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px]"
                          >
                            Delivered ✓
                          </button>
                        )}
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="px-2 py-1 text-slate-400 hover:text-white text-xs font-bold"
                        >
                          Detail →
                        </Link>
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
