'use client';

import React, { useState } from 'react';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminCouponsPage() {
  const { coupons, addCoupon, deleteCoupon } = useStore();
  const { showToast } = useToast();

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>('flat');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrder, setMinOrder] = useState('299');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    addCoupon({
      id: `c-${Date.now()}`,
      code: code.trim().toUpperCase(),
      description: description || `Save ₹${discountValue} on your grocery basket`,
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrder) || 199,
      expiresAt: '2026-12-31',
      isActive: true,
    });

    setShowAddModal(false);
    setCode('');
    setDescription('');
    setDiscountValue('');

    showToast({
      type: 'success',
      title: 'Coupon Created',
      message: `Coupon ${code.toUpperCase()} is now live.`,
    });
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Tag className="w-6 h-6 text-green-400" /> Store Coupons & Customer Offers
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Create discount coupons, free-delivery codes and first-order promotions
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Coupon Code
          </button>
        </div>

        {/* Coupons List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700/80 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black tracking-wider text-green-400 bg-green-950 px-2.5 py-1 rounded-xl border border-green-800">
                    {c.code}
                  </span>
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-white text-sm mt-3">{c.description}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Discount:{' '}
                  <strong className="text-green-400">
                    {c.discountType === 'flat' ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
                  </strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Min order required: ₹{c.minOrderValue}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active for checkout
                </span>
                <span className="text-slate-500">Valid until {c.expiresAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Create Coupon Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-700">
              <h3 className="text-base font-black text-white">Create New Coupon</h3>

              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white uppercase font-mono font-bold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Discount Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹50 off on minimum purchase of ₹399"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'flat')}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                    >
                      <option value="flat">Flat Rupee (₹)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Discount Value</label>
                    <input
                      type="number"
                      required
                      placeholder="50"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Minimum Order Value (₹)</label>
                  <input
                    type="number"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl"
                  >
                    Save Coupon
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-slate-700 text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
