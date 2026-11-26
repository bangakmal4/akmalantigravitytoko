export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded' | 'cancelled'
export type DeliveryMethod = 'pickup' | 'delivery'
export type PaymentMethod = 'manual_transfer' | 'cash_pickup'
export type DiscountType = 'percentage' | 'fixed_amount'
export type InventoryMovementType =
  | 'purchase_restock'
  | 'order_deduction'
  | 'order_cancellation_restore'
  | 'manual_adjustment'
  | 'damage_writeoff'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'staff'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StoreSettings {
  id: string
  store_name: string
  tagline: string
  logo_url: string | null
  store_description: string | null
  whatsapp_number: string
  email: string
  address: string
  opening_hours: string
  bank_name: string
  bank_account_number: string
  bank_account_holder: string
  qris_image_url: string | null
  shipping_cost: number
  pickup_instructions: string | null
  is_store_open: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  slug: string
  sku: string
  description: string | null
  specifications: Record<string, string> | null
  price: number
  sale_price: number | null
  stock: number
  low_stock_threshold: number
  main_image_url: string | null
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  category?: Category | null
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  created_at: string
}

export interface Customer {
  id: string
  full_name: string
  phone: string
  email: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export interface Promotion {
  id: string
  code: string
  discount_type: DiscountType
  discount_value: number
  minimum_order: number
  maximum_discount: number | null
  usage_limit: number | null
  usage_count: number
  start_date: string
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string | null
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  delivery_method: DeliveryMethod
  delivery_address: string | null
  subtotal: number
  discount_amount: number
  shipping_cost: number
  total: number
  customer_note: string | null
  promotion_code: string | null
  tracking_token_hash: string
  created_at: string
  updated_at: string
  customer?: Customer | null
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  subtotal: number
  created_at: string
}

export interface InventoryMovement {
  id: string
  product_id: string
  movement_type: InventoryMovementType
  quantity: number
  stock_before: number
  stock_after: number
  reason: string
  order_id: string | null
  actor_id: string | null
  created_at: string
  product?: Product | null
}

export interface AdminAuditLog {
  id: string
  actor_id: string | null
  actor_email: string | null
  action: string
  entity: string
  entity_id: string | null
  details: Record<string, any>
  ip_address: string | null
  created_at: string
}
