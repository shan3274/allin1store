'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, MapPin, PackageSearch, Phone, Printer, RotateCcw, Wallet } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { RequireAuth } from '@/components/ui/RequireAuth';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductImage } from '@/components/ui/ProductImage';
import { Sheet } from '@/components/ui/Sheet';
import { OrderStatusIcon } from '@/components/OrderStatusIcon';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useReorder } from '@/lib/useReorder';
import { PAYMENT_METHOD_LABEL, formatDateTime, formatINR } from '@/lib/format';
import type { OrderStatus } from '@/types/database';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'Placed' },
  { status: 'packed', label: 'Packed' },
  { status: 'out_for_delivery', label: 'On the way' },
  { status: 'delivered', label: 'Delivered' },
];
const RANK: Record<string, number> = { pending: 0, confirmed: 0.5, packed: 1, out_for_delivery: 2, delivered: 3 };

const CANCEL_REASONS = ['Ordered by mistake', 'Want to change items', 'Want to change address', 'Delivery is taking too long', 'Other'];

function headline(status: OrderStatus, slot?: string | null): { title: string; body: string } {
  switch (status) {
    case 'pending':
      return { title: 'Order placed', body: slot ? `Scheduled for ${slot}` : 'Waiting for the store to confirm' };
    case 'confirmed':
      return { title: 'Order confirmed', body: 'The store is picking your items' };
    case 'packed':
      return { title: 'Packed and ready', body: 'A rider will pick it up shortly' };
    case 'out_for_delivery':
      return { title: 'On the way', body: 'Your rider is heading to you' };
    case 'delivered':
      return { title: 'Delivered', body: 'Thanks for shopping with us' };
    default:
      return { title: 'Order cancelled', body: '' };
  }
}

