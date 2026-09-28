'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { Truck, MapPin, Phone, CheckCircle2 } from 'lucide-react';

export default function AdminDeliveryPage() {
  const { orders, settings, updateOrderStatus } = useStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'dispatch' | 'delivered'>('all');

  const activeDeliveries = orders.filter(
    (o) => o.order_type === 'online_delivery' && (o.status === 'packed' || o.status === 'out_for_delivery')
  );

  const deliveredList = orders.filter(
    (o) => o.order_type === 'online_delivery' && o.status === 'delivered'
  );

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered', 'Rider marked doorstep delivery completed');
    showToast({
      type: 'success',
      title: 'Delivery Completed',
      message: 'Order marked as delivered and receipt archived.',
    });
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Truck className="w-6 h-6 text-blue-400" /> Delivery & Rider Dispatch Console
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Monitor 25-minute quick delivery runs, driver assignments, and doorstep fulfillment
            </p>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
            <span className="font-bold text-slate-300">
              Active Radius: <strong className="text-white">{settings.delivery_radius_km} km</strong>
            </span>
          </div>
        </div>

        {/* Deliveries Status Tabs */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Active Deliveries ({activeDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'delivered' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Delivered Today ({deliveredList.length})
          </button>
        </div>

        {/* Deliveries Grid */}
        <div className="space-y-3">
          {(activeTab === 'all' ? activeDeliveries : deliveredList).length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
              <Truck className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="font-bold text-white text-sm">No deliveries in this section</p>
              <p className="text-xs">Incoming online grocery orders will show delivery routing here.</p>
            </div>
          ) : (
            (activeTab === 'all' ? activeDeliveries : deliveredList).map((ord) => (
              <div
                key={ord.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xs text-white">#{ord.order_number}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        ord.status === 'out_for_delivery'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse'
                          : ord.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Payment: <strong className="text-white uppercase">{ord.payment_method}</strong> (₹{ord.total_amount})
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white">
                    Customer: {ord.shipping_name} ({ord.shipping_phone})
                  </p>
                  <p className="text-xs text-slate-400 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{ord.shipping_address}, {ord.shipping_city} - {ord.shipping_pincode}</span>
                  </p>
                  {ord.notes && (
                    <p className="text-[11px] text-amber-300">
                      <strong>Delivery Instructions:</strong> {ord.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {ord.shipping_phone && (
                    <a
                      href={`tel:${ord.shipping_phone}`}
                      className="p-2.5 bg-slate-800 hover:bg-slate-700 text-green-400 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Rider / Customer
                    </a>
                  )}

                  {ord.status === 'out_for_delivery' && (
                    <button
                      onClick={() => handleMarkDelivered(ord.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Delivery
                    </button>
                  )}

                  <Link
                    href={`/admin/orders/${ord.id}`}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
