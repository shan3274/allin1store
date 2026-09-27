'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 3500);
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 md:px-0">
        {toasts.map((t) => {
          const bgColors = {
            success: 'bg-emerald-800 text-white border-emerald-600',
            error: 'bg-rose-700 text-white border-rose-500',
            warning: 'bg-amber-600 text-white border-amber-400',
            info: 'bg-slate-800 text-white border-slate-600',
          }[t.type];

          return (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-xl shadow-xl border p-3.5 flex items-start gap-3 transform transition-all duration-300 animate-slide-up ${bgColors}`}
            >
              <div className="flex-1">
                <p className="text-xs font-bold leading-snug">{t.title}</p>
                {t.message && (
                  <p className="text-[11px] opacity-90 mt-0.5 leading-tight">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="opacity-70 hover:opacity-100 text-xs font-bold ml-1 p-0.5"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