function OrderView({ id }: { id: string }) {
  const { getOrderById, cancelOrder, settings, getProductById, isHydrated } = useStore();
  const { user } = useAuth();
  const { showToast } = useToast();
  const reorder = useReorder();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [, forceTick] = useState(0);

  // Re-render every 30s so the ETA countdown stays fresh.
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const order = getOrderById(id);

  if (!order || order.user_id !== user?.id) {
    if (!isHydrated) return null;
    return (
      <EmptyState
        icon={<PackageSearch className="h-9 w-9" />}
        title="Order not found"
        description="We couldn’t find this order on your account."
        action={{ label: 'View your orders', href: '/orders' }}
      />
    );
  }

  const { title, body } = headline(order.status, order.delivery_slot);
  const isCancelled = order.status === 'cancelled' || order.status === 'returned';
  const isActive = !isCancelled && order.status !== 'delivered';
  const canCancel = order.status === 'pending' || order.status === 'confirmed';
  const rank = RANK[order.status] ?? 0;
  const eta = settings.delivery_eta_minutes || 30;
  const minsLeft = !order.delivery_slot
    ? Math.max(2, Math.round((new Date(order.created_at).getTime() + eta * 60000 - Date.now()) / 60000))
    : null;
  const stepTime = (s: OrderStatus) => order.timeline.find((t) => t.status === s && t.completed)?.timestamp;

  const confirmCancel = () => {
    cancelOrder(order.id, reason, 'Customer');
    setCancelOpen(false);
    showToast({ type: 'info', title: 'Order cancelled', message: 'You won’t be charged for this order.' });
  };

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-3 px-3 pb-28 pt-3 md:px-6 md:pt-2">
      {/* Status */}
      <section className="card px-4 py-5">
        <div className="flex items-center gap-3.5">
          <OrderStatusIcon status={order.status} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-ink">{title}</p>
            <p className="text-sm text-ink-muted">
              {isCancelled ? order.cancelled_reason || 'This order was cancelled' : body}
            </p>
          </div>
          {isActive && minsLeft !== null && (
            <div className="text-right">
              <p className="tabular text-2xl font-extrabold leading-none text-leaf-600">{minsLeft}</p>
              <p className="text-[11px] font-semibold uppercase text-ink-muted">mins</p>
            </div>
          )}
        </div>

        {!isCancelled && (
          <ol className="mt-6 grid grid-cols-4">
            {STEPS.map((s, i) => {
              const done = rank >= i;
              const ts = stepTime(s.status);
              return (
                <li key={s.status} className="relative flex flex-col items-center text-center">
                  {i > 0 && (
                    <span className={`absolute right-1/2 top-[9px] h-0.5 w-full ${rank >= i ? 'bg-leaf-500' : 'bg-line'}`} aria-hidden />
                  )}
                  <span
                    className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      done ? 'border-leaf-500 bg-leaf-500' : 'border-line bg-white'
                    }`}
                  >
                    {done && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className={`mt-2 text-xs font-semibold ${done ? 'text-ink' : 'text-ink-faint'}`}>{s.label}</span>
                  {ts && <span className="text-[10px] text-ink-faint">{formatDateTime(ts).split(', ').pop()}</span>}
                </li>
              );
            })}
          </ol>
        )}

        <div className="no-print mt-5 grid grid-cols-2 gap-2">
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="btn-secondary h-11 py-0 text-[13px]">
            <Phone className="h-4 w-4" /> Call store
          </a>
          <Link href={`/help?order=${order.order_number}`} className="btn-secondary h-11 py-0 text-[13px]">
            <HelpCircle className="h-4 w-4" /> Get help
          </Link>
        </div>
      </section>

      {/* Items */}
      <section className="card px-4 py-4">
        <h2 className="mb-3 text-sm font-bold text-ink">
          {order.items?.length} item{(order.items?.length ?? 0) > 1 ? 's' : ''} in this order
        </h2>
        <ul className="space-y-3">
          {order.items?.map((i) => {
            const p = i.product_id ? getProductById(i.product_id) : undefined;
            return (
              <li key={i.id} className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-line bg-tile/60">
                  <ProductImage src={p?.image_url} alt={i.product_name} className="h-full w-full object-cover" fallbackClassName="text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[13px] leading-snug text-ink">{i.product_name}</p>
                  <p className="tabular text-xs text-ink-muted">
                    {i.quantity} × {formatINR(i.unit_price)}
                  </p>
                </div>
                <p className="tabular text-[13px] font-semibold text-ink">{formatINR(i.total_price)}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Bill */}
      <section className="card px-4 py-4">
        <h2 className="mb-3 text-sm font-bold text-ink">Bill summary</h2>
        <dl className="tabular space-y-2 text-[13px]">
          <div className="flex justify-between text-ink-soft">
            <dt>Items total</dt>
            <dd className="text-ink">{formatINR(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ink-soft">
            <dt>Delivery charge</dt>
            <dd className={order.delivery_charge === 0 ? 'font-semibold text-leaf-600' : 'text-ink'}>
              {order.delivery_charge === 0 ? 'FREE' : formatINR(order.delivery_charge)}
            </dd>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-leaf-700">
              <dt>Discount</dt>
              <dd>−{formatINR(order.discount_amount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-3 text-[15px] font-bold text-ink">
            <dt>{order.payment_status === 'paid' ? 'Paid' : 'To pay'}</dt>
            <dd>{formatINR(order.total_amount)}</dd>
          </div>
        </dl>
      </section>

      {/* Details */}
      <section className="card space-y-4 px-4 py-4 text-[13px]">
        <h2 className="text-sm font-bold text-ink">Order details</h2>
        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
          <div>
            <p className="font-semibold text-ink">{order.shipping_name} · {order.shipping_phone}</p>
            <p className="text-ink-muted">
              {order.shipping_address}, {order.shipping_city} {order.shipping_pincode}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
          <p className="text-ink-muted">
            {PAYMENT_METHOD_LABEL[order.payment_method] ?? order.payment_method} ·{' '}
            <span className="capitalize">{order.payment_status === 'pending' ? 'pay on delivery' : order.payment_status}</span>
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-y-1.5 border-t border-line pt-3 text-ink-muted">
          <dt>Order ID</dt>
          <dd className="tabular text-right font-medium text-ink">#{order.order_number}</dd>
          <dt>Placed on</dt>
          <dd className="text-right text-ink">{formatDateTime(order.created_at)}</dd>
          {order.delivery_slot && (
            <>
              <dt>Delivery slot</dt>
              <dd className="text-right text-ink">{order.delivery_slot}</dd>
            </>
          )}
        </dl>
      </section>

      <div className="no-print grid grid-cols-2 gap-2">
        {canCancel ? (
          <button onClick={() => setCancelOpen(true)} className="btn-secondary text-rose-600">
            Cancel order
          </button>
        ) : (
          <button onClick={() => window.print()} className="btn-secondary">
            <Printer className="h-4 w-4" /> Invoice
          </button>
        )}
        <button onClick={() => reorder(order)} className="btn-primary">
          <RotateCcw className="h-4 w-4" /> Order again
        </button>
      </div>

      <Sheet
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this order?"
        description="Tell us why — it helps the store improve."
        size="sm"
        footer={
          <div className="flex gap-2">
            <button onClick={() => setCancelOpen(false)} className="btn-secondary flex-1">
              Keep order
            </button>
            <button onClick={confirmCancel} className="btn flex-1 bg-rose-600 text-white hover:bg-rose-700">
              Cancel order
            </button>
          </div>
        }
      >
        <div className="space-y-2" role="radiogroup">
          {CANCEL_REASONS.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-3.5 py-3 text-sm has-[:checked]:border-leaf-500 has-[:checked]:bg-leaf-50/60">
              <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="accent-leaf-500" />
              {r}
            </label>
          ))}
        </div>
      </Sheet>
    </main>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader hideOnMobile />
      <PageHeader title="Order summary" backHref="/orders" />
      <RequireAuth>
        <OrderView id={id} />
      </RequireAuth>
    </div>
  );
}
