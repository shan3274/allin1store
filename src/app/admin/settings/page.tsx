'use client';

import React, { useState } from 'react';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { Settings, Save, Store, Clock, Truck, Power } from 'lucide-react';

function SettingsForm() {
  const { settings, updateSettings } = useStore();
  const { showToast } = useToast();

  const [storeName, setStoreName] = useState(settings.store_name);
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email || '');
  const [address, setAddress] = useState(settings.address);
  const [city, setCity] = useState(settings.city);
  const [deliveryCharge, setDeliveryCharge] = useState(String(settings.delivery_charge));
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState(String(settings.free_delivery_above));
  const [minOrder, setMinOrder] = useState(String(settings.min_order_amount));
  const [isStoreOpen, setIsStoreOpen] = useState(settings.is_store_open);
  const [openingTime, setOpeningTime] = useState((settings.opening_time || '07:00').slice(0, 5));
  const [closingTime, setClosingTime] = useState((settings.closing_time || '22:00').slice(0, 5));
  const [etaMinutes, setEtaMinutes] = useState(String(settings.delivery_eta_minutes || 30));
  const [radiusKm, setRadiusKm] = useState(String(settings.delivery_radius_km));
  const [pincodes, setPincodes] = useState((settings.serviceable_pincodes || []).join(', '));
  const [error, setError] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const pinList = pincodes
      .split(/[\s,]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const badPin = pinList.find((p) => !/^[1-9]\d{5}$/.test(p));
    if (badPin) return setError(`“${badPin}” is not a valid 6-digit pincode.`);
    const nums = [deliveryCharge, freeDeliveryAbove, minOrder, etaMinutes, radiusKm].map(Number);
    if (nums.some((n) => Number.isNaN(n) || n < 0)) return setError('Amounts and distances must be positive numbers.');
    if (!openingTime || !closingTime) return setError('Set both opening and closing time.');
    setError(null);
    updateSettings({
      opening_time: `${openingTime}:00`,
      closing_time: `${closingTime}:00`,
      delivery_eta_minutes: Math.max(5, Number(etaMinutes)),
      delivery_radius_km: Number(radiusKm),
      serviceable_pincodes: Array.from(new Set(pinList)),
      store_name: storeName,
      tagline,
      phone,
      email,
      address,
      city,
      delivery_charge: Number(deliveryCharge),
      free_delivery_above: Number(freeDeliveryAbove),
      min_order_amount: Number(minOrder),
      is_store_open: isStoreOpen,
    });

    showToast({
      type: 'success',
      title: 'Store Settings Saved',
      message: 'Business rules updated and live across customer experience.',
    });
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-4xl w-full mx-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 text-green-400" /> Store Profile & Operational Settings
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Configure store timings, free delivery limits, store open/closed status and contact details
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Store Status Toggle */}
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/80 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isStoreOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                <Power className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">
                  Store Status: {isStoreOpen ? 'Accepting Orders' : 'Temporarily Closed'}
                </h3>
                <p className="text-slate-400 text-xs">
                  {isStoreOpen
                    ? 'Customers can place live orders for 25-minute delivery'
                    : 'Checkout will inform customers that store is closed'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                isStoreOpen ? 'bg-rose-600 text-white' : 'bg-green-600 text-white'
              }`}
            >
              {isStoreOpen ? 'Close Store' : 'Open Store'}
            </button>
          </div>

          {/* Delivery & Fees */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-sm space-y-4">
            <h3 className="font-black text-white text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-400" /> Delivery Fees & Cart Minimums
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Standard Delivery Fee (₹)</label>
                <input
                  type="number"
                  required
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Free Delivery Above (₹)</label>
                <input
                  type="number"
                  required
                  value={freeDeliveryAbove}
                  onChange={(e) => setFreeDeliveryAbove(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hours & delivery area */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-sm space-y-4">
            <h3 className="font-black text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-400" /> Store hours & delivery area
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Opens at</label>
                <input type="time" required value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Closes at</label>
                <input type="time" required value={closingTime} onChange={(e) => setClosingTime(e.target.value)} className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Delivery time shown (min)</label>
                <input type="number" min={5} required value={etaMinutes} onChange={(e) => setEtaMinutes(e.target.value)} className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Delivery radius (km)</label>
                <input type="number" min={0} step="0.5" required value={radiusKm} onChange={(e) => setRadiusKm(e.target.value)} className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Deliverable pincodes</label>
              <textarea
                rows={2}
                value={pincodes}
                onChange={(e) => setPincodes(e.target.value)}
                placeholder="201001, 201009, 201012 — leave empty to accept all"
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              />
              <p className="text-[11px] text-slate-500">Customers can only check out to these pincodes. Leave empty to allow any.</p>
            </div>
          </div>

          {/* Contact & Address */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 shadow-sm space-y-4">
            <h3 className="font-black text-white text-sm flex items-center gap-2">
              <Store className="w-4 h-4 text-green-400" /> Store Info & Public Brand
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Store Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Owner Helpline Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Support Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Physical Store Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}
            <button
              type="submit"
              className="px-6 py-3.5 bg-green-600 hover:bg-green-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Store Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayoutWrapper>
  );
}

export default function AdminSettingsPage() {
  const { isHydrated } = useStore();
  // Remount once saved settings load so the form never edits stale defaults.
  return <SettingsForm key={isHydrated ? 'ready' : 'loading'} />;
}
