'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Phone,
  Package,
  Bike
} from 'lucide-react';

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const resolvedParams = use(params);
  const { getOrderById, cancelOrder, settings, getProductById } = useStore();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Placed by mistake');

  const order = getOrderById(resolvedParams.id);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="max-w-lg mx-auto w-full px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-2xl">
            📦
          </div>
          <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
          <p className="text-xs text-slate-500">We could not retrieve order #{resolvedParams.id}.</p>
          <Link
            href="/orders"
            className="inline-block px-5 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Go to My Orders
          </Link>
        </main>
      </div>
    );
  }

  const handleReorder = () => {
    if (!order.items?.length) return;
    let addedCount = 0;
    order.items.forEach((item) => {
      if (item.product_id) {
        const prod = getProductById(item.product_id);
        if (prod && prod.stock_quantity > 0) {
          addToCart(prod, item.quantity);
          addedCount++;
        }
      }
    });

    if (addedCount > 0) {
      showToast({
        type: 'success',
        title: 'Reordered!',
        message: `${addedCount} items added back to your cart.`,
      });
    }
  };

  const handleConfirmCancel = () => {
    cancelOrder(order.id, cancelReason);
    setShowCancelModal(false);
    showToast({
      type: 'info',
      title: 'Order Cancelled',
      message: 'Your order was successfully cancelled.',
    });
  };

  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-3xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <Link href="/orders" className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Orders
          </Link>
          <span className="font-mono text-xs font-extrabold bg-slate-200/80 px-2.5 py-1 rounded-lg text-slate-800">
            Order #{order.order_number}
          </span>
        </div>

        {/* Status Highlight Banner */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Current Status
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 capitalize mt-0.5">
                {order.status === 'delivered'
                  ? 'Delivered at Doorstep'
                  : order.status === 'out_for_delivery'
                  ? 'Rider is Out for Delivery 🛵'
                  : order.status === 'packed'
                  ? 'Order Packed & Ready'
                  : order.status === 'confirmed'
                  ? 'Order Confirmed by Store'
                  : order.status === 'cancelled'
                  ? 'Order Cancelled'
                  : 'Order Placed & Awaiting Store'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${settings.phone}`}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5 text-green-600" /> Call Store
              </a>
              <Link
                href="/help"
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-600" /> Help
              </Link>
            </div>
          </div>

          {/* Real-time Order Progress Timeline */}
          {order.status !== 'cancelled' ? (
            <div className="py-2 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Live Timeline
              </h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {order.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step.completed
                          ? 'bg-green-600 text-white ring-4 ring-green-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          step.completed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-slate-500">{step.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
              <p className="font-bold">This order was cancelled.</p>
              <p className="text-rose-600">Reason: {order.cancelled_reason || 'Cancelled by customer'}</p>
            </div>
          )}
        </div>

        {/* Order Details & Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Items Ordered</h3>

          <div className="divide-y divide-slate-100 text-xs">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{item.product_name}</p>
                  <p className="text-slate-500 font-medium">Quantity: {item.quantity}</p>
                </div>
                <span className="font-bold text-slate-900">₹{item.total_price}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600 font-semibold">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span>-₹{order.discount_amount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-100">
              <span>Total Paid:</span>
              <span className="text-green-700 text-base">₹{order.total_amount}</span>
            </div>
          </div>

          {/* Delivery destination */}
          <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-slate-900">{order.shipping_name} ({order.shipping_phone})</p>
              <p className="text-slate-500 mt-0.5">{order.shipping_address}, {order.shipping_city}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReorder}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reorder Basket
            </button>

            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Cancel Order?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel order #{order.order_number}?
              </p>

              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Placed by mistake">Placed by mistake</option>
                <option value="Want to change address">Want to change address</option>
                <option value="Taking too long">Taking too long</option>
                <option value="Need to add more products">Need to add more products</option>
              </select>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Yes, Cancel Order
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Keep Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
