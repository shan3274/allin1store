'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banknote, Check, ChevronRight, Loader2, MapPin, QrCode, ShieldCheck } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { RequireAuth } from '@/components/ui/RequireAuth';
import { ProductImage } from '@/components/ui/ProductImage';
import { AddressPicker } from '@/components/AddressPicker';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { OrderError, useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { formatINR, roundMoney } from '@/lib/format';
import { getDeliverySlots, getStoreStatus } from '@/lib/storeHours';
import type { PaymentMethod } from '@/types/database';

const INSTRUCTIONS = ['Don’t ring the bell', 'Leave at the door', 'Avoid calling', 'Pet at home'];

const PAYMENT_OPTIONS: { id: PaymentMethod; title: string; body: string; icon: typeof Banknote }[] = [
  { id: 'upi', title: 'UPI on delivery', body: 'Scan the store QR with any UPI app when your order arrives', icon: QrCode },
  { id: 'cod', title: 'Cash on delivery', body: 'Pay the rider in cash at your door', icon: Banknote },
];

function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, deliveryCharge, discountAmount, totalAmount, appliedCoupon, clearCart, meetsMinOrder, minOrderAmount, unavailableItems, totalItems } =
    useCart();
  const { user, addresses, defaultAddress } = useAuth();
  const { createOrder, settings } = useStore();
  const { showToast } = useToast();

  const [addressId, setAddressId] = useState<string | null>(defaultAddress?.id ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [slots] = useState(() => getDeliverySlots(settings));
  const [slotId, setSlotId] = useState<string>(() => slots[0]?.id ?? '');
  const [chips, setChips] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('upi');
  const [placing, setPlacing] = useState(false);
  const placed = useRef(false);

  const address = addresses.find((a) => a.id === addressId) ?? defaultAddress;
  const slot = slots.find((s) => s.id === slotId);
  const storeStatus = getStoreStatus(settings);

  useEffect(() => {
    if (!addressId && defaultAddress) setAddressId(defaultAddress.id);
  }, [defaultAddress, addressId]);

  useEffect(() => {
    if (items.length === 0 && !placed.current) router.replace('/cart');
  }, [items.length, router]);

  const blocker = useMemo(() => {
    if (!address) return 'Add a delivery address';
    if (settings.serviceable_pincodes?.length && !settings.serviceable_pincodes.includes(address.pincode))
      return `We don’t deliver to ${address.pincode} yet. Choose another address.`;
    if (!slot) return 'No delivery slots available right now';
    if (slot.id === 'asap' && !storeStatus.isOpen) return storeStatus.message;
    if (unavailableItems.length) return 'Some items are out of stock. Go back to your cart to update.';
    if (!meetsMinOrder) return `Minimum order is ${formatINR(minOrderAmount)}. Add ${formatINR(roundMoney(minOrderAmount - subtotal))} more.`;
    return null;
  }, [address, settings, slot, storeStatus, unavailableItems, meetsMinOrder, minOrderAmount, subtotal]);

  const placeOrder = async () => {
    if (blocker || !address || !slot || placing) return;
    setPlacing(true);
    try {
      const instructions = [...chips, note.trim()].filter(Boolean).join(' · ');
      const order = createOrder({
        user_id: user?.id ?? null,
        order_type: 'online_delivery',
        subtotal,
        delivery_charge: deliveryCharge,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        payment_method: payment,
        payment_status: 'pending',
        shipping_name: address.name,
        shipping_phone: address.phone,
        shipping_address: [address.house_flat, address.street_area, address.landmark].filter(Boolean).join(', '),
        shipping_city: address.city,
        shipping_pincode: address.pincode,
        delivery_slot: slot.id === 'asap' ? null : `${slot.label}, ${slot.sublabel}`,
        notes: [appliedCoupon ? `Coupon ${appliedCoupon.code}` : '', instructions].filter(Boolean).join(' | ') || null,
        items: items.map((i, idx) => ({
          id: `oi-${Date.now().toString(36)}-${idx}`,
          order_id: '',
          product_id: i.product.id,
          product_name: `${i.product.name}${i.product.weight_volume ? ` (${i.product.weight_volume})` : ''}`,
          quantity: i.quantity,
          unit_price: Number(i.product.selling_price),
          total_price: roundMoney(Number(i.product.selling_price) * i.quantity),
          created_at: new Date().toISOString(),
        })),
      });
      placed.current = true;
      clearCart();
      router.replace(`/order/success/${order.id}`);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Couldn’t place your order',
        message: err instanceof OrderError ? err.message : 'Please try again in a moment.',
      });
      setPlacing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-3 pb-40 pt-3 md:px-6 md:pb-12 md:pt-2">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_360px] md:gap-6">
        <div className="min-w-0 space-y-3">
          {/* Address */}
          <section className="card px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink">Delivery address</h2>
              <button onClick={() => setPickerOpen(true)} className="text-sm font-semibold text-leaf-600">
                {address ? 'Change' : 'Add'}
              </button>
            </div>
            {address ? (
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft" />
                <div className="text-[13px] leading-relaxed">
                  <p className="font-semibold capitalize text-ink">
                    {address.address_type} · {address.name}
                  </p>
                  <p className="text-ink-muted">
                    {address.house_flat}, {address.street_area}
                    {address.landmark ? `, ${address.landmark}` : ''}, {address.city} {address.pincode}
                  </p>
                  <p className="text-ink-muted">{address.phone}</p>
                </div>
              </div>
            ) : (
              <button onClick={() => setPickerOpen(true)} className="btn-secondary w-full">
                Add delivery address
              </button>
            )}
          </section>

          {/* Slot */}
          <section className="card px-4 py-4">
            <h2 className="mb-3 text-sm font-bold text-ink">Delivery time</h2>
            {slots.length === 0 ? (
              <p className="text-[13px] text-ink-muted">No slots available. Please try again later.</p>
            ) : (
              <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
                {slots.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSlotId(s.id)}
                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-left transition ${
                      s.id === slotId ? 'border-leaf-500 bg-leaf-50/70' : 'border-line hover:border-ink-faint'
                    }`}
                  >
                    <span className={`block text-[13px] font-bold ${s.id === slotId ? 'text-leaf-700' : 'text-ink'}`}>{s.label}</span>
                    <span className="block text-xs text-ink-muted">{s.sublabel}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Instructions */}
          <section className="card px-4 py-4">
            <h2 className="mb-3 text-sm font-bold text-ink">Delivery instructions</h2>
            <div className="flex flex-wrap gap-2">
              {INSTRUCTIONS.map((c) => {
                const on = chips.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => setChips(on ? chips.filter((x) => x !== c) : [...chips, c])}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition ${
                      on ? 'border-leaf-500 bg-leaf-50 font-medium text-leaf-700' : 'border-line text-ink-soft'
                    }`}
                    aria-pressed={on}
                  >
                    {on && <Check className="h-3.5 w-3.5" />} {c}
                  </button>
                );
              })}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 200))}
              rows={2}
              placeholder="Anything else for the rider? (optional)"
              className="field mt-3 resize-none"
            />
          </section>

          {/* Payment */}
          <section className="card px-4 py-4">
            <h2 className="mb-3 text-sm font-bold text-ink">Payment method</h2>
            <div className="space-y-2" role="radiogroup">
              {PAYMENT_OPTIONS.map(({ id, title, body, icon: Icon }) => {
                const on = payment === id;
                return (
                  <button
                    key={id}
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPayment(id)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
                      on ? 'border-leaf-500 bg-leaf-50/60' : 'border-line hover:border-ink-faint'
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canvas">
                      <Icon className="h-[18px] w-[18px] text-ink-soft" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">{title}</span>
                      <span className="block text-xs text-ink-muted">{body}</span>
                    </span>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${on ? 'border-leaf-500' : 'border-line'}`}>
                      {on && <span className="h-2.5 w-2.5 rounded-full bg-leaf-500" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-3 md:sticky md:top-[96px] md:self-start">
          <section className="card px-4 py-4">
            <h2 className="mb-3 text-sm font-bold text-ink">
              Order summary · {totalItems} item{totalItems > 1 ? 's' : ''}
            </h2>
            <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
              {items.map((i) => (
                <div key={i.product.id} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-tile/60">
                  <ProductImage src={i.product.image_url} alt={i.product.name} className="h-full w-full object-cover" />
                  {i.quantity > 1 && (
                    <span className="absolute bottom-0.5 right-0.5 rounded bg-ink/80 px-1 text-[10px] font-bold text-white">×{i.quantity}</span>
                  )}
                </div>
              ))}
            </div>
            <dl className="tabular space-y-2 text-[13px]">
              <div className="flex justify-between text-ink-soft">
                <dt>Items total</dt>
                <dd className="text-ink">{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink-soft">
                <dt>Delivery charge</dt>
                <dd className={deliveryCharge === 0 ? 'font-semibold text-leaf-600' : 'text-ink'}>
                  {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                </dd>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-leaf-700">
                  <dt>Coupon discount</dt>
                  <dd>−{formatINR(discountAmount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-[15px] font-bold text-ink">
                <dt>To pay</dt>
                <dd>{formatINR(totalAmount)}</dd>
              </div>
            </dl>
          </section>

          <div className="hidden md:block">
            {blocker && <p className="mb-2 text-[13px] font-medium text-orange-700">{blocker}</p>}
            <button onClick={placeOrder} disabled={!!blocker || placing} className="btn-primary h-14 w-full justify-between px-5 text-base">
              <span className="tabular">{formatINR(totalAmount)}</span>
              <span className="flex items-center gap-1">
                {placing ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Place order <ChevronRight className="h-5 w-5" /></>}
              </span>
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-leaf-500" /> You pay only when the order reaches you
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile CTA */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white shadow-bar md:hidden">
        {blocker && <p className="bg-orange-50 px-4 py-2 text-xs font-medium text-orange-800">{blocker}</p>}
        <div className="px-3 py-3">
          <button onClick={placeOrder} disabled={!!blocker || placing} className="btn-primary h-14 w-full justify-between px-4">
            <span className="text-left leading-tight">
              <span className="tabular block text-[15px] font-bold">{formatINR(totalAmount)}</span>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-white/80">
                {payment === 'cod' ? 'Cash on delivery' : 'UPI on delivery'}
              </span>
            </span>
            <span className="flex items-center gap-1 text-[15px]">
              {placing ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Place order <ChevronRight className="h-5 w-5" /></>}
            </span>
          </button>
        </div>
      </div>

      <AddressPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={setAddressId} selectedId={address?.id} />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader hideOnMobile />
      <PageHeader title="Checkout" backHref="/cart" />
      <RequireAuth>
        <CheckoutView />
      </RequireAuth>
    </div>
  );
}
