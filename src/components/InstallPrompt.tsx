'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, MoreVertical, Share, SquarePlus, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { Sheet } from './ui/Sheet';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'kirana_install_dismissed_at';
const VISITS_KEY = 'kirana_visits';
const DISMISS_DAYS = 14;
const HIDDEN_ON = ['/admin', '/login', '/verify-otp', '/checkout', '/cart', '/order/success', '/product'];

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/** Registers the service worker and offers "install app" politely (returning visitors only). */
export function InstallPrompt() {
  const pathname = usePathname() || '/';
  const { totalItems } = useCart();
  const { settings } = useStore();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [eligible, setEligible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.error('SW registration failed', err));
    }
    if (isStandalone()) return;

    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    let visits = 0;
    let dismissedAt = 0;
    try {
      if (!sessionStorage.getItem('kirana_visit_counted')) {
        visits = Number(localStorage.getItem(VISITS_KEY) || 0) + 1;
        localStorage.setItem(VISITS_KEY, String(visits));
        sessionStorage.setItem('kirana_visit_counted', '1');
      } else {
        visits = Number(localStorage.getItem(VISITS_KEY) || 0);
      }
      dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    } catch {}
    const recentlyDismissed = Date.now() - dismissedAt < DISMISS_DAYS * 86400000;
    setEligible(visits >= 2 && !recentlyDismissed);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setEligible(false);
    };
    const onTrigger = () => setGuideOpen(true);

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('trigger-pwa-install', onTrigger);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('trigger-pwa-install', onTrigger);
    };
  }, []);

  const dismiss = () => {
    setEligible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  };

  const install = async () => {
    if (!deferred) {
      setGuideOpen(true);
      return;
    }
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    if (outcome === 'accepted') setEligible(false);
  };

  const hidden = HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const showBanner = eligible && !hidden && totalItems === 0 && (deferred || isIos);

  return (
    <>
      {showBanner && (
        <div className="fixed inset-x-3 bottom-[76px] z-30 animate-slide-up md:bottom-6 md:left-auto md:right-6 md:w-[360px]">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-pop">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192x192.png" alt="" className="h-11 w-11 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">Get the {settings.store_name} app</p>
              <p className="text-xs text-ink-muted">Faster reordering from your home screen</p>
            </div>
            <button onClick={install} className="btn-primary h-9 px-3.5 py-0 text-[13px]">
              Install
            </button>
            <button onClick={dismiss} className="-mr-1 p-1 text-ink-faint hover:text-ink" aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Sheet open={guideOpen} onClose={() => setGuideOpen(false)} title="Install the app" description="Add it to your home screen — no app store needed." size="sm">
        {deferred && (
          <button
            onClick={() => {
              setGuideOpen(false);
              install();
            }}
            className="btn-primary mb-5 w-full"
          >
            <Download className="h-4 w-4" /> Install now
          </button>
        )}
        <div className="space-y-5 text-sm text-ink-soft">
          <div>
            <p className="mb-2 font-semibold text-ink">{isIos ? 'On iPhone (Safari)' : 'On Android (Chrome)'}</p>
            {isIos ? (
              <ol className="space-y-2">
                <li className="flex items-center gap-2">
                  <Share className="h-4 w-4 shrink-0 text-offer" /> Tap the Share button in the toolbar
                </li>
                <li className="flex items-center gap-2">
                  <SquarePlus className="h-4 w-4 shrink-0 text-ink" /> Choose <b>Add to Home Screen</b>
                </li>
              </ol>
            ) : (
              <ol className="space-y-2">
                <li className="flex items-center gap-2">
                  <MoreVertical className="h-4 w-4 shrink-0 text-ink" /> Tap the ⋮ menu at the top right
                </li>
                <li className="flex items-center gap-2">
                  <Download className="h-4 w-4 shrink-0 text-leaf-600" /> Choose <b>Install app</b> or <b>Add to Home screen</b>
                </li>
              </ol>
            )}
          </div>
        </div>
      </Sheet>
    </>
  );
}
