'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Clock3, MapPin, Search, ShoppingBasket, UserRound } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/format';
import { Logo, LogoMark } from './Logo';
import { AddressPicker } from './AddressPicker';
import { StoreStatusBanner } from './StoreStatusBanner';

const SEARCH_HINTS = ['atta', 'milk', 'toor dal', 'ghee', 'biscuits', 'chai patti', 'detergent'];

interface SiteHeaderProps {
  /** Hide the whole header on phones (inner pages use PageHeader instead). */
  hideOnMobile?: boolean;
}

export function SiteHeader({ hideOnMobile = false }: SiteHeaderProps) {
  const router = useRouter();
  const { totalItems, totalAmount } = useCart();
  const { user, defaultAddress, isAuthenticated } = useAuth();
  const { settings } = useStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hint, setHint] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHint((h) => (h + 1) % SEARCH_HINTS.length), 2600);
    return () => clearInterval(t);
  }, []);

  const eta = settings.delivery_eta_minutes || 30;
  const addressLine = defaultAddress
    ? `${defaultAddress.house_flat}, ${defaultAddress.street_area}, ${defaultAddress.city}`
    : `Delivering across ${settings.city}`;

  const searchBox = (
    <Link
      href="/search"
      className="flex h-11 w-full items-center gap-3 rounded-full border border-line bg-white px-4 text-sm text-ink-muted transition hover:border-ink-faint/60"
    >
      <Search className="h-[18px] w-[18px] shrink-0 text-ink-soft" />
      <span className="truncate">
        Search for{' '}
        <span key={hint} className="inline-block animate-slide-up text-ink-soft">
          {SEARCH_HINTS[hint]}
        </span>
      </span>
    </Link>
  );

  const deliverLabel = defaultAddress
    ? `Deliver to ${defaultAddress.address_type.charAt(0).toUpperCase()}${defaultAddress.address_type.slice(1)}`
    : 'Set delivery location';

  const etaChip = (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-semibold text-leaf-700">
      <Clock3 className="h-3.5 w-3.5" /> ~{eta} min
    </span>
  );

  return (
    <>
      <StoreStatusBanner />
      <header
        className={`z-40 bg-canvas/95 backdrop-blur md:sticky md:top-0 md:border-b md:border-line ${hideOnMobile ? 'hidden md:block' : ''}`}
      >
        {/* Desktop */}
        <div className="mx-auto hidden h-[76px] max-w-7xl items-center gap-5 px-6 md:flex">
          <Logo name={settings.store_name} />
          <button
            onClick={() => setPickerOpen(true)}
            className="flex min-w-0 max-w-[280px] shrink-0 items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-2 pr-3 text-left transition hover:border-ink-faint/60"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-tight text-ink">{deliverLabel}</span>
              <span className="block truncate text-xs text-ink-muted">{addressLine}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-ink-muted" />
          </button>
          {etaChip}
          <div className="flex-1">{searchBox}</div>
          <Link
            href={isAuthenticated ? '/profile' : '/login'}
            className="flex shrink-0 items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <UserRound className="h-5 w-5" />
            {isAuthenticated ? user?.full_name?.split(' ')[0] || 'Account' : 'Sign in'}
          </Link>
          <Link
            href="/cart"
            className="relative flex h-11 shrink-0 items-center gap-2 rounded-full bg-leaf-500 px-4 text-sm font-semibold text-white transition hover:bg-leaf-600"
          >
            <ShoppingBasket className="h-5 w-5" />
            {totalItems > 0 ? <span className="tabular">{formatINR(totalAmount)}</span> : <span>Basket</span>}
            {totalItems > 0 && (
              <span className="tabular absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sun-400 px-1 text-[11px] font-bold text-ink">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-center gap-3 px-4 pb-2 pt-3">
            <LogoMark className="h-9 w-9 shrink-0" />
            <button onClick={() => setPickerOpen(true)} className="min-w-0 flex-1 text-left">
              <span className="flex items-center gap-0.5 text-[15px] font-semibold leading-tight text-ink">
                {deliverLabel}
                <ChevronDown className="h-4 w-4 shrink-0" />
              </span>
              <span className="block truncate text-xs text-ink-muted">{addressLine}</span>
            </button>
            {etaChip}
            <button
              onClick={() => router.push(isAuthenticated ? '/profile' : '/login')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink-soft"
              aria-label="Account"
            >
              <UserRound className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </header>
      {!hideOnMobile && (
        <div className="sticky top-0 z-40 bg-canvas/95 px-4 pb-3 pt-1 backdrop-blur md:hidden">{searchBox}</div>
      )}

      <AddressPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </>
  );
}
