'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Bike,
  ChevronRight,
  FileText,
  ShoppingBag,
  ShoppingCart,
  TicketPercent,
  Timer,
  Trash2,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductImage } from '@/components/ui/ProductImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { ProductRail } from '@/components/ProductRail';
import { AddressPicker } from '@/components/AddressPicker';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { formatINR, roundMoney } from '@/lib/format';
import { getStoreStatus } from '@/lib/storeHours';
import { useIsClient } from '@/lib/useIsClient';

export default function CartPage() {
  const router = useRouter();
  const isClient = useIsClient();
  const cart = useCart();
  const {
    items,
    removeFromCart,
    clearCart,
    subtotal,
    mrpTotal,
    totalSavings,
    deliveryCharge,
    discountAmount,
    totalAmount,
    appliedCoupon,
    couponWarning,
    availableCoupons,
    applyCoupon,
    removeCoupon,
    amountNeededForFreeDelivery,
    freeDeliveryProgressPercent,
    minOrderAmount,
    meetsMinOrder,
    unavailableItems,
    totalItems,
  } = cart;
  const { isAuthenticated, defaultAddress } = useAuth();
  const { settings, catalog } = useStore();

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const status = getStoreStatus(settings);
  const eta = settings.delivery_eta_minutes || 30;

  const suggestions = catalog
    .filter((p) => p.is_featured && p.stock_quantity > 0 && !items.some((i) => i.product.id === p.id))
    .slice(0, 10);

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const res = applyCoupon(code);
    if (res.success) {
      setCode('');
      setCodeError(null);
    } else setCodeError(res.message);
  };

  // Primary action depends on where the customer is in the funnel.
  let blocker: string | null = null;
  if (unavailableItems.length) blocker = 'Some items are out of stock. Update your basket to continue.';
  else if (!meetsMinOrder) blocker = `Minimum order is ${formatINR(minOrderAmount)}. Add ${formatINR(roundMoney(minOrderAmount - subtotal))} more.`;

  const primary = () => {
    if (!isAuthenticated) return router.push('/login?redirect=/cart');
    if (!defaultAddress) return setPickerOpen(true);
    router.push('/checkout');
  };
  const primaryLabel = !isAuthenticated ? 'Login to proceed' : !defaultAddress ? 'Add address to proceed' : 'Proceed to checkout';

  if (!isClient) {
    return (
      <div className="min-h-screen">
        <SiteHeader hideOnMobile />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader hideOnMobile />
        <div className="md:hidden">
          <PageHeader title="Your basket" />
        </div>
        <EmptyState
          icon={<ShoppingCart className="h-9 w-9" />}
          title="Your basket is empty"
          description="Add atta, dal, milk and everything else you need — delivered in minutes."
          action={{ label: 'Start shopping', href: '/' }}
        />
        <div className="mx-auto w-full max-w-6xl md:px-6">
          <ProductRail title="Popular right now" products={suggestions} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader hideOnMobile />
      <div className="md:hidden">
        <PageHeader
          title="Your basket"
          right={
            <button onClick={clearCart} className="px-3 text-sm font-medium text-rose-600" aria-label="Empty cart">
              Clear
            </button>
          }
        />
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-3 pb-44 pt-3 md:px-6 md:pb-12 md:pt-6">
        <div className="mb-4 hidden items-center justify-between md:flex">
          <h1 className="font-display text-3xl font-semibold text-ink">Your basket</h1>
          <button onClick={clearCart} className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600">
            <Trash2 className="h-4 w-4" /> Empty basket
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_380px] md:gap-6">
          <div className="min-w-0 space-y-3">
            {/* Items */}
            <section className="card overflow-hidden">
              <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-canvas">
                  <Timer className="h-5 w-5 text-ink-soft" />
                </span>
                <div>
                  <p className="font-bold text-ink">{status.isOpen ? `Arriving in about ${eta} min` : 'Scheduled delivery'}</p>
                  <p className="text-xs text-ink-muted">
                    Shipment of {totalItems} item{totalItems > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {unavailableItems.length > 0 && (
                <div className="flex gap-2 bg-orange-50 px-4 py-3 text-[13px] text-orange-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>Stock changed for {unavailableItems.map((i) => i.product.name).join(', ')}. Please reduce the quantity or remove.</span>
                </div>
              )}

              <ul className="divide-y divide-line">
                {items.map(({ product, quantity }) => {
                  const short = quantity > product.stock_quantity;
                  return (
                    <li key={product.id} className="flex items-center gap-3 px-4 py-3.5">
                      <Link href={`/product/${product.slug}`} className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-line bg-tile/60">
                        <ProductImage src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[13px] font-medium leading-snug text-ink">{product.name}</p>
                        <p className="text-xs text-ink-muted">{product.weight_volume || product.unit}</p>
                        {short ? (
                          <button onClick={() => removeFromCart(product.id)} className="mt-0.5 text-xs font-semibold text-orange-700">
                            {product.stock_quantity === 0 ? 'Out of stock · Remove' : `Only ${product.stock_quantity} left`}
                          </button>
                        ) : (
                          <p className="tabular mt-0.5 text-[13px] font-bold text-ink">
                            {formatINR(product.selling_price * quantity)}
                            {product.mrp > product.selling_price && (
                              <span className="ml-1.5 text-xs font-normal text-ink-faint line-through">
                                {formatINR(product.mrp * quantity)}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                      <QuantityStepper product={product} size="sm" />
                    </li>
                  );
                })}
              </ul>
            </section>

            {suggestions.length > 0 && (
              <section className="card px-1 md:px-4">
                <ProductRail title="Add a little more" products={suggestions} />
              </section>
            )}
          </div>

          <aside className="min-w-0 space-y-3 md:sticky md:top-[96px] md:self-start">
            {/* Free delivery meter */}
            {settings.free_delivery_above > 0 && (
              <section className="card px-4 py-3.5">
                <div className="flex items-center gap-2 text-[13px]">
                  <Bike className="h-4 w-4 shrink-0 text-leaf-600" />
                  {amountNeededForFreeDelivery > 0 ? (
                    <span className="text-ink-soft">
                      Add <b className="text-ink">{formatINR(amountNeededForFreeDelivery)}</b> more for free delivery
                    </span>
                  ) : (
                    <span className="font-semibold text-leaf-700">Free delivery unlocked</span>
                  )}
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-canvas">
                  <div className="h-full rounded-full bg-leaf-500 transition-all" style={{ width: `${freeDeliveryProgressPercent}%` }} />
                </div>
              </section>
            )}

            {/* Coupons */}
            <section className="card px-4 py-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <TicketPercent className="h-4 w-4 text-offer" /> Offers
              </h2>
              {appliedCoupon ? (
                <div className="rounded-xl border border-leaf-200 bg-leaf-50/70 px-3.5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-leaf-700">{appliedCoupon.code} applied</p>
                      <p className="text-xs text-ink-muted">
                        {discountAmount > 0 ? `You save ${formatINR(discountAmount)}` : appliedCoupon.description}
                      </p>
                    </div>
                    <button onClick={removeCoupon} className="text-sm font-semibold text-rose-600">
                      Remove
                    </button>
                  </div>
                  {couponWarning && <p className="mt-2 text-xs font-medium text-orange-700">{couponWarning}</p>}
                </div>
              ) : (
                <>
                  <form onSubmit={submitCode} className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        setCodeError(null);
                      }}
                      placeholder="Enter coupon code"
                      className="field h-10 flex-1 py-0 uppercase tracking-wide"
                      aria-label="Coupon code"
                    />
                    <button type="submit" className="btn-ghost h-10 px-3 py-0" disabled={!code.trim()}>
                      Apply
                    </button>
                  </form>
                  {codeError && <p className="mt-1.5 text-xs font-medium text-rose-600">{codeError}</p>}
                  {availableCoupons.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {availableCoupons.map((c) => {
                        const short = c.minOrderValue - subtotal;
                        return (
                          <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-line px-3.5 py-2.5">
                            <div className="min-w-0">
                              <p className="text-[13px] font-bold tracking-wide text-ink">{c.code}</p>
                              <p className="text-xs text-ink-muted">{c.description}</p>
                              {short > 0 && (
                                <p className="mt-0.5 text-[11px] text-ink-faint">Add {formatINR(roundMoney(short))} more to unlock</p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                const r = applyCoupon(c.code);
                                setCodeError(r.success ? null : r.message);
                              }}
                              disabled={short > 0}
                              className="shrink-0 text-sm font-bold text-leaf-600 disabled:text-ink-faint"
                            >
                              Apply
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </section>

            {/* Bill */}
            <section className="card px-4 py-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
                <FileText className="h-4 w-4 text-ink-soft" /> Bill summary
              </h2>
              <dl className="tabular space-y-2 text-[13px]">
                <div className="flex justify-between text-ink-soft">
                  <dt>Items total</dt>
                  <dd>
                    {mrpTotal > subtotal && <span className="mr-1.5 text-ink-faint line-through">{formatINR(mrpTotal)}</span>}
                    <span className="text-ink">{formatINR(subtotal)}</span>
                  </dd>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <dt>Delivery charge</dt>
                  <dd>
                    {deliveryCharge === 0 ? (
                      <>
                        {settings.delivery_charge > 0 && (
                          <span className="mr-1.5 text-ink-faint line-through">{formatINR(settings.delivery_charge)}</span>
                        )}
                        <span className="font-semibold text-leaf-600">FREE</span>
                      </>
                    ) : (
                      <span className="text-ink">{formatINR(deliveryCharge)}</span>
                    )}
                  </dd>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-leaf-700">
                    <dt>Coupon ({appliedCoupon?.code})</dt>
                    <dd>−{formatINR(discountAmount)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-line pt-3 text-[15px] font-bold text-ink">
                  <dt>Grand total</dt>
                  <dd>{formatINR(totalAmount)}</dd>
                </div>
              </dl>
              {totalSavings > 0 && (
                <p className="mt-3 rounded-xl bg-leaf-50 px-3 py-2 text-[13px] font-medium text-leaf-700">
                  You save {formatINR(totalSavings)} compared to MRP
                </p>
              )}
            </section>

            <section className="card px-4 py-4 text-xs leading-relaxed text-ink-muted">
              <p className="mb-1 text-sm font-bold text-ink">Cancellation policy</p>
              Orders can be cancelled until they are packed. Damaged or wrong items are replaced at your doorstep.{' '}
              <Link href="/refund-policy" className="font-semibold text-leaf-600">
                Read more
              </Link>
            </section>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              {blocker ? (
                <p className="mb-2 text-[13px] font-medium text-orange-700">{blocker}</p>
              ) : (
                !status.isOpen && <p className="mb-2 text-[13px] text-ink-muted">Store is closed now — you can schedule delivery at checkout.</p>
              )}
              <button onClick={primary} disabled={!!blocker && isAuthenticated && !!defaultAddress} className="btn-primary h-14 w-full justify-between px-5 text-base">
                <span className="tabular">{formatINR(totalAmount)}</span>
                <span className="flex items-center gap-1">
                  {primaryLabel} <ChevronRight className="h-5 w-5" />
                </span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky footer */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white shadow-bar md:hidden">
        {isAuthenticated && defaultAddress && (
          <button onClick={() => setPickerOpen(true)} className="flex w-full items-center gap-3 border-b border-line px-4 py-2.5 text-left">
            <ShoppingBag className="h-4 w-4 shrink-0 text-ink-soft" />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-ink">
                Delivering to {defaultAddress.address_type.charAt(0).toUpperCase() + defaultAddress.address_type.slice(1)}
              </span>
              <span className="block truncate text-xs text-ink-muted">
                {defaultAddress.house_flat}, {defaultAddress.street_area}
              </span>
            </span>
            <span className="text-[13px] font-semibold text-leaf-600">Change</span>
          </button>
        )}
        {blocker ? (
          <p className="bg-orange-50 px-4 py-2 text-xs font-medium text-orange-800">{blocker}</p>
        ) : (
          !status.isOpen && <p className="bg-sun-50 px-4 py-2 text-xs font-medium text-ink-soft">Store is closed now — you can schedule delivery at checkout.</p>
        )}
        <div className="px-3 py-3">
          <button onClick={primary} disabled={!!blocker && isAuthenticated && !!defaultAddress} className="btn-primary h-14 w-full justify-between px-4">
            <span className="text-left leading-tight">
              <span className="tabular block text-[15px] font-bold">{formatINR(totalAmount)}</span>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-white/80">Total</span>
            </span>
            <span className="flex items-center gap-1 text-[15px]">
              {primaryLabel} <ChevronRight className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>

      <AddressPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </div>
  );
}
