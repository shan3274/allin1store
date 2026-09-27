'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ClipboardList, ArrowRight, RotateCcw, Clock, MapPin, ChevronRight } from 'lucide-react';

export default function OrdersHistoryPage() {
  const { orders, getProductById } = useStore();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleReorder = (order: typeof orders[0]) => {
    let count = 0;
    order.items?.forEach((item) => {
      if (item.product_id) {
        const prod = getProductById(item.product_id);
        if (prod && prod.stock_quantity > 0) {
          addToCart(prod, item.quantity);
          count++;
        }
      }
    });

    if (count > 0) {
      showToast({
        type: 'success',
        title: 'Reordered!',
        message: `${count} items added to basket.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-green-600" /> My Orders & Reorder
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Track active kirana dispatches or re-purchase past household staples
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3 shadow-2xs">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-2xl">
              📦
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No previous orders</h3>
            <p className="text-xs text-slate-500">
              When you order grocery essentials from your local store, your history appears here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => {
              const statusStyles: Record<string, string> = {
                delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
                returned: 'bg-rose-100 text-rose-800 border-rose-200',
                out_for_delivery: 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse',
                packed: 'bg-amber-100 text-amber-800 border-amber-200',
                confirmed: 'bg-slate-100 text-slate-800 border-slate-200',
                pending: 'bg-amber-50 text-amber-800 border-amber-200',
              };

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 space-y-4 hover:border-green-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                        #{ord.order_number}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(ord.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusStyles[ord.status] || 'bg-slate-100 text-slate-800'}`}
                      >
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-black text-slate-900">₹{ord.total_amount}</span>
                    </div>
                  </div>

                  {/* Items snapshot */}
                  <div className="text-xs space-y-1">
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700">
                        <span className="font-medium">
                          {item.quantity} × {item.product_name}
                        </span>
                        <span className="font-bold">₹{item.total_price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link
                      href={`/orders/${ord.id}`}
                      className="text-xs font-bold text-slate-700 hover:text-green-700 flex items-center gap-1"
                    >
                      <span>Track Order</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleReorder(ord)}
                      className="px-4 py-2 bg-green-50 hover:bg-green-600 text-green-700 hover:text-white border border-green-300 hover:border-green-600 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reorder All Items
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
