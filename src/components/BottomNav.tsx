'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, House, LayoutGrid, ReceiptText, ShoppingBasket, UserRound } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/format';
import { useIsClient } from '@/lib/useIsClient';

const NAV_HIDDEN = ['/admin', '/login', '/verify-otp', '/checkout', '/order/success', '/product', '/cart'];
const CART_BAR_HIDDEN = NAV_HIDDEN;

const LINKS = [
  { label: 'Home', href: '/', icon: House },
  { label: 'Aisles', href: '/categories', icon: LayoutGrid },
  { label: 'Orders', href: '/orders', icon: ReceiptText },
  { label: 'Account', href: '/profile', icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname() || '/';
  const { totalItems, totalAmount } = useCart();
  const isClient = useIsClient();

  const hiddenFor = (list: string[]) => list.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const showNav = !hiddenFor(NAV_HIDDEN);
  const showCartBar = isClient && totalItems > 0 && !hiddenFor(CART_BAR_HIDDEN);

  return (
    <>
      {showCartBar && (
        <div className={`fixed inset-x-4 z-40 animate-slide-up md:hidden ${showNav ? 'bottom-[76px]' : 'bottom-4'}`}>
          <Link
            href="/cart"
            className="flex items-center justify-between rounded-full bg-ink py-2 pl-2 pr-5 text-white shadow-pop"
          >
            <span className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-sun-400 text-ink">
                <ShoppingBasket className="h-5 w-5" />
                <span className="tabular absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-leaf-500 px-1 text-[11px] font-bold text-white">
                  {totalItems}
                </span>
              </span>
              <span className="leading-tight">
                <span className="tabular block text-[15px] font-semibold">{formatINR(totalAmount)}</span>
                <span className="block text-xs text-white/60">
                  {totalItems} item{totalItems > 1 ? 's' : ''} in basket
                </span>
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              Checkout <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      )}

      {showNav && (
        <nav
          className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur md:hidden"
          aria-label="Primary"
        >
          <div className="flex h-16 items-stretch justify-around">
            {LINKS.map(({ label, href, icon: Icon }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition ${
                    active ? 'text-leaf-700' : 'text-ink-muted'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className={`flex h-7 w-12 items-center justify-center rounded-full transition ${active ? 'bg-leaf-100' : ''}`}>
                    <Icon className="h-5 w-5" strokeWidth={active ? 2.3 : 1.8} />
                  </span>
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
