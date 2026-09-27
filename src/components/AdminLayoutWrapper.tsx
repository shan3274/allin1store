'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import {
  LayoutDashboard,
  Calculator,
  Package,
  ClipboardList,
  Users,
  Tag,
  Truck,
  CreditCard,
  BarChart3,
  Bell,
  HelpCircle,
  Settings,
  History,
  Store,
  LogOut,
  ExternalLink,
  Search,
  Power,
  Menu,
  X,
  Plus
} from 'lucide-react';

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { adminLogout, isAdmin } = useAuth();
  const { settings, updateSettings, orders, products, supportTickets, notifications } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const lowStockCount = products.filter((p) => p.stock_quantity <= p.min_stock_alert).length;
  const openTicketsCount = supportTickets.filter((t) => t.status === 'open').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Counter POS', href: '/admin/pos', icon: Calculator },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ClipboardList,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
    },
    {
      label: 'Inventory',
      href: '/admin/inventory',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
    },
    { label: 'Products', href: '/admin/products', icon: Store },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Coupons & Deals', href: '/admin/coupons', icon: Tag },
    { label: 'Deliveries', href: '/admin/delivery', icon: Truck },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    {
      label: 'Notifications',
      href: '/admin/notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
    },
    {
      label: 'Support Tickets',
      href: '/admin/support',
      icon: HelpCircle,
      badge: openTicketsCount > 0 ? openTicketsCount : null,
    },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit Logs', href: '/admin/audit', icon: History },
  ];

  const handleToggleStore = () => {
    updateSettings({ is_store_open: !settings.is_store_open });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row font-sans selection:bg-green-600 selection:text-white">
      {/* Mobile Sticky Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm text-white truncate max-w-[130px]">
              {settings.store_name}
            </span>
            <button
              onClick={handleToggleStore}
              className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                settings.is_store_open ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {settings.is_store_open ? 'OPEN' : 'CLOSED'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/notifications"
            className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-[9px] font-black flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </Link>
          <Link
            href="/admin/pos"
            className="px-2.5 py-1 bg-green-600 text-white text-xs font-black rounded-lg shadow-sm"
          >
            POS
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-slate-900 h-full p-4 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center font-black">
                    <Store className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm text-white">Owner Operations</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-green-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-800/80 rounded-xl text-xs font-bold text-slate-300"
              >
                <span>Preview Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={adminLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-slate-800 rounded-xl"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 p-4 flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div className="space-y-5">
          {/* Header Brand */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Store className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-black text-sm block leading-none truncate text-white">
                  {settings.store_name}
                </span>
                <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider block mt-0.5">
                  Kirana OS Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Store Open/Close Toggle Pill */}
          <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${settings.is_store_open ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <span className="font-bold text-slate-300">
                {settings.is_store_open ? 'Store is Open' : 'Store is Closed'}
              </span>
            </div>
            <button
              onClick={handleToggleStore}
              className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider transition ${
                settings.is_store_open ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
              }`}
            >
              {settings.is_store_open ? 'Close' : 'Open'}
            </button>
          </div>

          {/* Quick link to customer storefront */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-slate-950 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 border border-slate-800 transition"
          >
            <span className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-green-400" /> View Storefront
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={adminLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" /> Exit Store Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-950 overflow-y-auto flex flex-col min-w-0 pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation for Admin Quick Controls */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-1.5 px-4 flex justify-around items-center">
        <Link
          href="/admin"
          className={`flex flex-col items-center text-[10px] font-bold ${
            pathname === '/admin' ? 'text-green-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/admin/orders"
          className={`flex flex-col items-center text-[10px] font-bold relative ${
            pathname === '/admin/orders' ? 'text-green-400' : 'text-slate-400'
          }`}
        >
          <div className="relative">
            <ClipboardList className="w-4 h-4 mb-0.5" />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </div>
          <span>Orders</span>
        </Link>

        <Link
          href="/admin/pos"
          className="flex flex-col items-center text-[10px] font-black text-white bg-green-600 px-3 py-1 rounded-xl shadow-md transform -translate-y-1"
        >
          <Calculator className="w-4 h-4" />
          <span>POS</span>
        </Link>

        <Link
          href="/admin/inventory"
          className={`flex flex-col items-center text-[10px] font-bold relative ${
            pathname === '/admin/inventory' ? 'text-green-400' : 'text-slate-400'
          }`}
        >
          <div className="relative">
            <Package className="w-4 h-4 mb-0.5" />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {lowStockCount}
              </span>
            )}
          </div>
          <span>Stock</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center text-[10px] font-bold text-slate-400"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}
