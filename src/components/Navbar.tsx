'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import {
  Store,
  ShoppingBag,
  MapPin,
  Search,
  User,
  Heart,
  ChevronDown,
  X,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download
} from 'lucide-react';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function Navbar({ searchQuery = '', onSearchChange }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems, totalAmount } = useCart();
  const { user, defaultAddress, isAuthenticated } = useAuth();
  const { settings } = useStore();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2 sticky top-0 z-[60]">
          <AlertCircle className="w-4 h-4" />
          <span>You are currently offline. Browsing cached store & cart.</span>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm backdrop-blur-md bg-white/95 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 md:gap-6">
          {/* Logo & Delivery Location */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-tr from-green-700 to-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-green-700/20 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 tracking-tight text-base leading-none">
                    {settings.store_name}
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${settings.is_store_open ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {settings.is_store_open ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium leading-none block mt-0.5">
                  {settings.tagline}
                </span>
              </div>
            </Link>

            {/* Location Pill */}
            <button
              onClick={() => setShowAddressModal(true)}
              className="flex items-center gap-1.5 text-left bg-slate-100/80 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl transition border border-slate-200/60 max-w-[200px] sm:max-w-[280px]"
            >
              <div className="w-6 h-6 rounded-lg bg-green-600/10 text-green-700 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 leading-tight">
                  <span className="truncate">
                    Deliver to {defaultAddress?.address_type ? defaultAddress.address_type.toUpperCase() : 'Home'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                </div>
                <p className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
                  {defaultAddress
                    ? `${defaultAddress.house_flat}, ${defaultAddress.street_area}`
                    : 'Sector 4, Ghaziabad • 25 mins'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Search Input */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2">
            <Link
              href="/search"
              className="w-full relative flex items-center text-slate-400 hover:text-slate-600 bg-slate-100/90 hover:bg-slate-100 px-3.5 py-2.5 rounded-2xl border border-slate-200/70 text-xs shadow-inner transition group"
            >
              <Search className="w-4 h-4 mr-2.5 text-slate-400 group-hover:text-green-600 transition-colors" />
              <span className="truncate text-slate-500 font-medium">
                {searchQuery || 'Search "atta", "dal", "oil", "maggi", "ghee", "biscuits"...'}
              </span>
              <kbd className="hidden lg:inline-block ml-auto text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 font-semibold text-slate-400 shadow-2xs">
                ⌘K
              </kbd>
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Install App Quick Trigger */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 px-2.5 sm:px-3 py-2 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
              title="Install Apna Kirana App"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden text-[11px]">Install</span>
            </button>

            {/* Owner portal quick switch */}
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-green-700 bg-slate-100 hover:bg-green-50 px-3 py-2 rounded-xl border border-slate-200/80 transition"
            >
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Owner POS</span>
            </Link>

            {/* Profile CTA */}
            <Link
              href={isAuthenticated ? '/profile' : '/login'}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 p-2 sm:px-3 sm:py-2 rounded-xl transition"
            >
              <User className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline truncate max-w-[90px]">
                {isAuthenticated ? user?.full_name?.split(' ')[0] : 'Login'}
              </span>
            </Link>

            {/* Sticky Cart Button */}
            <Link
              href="/cart"
              className={`flex items-center gap-2.5 text-xs sm:text-sm font-extrabold px-3.5 py-2 rounded-xl shadow-sm transition transform active:scale-95 ${
                totalItems > 0
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-green-600/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {totalItems > 0 ? `₹${totalAmount}` : 'My Cart'}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Input Trigger */}
        <div className="md:hidden px-3 pb-2.5 pt-0.5">
          <Link
            href="/search"
            className="flex items-center text-slate-400 bg-slate-100/90 active:bg-slate-200/80 px-3.5 py-2 rounded-xl border border-slate-200/80 text-xs shadow-inner"
          >
            <Search className="w-4 h-4 mr-2 text-slate-400" />
            <span className="truncate text-slate-500 font-medium">
              {searchQuery || 'Search atta, dal, oil, biscuits, tea...'}
            </span>
          </Link>
        </div>
      </header>

      {/* Address Switcher Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Select Delivery Location</h3>
              </div>
              <button
                onClick={() => setShowAddressModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {defaultAddress ? (
                <div className="p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-green-800">
                        {defaultAddress.address_type} (Current)
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{defaultAddress.name} • {defaultAddress.phone}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{defaultAddress.house_flat}, {defaultAddress.street_area}, {defaultAddress.city} - {defaultAddress.pincode}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No saved addresses found.</p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/profile/addresses"
                onClick={() => setShowAddressModal(false)}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl text-center shadow-sm transition"
              >
                Manage Saved Addresses
              </Link>
              <button
                onClick={() => setShowAddressModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
