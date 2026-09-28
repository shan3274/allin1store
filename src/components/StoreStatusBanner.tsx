'use client';

import React, { useEffect, useState } from 'react';
import { Moon, WifiOff } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { getStoreStatus } from '@/lib/storeHours';

/** Slim banners for "store closed" and "you're offline". */
export function StoreStatusBanner() {
  const { settings, isHydrated } = useStore();
  const [online, setOnline] = useState(true);
  const [status, setStatus] = useState({ isOpen: true, message: '' });

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const tick = () => setStatus(getStoreStatus(settings));
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, [settings, isHydrated]);

  if (!online) {
    return (
      <div className="flex items-center justify-center gap-2 bg-ink px-4 py-2 text-xs font-medium text-white">
        <WifiOff className="h-3.5 w-3.5" /> You&apos;re offline. Some items may be out of date.
      </div>
    );
  }
  if (!status.isOpen) {
    return (
      <div className="flex items-center justify-center gap-2 bg-sun-50 px-4 py-2 text-center text-xs font-medium text-ink-soft">
        <Moon className="h-3.5 w-3.5 shrink-0 text-sun-500" />
        <span>{status.message} You can still browse and fill your basket.</span>
      </div>
    );
  }
  return null;
}
