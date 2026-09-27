'use client';

import React, { useState } from 'react';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { HelpCircle, Phone, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function AdminSupportPage() {
  const { supportTickets, updateTicketStatus } = useStore();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');

  const filtered = supportTickets.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const handleStatusChange = (id: string, status: 'open' | 'in_progress' | 'resolved') => {
    updateTicketStatus(id, status);
    showToast({
      type: 'success',
      title: 'Ticket Updated',
      message: `Ticket status set to ${status.replace('_', ' ')}`,
    });
  };

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-rose-400" /> Customer Support & Claims
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Handle missing grocery complaints, delayed deliveries, and refund requests directly
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'all' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Tickets ({supportTickets.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'open' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Open Issues
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filter === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-white">#{t.id}</span>
                  {t.orderNumber && (
                    <span className="text-xs text-slate-400">Order #{t.orderNumber}</span>
                  )}
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      t.status === 'open'
                        ? 'bg-rose-500/20 text-rose-300'
                        : t.status === 'in_progress'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${t.customerPhone}`}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-green-400 text-xs font-bold rounded-xl flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Customer
                  </a>
                </div>
              </div>

              <div>
                <p className="font-bold text-white text-xs sm:text-sm">{t.issueType}</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t.description}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Reported by: <strong>{t.customerName}</strong> ({t.customerPhone}) • {t.createdAt}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Update Resolution:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(t.id, 'in_progress')}
                    className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(t.id, 'resolved')}
                    className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold rounded-lg"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
