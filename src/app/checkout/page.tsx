'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import {
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Plus,
  AlertCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, subtotal, deliveryCharge, discountAmount, clearCart } = useCart();
  const { addresses, defaultAddress, user, saveAddress, setDefaultAddress } = useAuth();
  const { createOrder, settings } = useStore();
  const { showToast } = useToast();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddress?.id || '');
  const [selectedSlot, setSelectedSlot] = useState<string>('asap');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Address add form modal state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState(user?.full_name || '');
  const [newAddrPhone, setNewAddrPhone] = useState(user?.phone || '');
  const [newAddrHouse, setNewAddrHouse] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrType, setNewAddrType] = useState<'home' | 'work' | 'other'>('home');

  const selectedAddr = addresses.find((a) => a.id === selectedAddressId) || defaultAddress;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrHouse || !newAddrStreet) return;

    saveAddress({
      name: newAddrName || 'Customer',
      phone: newAddrPhone || '+91 98765 43210',
      house_flat: newAddrHouse,
      street_area: newAddrStreet,
      landmark: 'Near Main Market',
      city: 'Ghaziabad',
      pincode: '201001',
      address_type: newAddrType,
      is_default: true,
    });

    setShowAddAddress(false);
    showToast({
      type: 'success',
      title: 'Address Saved',
      message: 'New delivery address added successfully.',
    });
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    if (!selectedAddr) {
      showToast({
        type: 'error',
        title: 'Missing Address',
        message: 'Please choose or add a delivery address.',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate real gateway processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      const orderPayload = items.map((i) => ({
        id: `oi-${Date.now()}-${Math.random()}`,
        order_id: '',
        product_id: i.product.id,
        product_name: i.product.name,
        quantity: i.quantity,
        unit_price: Number(i.product.selling_price),
        total_price: Number(i.product.selling_price) * i.quantity,
        created_at: new Date().toISOString(),
      }));

      const newOrder = createOrder({
        user_id: user?.id || 'guest',
        subtotal,
        delivery_charge: deliveryCharge,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        shipping_name: selectedAddr.name,
        shipping_phone: selectedAddr.phone,
        shipping_address: `${selectedAddr.house_flat}, ${selectedAddr.street_area}`,
        shipping_city: selectedAddr.city,
        shipping_pincode: selectedAddr.pincode,
        notes: deliveryNotes ? `${deliveryNotes} (Slot: ${selectedSlot})` : `Slot: ${selectedSlot}`,
        items: orderPayload,
      });

      clearCart();
      showToast({
        type: 'success',
        title: 'Order Confirmed!',
        message: `Order #${newOrder.order_number} received by Kirana store.`,
      });

      router.push(`/order/success/${newOrder.id}`);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Order Failed',
        message: 'Unable to process checkout. Please try again.',
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/cart" className="hover:text-green-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Basket
          </Link>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Checkout & Order Confirmation
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Address, Slot, Payment */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. Delivery Address Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">1. Delivery Address</h3>
                </div>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="text-xs font-bold text-green-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New
                </button>
              </div>

              {/* Saved Addresses Selector */}
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                      (selectedAddressId ? selectedAddressId === addr.id : addr.is_default)
                        ? 'border-green-600 bg-green-50/70 ring-1 ring-green-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected_address"
                      checked={
                        selectedAddressId ? selectedAddressId === addr.id : addr.is_default
                      }
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 text-green-600 focus:ring-green-500"
                    />
                    <div className="text-xs">
                      <span className="font-black uppercase tracking-wider text-green-800 bg-green-200/60 px-1.5 py-0.5 rounded text-[10px]">
                        {addr.address_type}
                      </span>
                      <p className="font-bold text-slate-900 mt-1">{addr.name} • {addr.phone}</p>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {addr.house_flat}, {addr.street_area}, {addr.city} - {addr.pincode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Delivery Slot Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">2. Delivery Preference</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedSlot('asap')}
                  className={`p-3 rounded-2xl border text-left font-bold transition ${
                    selectedSlot === 'asap'
                      ? 'border-green-600 bg-green-50 text-green-900 ring-1 ring-green-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-black text-sm">⚡ ASAP Delivery</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">25–35 minutes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSlot('evening')}
                  className={`p-3 rounded-2xl border text-left font-bold transition ${
                    selectedSlot === 'evening'
                      ? 'border-green-600 bg-green-50 text-green-900 ring-1 ring-green-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-black text-sm">🌙 Evening Slot</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">06:00 PM – 08:00 PM</span>
                </button>
              </div>

              {/* Delivery Instructions */}
              <input
                type="text"
                placeholder="Drop at door / Ring bell instructions..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* 3. Payment Method Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">3. Payment Option</h3>
              </div>

              <div className="space-y-2 text-xs">
                <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <span className="font-black text-slate-900 block">UPI Instant Payment (GPay / PhonePe / Paytm)</span>
                      <span className="text-[11px] text-slate-500">Fastest checkout with instant verification</span>
                    </div>
                  </div>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-black text-[10px]">FAST</span>
                </label>

                <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <span className="font-black text-slate-900 block">Cash on Delivery (COD)</span>
                      <span className="text-[11px] text-slate-500">Pay cash or scan QR when delivery partner arrives</span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-slate-400" />
                </label>

                <label className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <span className="font-black text-slate-900 block">Credit / Debit Card / Netbanking</span>
                      <span className="text-[11px] text-slate-500">Visa, Mastercard, RuPay, Maestro</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place CTA */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Order Summary ({items.length} items)
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-100">
                {items.map((i) => (
                  <div key={i.product.id} className="pt-1.5 flex justify-between text-xs">
                    <span className="truncate max-w-[180px] text-slate-800 font-semibold">
                      {i.quantity} × {i.product.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{Number(i.product.selling_price) * i.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2 text-xs text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span className="font-black">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-black">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">₹{deliveryCharge}</span>
                  )}
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-black text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-green-700 text-xl">₹{totalAmount}</span>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 text-white font-black text-sm rounded-2xl shadow-md shadow-green-700/20 transition flex items-center justify-center gap-2 active:scale-98"
              >
                {isProcessing ? 'Confirming Order with Store...' : `Place Order • ₹${totalAmount}`}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Safe & Trusted Kirana Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add Delivery Address */}
        {showAddAddress && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Add New Delivery Address</h3>

              <form onSubmit={handleSaveNewAddress} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newAddrName}
                  onChange={(e) => setNewAddrName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number"
                  value={newAddrPhone}
                  onChange={(e) => setNewAddrPhone(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="House / Flat / Block No"
                  value={newAddrHouse}
                  onChange={(e) => setNewAddrHouse(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Street / Society / Area"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />

                <div className="flex gap-2">
                  {(['home', 'work', 'other'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setNewAddrType(type)}
                      className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-xl border transition ${
                        newAddrType === type
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
