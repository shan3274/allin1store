import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { BottomNav } from "@/components/BottomNav";
import { PwaInstallBanner } from "@/components/PwaInstallBanner";

export const metadata: Metadata = {
  title: "Apna Kirana Store | Fast Local Grocery Delivery",
  description: "Order fresh chakki atta, dal, desi ghee, edible oil, biscuits & daily essentials in 25-35 minutes from your trusted neighbourhood kirana.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Apna Kirana",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-slate-100/70 text-slate-900 pb-20 md:pb-0 antialiased flex flex-col font-sans selection:bg-green-100 selection:text-green-900">
        <ToastProvider>
          <StoreProvider>
            <AuthProvider>
              <CartProvider>
                <div className="flex-1 flex flex-col w-full">
                  {children}
                </div>
                <BottomNav />
                <PwaInstallBanner />
              </CartProvider>
            </AuthProvider>
          </StoreProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
