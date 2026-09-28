'use client';

import React from 'react';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { BarChart3 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { orders, products } = useStore();

  const completedOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const avgOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;

  const onlineOrders = orders.filter((o) => o.order_type === 'online_delivery');
  const counterOrders = orders.filter((o) => o.order_type === 'pos_counter');

  const upiCount = orders.filter((o) => o.payment_method === 'upi').length;
  const codCount = orders.filter((o) => o.payment_method === 'cod').length;
  const cashPosCount = orders.filter((o) => o.payment_method === 'cash_pos').length;

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-6xl w-full mx-auto">
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-400" /> Sales & Order Performance Analytics
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Aggregated business insights comparing counter billing vs quick-commerce delivery
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/80 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Store Turnover</span>
            <div className="text-2xl font-black text-white">₹{totalRevenue}</div>
            <p className="text-[11px] text-green-400 font-medium">{completedOrders.length} successful sales recorded</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/80 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Basket Value (AOV)</span>
            <div className="text-2xl font-black text-white">₹{avgOrderValue}</div>
            <p className="text-[11px] text-slate-400 font-medium">Higher ticket sizes on grocery staples</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/80 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Catalog SKUs</span>
            <div className="text-2xl font-black text-white">{products.length}</div>
            <p className="text-[11px] text-slate-400 font-medium">Live inventory active across channels</p>
          </div>
        </div>

        {/* Breakdown Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales Channel Split */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-sm space-y-4">
            <h3 className="font-black text-white text-sm">Channel Split</h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>Online Doorstep Deliveries</span>
                  <span className="text-green-400 font-black">{onlineOrders.length} orders</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{
                      width: `${orders.length > 0 ? (onlineOrders.length / orders.length) * 100 : 50}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-300 mb-1">
                  <span>POS Counter Cash Sales</span>
                  <span className="text-blue-400 font-black">{counterOrders.length} bills</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{
                      width: `${orders.length > 0 ? (counterOrders.length / orders.length) * 100 : 50}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Mode Distribution */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-sm space-y-4">
            <h3 className="font-black text-white text-sm">Payment Methods</h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                <span className="text-slate-300 font-bold">UPI Online Payment</span>
                <span className="font-mono font-black text-white">{upiCount} orders</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                <span className="text-slate-300 font-bold">Cash on Delivery (COD)</span>
                <span className="font-mono font-black text-white">{codCount} orders</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-700/40">
                <span className="text-slate-300 font-bold">Counter POS Cash</span>
                <span className="font-mono font-black text-white">{cashPosCount} orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
