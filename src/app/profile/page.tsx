'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  User,
  MapPin,
  ClipboardList,
  Heart,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Phone,
  Bell,
  Sparkles,
  Download,
  Smartphone
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, defaultAddress, favorites, logout, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been signed out from Apni Kirana.',
    });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-green-700 to-emerald-500 text-white flex items-center justify-center font-black text-2xl shadow-md">
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {user?.full_name || 'Guest User'}
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {user?.phone || '+91 98765 43210'}
              </p>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1 border border-emerald-200">
                Verified Kirana Customer
              </span>
            </div>
          </div>

          <Link
            href="/profile/setup"
            className="text-xs font-bold text-green-700 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200 transition"
          >
            Edit
          </Link>
        </div>

        {/* Customer Hub Navigation List */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          <Link
            href="/orders"
            className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">My Orders & Live Dispatches</p>
                <p className="text-[11px] text-slate-500 font-medium">View active order status & reorder previous lists</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/profile/addresses"
            className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Saved Delivery Addresses</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {defaultAddress
                    ? `${defaultAddress.house_flat}, ${defaultAddress.street_area}`
                    : 'Manage home and office locations'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/profile/favorites"
            className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Saved Grocery Essentials</p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {favorites.length} frequent staples saved for fast re-ordering
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            href="/help"
            className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Help & Support</p>
                <p className="text-[11px] text-slate-500 font-medium">Delivery issues, order refunds & direct store contact</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('trigger-pwa-install'));
              }
            }}
            className="w-full text-left p-4 flex items-center justify-between hover:bg-emerald-50/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Install Apna Kirana App</span>
                  <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                    PWA App
                  </span>
                </p>
                <p className="text-[11px] text-slate-500 font-medium">Download to Android/iPhone home screen for instant ordering</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </div>
          </button>

          <Link
            href="/admin"
            className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">Owner POS & Billing Dashboard</p>
                <p className="text-[11px] text-slate-500 font-medium">Switch to store owner mode</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Logout */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm rounded-2xl border border-rose-200 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        )}
      </main>
    </div>
  );
}
