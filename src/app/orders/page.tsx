'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { RequireAuth } from '@/components/ui/RequireAuth';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductImage } from '@/components/ui/ProductImage';
import { OrderStatusIcon } from '@/components/OrderStatusIcon';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { useReorder } from '@/lib/useReorder';
import { ORDER_STATUS_LABEL, formatINR, formatRelative } from '@/lib/format';

function OrdersList() {
  const { orders, getProductById } = useStore();
  const { user } = useAuth();
  const reorder = useReorder();
  const mine = orders.filter((o) => o.user_id === user?.id).sort((a, b) => b.created_at.localeCompare(a.created_at));

  if (mine.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-9 w-9" />}
        title="No orders yet"
        description="Your orders will show up here so you can track them and order again in one tap."
        action={{ label: 'Start shopping', href: '/' }}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {mine.map((o) => {
        const active = !['delivered', 'cancelled', 'returned'].includes(o.status);
        return (
          <li key={o.id} className="card overflow-hidden">
            <Link href={`/orders/${o.id}`} className="flex items-center gap-3 px-4 pb-3 pt-4">
              <OrderStatusIcon status={o.status} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-ink">
                  {o.status === 'delivered' ? 'Delivered' : ORDER_STATUS_LABEL[o.status]}
                  {active && <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-leaf-500 align-middle" />}
                </p>
                <p className="tabular text-xs text-ink-muted">
                  {formatINR(o.total_amount)} · {formatRelative(o.created_at)}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-ink-faint" />
            </Link>
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4">
              {o.items?.map((i) => {
                const p = i.product_id ? getProductById(i.product_id) : undefined;
                return (
                  <div key={i.id} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-tile/60">
                    <ProductImage src={p?.image_url} alt={i.product_name} className="h-full w-full object-cover" fallbackClassName="text-sm" />
                    {i.quantity > 1 && (
                      <span className="absolute bottom-0.5 right-0.5 rounded bg-ink/80 px-1 text-[10px] font-bold text-white">×{i.quantity}</span>
                    )}
                  </div>
                );
              })}
            </div>
            {!active && (
              <div className="border-t border-line px-4 py-2.5">
                <button onClick={() => reorder(o)} className="text-sm font-semibold text-leaf-600">
                  Order again
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader hideOnMobile />
      <PageHeader title="Your orders" backHref="/profile" />
      <main className="mx-auto w-full max-w-2xl flex-1 px-3 pb-28 pt-3 md:px-6 md:pt-2">
        <RequireAuth>
          <OrdersList />
        </RequireAuth>
      </main>
    </div>
  );
}
