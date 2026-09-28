'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { formatDate, formatRelative } from '@/lib/format';
import { Users, Search, Phone } from 'lucide-react';

export default function AdminCustomersPage() {
  const { customers } = useStore();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" /> Customer Management & CRM
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Registered kirana customers, lifetime spend, order frequencies & contact info
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-xs rounded-xl text-white outline-none focus:ring-1 focus:ring-green-500 w-64"
            />
          </div>
        </div>

        {/* Customer Cards & Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Phone & Contact</th>
                  <th className="p-3.5">Primary Delivery Area</th>
                  <th className="p-3.5">Total Orders</th>
                  <th className="p-3.5">Lifetime Spend</th>
                  <th className="p-3.5">Last Order</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 font-black flex items-center justify-center text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{c.name}</p>
                          <p className="text-[10px] text-slate-500">Customer since {formatDate(c.joinedDate)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <p className="font-mono text-white text-xs">{c.phone}</p>
                      {c.email && <p className="text-[10px] text-slate-400">{c.email}</p>}
                    </td>

                    <td className="p-3.5 text-slate-400 text-xs max-w-[200px] truncate">
                      {c.address}
                    </td>

                    <td className="p-3.5 font-bold text-white text-xs">
                      {c.totalOrders} orders
                    </td>

                    <td className="p-3.5 font-black text-green-400 text-sm">
                      ₹{c.totalSpent}
                    </td>

                    <td className="p-3.5 text-slate-400 text-xs">
                      {formatRelative(c.lastOrderDate)}
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <a
                        href={`tel:${c.phone}`}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-green-400 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                      >
                        Profile
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
