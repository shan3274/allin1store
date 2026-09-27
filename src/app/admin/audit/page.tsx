'use client';

import React from 'react';
import { AdminLayoutWrapper } from '@/components/AdminLayoutWrapper';
import { useStore } from '@/context/StoreContext';
import { History, ShieldCheck, Clock, UserCheck } from 'lucide-react';

export default function AdminAuditPage() {
  const { auditLogs } = useStore();

  return (
    <AdminLayoutWrapper>
      <div className="p-4 sm:p-8 space-y-6 max-w-5xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <History className="w-6 h-6 text-teal-400" /> Operational Audit Trail & Logs
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Tamper-evident log of all stock adjustments, price changes, orders status modifications, and store settings
            </p>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="p-3.5">Actor</th>
                  <th className="p-3.5">Action Event</th>
                  <th className="p-3.5">Entity / Item</th>
                  <th className="p-3.5">Change (Old → New)</th>
                  <th className="p-3.5">Reason / Details</th>
                  <th className="p-3.5 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-bold text-white flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-green-400" />
                      <span>{log.actor}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800 text-[11px]">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-white">{log.entity}</td>

                    <td className="p-3.5 font-mono text-[11px]">
                      {log.oldValue && log.newValue ? (
                        <span>
                          <span className="text-rose-400">{log.oldValue}</span> →{' '}
                          <span className="text-green-400">{log.newValue}</span>
                        </span>
                      ) : log.newValue ? (
                        <span className="text-green-400">{log.newValue}</span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="p-3.5 text-slate-400 text-xs">{log.reason || 'Standard operational task'}</td>

                    <td className="p-3.5 text-right text-slate-400 text-xs font-mono">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
