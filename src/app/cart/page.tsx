'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Clock,
  ShieldCheck,
  Check,
  MapPin,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    mrpTotal,
    totalSavings,
    deliveryCharge,
    discountAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    amountNeededForFreeDelivery,
    freeDeliveryProgressPercent,
  } = useCart();

  const { isAuthenticated, defaultAddress } = useAuth();
  const { settings } = useStore();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponCodeInput.trim()) return;

    const res = applyCoupon(couponCodeInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCodeInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-green-600" /> Your Grocery Basket
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {items.length} {items.length === 1 ? 'item' : 'unique items'} selected for delivery
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5" /> Empty Basket
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center space-y-4 shadow-2xs">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto text-3xl">
              🛒
            </div>
            <div className="space-y-1">
              <h2 className="font-black text-slate-800 text-lg">Your basket is feeling light</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Explore fresh wheat flour, ghee, lentils, spices and daily milk products from your local store.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-md transition"
            >
              Browse Grocery Aisles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Items List */}
            <div className="lg:col-span-7 space-y-3">
              {/* Free delivery meter */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">
                    {amountNeededForFreeDelivery === 0
                      ? '🎉 Free instant delivery unlocked!'
                      : `Add ₹${amountNeededForFreeDelivery} more for FREE Delivery`}
                  </span>
                  <span className="text-green-700 font-black">{freeDeliveryProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeDeliveryProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 flex items-center justify-between gap-3 sm:gap-4 hover:bg-slate-50/50 transition"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-slate-50 rounded-xl p-1 flex-shrink-0 flex items-center justify-center border border-slate-100">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <span className="text-lg font-bold text-green-700">
                          {item.product.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                        {item.product.brand || 'Kirana'}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {item.product.weight_volume || item.product.unit}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-slate-900">
                          ₹{Number(item.product.selling_price) * item.quantity}
                        </span>
                        {Number(item.product.mrp) > Number(item.product.selling_price) && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{Number(item.product.mrp) * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-black text-slate-900 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery ETA info */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-emerald-900 font-semibold">
                <Clock className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>
                  Delivery in <strong>25–35 minutes</strong> from {settings.store_name} ({settings.city})
                </span>
              </div>
            </div>

            {/* Right: Bill & Coupon Details */}
            <div className="lg:col-span-5 space-y-4">
              {/* Coupon Section */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-600" />
                  <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Apply Store Coupon</h3>
                </div>

                {appliedCoupon ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-xs text-green-800 bg-green-200/60 px-2 py-0.5 rounded">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[11px] text-green-700 mt-1">{appliedCoupon.description}</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try WELCOME50 or KIRANA10"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold outline-none focus:ring-1 focus:ring-green-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 font-semibold">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Bill Details */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  Bill Summary
                </h3>

                <div className="space-y-2 text-xs text-slate-600 font-semibold">
                  <div className="flex justify-between">
                    <span>Item Total (MRP)</span>
                    <span className="text-slate-400 line-through">₹{mrpTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Store Discount Price</span>
                    <span className="font-bold text-slate-900">₹{subtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Coupon Savings</span>
                      <span className="font-black">-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-black">FREE</span>
                    ) : (
                      <span className="font-bold text-slate-900">₹{deliveryCharge}</span>
                    )}
                  </div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-black text-slate-900">
                    <span>To Pay</span>
                    <span className="text-green-700 text-lg">₹{totalAmount}</span>
                  </div>
                </div>

                {totalSavings > 0 && (
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-center text-xs font-black text-emerald-800 border border-emerald-200">
                    🎉 You are saving ₹{totalSavings} on this order!
                  </div>
                )}

                {/* Checkout Trigger */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-green-700/20 transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
