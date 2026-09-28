'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Product, Category, StoreSettings, Order, OrderStatus } from '@/types/database';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, INITIAL_STORE_SETTINGS, MOCK_COUPONS, Coupon } from '@/data/mockInventory';
import {
  DEMO_AUDIT_LOGS,
  DEMO_CUSTOMERS,
  DEMO_DATA_ENABLED,
  DEMO_NOTIFICATIONS,
  DEMO_ORDERS,
  DEMO_SUPPORT_TICKETS,
} from '@/data/demoData';
import { normalizePhone, roundMoney } from '@/lib/format';

export interface TimelineStep {
  status: OrderStatus;
  /** ISO timestamp once completed; legacy data may hold free text. */
  timestamp: string;
  label: string;
  completed: boolean;
}

export interface ExtendedOrder extends Order {
  timeline: TimelineStep[];
  delivery_slot?: string | null;
}

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'blocked';
  joinedDate: string;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerPhone: string;
  orderNumber?: number;
  issueType: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  entity: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  reason?: string;
}

export interface StoreNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'payment' | 'support' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export class OrderError extends Error {}

interface StoreContextType {
  isHydrated: boolean;
  products: Product[];
  /** Products visible to customers (active only). */
  catalog: Product[];
  categories: Category[];
  settings: StoreSettings;
  coupons: Coupon[];
  orders: ExtendedOrder[];
  customers: AdminCustomer[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLogItem[];
  notifications: StoreNotification[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, newStock: number, reason?: string) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  /** Throws OrderError when stock is insufficient. */
  createOrder: (orderData: Partial<ExtendedOrder>) => ExtendedOrder;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
  cancelOrder: (orderId: string, reason: string, actor?: string) => void;
  getOrderById: (id: string) => ExtendedOrder | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  getCustomerById: (id: string) => AdminCustomer | undefined;
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => SupportTicket;
  updateTicketStatus: (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORE_STATE_STORAGE_KEY = 'kirana_store_state_v3';

export const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

interface PersistedState {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  coupons: Coupon[];
  orders: ExtendedOrder[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLogItem[];
  notifications: StoreNotification[];
}

const initialState = (): PersistedState => ({
  products: MOCK_PRODUCTS,
  categories: MOCK_CATEGORIES,
  settings: INITIAL_STORE_SETTINGS,
  coupons: MOCK_COUPONS,
  orders: DEMO_DATA_ENABLED ? DEMO_ORDERS : [],
  supportTickets: DEMO_DATA_ENABLED ? DEMO_SUPPORT_TICKETS : [],
  auditLogs: DEMO_DATA_ENABLED ? DEMO_AUDIT_LOGS : [],
  notifications: DEMO_DATA_ENABLED ? DEMO_NOTIFICATIONS : [],
});

function readPersisted(): Partial<PersistedState> | null {
  try {
    const raw = localStorage.getItem(STORE_STATE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<PersistedState>) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  // Skip writing back a state we just received from another tab.
  const skipNextWrite = useRef(false);

  const applyPersisted = useCallback((parsed: Partial<PersistedState> | null) => {
    if (!parsed) return;
    setState((prev) => ({
      products: parsed.products ?? prev.products,
      categories: parsed.categories?.length ? parsed.categories : prev.categories,
      settings: parsed.settings ? { ...prev.settings, ...parsed.settings } : prev.settings,
      coupons: parsed.coupons ?? prev.coupons,
      orders: parsed.orders ?? prev.orders,
      supportTickets: parsed.supportTickets ?? prev.supportTickets,
      auditLogs: parsed.auditLogs ?? prev.auditLogs,
      notifications: parsed.notifications ?? prev.notifications,
    }));
  }, []);

  useEffect(() => {
    applyPersisted(readPersisted());
    setIsHydrated(true);

    // Keep the storefront and owner dashboard in sync across open tabs.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORE_STATE_STORAGE_KEY || !e.newValue) return;
      try {
        skipNextWrite.current = true;
        applyPersisted(JSON.parse(e.newValue));
      } catch {
        skipNextWrite.current = false;
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [applyPersisted]);

  useEffect(() => {
    if (!isHydrated) return;
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    try {
      localStorage.setItem(STORE_STATE_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save store state', e);
    }
  }, [state, isHydrated]);

  const { products, categories, settings, coupons, orders, supportTickets, auditLogs, notifications } = state;

  const makeAudit = (log: Omit<AuditLogItem, 'id' | 'timestamp'>): AuditLogItem => ({
    ...log,
    id: uid('aud'),
    timestamp: new Date().toISOString(),
  });

  const makeNotification = (n: Omit<StoreNotification, 'id' | 'timestamp' | 'read'>): StoreNotification => ({
    ...n,
    id: uid('notif'),
    timestamp: new Date().toISOString(),
    read: false,
  });

  const pushAudit = (logs: AuditLogItem[]) => (prev: AuditLogItem[]) => [...logs, ...prev].slice(0, 500);

  const addAuditLog = (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    const entry = makeAudit(log);
    setState((s) => ({ ...s, auditLogs: pushAudit([entry])(s.auditLogs) }));
  };

  const lowStockNotification = (p: Product, qty: number) =>
    qty <= p.min_stock_alert
      ? makeNotification({
          title: qty === 0 ? 'Out of stock' : 'Low stock',
          message: qty === 0 ? `${p.name} is out of stock.` : `${p.name} has only ${qty} left.`,
          type: 'stock',
          link: '/admin/inventory',
        })
      : null;

  const updateProduct = (updated: Product) => {
    const existing = products.find((p) => p.id === updated.id);
    const logs: AuditLogItem[] = [];
    if (existing && existing.selling_price !== updated.selling_price) {
      logs.push(
        makeAudit({
          actor: 'Store Owner',
          action: 'Price changed',
          entity: updated.name,
          oldValue: `₹${existing.selling_price}`,
          newValue: `₹${updated.selling_price}`,
        })
      );
    }
    if (existing && existing.stock_quantity !== updated.stock_quantity) {
      logs.push(
        makeAudit({
          actor: 'Store Owner',
          action: 'Stock adjusted',
          entity: updated.name,
          oldValue: String(existing.stock_quantity),
          newValue: String(updated.stock_quantity),
          reason: 'Product edit',
        })
      );
    }
    const stamped = { ...updated, updated_at: new Date().toISOString() };
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === updated.id ? stamped : p)),
      auditLogs: pushAudit(logs)(s.auditLogs),
    }));
  };

  const addProduct = (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = { ...product, id: uid('p'), created_at: now, updated_at: now };
    const log = makeAudit({
      actor: 'Store Owner',
      action: 'Product added',
      entity: newProduct.name,
      newValue: `MRP ₹${newProduct.mrp}, stock ${newProduct.stock_quantity}`,
    });
    setState((s) => ({
      ...s,
      products: [newProduct, ...s.products],
      auditLogs: pushAudit([log])(s.auditLogs),
    }));
  };

  const deleteProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const log = makeAudit({ actor: 'Store Owner', action: 'Product removed', entity: p.name });
    setState((s) => ({
      ...s,
      products: s.products.filter((item) => item.id !== id),
      auditLogs: pushAudit([log])(s.auditLogs),
    }));
  };

  const updateStock = (productId: string, newStock: number, reason: string = 'Stock adjustment') => {
    const current = products.find((p) => p.id === productId);
    if (!current) return;
    const finalQty = Math.max(0, Math.floor(newStock));
    const log = makeAudit({
      actor: 'Store Owner',
      action: 'Stock adjusted',
      entity: current.name,
      oldValue: String(current.stock_quantity),
      newValue: String(finalQty),
      reason,
    });
    const notif = finalQty < current.stock_quantity ? lowStockNotification(current, finalQty) : null;
    setState((s) => ({
      ...s,
      products: s.products.map((p) =>
        p.id === productId ? { ...p, stock_quantity: finalQty, updated_at: new Date().toISOString() } : p
      ),
      auditLogs: pushAudit([log])(s.auditLogs),
      notifications: notif ? [notif, ...s.notifications] : s.notifications,
    }));
  };

  const updateSettings = (updated: Partial<StoreSettings>) => {
    const log = makeAudit({
      actor: 'Store Owner',
      action: 'Settings updated',
      entity: 'Store settings',
      newValue: Object.keys(updated).join(', '),
    });
    setState((s) => ({
      ...s,
      settings: { ...s.settings, ...updated, updated_at: new Date().toISOString() },
      auditLogs: pushAudit([log])(s.auditLogs),
    }));
  };

  const createOrder = (orderData: Partial<ExtendedOrder>): ExtendedOrder => {
    const items = orderData.items || [];
    if (items.length === 0) throw new OrderError('Your basket is empty.');

    // Validate stock against the latest catalogue before committing anything.
    for (const item of items) {
      const p = products.find((x) => x.id === item.product_id);
      if (!p || !p.is_active) throw new OrderError(`${item.product_name} is no longer available.`);
      if (p.stock_quantity < item.quantity) {
        throw new OrderError(
          p.stock_quantity === 0
            ? `${p.name} just went out of stock.`
            : `Only ${p.stock_quantity} of ${p.name} left. Please update your basket.`
        );
      }
    }

    const orderNumber = orders.reduce((max, o) => Math.max(max, o.order_number), 1000) + 1;
    const orderId = `ord-${orderNumber}`;
    const now = new Date().toISOString();
    const isPos = orderData.order_type === 'pos_counter';

    const newOrder: ExtendedOrder = {
      id: orderId,
      order_number: orderNumber,
      user_id: orderData.user_id || null,
      order_type: orderData.order_type || 'online_delivery',
      status: orderData.status || 'pending',
      subtotal: roundMoney(orderData.subtotal || 0),
      delivery_charge: roundMoney(orderData.delivery_charge || 0),
      discount_amount: roundMoney(orderData.discount_amount || 0),
      total_amount: roundMoney(orderData.total_amount || 0),
      payment_method: orderData.payment_method || 'cod',
      payment_status: orderData.payment_status || 'pending',
      payment_transaction_id: orderData.payment_transaction_id || null,
      shipping_name: orderData.shipping_name || null,
      shipping_phone: orderData.shipping_phone || null,
      shipping_address: orderData.shipping_address || null,
      shipping_city: orderData.shipping_city || null,
      shipping_pincode: orderData.shipping_pincode || null,
      notes: orderData.notes || null,
      delivery_slot: orderData.delivery_slot || null,
      cancelled_reason: null,
      created_at: now,
      updated_at: now,
      items: items.map((i) => ({ ...i, order_id: orderId })),
      timeline: isPos
        ? [{ status: 'delivered', timestamp: now, label: 'Billed at counter', completed: true }]
        : [
            { status: 'pending', timestamp: now, label: 'Order placed', completed: true },
            { status: 'confirmed', timestamp: '', label: 'Confirmed by store', completed: false },
            { status: 'packed', timestamp: '', label: 'Packed', completed: false },
            { status: 'out_for_delivery', timestamp: '', label: 'Out for delivery', completed: false },
            { status: 'delivered', timestamp: '', label: 'Delivered', completed: false },
          ],
    };

    const stockNotifs: StoreNotification[] = [];
    for (const item of items) {
      const p = products.find((x) => x.id === item.product_id);
      if (p) {
        const n = lowStockNotification(p, p.stock_quantity - item.quantity);
        if (n && p.stock_quantity > p.min_stock_alert) stockNotifs.push(n);
      }
    }

    const orderNotif = isPos
      ? null
      : makeNotification({
          title: `New order #${orderNumber}`,
          message: `${newOrder.shipping_name || 'Customer'} placed an order for ₹${newOrder.total_amount}.`,
          type: 'order',
          link: `/admin/orders/${orderId}`,
        });

    const log = makeAudit({
      actor: isPos ? 'Counter' : 'Customer',
      action: isPos ? 'Counter sale' : 'Order placed',
      entity: `Order #${orderNumber}`,
      newValue: `₹${newOrder.total_amount} · ${newOrder.payment_method}`,
    });

    setState((s) => ({
      ...s,
      products: s.products.map((p) => {
        const item = items.find((i) => i.product_id === p.id);
        return item ? { ...p, stock_quantity: Math.max(0, p.stock_quantity - item.quantity) } : p;
      }),
      orders: [newOrder, ...s.orders],
      notifications: [...(orderNotif ? [orderNotif] : []), ...stockNotifs, ...s.notifications].slice(0, 200),
      auditLogs: pushAudit([log])(s.auditLogs),
    }));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, notes?: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord || ord.status === newStatus) return;
    if (ord.status === 'cancelled' || ord.status === 'delivered') return;
    if (newStatus === 'cancelled') {
      cancelOrder(orderId, notes || 'Cancelled by store');
      return;
    }
    const targetIndex = STATUS_FLOW.indexOf(newStatus);
    // Orders only move forward through the fulfilment flow.
    if (targetIndex === -1 || targetIndex <= STATUS_FLOW.indexOf(ord.status)) return;

    const now = new Date().toISOString();
    const timeline = ord.timeline.map((step) => {
      const idx = STATUS_FLOW.indexOf(step.status);
      if (idx !== -1 && idx <= targetIndex && !step.completed) {
        return { ...step, completed: true, timestamp: now };
      }
      return step;
    });

    const log = makeAudit({
      actor: 'Store Owner',
      action: 'Order status changed',
      entity: `Order #${ord.order_number}`,
      oldValue: ord.status,
      newValue: newStatus,
      reason: notes,
    });

    setState((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id !== orderId
          ? o
          : {
              ...o,
              status: newStatus,
              notes: notes ? (o.notes ? `${o.notes} | ${notes}` : notes) : o.notes,
              updated_at: now,
              // Cash / UPI is collected by the rider at the door.
              payment_status: newStatus === 'delivered' && o.payment_status === 'pending' ? 'paid' : o.payment_status,
              timeline,
            }
      ),
      auditLogs: pushAudit([log])(s.auditLogs),
    }));
  };

  const cancelOrder = (orderId: string, reason: string, actor: string = 'Store Owner') => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord || ord.status === 'cancelled' || ord.status === 'delivered') return;

    const now = new Date().toISOString();
    const restock = new Map<string, number>();
    ord.items?.forEach((i) => {
      if (i.product_id) restock.set(i.product_id, (restock.get(i.product_id) || 0) + i.quantity);
    });

    const log = makeAudit({
      actor,
      action: 'Order cancelled',
      entity: `Order #${ord.order_number}`,
      oldValue: ord.status,
      newValue: 'cancelled',
      reason,
    });
    const notif =
      actor === 'Customer'
        ? makeNotification({
            title: `Order #${ord.order_number} cancelled`,
            message: `Cancelled by customer: ${reason}`,
            type: 'order',
            link: `/admin/orders/${ord.id}`,
          })
        : null;

    setState((s) => ({
      ...s,
      products: s.products.map((p) =>
        restock.has(p.id) ? { ...p, stock_quantity: p.stock_quantity + (restock.get(p.id) || 0) } : p
      ),
      orders: s.orders.map((o) =>
        o.id !== orderId
          ? o
          : {
              ...o,
              status: 'cancelled',
              cancelled_reason: reason,
              payment_status: o.payment_status === 'paid' ? 'refunded' : o.payment_status,
              updated_at: now,
              timeline: [
                ...o.timeline.filter((t) => t.completed),
                { status: 'cancelled', timestamp: now, label: 'Cancelled', completed: true },
              ],
            }
      ),
      notifications: notif ? [notif, ...s.notifications] : s.notifications,
      auditLogs: pushAudit([log])(s.auditLogs),
    }));
  };

  const getOrderById = (id: string) =>
    orders.find((o) => o.id === id || String(o.order_number) === id || o.id === `ord-${id}`);

  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug || p.id === slug);

  const getProductById = (id: string) => products.find((p) => p.id === id);

  // Customers are derived from real online orders (plus demo records when enabled).
  const customers = useMemo<AdminCustomer[]>(() => {
    const map = new Map<string, AdminCustomer>();
    if (DEMO_DATA_ENABLED) DEMO_CUSTOMERS.forEach((c) => map.set(normalizePhone(c.phone), { ...c }));

    [...orders]
      .filter((o) => o.order_type !== 'pos_counter' && o.shipping_phone)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .forEach((o) => {
        const key = normalizePhone(o.shipping_phone || '');
        if (!key) return;
        const existing = map.get(key);
        const counts = o.status !== 'cancelled';
        if (existing) {
          existing.totalOrders += counts ? 1 : 0;
          existing.totalSpent = roundMoney(existing.totalSpent + (counts ? o.total_amount : 0));
          existing.lastOrderDate = o.created_at;
          existing.address = `${o.shipping_address}, ${o.shipping_city}`;
          existing.name = o.shipping_name || existing.name;
        } else {
          map.set(key, {
            id: o.user_id || `c-${key}`,
            name: o.shipping_name || 'Customer',
            phone: o.shipping_phone || '',
            email: null,
            address: `${o.shipping_address}, ${o.shipping_city}`,
            totalOrders: counts ? 1 : 0,
            totalSpent: counts ? o.total_amount : 0,
            lastOrderDate: o.created_at,
            status: 'active',
            joinedDate: o.created_at,
          });
        }
      });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const getCustomerById = (id: string) =>
    customers.find((c) => c.id === id || c.phone === id || normalizePhone(c.phone) === normalizePhone(id));

  const addCoupon = (coupon: Coupon) => {
    const log = makeAudit({
      actor: 'Store Owner',
      action: 'Coupon created',
      entity: coupon.code,
      newValue: `${coupon.discountType === 'flat' ? '₹' : ''}${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ''} off`,
      reason: coupon.description,
    });
    setState((s) => ({ ...s, coupons: [coupon, ...s.coupons], auditLogs: pushAudit([log])(s.auditLogs) }));
  };

  const deleteCoupon = (id: string) => {
    setState((s) => ({ ...s, coupons: s.coupons.filter((c) => c.id !== id) }));
  };

  const createSupportTicket = (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `t-${Date.now().toString(36)}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const notif = makeNotification({
      title: 'New support request',
      message: `${ticket.customerName}: ${ticket.issueType}${ticket.orderNumber ? ` (order #${ticket.orderNumber})` : ''}`,
      type: 'support',
      link: '/admin/support',
    });
    setState((s) => ({
      ...s,
      supportTickets: [newTicket, ...s.supportTickets],
      notifications: [notif, ...s.notifications],
    }));
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    const log = makeAudit({
      actor: 'Store Owner',
      action: 'Support ticket updated',
      entity: `Ticket #${ticketId}`,
      newValue: status,
    });
    setState((s) => ({
      ...s,
      supportTickets: s.supportTickets.map((t) => (t.id === ticketId ? { ...t, status } : t)),
      auditLogs: pushAudit([log])(s.auditLogs),
    }));
  };

  const markNotificationRead = (id: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  };

  const catalog = useMemo(() => products.filter((p) => p.is_active), [products]);

  return (
    <StoreContext.Provider
      value={{
        isHydrated,
        products,
        catalog,
        categories,
        settings,
        coupons,
        orders,
        customers,
        supportTickets,
        auditLogs,
        notifications,
        updateProduct,
        addProduct,
        deleteProduct,
        updateStock,
        updateSettings,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        getOrderById,
        getProductBySlug,
        getProductById,
        addCoupon,
        deleteCoupon,
        getCustomerById,
        createSupportTicket,
        updateTicketStatus,
        markNotificationRead,
        markAllNotificationsRead,
        addAuditLog,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
