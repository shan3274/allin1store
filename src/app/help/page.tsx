'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { HelpCircle, Phone, Mail, ArrowLeft, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function HelpSupportPage() {
  const { settings, orders } = useStore();
  const { showToast } = useToast();

  const [issueType, setIssueType] = useState('Order delayed');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitted(true);
    showToast({
      type: 'success',
      title: 'Ticket Submitted',
      message: 'Store manager will assist you shortly.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <Link href="/profile" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
          </Link>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-green-600" /> Help & Customer Support
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Contact your local store or report an issue with an active grocery delivery
          </p>
        </div>

        {/* Store Direct Contact Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Direct Store Contact</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a
              href={`tel:${settings.phone}`}
              className="p-3.5 bg-green-50 hover:bg-green-100 rounded-2xl border border-green-200 flex items-center gap-3 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-green-600 text-white flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Call Store Counter</span>
                <span className="text-slate-500">{settings.phone}</span>
              </div>
            </a>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Email Support</span>
                <span className="text-slate-500">{settings.email || 'care@apnakirana.in'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Issue Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Report an Issue with an Order</h3>

          {submitted ? (
            <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-black text-emerald-950 text-sm">Support Request Received</h4>
              <p className="text-xs text-emerald-800">
                Our kirana store supervisor is reviewing your issue and will call your registered phone number.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Select Order (Optional)</label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">General Inquiry / Feedback</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      Order #{o.order_number} (₹{o.total_amount})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Issue Category</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Order delayed">Order delayed beyond 35 mins</option>
                  <option value="Missing item in package">Missing item in grocery bag</option>
                  <option value="Wrong product delivered">Wrong product delivered</option>
                  <option value="Packaging damaged">Item or seal damaged</option>
                  <option value="Payment or refund inquiry">Payment / refund inquiry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Explain Issue</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what went wrong with your grocery delivery..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition"
              >
                Submit Support Request
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
