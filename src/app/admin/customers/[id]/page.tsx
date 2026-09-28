'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { formatDate } from '@/lib/format';
import { ArrowLeft, Phone } from 'lucide-react';

interface AdminCustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
  const resolvedParams = use(params);
  const { getCustomerById, orders } = useStore();

  const customer = getCustomerById(resolvedParams.id);

  if (!customer) {
    return (
      <AdminLayoutWrapper>
        <div className="p-8 text-center text-slate-400">
          <p>Customer profile not found.</p>
          <Link href="/admin/customers" className="text-xs text-green-400 hover:underline">
            Back to Customers
          </Link>
        </div>
      </AdminLayoutWrapper>
    );
  }

  const customerOrders = orders.filter(
    (o) => o.shipping_phone === customer.phone || o.shipping_name === customer.name
  );

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-4xl w-full mx-auto">
        <Link
          href="/admin/customers"
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customers List
        </Link>

        {/* Customer Header Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-lg">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{customer.name}</h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{customer.phone}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Verified Local Buyer
                </span>
                <span className="text-[10px] text-slate-500">Customer since {formatDate(customer.joinedDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${customer.phone}`}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" /> Call Customer
            </a>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Orders</span>
            <div className="text-xl font-black text-white">{customerOrders.length || customer.totalOrders}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Lifetime Spend</span>
            <div className="text-xl font-black text-green-400">₹{customer.totalSpent}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Saved Address</span>
            <div className="text-xs font-semibold text-slate-300 truncate">{customer.address}</div>
          </div>
        </div>

        {/* Customer Orders History */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-white">Purchase History</h3>

          {customerOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No recent online orders found for this customer.</p>
          ) : (
            <div className="space-y-2">
              {customerOrders.map((ord) => (
                <Link
                  key={ord.id}
                  href={`/admin/orders/${ord.id}`}
                  className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <span className="font-mono text-xs font-black text-white">#{ord.order_number}</span>
                    <span className="text-xs text-slate-400 ml-2">
                      {ord.items?.length} items ({ord.items?.[0]?.product_name})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-white text-xs">₹{ord.total_amount}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {ord.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
