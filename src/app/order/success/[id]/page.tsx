'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useStore } from '@/context/StoreContext';
import { CheckCircle2, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

interface OrderSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const resolvedParams = use(params);
  const { getOrderById, settings } = useStore();
  const order = getOrderById(resolvedParams.id);

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-xl mx-auto w-full px-4 py-12 flex-1 flex flex-col items-center justify-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-600/20 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Your groceries are being prepared at {settings.store_name}.
          </p>
          <div className="pt-2">
            <span className="font-mono font-black text-green-800 bg-green-100/80 px-3 py-1 rounded-xl text-xs border border-green-200">
              Order #{order ? order.order_number : resolvedParams.id}
            </span>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 w-full space-y-4">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <Clock className="w-6 h-6 text-emerald-700 flex-shrink-0" />
            <div>
              <p className="text-xs font-black text-emerald-950">Arriving in 25–35 minutes</p>
              <p className="text-[11px] text-emerald-800 font-medium">Instant local dispatch via Kirana rider</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <span>
                Delivering to: <strong className="text-slate-900">{order?.shipping_address || 'Registered Address'}</strong>
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-semibold">
              <span>Total Paid:</span>
              <span className="font-black text-slate-900 text-sm">₹{order?.total_amount || 0}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>Payment Mode:</span>
              <span className="uppercase text-green-700 font-bold">{order?.payment_method || 'COD'}</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href={`/orders/${resolvedParams.id}`}
            className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition text-center flex items-center justify-center gap-2"
          >
            <span>Live Order Tracking</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 transition text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
}
