import React from 'react';
import { Bike, CheckCircle2, ClipboardCheck, Clock3, PackageCheck, XCircle } from 'lucide-react';
import type { OrderStatus } from '@/types/database';

const MAP: Record<OrderStatus, { icon: typeof Bike; tone: string }> = {
  pending: { icon: Clock3, tone: 'bg-sun-50 text-sun-500' },
  confirmed: { icon: ClipboardCheck, tone: 'bg-offer-soft text-offer' },
  packed: { icon: PackageCheck, tone: 'bg-offer-soft text-offer' },
  out_for_delivery: { icon: Bike, tone: 'bg-leaf-50 text-leaf-600' },
  delivered: { icon: CheckCircle2, tone: 'bg-leaf-50 text-leaf-600' },
  cancelled: { icon: XCircle, tone: 'bg-rose-50 text-rose-500' },
  returned: { icon: XCircle, tone: 'bg-rose-50 text-rose-500' },
};

export function OrderStatusIcon({ status, size = 'md' }: { status: OrderStatus; size?: 'md' | 'lg' }) {
  const { icon: Icon, tone } = MAP[status] ?? MAP.pending;
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full ${tone} ${size === 'lg' ? 'h-14 w-14' : 'h-10 w-10'}`}>
      <Icon className={size === 'lg' ? 'h-7 w-7' : 'h-5 w-5'} />
    </span>
  );
}
