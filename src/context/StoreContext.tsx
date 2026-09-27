'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, StoreSettings, Order, OrderStatus } from '@/types/database';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, INITIAL_STORE_SETTINGS, MOCK_COUPONS, Coupon } from '@/data/mockInventory';

export interface ExtendedOrder extends Order {
  timeline: {
    status: OrderStatus;
    timestamp: string;
    label: string;
    completed: boolean;
  }[];
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

interface StoreContextType {
  products: Product[];
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
  createOrder: (orderData: Partial<ExtendedOrder>) => ExtendedOrder;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  getOrderById: (id: string) => ExtendedOrder | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  getCustomerById: (id: string) => AdminCustomer | undefined;
  updateTicketStatus: (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORE_STATE_STORAGE_KEY = 'kirana_store_state_v2';

const INITIAL_DEMO_CUSTOMERS: AdminCustomer[] = [
  {
    id: 'cust-1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    address: 'Flat 402, Block B, Gaur City 2, Ghaziabad',
    totalOrders: 14,
    totalSpent: 6840,
    lastOrderDate: 'Today, 10:30 AM',
    status: 'active',
    joinedDate: '12 Jan 2026',
  },
  {
    id: 'cust-2',
    name: 'Pooja Agarwal',
    phone: '+91 98112 34567',
    email: 'pooja.a@gmail.com',
    address: 'House 14, Sector 4, Vasundhara, Ghaziabad',
    totalOrders: 8,
    totalSpent: 3920,
    lastOrderDate: 'Yesterday, 04:15 PM',
    status: 'active',
    joinedDate: '04 Feb 2026',
  },
  {
    id: 'cust-3',
    name: 'Amitabh Sen',
    phone: '+91 98223 99881',
    email: 'amitabh.sen@rediffmail.com',
    address: 'Tower 3, Apt 1102, Indirapuram, Ghaziabad',
    totalOrders: 21,
    totalSpent: 12450,
    lastOrderDate: '24 Sep 2026',
    status: 'active',
    joinedDate: '18 Nov 2025',
  },
  {
    id: 'cust-4',
    name: 'Meena Gupta',
    phone: '+91 99100 44221',
    email: 'meenag@yahoo.co.in',
    address: 'Shop 2, Raj Nagar Extension, Ghaziabad',
    totalOrders: 5,
    totalSpent: 2100,
    lastOrderDate: '22 Sep 2026',
    status: 'active',
    joinedDate: '15 Feb 2026',
  },
  {
    id: 'cust-5',
    name: 'Vikas Malhotra',
    phone: '+91 97112 88334',
    email: null,
    address: 'Pocket B, Crossing Republik, Ghaziabad',
    totalOrders: 2,
    totalSpent: 890,
    lastOrderDate: '21 Sep 2026',
    status: 'active',
    joinedDate: '01 Mar 2026',
  },
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 't-101',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    orderNumber: 1025,
    issueType: 'Missing item in package',
    description: 'Received 1kg salt instead of Tata Tea pack.',
    status: 'in_progress',
    createdAt: 'Today, 11:15 AM',
  },
  {
    id: 't-102',
    customerName: 'Meena Gupta',
    customerPhone: '+91 99100 44221',
    orderNumber: 1022,
    issueType: 'Payment deducted twice',
    description: 'UPI transaction showed pending then deducted ₹380 twice.',
    status: 'open',
    createdAt: 'Yesterday, 06:40 PM',
  },
  {
    id: 't-103',
    customerName: 'Pooja Agarwal',
    customerPhone: '+91 98112 34567',
    orderNumber: 1020,
    issueType: 'Packaging damaged',
    description: 'Ghee tin had a small dent on corner. Replaced on doorstep.',
    status: 'resolved',
    createdAt: '23 Sep 2026',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    actor: 'Store Owner',
    action: 'Stock Adjustment',
    entity: 'Aashirvaad Atta 5kg',
    oldValue: '32',
    newValue: '42',
    timestamp: 'Today, 09:15 AM',
    reason: 'Received supplier delivery crate',
  },
  {
    id: 'aud-2',
    actor: 'Counter Staff',
    action: 'POS Sale Out',
    entity: 'Tata Salt 1kg',
    oldValue: '116',
    newValue: '115',
    timestamp: 'Today, 10:02 AM',
    reason: 'Cash Counter bill #POS-1002',
  },
  {
    id: 'aud-3',
    actor: 'Store Owner',
    action: 'Price Update',
    entity: 'Amul Desi Ghee 1L',
    oldValue: '₹620',
    newValue: '₹610',
    timestamp: 'Yesterday, 07:30 PM',
    reason: 'Seasonal festival promotion discount',
  },
  {
    id: 'aud-4',
    actor: 'System',
    action: 'Order Placed Deduct',
    entity: 'MDH Deggi Mirch 100g',
    oldValue: '61',
    newValue: '60',
    timestamp: 'Today, 10:30 AM',
    reason: 'Customer online order #1025',
  },
];

const INITIAL_NOTIFICATIONS: StoreNotification[] = [
  {
    id: 'notif-1',
    title: 'New Online Order #1026',
    message: 'Rahul Sharma placed an order for ₹582 via UPI.',
    type: 'order',
    timestamp: '2 mins ago',
    read: false,
    link: '/admin/orders/ord-1026',
  },
  {
    id: 'notif-2',
    title: 'Low Stock Alert',
    message: 'Rajdhani Sooji and Kabuli Chana are below threshold alert limit.',
    type: 'stock',
    timestamp: '15 mins ago',
    read: false,
    link: '/admin/inventory',
  },
  {
    id: 'notif-3',
    title: 'Support Ticket #t-101 Logged',
    message: 'Rahul Sharma submitted a missing item query on Order #1025.',
    type: 'support',
    timestamp: '1 hour ago',
    read: false,
    link: '/admin/support',
  },
];

const INITIAL_DEMO_ORDERS: ExtendedOrder[] = [
  {
    id: 'ord-1026',
    order_number: 1026,
    user_id: 'cust-1',
    order_type: 'online_delivery',
    status: 'pending',
    subtotal: 582,
    delivery_charge: 0,
    discount_amount: 50,
    total_amount: 532,
    payment_method: 'upi',
    payment_status: 'paid',
    payment_transaction_id: 'UPI-9923812391',
    shipping_name: 'Rahul Sharma',
    shipping_phone: '+91 98765 43210',
    shipping_address: 'Flat 402, Block B, Gaur City 2',
    shipping_city: 'Ghaziabad',
    shipping_pincode: '201009',
    notes: 'Please do not ring bell if baby is sleeping.',
    cancelled_reason: null,
    created_at: new Date(Date.now() - 300000).toISOString(), // 5 mins ago
    updated_at: new Date().toISOString(),
    items: [
      {
        id: 'oi-7',
        order_id: 'ord-1026',
        product_id: 'p-1',
        product_name: 'Aashirvaad Shudh Chakki Whole Wheat Atta 5kg',
        quantity: 1,
        unit_price: 249,
        total_price: 249,
        created_at: '',
      },
      {
        id: 'oi-8',
        order_id: 'ord-1026',
        product_id: 'p-11',
        product_name: 'Amul Pure Desi Ghee Tin 1L',
        quantity: 1,
        unit_price: 610,
        total_price: 610,
        created_at: '',
      },
    ],
    timeline: [
      { status: 'pending', timestamp: '5 mins ago', label: 'Order Placed', completed: true },
      { status: 'confirmed', timestamp: 'Waiting', label: 'Confirmed by Kirana Store', completed: false },
      { status: 'packed', timestamp: 'Waiting', label: 'Items Packed & Billed', completed: false },
      { status: 'out_for_delivery', timestamp: 'Pending', label: 'Out for Quick Delivery', completed: false },
      { status: 'delivered', timestamp: 'Estimated 25m', label: 'Delivery at Doorstep', completed: false },
    ],
  },
  {
    id: 'ord-1025',
    order_number: 1025,
    user_id: 'cust-2',
    order_type: 'online_delivery',
    status: 'packed',
    subtotal: 395,
    delivery_charge: 25,
    discount_amount: 0,
    total_amount: 420,
    payment_method: 'cod',
    payment_status: 'pending',
    payment_transaction_id: null,
    shipping_name: 'Pooja Agarwal',
    shipping_phone: '+91 98112 34567',
    shipping_address: 'House 14, Sector 4, Vasundhara',
    shipping_city: 'Ghaziabad',
    shipping_pincode: '201012',
    notes: 'Call on reaching the gate.',
    cancelled_reason: null,
    created_at: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    updated_at: new Date(Date.now() - 600000).toISOString(),
    items: [
      {
        id: 'oi-4',
        order_id: 'ord-1025',
        product_id: 'p-10',
        product_name: 'Fortune Kachi Ghani Pure Mustard Oil 1L',
        quantity: 1,
        unit_price: 142,
        total_price: 142,
        created_at: '',
      },
      {
        id: 'oi-5',
        order_id: 'ord-1025',
        product_id: 'p-7',
        product_name: 'Tata Sampann Unpolished Toor Dal 1kg',
        quantity: 1,
        unit_price: 172,
        total_price: 172,
        created_at: '',
      },
      {
        id: 'oi-6',
        order_id: 'ord-1025',
        product_id: 'p-19',
        product_name: 'Parle-G Gluco Biscuits Family Pack 800g',
        quantity: 1,
        unit_price: 79,
        total_price: 79,
        created_at: '',
      },
    ],
    timeline: [
      { status: 'pending', timestamp: 'Today, 30 mins ago', label: 'Order Placed', completed: true },
      { status: 'confirmed', timestamp: 'Today, 25 mins ago', label: 'Confirmed by Kirana Store', completed: true },
      { status: 'packed', timestamp: 'Today, 10 mins ago', label: 'Items Packed & Billed', completed: true },
      { status: 'out_for_delivery', timestamp: 'Pending', label: 'Out for Quick Delivery', completed: false },
      { status: 'delivered', timestamp: 'Estimated in 12 mins', label: 'Delivery at Doorstep', completed: false },
    ],
  },
  {
    id: 'ord-1024',
    order_number: 1024,
    user_id: 'cust-1',
    order_type: 'online_delivery',
    status: 'delivered',
    subtotal: 513,
    delivery_charge: 0,
    discount_amount: 50,
    total_amount: 463,
    payment_method: 'upi',
    payment_status: 'paid',
    payment_transaction_id: 'UPI-9823482394',
    shipping_name: 'Rahul Sharma',
    shipping_phone: '+91 98765 43210',
    shipping_address: 'Flat 402, Block B, Gaur City 2, Sector 16C',
    shipping_city: 'Ghaziabad',
    shipping_pincode: '201009',
    notes: 'Please leave parcel at the front door.',
    cancelled_reason: null,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 84000000).toISOString(),
    items: [
      {
        id: 'oi-1',
        order_id: 'ord-1024',
        product_id: 'p-1',
        product_name: 'Aashirvaad Shudh Chakki Whole Wheat Atta 5kg',
        quantity: 1,
        unit_price: 249,
        total_price: 249,
        created_at: '',
      },
      {
        id: 'oi-2',
        order_id: 'ord-1024',
        product_id: 'p-15',
        product_name: 'Tata Salt Vacuum Evaporated 1kg',
        quantity: 1,
        unit_price: 26,
        total_price: 26,
        created_at: '',
      },
      {
        id: 'oi-3',
        order_id: 'ord-1024',
        product_id: 'p-21',
        product_name: 'Tata Tea Premium Desh Ki Chai 500g',
        quantity: 1,
        unit_price: 224,
        total_price: 224,
        created_at: '',
      },
    ],
    timeline: [
      { status: 'pending', timestamp: 'Yesterday, 10:30 AM', label: 'Order Placed', completed: true },
      { status: 'confirmed', timestamp: 'Yesterday, 10:32 AM', label: 'Confirmed by Kirana Store', completed: true },
      { status: 'packed', timestamp: 'Yesterday, 10:40 AM', label: 'Items Packed & Checked', completed: true },
      { status: 'out_for_delivery', timestamp: 'Yesterday, 10:48 AM', label: 'Out for Quick Delivery', completed: true },
      { status: 'delivered', timestamp: 'Yesterday, 11:05 AM', label: 'Delivered at Doorstep', completed: true },
    ],
  },
  {
    id: 'ord-1023',
    order_number: 1023,
    user_id: 'cust-3',
    order_type: 'pos_counter',
    status: 'delivered',
    subtotal: 654,
    delivery_charge: 0,
    discount_amount: 0,
    total_amount: 654,
    payment_method: 'cash_pos',
    payment_status: 'paid',
    payment_transaction_id: 'POS-CASH-1023',
    shipping_name: 'Walk-in Counter Customer',
    shipping_phone: 'Counter',
    shipping_address: 'Direct Counter Sale',
    shipping_city: 'Ghaziabad',
    shipping_pincode: '201001',
    notes: 'Walk-in direct receipt',
    cancelled_reason: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    items: [
      {
        id: 'oi-9',
        order_id: 'ord-1023',
        product_id: 'p-4',
        product_name: 'Fortune Everyday Basmati Rice 1kg',
        quantity: 2,
        unit_price: 94,
        total_price: 188,
        created_at: '',
      },
      {
        id: 'oi-10',
        order_id: 'ord-1023',
        product_id: 'p-27',
        product_name: 'Happilo California Almonds 500g',
        quantity: 1,
        unit_price: 439,
        total_price: 439,
        created_at: '',
      },
      {
        id: 'oi-11',
        order_id: 'ord-1023',
        product_id: 'p-15',
        product_name: 'Tata Salt Vacuum Evaporated 1kg',
        quantity: 1,
        unit_price: 26,
        total_price: 26,
        created_at: '',
      },
    ],
    timeline: [
      { status: 'delivered', timestamp: '2 days ago', label: 'Billed and Handed to Customer', completed: true },
    ],
  },
  {
    id: 'ord-1022',
    order_number: 1022,
    user_id: 'cust-4',
    order_type: 'online_delivery',
    status: 'cancelled',
    subtotal: 380,
    delivery_charge: 25,
    discount_amount: 0,
    total_amount: 405,
    payment_method: 'cod',
    payment_status: 'failed',
    payment_transaction_id: null,
    shipping_name: 'Meena Gupta',
    shipping_phone: '+91 99100 44221',
    shipping_address: 'Shop 2, Raj Nagar Extension',
    shipping_city: 'Ghaziabad',
    shipping_pincode: '201017',
    notes: 'Customer canceled due to delayed arrival.',
    cancelled_reason: 'Delivery delayed beyond estimated slot',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 250000000).toISOString(),
    items: [
      {
        id: 'oi-12',
        order_id: 'ord-1022',
        product_id: 'p-10',
        product_name: 'Fortune Kachi Ghani Pure Mustard Oil 1L',
        quantity: 1,
        unit_price: 142,
        total_price: 142,
        created_at: '',
      },
      {
        id: 'oi-13',
        order_id: 'ord-1022',
        product_id: 'p-21',
        product_name: 'Tata Tea Premium Desh Ki Chai 500g',
        quantity: 1,
        unit_price: 224,
        total_price: 224,
        created_at: '',
      },
    ],
    timeline: [
      { status: 'pending', timestamp: '3 days ago', label: 'Order Placed', completed: true },
      { status: 'cancelled', timestamp: '3 days ago', label: 'Order Cancelled', completed: true },
    ],
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [orders, setOrders] = useState<ExtendedOrder[]>(INITIAL_DEMO_ORDERS);
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_DEMO_CUSTOMERS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<StoreNotification[]>(INITIAL_NOTIFICATIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORE_STATE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.products?.length) setProducts(parsed.products);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.orders?.length) setOrders(parsed.orders);
        if (parsed.coupons?.length) setCoupons(parsed.coupons);
        if (parsed.customers?.length) setCustomers(parsed.customers);
        if (parsed.supportTickets?.length) setSupportTickets(parsed.supportTickets);
        if (parsed.auditLogs?.length) setAuditLogs(parsed.auditLogs);
        if (parsed.notifications?.length) setNotifications(parsed.notifications);
      }
    } catch (e) {
      console.error('Failed to load store state', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          STORE_STATE_STORAGE_KEY,
          JSON.stringify({
            products,
            settings,
            orders,
            coupons,
            customers,
            supportTickets,
            auditLogs,
            notifications,
          })
        );
      } catch (e) {
        console.error('Failed to save store state', e);
      }
    }
  }, [products, settings, orders, coupons, customers, supportTickets, auditLogs, notifications, isLoaded]);

  const addAuditLog = (log: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    const newLog: AuditLogItem = {
      ...log,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const updateProduct = (updated: Product) => {
    const existing = products.find((p) => p.id === updated.id);
    if (existing && existing.selling_price !== updated.selling_price) {
      addAuditLog({
        actor: 'Store Owner',
        action: 'Price Changed',
        entity: updated.name,
        oldValue: `₹${existing.selling_price}`,
        newValue: `₹${updated.selling_price}`,
        reason: 'Manual price adjustment',
      });
    }
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const addProduct = (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const id = `p-${Date.now()}`;
    const newProduct: Product = {
      ...product,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    addAuditLog({
      actor: 'Store Owner',
      action: 'Product Added',
      entity: newProduct.name,
      newValue: `MRP ₹${newProduct.mrp}, Stock ${newProduct.stock_quantity}`,
      reason: 'New catalog entry',
    });
  };

  const deleteProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
    if (p) {
      addAuditLog({
        actor: 'Store Owner',
        action: 'Product Archived',
        entity: p.name,
        reason: 'Item deleted from catalog',
      });
    }
  };

  const updateStock = (productId: string, newStock: number, reason: string = 'Stock Adjustment') => {
    const currentProd = products.find((p) => p.id === productId);
    const oldQty = currentProd ? currentProd.stock_quantity : 0;
    const finalQty = Math.max(0, newStock);

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock_quantity: finalQty } : p))
    );

    if (currentProd) {
      addAuditLog({
        actor: 'Store Owner',
        action: 'Stock Ledger Adjustment',
        entity: currentProd.name,
        oldValue: String(oldQty),
        newValue: String(finalQty),
        reason,
      });

      if (finalQty <= currentProd.min_stock_alert && finalQty > 0) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            title: 'Low Stock Alert',
            message: `${currentProd.name} is low on stock (${finalQty} units left).`,
            type: 'stock',
            timestamp: 'Just now',
            read: false,
            link: '/admin/inventory',
          },
          ...prev,
        ]);
      }
    }
  };

  const updateSettings = (updated: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated, updated_at: new Date().toISOString() }));
    addAuditLog({
      actor: 'Store Owner',
      action: 'Store Settings Modified',
      entity: 'Store Operational Rules',
      reason: 'Delivery charges or timings updated',
    });
  };

  const createOrder = (orderData: Partial<ExtendedOrder>): ExtendedOrder => {
    const orderNumber = 1000 + orders.length + 1;
    const orderId = `ord-${orderNumber}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: ExtendedOrder = {
      id: orderId,
      order_number: orderNumber,
      user_id: orderData.user_id || 'guest',
      order_type: orderData.order_type || 'online_delivery',
      status: orderData.status || 'pending',
      subtotal: orderData.subtotal || 0,
      delivery_charge: orderData.delivery_charge || 0,
      discount_amount: orderData.discount_amount || 0,
      total_amount: orderData.total_amount || 0,
      payment_method: orderData.payment_method || 'cod',
      payment_status: orderData.payment_status || (orderData.payment_method === 'cod' ? 'pending' : 'paid'),
      payment_transaction_id: orderData.payment_transaction_id || (orderData.payment_method !== 'cod' ? `TXN-${Date.now()}` : null),
      shipping_name: orderData.shipping_name || 'Customer',
      shipping_phone: orderData.shipping_phone || '',
      shipping_address: orderData.shipping_address || '',
      shipping_city: orderData.shipping_city || 'Ghaziabad',
      shipping_pincode: orderData.shipping_pincode || '201001',
      notes: orderData.notes || null,
      cancelled_reason: null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      items: orderData.items || [],
      timeline: [
        { status: 'pending', timestamp: `${timeStr}`, label: 'Order Placed', completed: true },
        { status: 'confirmed', timestamp: 'Pending confirmation', label: 'Store Confirmation', completed: false },
        { status: 'packed', timestamp: 'Pending', label: 'Packing Items', completed: false },
        { status: 'out_for_delivery', timestamp: 'Pending', label: 'Out for Quick Delivery', completed: false },
        { status: 'delivered', timestamp: 'Estimated 25-35 mins', label: 'Delivery at Doorstep', completed: false },
      ],
    };

    // Deduct inventory quantities automatically
    if (newOrder.items?.length) {
      setProducts((prev) =>
        prev.map((p) => {
          const item = newOrder.items?.find((i) => i.product_id === p.id);
          if (item) {
            return { ...p, stock_quantity: Math.max(0, p.stock_quantity - item.quantity) };
          }
          return p;
        })
      );
    }

    setOrders((prev) => [newOrder, ...prev]);

    // Push notification to Admin
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `New Order #${newOrder.order_number}`,
        message: `${newOrder.shipping_name} placed an order for ₹${newOrder.total_amount} (${newOrder.payment_method.toUpperCase()}).`,
        type: 'order',
        timestamp: 'Just now',
        read: false,
        link: `/admin/orders/${newOrder.id}`,
      },
      ...prev,
    ]);

    addAuditLog({
      actor: 'System',
      action: 'Order Created',
      entity: `Order #${newOrder.order_number}`,
      newValue: `₹${newOrder.total_amount} via ${newOrder.payment_method}`,
      reason: newOrder.order_type,
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, notes?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        const updatedTimeline = ord.timeline.map((step) => {
          if (step.status === newStatus) {
            return { ...step, completed: true, timestamp: timeStr };
          }
          const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];
          const currentIndex = statusOrder.indexOf(newStatus);
          const stepIndex = statusOrder.indexOf(step.status);
          if (stepIndex <= currentIndex && stepIndex !== -1) {
            return { ...step, completed: true, timestamp: step.completed ? step.timestamp : timeStr };
          }
          return step;
        });

        addAuditLog({
          actor: 'Store Owner',
          action: 'Order Status Changed',
          entity: `Order #${ord.order_number}`,
          oldValue: ord.status,
          newValue: newStatus,
          reason: notes || 'Standard order processing',
        });

        return {
          ...ord,
          status: newStatus,
          notes: notes ? (ord.notes ? `${ord.notes} | ${notes}` : notes) : ord.notes,
          updated_at: now.toISOString(),
          payment_status: newStatus === 'delivered' ? 'paid' : ord.payment_status,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const cancelOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        // Restock products back into inventory
        if (ord.items?.length) {
          ord.items.forEach((item) => {
            if (item.product_id) {
              const prod = products.find((p) => p.id === item.product_id);
              if (prod) {
                updateStock(prod.id, prod.stock_quantity + item.quantity, `Order #${ord.order_number} cancelled restock`);
              }
            }
          });
        }

        addAuditLog({
          actor: 'Store Owner',
          action: 'Order Cancelled',
          entity: `Order #${ord.order_number}`,
          oldValue: ord.status,
          newValue: 'cancelled',
          reason,
        });

        return {
          ...ord,
          status: 'cancelled',
          cancelled_reason: reason,
          updated_at: new Date().toISOString(),
        };
      })
    );
  };

  const getOrderById = (id: string) => {
    return orders.find((o) => o.id === id || String(o.order_number) === id || o.id === `ord-${id}`);
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug || p.id === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const getCustomerById = (id: string) => {
    return customers.find((c) => c.id === id || c.phone === id);
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    addAuditLog({
      actor: 'Store Owner',
      action: 'Coupon Created',
      entity: coupon.code,
      newValue: `${coupon.discountType === 'flat' ? '₹' : ''}${coupon.discountValue} off`,
      reason: coupon.description,
    });
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const updateTicketStatus = (ticketId: string, status: 'open' | 'in_progress' | 'resolved') => {
    setSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    addAuditLog({
      actor: 'Store Owner',
      action: 'Support Ticket Status',
      entity: `Ticket #${ticketId}`,
      newValue: status,
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
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
