'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types/database';
import { useStore } from './StoreContext';
import { useToast } from './ToastContext';
import { Coupon } from '@/data/mockInventory';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, quantityToAdd?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'kirana_cart_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { settings, coupons, products } = useStore();
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.items) setItems(parsed.items);
        if (parsed.coupon) setAppliedCoupon(parsed.coupon);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify({ items, coupon: appliedCoupon })
        );
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [items, appliedCoupon, isLoaded]);

  // Keep cart items' live stock & prices refreshed with store state
  useEffect(() => {
    if (items.length > 0 && products.length > 0) {
      setItems((prev) =>
        prev.map((item) => {
          const fresh = products.find((p) => p.id === item.product.id);
          return fresh ? { ...item, product: fresh } : item;
        })
      );
    }
  }, [products]);

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    if (product.stock_quantity <= 0) {
      showToast({
        type: 'error',
        title: 'Out of Stock',
        message: `${product.name} is currently out of stock.`,
      });
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock_quantity, existing.quantity + quantityToAdd);
        if (newQty === existing.quantity && existing.quantity >= product.stock_quantity) {
          showToast({
            type: 'warning',
            title: 'Max Stock Limit',
            message: `Only ${product.stock_quantity} units available.`,
          });
          return prev;
        }
        showToast({
          type: 'success',
          title: 'Cart Updated',
          message: `${product.name} quantity increased to ${newQty}`,
        });
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: newQty } : i));
      }

      showToast({
        type: 'success',
        title: 'Added to Cart',
        message: `${product.name} added to your basket`,
      });
      return [...prev, { product, quantity: Math.min(product.stock_quantity, quantityToAdd) }];
    });
  };

  const removeFromCart = (productId: string) => {
    const item = items.find((i) => i.product.id === productId);
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast({
        type: 'info',
        title: 'Removed from Cart',
        message: `${item.product.name} was removed.`,
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const item = items.find((i) => i.product.id === productId);
    if (item && quantity > item.product.stock_quantity) {
      showToast({
        type: 'warning',
        title: 'Stock Limit Reached',
        message: `Only ${item.product.stock_quantity} available in store.`,
      });
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.selling_price) * item.quantity,
    0
  );

  const mrpTotal = items.reduce(
    (sum, item) => sum + Number(item.product.mrp) * item.quantity,
    0
  );

  const freeDeliveryThreshold = settings.free_delivery_above || 499;
  const standardDeliveryCharge = settings.delivery_charge || 25;

  // Delivery charge calculation
  let deliveryCharge = 0;
  if (subtotal > 0) {
    if (subtotal >= freeDeliveryThreshold) {
      deliveryCharge = 0;
    } else {
      deliveryCharge = standardDeliveryCharge;
    }
  }

  // Calculate Coupon discount
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'flat') {
      discountAmount = appliedCoupon.discountValue;
    } else {
      const pct = (subtotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscount ? Math.min(pct, appliedCoupon.maxDiscount) : pct;
    }
  }

  // Total Retail savings (MRP savings + Coupon discount)
  const retailSavings = mrpTotal > subtotal ? mrpTotal - subtotal : 0;
  const totalSavings = retailSavings + discountAmount;

  const totalAmount = Math.max(0, subtotal + deliveryCharge - discountAmount);

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Min order value of ₹${found.minOrderValue} required for ${found.code}.`,
      };
    }

    setAppliedCoupon(found);
    showToast({
      type: 'success',
      title: 'Coupon Applied!',
      message: `Coupon ${found.code} applied successfully!`,
    });
    return { success: true, message: `Applied ${found.code}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast({
      type: 'info',
      title: 'Coupon Removed',
      message: 'Discount has been removed from order.',
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
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
