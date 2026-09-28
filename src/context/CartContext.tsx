'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types/database';
import { useStore } from './StoreContext';
import { useToast } from './ToastContext';
import { Coupon } from '@/data/mockInventory';
import { roundMoney } from '@/lib/format';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  /** Set when the applied coupon no longer applies (e.g. basket dropped below minimum). */
  couponWarning: string | null;
  availableCoupons: Coupon[];
  addToCart: (product: Product, quantityToAdd?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getQuantity: (productId: string) => number;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  totalItems: number;
  subtotal: number;
  mrpTotal: number;
  totalSavings: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  freeDeliveryProgressPercent: number;
  minOrderAmount: number;
  meetsMinOrder: boolean;
  /** Items whose requested quantity is no longer in stock. */
  unavailableItems: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'kirana_cart_v3';

export function isCouponLive(c: Coupon, now = new Date()): boolean {
  if (!c.isActive) return false;
  if (!c.expiresAt) return true;
  const end = new Date(c.expiresAt);
  end.setHours(23, 59, 59, 999);
  return end.getTime() >= now.getTime();
}

function couponDiscount(c: Coupon, subtotal: number): number {
  if (subtotal < c.minOrderValue) return 0;
  const raw =
    c.discountType === 'flat'
      ? c.discountValue
      : Math.min((subtotal * c.discountValue) / 100, c.maxDiscount ?? Infinity);
  return Math.round(Math.min(raw, subtotal));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings, coupons, products, isHydrated } = useStore();
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.coupon) setAppliedCoupon(parsed.coupon);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, coupon: appliedCoupon }));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, appliedCoupon, isLoaded]);

  // Reconcile the saved basket with the live catalogue: fresh prices, removed/hidden products dropped.
  useEffect(() => {
    if (!isLoaded || !isHydrated) return;
    setItems((prev) => {
      let changed = false;
      const next = prev.flatMap((item) => {
        const fresh = products.find((p) => p.id === item.product.id);
        if (!fresh || !fresh.is_active) {
          changed = true;
          return [];
        }
        if (fresh !== item.product) changed = true;
        return [{ ...item, product: fresh }];
      });
      return changed ? next : prev;
    });
  }, [products, isLoaded, isHydrated]);

  // Keep the applied coupon in sync with owner edits / deletion.
  useEffect(() => {
    if (!appliedCoupon || !isHydrated) return;
    const fresh = coupons.find((c) => c.id === appliedCoupon.id);
    if (!fresh || !isCouponLive(fresh)) setAppliedCoupon(null);
    else if (fresh !== appliedCoupon && JSON.stringify(fresh) !== JSON.stringify(appliedCoupon)) setAppliedCoupon(fresh);
  }, [coupons, appliedCoupon, isHydrated]);

  const getQuantity = (productId: string) => items.find((i) => i.product.id === productId)?.quantity ?? 0;

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    if (product.stock_quantity <= 0) {
      showToast({ type: 'error', title: `${product.name} is out of stock` });
      return;
    }
    const current = getQuantity(product.id);
    const target = Math.min(product.stock_quantity, current + quantityToAdd);
    if (target === current) {
      showToast({ type: 'warning', title: `Only ${product.stock_quantity} available` });
      return;
    }
    setItems((prev) =>
      current > 0
        ? prev.map((i) => (i.product.id === product.id ? { ...i, quantity: target } : i))
        : [...prev, { product, quantity: target }]
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = items.find((i) => i.product.id === productId);
    if (item && quantity > item.product.stock_quantity && quantity > item.quantity) {
      showToast({ type: 'warning', title: `Only ${item.product.stock_quantity} available` });
      return;
    }
    setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = roundMoney(items.reduce((sum, i) => sum + Number(i.product.selling_price) * i.quantity, 0));
  const mrpTotal = roundMoney(items.reduce((sum, i) => sum + Number(i.product.mrp) * i.quantity, 0));

  const freeDeliveryThreshold = Number(settings.free_delivery_above) || 0;
  const standardDeliveryCharge = Number(settings.delivery_charge) || 0;
  const minOrderAmount = Number(settings.min_order_amount) || 0;

  const deliveryCharge =
    subtotal === 0 || (freeDeliveryThreshold > 0 && subtotal >= freeDeliveryThreshold) ? 0 : standardDeliveryCharge;

  const discountAmount = appliedCoupon ? couponDiscount(appliedCoupon, subtotal) : 0;
  const couponWarning =
    appliedCoupon && discountAmount === 0
      ? `Add ₹${roundMoney(appliedCoupon.minOrderValue - subtotal)} more to use ${appliedCoupon.code}`
      : null;

  const retailSavings = Math.max(0, roundMoney(mrpTotal - subtotal));
  const totalSavings = roundMoney(retailSavings + discountAmount);
  const totalAmount = roundMoney(Math.max(0, subtotal + deliveryCharge - discountAmount));

  const amountNeededForFreeDelivery =
    freeDeliveryThreshold > 0 ? Math.max(0, roundMoney(freeDeliveryThreshold - subtotal)) : 0;
  const freeDeliveryProgressPercent =
    freeDeliveryThreshold > 0 ? Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100)) : 100;

  const unavailableItems = items.filter((i) => i.quantity > i.product.stock_quantity);
  const availableCoupons = coupons.filter((c) => isCouponLive(c));

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean);
    if (!found || !isCouponLive(found)) {
      return { success: false, message: 'This coupon is invalid or has expired.' };
    }
    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Add items worth ₹${roundMoney(found.minOrderValue - subtotal)} more to use ${found.code}.`,
      };
    }
    setAppliedCoupon(found);
    showToast({ type: 'success', title: `${found.code} applied`, message: `You save ₹${couponDiscount(found, subtotal)}` });
    return { success: true, message: `Applied ${found.code}` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        couponWarning,
        availableCoupons,
        addToCart,
        removeFromCart,
        updateQuantity,
        getQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        totalItems,
        subtotal,
        mrpTotal,
        totalSavings,
        deliveryCharge,
        discountAmount,
        totalAmount,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        freeDeliveryProgressPercent,
        minOrderAmount,
        meetsMinOrder: subtotal >= minOrderAmount,
        unavailableItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
