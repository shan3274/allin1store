'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Check, Sparkles, Share2, MoreVertical, ShieldCheck, Zap } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker for PWA
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.error('[PWA] Service Worker registration failed:', err);
        });
    }

    // 2. Check if already installed & running in standalone mode
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');

      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Check device OS
      const ua = navigator.userAgent || '';
      const android = /android/i.test(ua);
      const ios = /iphone|ipad|ipod/i.test(ua);
      setIsAndroid(android);
      setIsIos(ios);

      // Check sessionStorage dismissal
      const dismissed = sessionStorage.getItem('pwa_banner_dismissed') === 'true';
      if (dismissed) {
        setIsDismissed(true);
      }
    }

    // 3. Listen for Chrome / Android beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      console.log('[PWA] beforeinstallprompt event captured');
      setDeferredPrompt(e);
      // Make sure banner is shown if event is available
      setIsDismissed(false);
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App successfully installed!');
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsDismissed(true);
    };

    const handleCustomTrigger = () => {
      setIsDismissed(false);
      setShowGuideModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('trigger-pwa-install', handleCustomTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('trigger-pwa-install', handleCustomTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        setIsInstalling(true);
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log('[PWA] User choice:', choice.outcome);
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setIsDismissed(true);
        }
      } catch (err) {
        console.error('[PWA] Error during prompt():', err);
        setShowGuideModal(true);
      } finally {
        setIsInstalling(false);
        setDeferredPrompt(null);
      }
    } else {
      // If browser hasn't fired beforeinstallprompt or is on iOS/unsupported, show step-by-step guide
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa_banner_dismissed', 'true');
    }
  };

  // If already installed, don't show prompt
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Install Banner for Mobile / Android */}
      {!isDismissed && (
        <div className="fixed bottom-16 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-emerald-500/40 relative overflow-hidden backdrop-blur-md">
            {/* Subtle glow background */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3 relative z-10">
              {/* App Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-700 to-emerald-500 flex items-center justify-center p-2 shadow-lg shadow-emerald-900/50 flex-shrink-0 border border-emerald-400/30">
                <Smartphone className="w-6 h-6 text-white" />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black tracking-tight text-white">
                    Apna Kirana App
                  </span>
                  <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 fill-current" /> Fast App
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-snug mt-0.5">
                  Phone mein install karein — 25 min grocery delivery aur ₹50 off payein!
                </p>

                {/* Badges */}
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-emerald-400 font-bold">
                  <span className="flex items-center gap-0.5">
                    <Check className="w-3 h-3 text-emerald-400" /> Sirf 2 MB
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <Check className="w-3 h-3 text-emerald-400" /> No Play Store needed
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Install Action Button */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-[0.98] text-slate-950 font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-950 animate-bounce" />
                <span>{isInstalling ? 'Installing...' : 'Install App (Download)'}</span>
              </button>

              <button
                onClick={() => setShowGuideModal(true)}
                className="px-3 py-2.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition cursor-pointer"
              >
                Kaise Karein?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Step-by-Step Installation Modal Guide */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Apna Kirana App Install Karein
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Apne phone par app jaise chalayein
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If direct trigger is available, give direct 1-tap option */}
            {deferredPrompt && (
              <div className="my-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <p className="text-xs font-bold text-emerald-900 mb-2">
                  Aapke browser mein 1-Tap download support available hai:
                </p>
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  Direct Install Prompt Open Karein
                </button>
              </div>
            )}

            {/* Android Chrome Instructions */}
            <div className="space-y-4 my-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2 text-xs font-extrabold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Android (Chrome / Brave / Samsung)</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 pl-7">
                  <div className="flex items-center gap-2">
                    <MoreVertical className="w-4 h-4 text-slate-700 flex-shrink-0" />
                    <span>Upar daayein (top right) corner mein <b>3 dots (⋮)</b> par click karein.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Menu mein <b>"Install app"</b> ya <b>"Add to Home screen"</b> chunein.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span><b>"Install"</b> par confirm karein — App phone ke home screen par aa jayegi!</span>
                  </div>
                </div>
              </div>

              {/* iPhone Safari Instructions */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2 text-xs font-extrabold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>iPhone (Safari Browser)</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 pl-7">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Neeche <b>Share button</b> (arrow wala square) tap karein.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-700 flex-shrink-0" />
                    <span>Scroll karke <b>"Add to Home Screen"</b> par tap karein.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Upar <b>"Add"</b> dabaayein — Instant install ho jayegi!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition text-center"
              >
                Theek Hai, Samajh Gaya (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
