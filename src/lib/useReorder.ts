'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useStore, type ExtendedOrder } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';

/** Adds every still-available item of a past order back to the cart. */
export function useReorder() {
  const router = useRouter();
  const { getProductById } = useStore();
  const { addToCart, getQuantity } = useCart();
  const { showToast } = useToast();

  return (order: ExtendedOrder) => {
    let added = 0;
    let skipped = 0;
    order.items?.forEach((item) => {
      const p = item.product_id ? getProductById(item.product_id) : undefined;
      if (!p || !p.is_active || p.stock_quantity <= 0) {
        skipped++;
        return;
      }
      const room = p.stock_quantity - getQuantity(p.id);
      if (room <= 0) return;
      addToCart(p, Math.min(item.quantity, room));
      added++;
    });
    if (added === 0) {
      showToast({ type: 'warning', title: 'These items are currently unavailable' });
      return;
    }
    if (skipped > 0) {
      showToast({ type: 'info', title: `${skipped} item${skipped > 1 ? 's' : ''} unavailable`, message: 'We added the rest to your cart.' });
    }
    router.push('/cart');
  };
}
