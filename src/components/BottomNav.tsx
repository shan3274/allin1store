'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems, totalAmount } = useCart();

  // Hide on admin routes to prevent mixing owner with customer bottom navigation
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const links = [
    { label: 'Store', href: '/', icon: Home },
    { label: 'Categories', href: '/categories', icon: Grid },
    { label: 'Orders', href: '/orders', icon: ClipboardList },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <>
      {/* Floating Sticky Cart Bar on Mobile when items exist */}
      {totalItems > 0 && pathname !== '/cart' && pathname !== '/checkout' && !pathname?.startsWith('/order/') && (
        <div className="md:hidden fixed bottom-16 left-3 right-3 z-40 animate-slide-up">
          <Link
            href="/cart"
            className="flex items-center justify-between bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white p-3 rounded-2xl shadow-xl shadow-green-900/30 border border-green-500/30"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-xs text-yellow-300">
                {totalItems}
              </div>
              <div>
                <span className="text-xs font-black block leading-none">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in basket
                </span>
                <span className="text-[11px] text-green-100 font-semibold leading-tight block mt-0.5">
                  ₹{totalAmount} • Instant 25m Delivery
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs">
              <span>View Cart</span>
              <span className="text-sm">→</span>
            </div>
          </Link>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-4 flex justify-around items-center shadow-2xl safe-area-pb">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center relative py-1 px-3 rounded-xl transition text-[11px] font-bold ${
                isActive
                  ? 'text-green-700 scale-105'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className="leading-tight">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
