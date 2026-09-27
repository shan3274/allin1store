'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { OrderStatus } from '@/types/database';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  RotateCcw,
  Printer,
  ShieldCheck
} from 'lucide-react';

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const resolvedParams = use(params);
  const { getOrderById, updateOrderStatus, cancelOrder } = useStore();
  const { showToast } = useToast();

  const [notes, setNotes] = useState('');
  const [cancelModal, setCancelModal] = useState(false);
  const [reason, setReason] = useState('Out of stock items');

  const order = getOrderById(resolvedParams.id);

  if (!order) {
    return (
      <AdminLayoutWrapper>
        <div className="p-8 text-center text-slate-400 space-y-3">
          <p className="font-bold">Order not found.</p>
          <Link href="/admin/orders" className="text-xs text-green-400 hover:underline">
            Back to Orders List
          </Link>
        </div>
      </AdminLayoutWrapper>
    );
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus, notes);
    setNotes('');
    showToast({
      type: 'success',
      title: 'Order Updated',
      message: `Status marked as ${newStatus.replace(/_/g, ' ')}`,
    });
  };

  const handleCancelOrder = () => {
    cancelOrder(order.id, reason);
    setCancelModal(false);
    showToast({
      type: 'info',
      title: 'Order Cancelled',
      message: `Order #${order.order_number} cancelled.`,
    });
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print Invoice
            </button>
          </div>
        </div>

        {/* Order Header */}
        <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Order #{order.order_number}
                </h1>
                <span className="text-xs uppercase font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {order.order_type.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['confirmed', 'packed', 'out_for_delivery', 'delivered'] as OrderStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs capitalize transition ${
                      order.status === status
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    Mark {status.replace(/_/g, ' ')}
                  </button>
                )
              )}
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <button
                  onClick={() => setCancelModal(true)}
                  className="px-3 py-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl font-bold text-xs transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60 space-y-1">
              <span className="text-slate-400 uppercase font-black tracking-wider text-[10px] block">
                Customer & Contact
              </span>
              <p className="font-bold text-white text-sm">{order.shipping_name}</p>
              <p className="text-slate-300 font-mono">{order.shipping_phone}</p>
              {order.shipping_phone && (
                <a
                  href={`tel:${order.shipping_phone}`}
                  className="inline-flex items-center gap-1 text-green-400 font-bold hover:underline pt-1"
                >
                  <Phone className="w-3 h-3" /> Call Customer
                </a>
              )}
            </div>

            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60 space-y-1">
              <span className="text-slate-400 uppercase font-black tracking-wider text-[10px] block">
                Delivery Address
              </span>
              <p className="text-slate-200 leading-relaxed font-medium">
                {order.shipping_address}, {order.shipping_city} - {order.shipping_pincode}
              </p>
              {order.notes && (
                <p className="text-amber-300 pt-1">
                  <strong>Notes:</strong> {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Items & Bill */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Ordered Items ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-slate-700/50 text-xs">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-slate-300">
                  <div>
                    <p className="font-bold text-white">{item.product_name}</p>
                    <p className="text-[11px] text-slate-400">
                      ₹{item.unit_price} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-black text-white text-sm">₹{item.total_price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 pt-3 space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">₹{order.subtotal}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{order.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>₹{order.delivery_charge}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-700">
                <span>Total Amount:</span>
                <span className="text-green-400">₹{order.total_amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Modal */}
        {cancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="bg-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-700">
              <h3 className="text-base font-black text-white">Cancel Order #{order.order_number}?</h3>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
              >
                <option value="Out of stock items">Out of stock items</option>
                <option value="Customer requested cancellation">Customer requested cancellation</option>
                <option value="Address not reachable">Address not reachable</option>
                <option value="Payment issue">Payment issue</option>
              </select>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
                >
                  Confirm Cancel
                </button>
                <button
                  onClick={() => setCancelModal(false)}
                  className="flex-1 py-2.5 bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
