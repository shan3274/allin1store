'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { PAYMENT_METHOD_LABEL, formatINR } from '@/lib/format';

export default function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getOrderById, settings } = useStore();
  const { user } = useAuth();
  const order = getOrderById(id);
  const mine = order && order.user_id === user?.id;
  const eta = settings.delivery_eta_minutes || 30;

  return (
    <div className="flex min-h-screen flex-col bg-leaf-700 text-canvas">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="flex h-24 w-24 animate-pop items-center justify-center rounded-full bg-white text-leaf-700 shadow-pop">
          <Check className="h-12 w-12" strokeWidth={3} />
        </span>
        <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">Thank you!</h1>
        <p className="mt-1 text-lg">Your order is placed.</p>
        {mine ? (
          <>
            <p className="mt-2 text-white/85">
              {order.delivery_slot ? `Arriving ${order.delivery_slot}` : `Arriving in about ${eta} minutes`}
            </p>
            <div className="mt-8 w-full rounded-2xl bg-white/10 px-5 py-4 text-left text-sm backdrop-blur">
              <div className="flex justify-between">
                <span className="text-white/75">Order ID</span>
                <span className="tabular font-semibold">#{order.order_number}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-white/75">Amount</span>
                <span className="tabular font-semibold">{formatINR(order.total_amount)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-white/75">Payment</span>
                <span className="font-semibold">{PAYMENT_METHOD_LABEL[order.payment_method]}</span>
              </div>
              <div className="mt-2 flex justify-between gap-4">
                <span className="shrink-0 text-white/75">Deliver to</span>
                <span className="truncate font-semibold">{order.shipping_address}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-2 text-white/85">You can track it from your orders.</p>
        )}
      </main>
      <div className="pb-safe mx-auto w-full max-w-md space-y-2 px-6 pb-8">
        <Link href={mine ? `/orders/${order.id}` : '/orders'} className="btn h-14 w-full bg-white text-base text-leaf-700 hover:bg-white/90">
          Track your order
        </Link>
        <Link href="/" className="btn h-12 w-full text-white/90 hover:bg-white/10">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
