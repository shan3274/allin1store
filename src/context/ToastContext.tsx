'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

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

const ICONS = {
  success: <CheckCircle2 className="h-4 w-4 shrink-0 text-leaf-200" />,
  error: <AlertCircle className="h-4 w-4 shrink-0 text-rose-300" />,
  warning: <AlertTriangle className="h-4 w-4 shrink-0 text-sun-400" />,
  info: <Info className="h-4 w-4 shrink-0 text-sky-300" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const pathname = usePathname();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.delete(id);
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => {
        // Same message twice in a row just refreshes.
        const deduped = prev.filter((t) => t.title !== toast.title);
        return [...deduped, { ...toast, id }].slice(-3);
      });
      timers.current.set(
        id,
        setTimeout(() => removeToast(id), toast.duration || (toast.type === 'error' ? 5000 : 3000))
      );
    },
    [removeToast]
  );

  // Sit above the mobile cart bar / bottom nav on storefront pages.
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 z-[70] flex flex-col items-center gap-2 px-4 ${
          isAdmin ? 'bottom-20 md:bottom-6' : 'bottom-36 md:bottom-8'
        }`}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex w-full max-w-sm animate-slide-up items-start gap-2.5 rounded-xl bg-ink px-3.5 py-3 text-white shadow-pop"
          >
            <span className="mt-0.5">{ICONS[t.type]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-snug">{t.title}</p>
              {t.message && <p className="mt-0.5 text-xs leading-snug text-white/70">{t.message}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="-mr-1 rounded p-0.5 text-white/50 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
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
