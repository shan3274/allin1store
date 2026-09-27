'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { OrderStatus } from '@/types/database';
import {
  TrendingUp,
  Package,
  ClipboardList,
  AlertTriangle,
  Users,
  CreditCard,
  Calculator,
  Plus,
  Tag,
  ArrowRight,
  Search,
  Bell,
  Clock,
  CheckCircle2,
  Phone,
  Power,
  Zap,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Truck,
  HelpCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { orders, products, settings, supportTickets, updateOrderStatus, updateSettings } = useStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'preparing' | 'ready' | 'dispatched'>('all');

  if (!isAdmin) {
    if (typeof window !== 'undefined') router.push('/admin/login');
    return null;
  }

  // Live Metrics
  const activeOrders = orders.filter((o) => o.status !== 'cancelled' && o.status !== 'delivered');
  const newOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'confirmed' || o.status === 'packed');
  const outForDeliveryOrders = orders.filter((o) => o.status === 'out_for_delivery');
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const todayTurnover = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const lowStockItems = products.filter((p) => p.stock_quantity <= p.min_stock_alert && p.stock_quantity > 0);
  const outOfStockItems = products.filter((p) => p.stock_quantity === 0);
  const openIssues = supportTickets.filter((t) => t.status === 'open');

  const handleQuickStatus = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    showToast({
      type: 'success',
      title: 'Order Status Advanced',
      message: `Order transitioned to ${nextStatus.replace(/_/g, ' ')}`,
    });
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top Operational Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                Kirana Operations Command Center
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Live status: <strong className="text-white">{settings.store_name}</strong> • Delivery Radius: <strong>{settings.delivery_radius_km} km</strong>
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/pos"
              className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4" /> Open Counter POS
            </Link>
            <Link
              href="/admin/products/new"
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-green-400" /> Add Product
            </Link>
          </div>
        </div>

        {/* Action Required Alert Banners (if any pending) */}
        {(newOrders.length > 0 || outOfStockItems.length > 0 || openIssues.length > 0) && (
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
              ⚡ Action Required Right Now
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {newOrders.length > 0 && (
                <Link
                  href="/admin/orders"
                  className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between hover:bg-amber-500/20 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                      {newOrders.length}
                    </span>
                    <div>
                      <p className="text-xs font-black text-white">New Orders Awaiting Confirmation</p>
                      <p className="text-[10px] text-amber-300 font-medium">Tap to review & dispatch</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              {outOfStockItems.length > 0 && (
                <Link
                  href="/admin/inventory"
                  className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-between hover:bg-rose-500/20 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center text-xs">
                      {outOfStockItems.length}
                    </span>
                    <div>
                      <p className="text-xs font-black text-white">Products Completely Out of Stock</p>
                      <p className="text-[10px] text-rose-300 font-medium">Zero stock on storefront</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              {openIssues.length > 0 && (
                <Link
                  href="/admin/support"
                  className="p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-between hover:bg-blue-500/20 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center text-xs">
                      {openIssues.length}
                    </span>
                    <div>
                      <p className="text-xs font-black text-white">Customer Support Tickets Open</p>
                      <p className="text-[10px] text-blue-300 font-medium">Requires owner resolution</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* 4 Interactive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/admin/analytics"
            className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Today's Sales</span>
              <div className="w-7 h-7 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">₹{todayTurnover}</div>
            <p className="text-[10px] text-green-400 font-medium">+14.2% vs yesterday</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Pipeline</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{activeOrders.length}</div>
            <p className="text-[10px] text-amber-400 font-medium">New, packing or dispatched</p>
          </Link>

          <Link
            href="/admin/inventory"
            className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Stock Alerts</span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {lowStockItems.length + outOfStockItems.length}
            </div>
            <p className="text-[10px] text-rose-400 font-medium">{outOfStockItems.length} out of stock</p>
          </Link>

          <Link
            href="/admin/customers"
            className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Delivered Today</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{deliveredOrders.length}</div>
            <p className="text-[10px] text-emerald-400 font-medium">Fulfilled doorstep orders</p>
          </Link>
        </div>

        {/* Live Operational Pipeline Stage Hub */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                Live Store Dispatch Pipeline
              </h2>
              <p className="text-xs text-slate-400">Track and advance active deliveries with 1 tap</p>
            </div>

            <div className="flex gap-1.5 overflow-x-auto text-xs scrollbar-none">
              {[
                { id: 'all', label: `All Active (${activeOrders.length})` },
                { id: 'new', label: `New (${newOrders.length})` },
                { id: 'preparing', label: `Packing (${preparingOrders.length})` },
                { id: 'dispatched', label: `Rider Out (${outForDeliveryOrders.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Orders List */}
          <div className="space-y-3">
            {activeOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">All deliveries cleared!</p>
                <p className="text-xs">No pending orders waiting for packing or dispatch.</p>
              </div>
            ) : (
              activeOrders
                .filter((o) => {
                  if (activeTab === 'new') return o.status === 'pending';
                  if (activeTab === 'preparing') return o.status === 'confirmed' || o.status === 'packed';
                  if (activeTab === 'dispatched') return o.status === 'out_for_delivery';
                  return true;
                })
                .map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-white">#{ord.order_number}</span>
                        <span className="font-bold text-xs text-slate-200">{ord.shipping_name}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {ord.payment_method}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {ord.items?.length} items ({ord.items?.[0]?.product_name}) • ₹{ord.total_amount}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        📍 {ord.shipping_address}, {ord.shipping_city}
                      </p>
                    </div>

                    {/* Operational Action Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {ord.shipping_phone && (
                        <a
                          href={`tel:${ord.shipping_phone}`}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-green-400 rounded-xl transition"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      )}

                      {ord.status === 'pending' && (
                        <button
                          onClick={() => handleQuickStatus(ord.id, 'confirmed')}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Accept Order
                        </button>
                      )}

                      {ord.status === 'confirmed' && (
                        <button
                          onClick={() => handleQuickStatus(ord.id, 'packed')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Mark Packed
                        </button>
                      )}

                      {ord.status === 'packed' && (
                        <button
                          onClick={() => handleQuickStatus(ord.id, 'out_for_delivery')}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Dispatch Rider 🛵
                        </button>
                      )}

                      {ord.status === 'out_for_delivery' && (
                        <button
                          onClick={() => handleQuickStatus(ord.id, 'delivered')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Mark Delivered ✓
                        </button>
                      )}

                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* 2 Column Operations Grid: Inventory Alerts & Fast Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Low Stock Fast Reorder Panel */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-white text-sm">Low Stock Items ({lowStockItems.length + outOfStockItems.length})</h3>
              </div>
              <Link href="/admin/inventory" className="text-xs text-amber-400 font-bold hover:underline">
                Manage All
              </Link>
            </div>

            <div className="space-y-2">
              {[...outOfStockItems, ...lowStockItems].slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-white truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.weight_volume || p.unit} • ₹{p.selling_price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        p.stock_quantity === 0
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {p.stock_quantity === 0 ? 'Out of Stock' : `Qty: ${p.stock_quantity}`}
                    </span>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts Matrix */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-white text-sm border-b border-slate-800 pb-3">
              Store Operations Modules
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <Link
                href="/admin/delivery"
                className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-2xl border border-slate-800 transition text-center space-y-1 group"
              >
                <Truck className="w-5 h-5 text-blue-400 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">Deliveries</span>
                <span className="text-[10px] text-slate-400">Rider tracking</span>
              </Link>

              <Link
                href="/admin/payments"
                className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-2xl border border-slate-800 transition text-center space-y-1 group"
              >
                <CreditCard className="w-5 h-5 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">Payments</span>
                <span className="text-[10px] text-slate-400">UPI, COD & Refunds</span>
              </Link>

              <Link
                href="/admin/customers"
                className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-2xl border border-slate-800 transition text-center space-y-1 group"
              >
                <Users className="w-5 h-5 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">Customers</span>
                <span className="text-[10px] text-slate-400">CRM & repeat orders</span>
              </Link>

              <Link
                href="/admin/coupons"
                className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-2xl border border-slate-800 transition text-center space-y-1 group"
              >
                <Tag className="w-5 h-5 text-yellow-400 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">Coupons</span>
                <span className="text-[10px] text-slate-400">Store deals</span>
              </Link>

              <Link
                href="/admin/support"
                className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-2xl border border-slate-800 transition text-center space-y-1 group"
              >
                <HelpCircle className="w-5 h-5 text-rose-400 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">Support</span>
                <span className="text-[10px] text-slate-400">Issues & claims</span>
              </Link>

              <Link
                href="/admin/audit"
                className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-2xl border border-slate-800 transition text-center space-y-1 group"
              >
                <Clock className="w-5 h-5 text-teal-400 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-white block">Audit Logs</span>
                <span className="text-[10px] text-slate-400">Change history</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
