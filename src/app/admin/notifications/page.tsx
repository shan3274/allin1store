'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { Bell, CheckCircle2, AlertTriangle, HelpCircle, Package, ArrowRight } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-4xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Bell className="w-6 h-6 text-yellow-400" /> Notifications & Operational Alerts
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Real-time push events for new customer orders, low stock warnings, and payment receipts
            </p>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition"
          >
            Mark All as Read
          </button>
        </div>

        {/* Notifications Stream */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="font-bold text-white text-sm">No new notifications</p>
              <p className="text-xs">Your store feed is completely up to date.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const iconMap = {
                order: <Package className="w-5 h-5 text-emerald-400" />,
                stock: <AlertTriangle className="w-5 h-5 text-amber-400" />,
                support: <HelpCircle className="w-5 h-5 text-blue-400" />,
                payment: <CheckCircle2 className="w-5 h-5 text-green-400" />,
                system: <Bell className="w-5 h-5 text-purple-400" />,
              }[notif.type] || <Bell className="w-5 h-5 text-slate-400" />;

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-4 rounded-3xl border transition flex items-start justify-between gap-3 ${
                    notif.read
                      ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                      : 'bg-slate-900 border-green-500/50 text-white ring-1 ring-green-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-2xl bg-slate-800 shrink-0 mt-0.5">
                      {iconMap}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm">{notif.title}</h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                      <span className="text-[10px] text-slate-500 block mt-1">{notif.timestamp}</span>
                    </div>
                  </div>

                  {notif.link && (
                    <Link
                      href={notif.link}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl shrink-0 flex items-center gap-1"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
