'use client';

import React, { useState } from 'react';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { Product } from '@/types/database';
import {
  Calculator,
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CheckCircle2,
  Printer,
  Sparkles,
  Barcode
} from 'lucide-react';

interface POSItem {
  product: Product;
  quantity: number;
}

export default function CounterPOSPage() {
  const { products, updateStock, createOrder } = useStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<POSItem[]>([]);
  const [lastReceipt, setLastReceipt] = useState<{
    id: string;
    number: number;
    total: number;
    items: POSItem[];
  } | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search)) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const addToCart = (product: Product) => {
    if (product.stock_quantity <= 0) {
      showToast({
        type: 'error',
        title: 'Zero Stock',
        message: `${product.name} is out of stock on counter.`,
      });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          showToast({
            type: 'warning',
            title: 'Max Stock Limit',
            message: `Only ${product.stock_quantity} available.`,
          });
          return prev;
        }
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const totalAmount = cart.reduce(
    (sum, i) => sum + Number(i.product.selling_price) * i.quantity,
    0
  );

  const handleCheckoutBill = () => {
    if (cart.length === 0) return;

    const orderPayload = cart.map((i) => ({
      id: `oi-pos-${Date.now()}-${Math.random()}`,
      order_id: '',
      product_id: i.product.id,
      product_name: i.product.name,
      quantity: i.quantity,
      unit_price: Number(i.product.selling_price),
      total_price: Number(i.product.selling_price) * i.quantity,
      created_at: new Date().toISOString(),
    }));

    const newOrder = createOrder({
      order_type: 'pos_counter',
      status: 'delivered',
      subtotal: totalAmount,
      delivery_charge: 0,
      discount_amount: 0,
      total_amount: totalAmount,
      payment_method: 'cash_pos',
      payment_status: 'paid',
      shipping_name: 'Counter Walk-in Customer',
      shipping_phone: 'Walk-in',
      shipping_address: 'Direct Counter Sale',
      items: orderPayload,
    });

    setLastReceipt({
      id: newOrder.id,
      number: newOrder.order_number,
      total: totalAmount,
      items: [...cart],
    });

    setCart([]);
    showToast({
      type: 'success',
      title: 'Counter Sale Billed!',
      message: `Bill #${newOrder.order_number} recorded & stock deducted.`,
    });
  };

  return (
    <AdminLayoutWrapper>
      <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-7xl mx-auto w-full">
        {/* Left Column: Product Selection & Barcode Search */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 flex items-center gap-2.5">
            <Barcode className="w-5 h-5 text-green-400" />
            <input
              type="text"
              autoFocus
              placeholder="Scan Barcode (e.g. 890103000001) or search product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs font-semibold bg-transparent text-white outline-none placeholder-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-xs text-slate-400 hover:text-white font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick-Click Grid */}
          <div className="bg-slate-800/80 p-4 rounded-3xl border border-slate-700/80 flex-1 overflow-y-auto max-h-[640px] space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
              Direct Click Item ({filteredProducts.length})
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock_quantity <= 0;

                return (
                  <button
                    key={p.id}
                    disabled={isOutOfStock}
                    onClick={() => addToCart(p)}
                    className={`p-3 text-left rounded-2xl border transition flex flex-col justify-between h-28 group ${
                      isOutOfStock
                        ? 'border-slate-800 bg-slate-900/40 opacity-40 cursor-not-allowed'
                        : 'border-slate-700/70 bg-slate-900/60 hover:bg-slate-900 hover:border-green-500'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs text-white line-clamp-2 leading-snug group-hover:text-green-400 transition-colors">
                        {p.name}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {p.barcode || p.weight_volume}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-1.5 mt-1">
                      <span className="font-black text-green-400 text-xs">₹{p.selling_price}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          p.stock_quantity <= p.min_stock_alert
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        Qty: {p.stock_quantity}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Instant Counter Bill Slip */}
        <div className="lg:col-span-5 bg-slate-800/80 rounded-3xl border border-slate-700/80 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-green-400" />
                <h3 className="font-black text-white text-sm">Counter Cash Bill</h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-rose-400 hover:underline font-bold"
                >
                  Clear Bill
                </button>
              )}
            </div>

            {/* Last bill banner */}
            {lastReceipt && (
              <div className="mb-3 p-3 bg-emerald-950/60 border border-emerald-600/40 rounded-2xl text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bill #{lastReceipt.number} (₹{lastReceipt.total}) Paid</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="text-xs font-bold text-white underline flex items-center gap-1"
                >
                  <Printer className="w-3 h-3" /> Print
                </button>
              </div>
            )}

            {/* Bill Line Items */}
            {cart.length === 0 ? (
              <div className="py-20 text-center text-slate-500 space-y-2">
                <Calculator className="w-12 h-12 mx-auto text-slate-600" />
                <p className="font-bold text-sm text-slate-300">No items on counter slip</p>
                <p className="text-xs">Scan barcode or tap items to build customer slip</p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-2.5 bg-slate-900/80 border border-slate-700/60 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold text-white truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">
                        ₹{item.product.selling_price} × {item.quantity} ={' '}
                        <strong className="text-white">
                          ₹{Number(item.product.selling_price) * item.quantity}
                        </strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-700 rounded text-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-black text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-700 rounded text-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => updateQuantity(item.product.id, 0)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout & Cash CTA */}
          <div className="pt-3 border-t border-slate-700 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-400">
              <span>Total Items:</span>
              <span className="text-white font-bold">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-black text-white">
              <span>Grand Total:</span>
              <span className="text-green-400 text-2xl font-black">₹{totalAmount}</span>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handleCheckoutBill}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-40 text-white font-black rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm active:scale-98"
            >
              <Receipt className="w-4 h-4" /> Collect Cash & Generate Receipt (₹{totalAmount})
            </button>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
