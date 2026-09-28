export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'owner' | 'customer'
export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type PaymentMethod = 'cod' | 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash_pos'
export type OrderType = 'online_delivery' | 'online_pickup' | 'pos_counter'
export type InventoryMovementType = 'purchase_in' | 'sale_out' | 'pos_sale_out' | 'return_in' | 'damage_loss' | 'adjustment'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  phone: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface StoreSettings {
  id: string
  store_name: string
  tagline: string | null
  phone: string
  email: string | null
  address: string
  city: string
  state: string
  pincode: string
  latitude: number | null
  longitude: number | null
  delivery_radius_km: number
  delivery_charge: number
  free_delivery_above: number
  min_order_amount: number
  is_store_open: boolean
  opening_time: string | null
  closing_time: string | null
  /** Pincodes the store delivers to. Empty = no pincode restriction. */
  serviceable_pincodes?: string[]
  /** Typical door-to-door time shown to customers. */
  delivery_eta_minutes?: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  description: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  brand: string | null
  description: string | null
  image_url: string | null
  barcode: string | null
  sku: string | null
  hsn_code: string | null
  unit: string
  weight_volume: string | null
  mrp: number
  selling_price: number
  cost_price: number
  gst_rate: number
  stock_quantity: number
  min_stock_alert: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface CustomerAddress {
  id: string
  user_id: string
  name: string
  phone: string
  house_flat: string
  street_area: string
  landmark: string | null
  city: string
  pincode: string
  address_type: 'home' | 'work' | 'other'
  is_default: boolean
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

export interface Order {
  id: string
  order_number: number
  user_id: string | null
  order_type: OrderType
  status: OrderStatus
  subtotal: number
  delivery_charge: number
  discount_amount: number
  total_amount: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  payment_transaction_id: string | null
  shipping_name: string | null
  shipping_phone: string | null
  shipping_address: string | null
  shipping_city: string | null
  shipping_pincode: string | null
  notes: string | null
  cancelled_reason: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}
