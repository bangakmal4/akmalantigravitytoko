import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Product, Category, StoreSettings, Promotion, Order } from '@/types/database.types'

// Mock fallback when Supabase is not yet connected to external instance
export const mockStoreSettings: StoreSettings = {
  id: 'mock-settings',
  store_name: 'Toko Akmal Accessories HP & Laptop',
  tagline: 'Belanja lengkap, murah, terjangkau dan terpercaya',
  logo_url: '/logo.svg',
  store_description: 'Pusat aksesoris smartphone dan laptop terlengkap, termurah, original dan bergaransi.',
  whatsapp_number: '6281234567890',
  email: 'kontak@tokoakmal.com',
  address: 'Pertokoan Niaga Utama Blok C No. 15, Jl. Pemuda Raya, Jakarta',
  opening_hours: 'Senin - Sabtu: 09:00 - 21:00 WIB, Minggu: 10:00 - 18:00 WIB',
  bank_name: 'BCA (Bank Central Asia)',
  bank_account_number: '7890123456',
  bank_account_holder: 'Akmal Hidayat',
  qris_image_url: null,
  shipping_cost: 15000,
  pickup_instructions: 'Tunjukkan nomor pesanan Anda saat mengambil paket di kasir Toko Akmal.',
  is_store_open: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockCategories: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Charger & Kabel',
    slug: 'charger-kabel',
    description: 'Fast charger, kabel data type-c, lightning, micro usb original.',
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Casing & Tempered Glass',
    slug: 'casing-tempered-glass',
    description: 'Pelindung layar anti gores spy, clear, matte, dan casing proteksi tinggi.',
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Audio & TWS',
    slug: 'audio-tws',
    description: 'Headset bluetooth, earphone gaming kabel, dan TWS bass jernih.',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Aksesoris Laptop',
    slug: 'aksesoris-laptop',
    description: 'Stand laptop aluminium, mouse wireless, keyboard, cooling pad.',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Powerbank & Baterai',
    slug: 'powerbank-baterai',
    description: 'Powerbank kapasitas 10.000 - 30.000 mAh support Quick Charge & PD.',
    image_url: 'https://images.unsplash.com/photo-1609592426507-285640733a87?w=600&auto=format&fit=crop&q=80',
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockProducts: Product[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Adaptor Fast Charger 65W GaN Multi-Port Type-C',
    slug: 'adaptor-fast-charger-65w-gan-multi-port',
    sku: 'CHG-65W-GAN',
    description: 'Kepala charger GaN 65W dengan 2 port USB-C dan 1 USB-A. Cocok untuk laptop MacBook, ultrabook, dan smartphone Samsung, iPhone, Xiaomi.',
    specifications: {
      Daya: '65 Watt',
      Port: '2x Type-C, 1x USB-A',
      Protokol: 'PD 3.0, QC 4.0',
      Garansi: '12 Bulan Resmi',
    },
    price: 185000,
    sale_price: 149000,
    stock: 25,
    low_stock_threshold: 5,
    main_image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: mockCategories[0],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Kabel Data Braided Type-C to Type-C 100W PD 1.5M',
    slug: 'kabel-data-braided-type-c-100w',
    sku: 'KBL-CC-100W',
    description: 'Kabel braided nylon anti putus mendukung transfer daya hingga 100 Watt serta transfer data berkecepatan 480 Mbps.',
    specifications: {
      Panjang: '1.5 Meter',
      'Arus Maksimal': '5A / 100W',
      Material: 'Braided Nylon',
      Garansi: '6 Bulan',
    },
    price: 49000,
    sale_price: 35000,
    stock: 60,
    low_stock_threshold: 10,
    main_image_url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: mockCategories[0],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    category_id: 'c1000000-0000-0000-0000-000000000003',
    name: 'TWS Earphone True Wireless Bluetooth 5.3 Low Latency',
    slug: 'tws-earphone-true-wireless-bluetooth-53',
    sku: 'AUD-TWS-530',
    description: 'Earphone nirkabel dengan koneksi Bluetooth 5.3 stabil, mode gaming latency rendah 45ms, dan ketahanan baterai total 28 jam bersama case.',
    specifications: {
      Bluetooth: 'Versi 5.3',
      Baterai: '5 Jam Playtime + 23 Jam Case',
      Fitur: 'Touch Control, ENC Noise Reduction',
      Garansi: '12 Bulan',
    },
    price: 179000,
    sale_price: 139000,
    stock: 30,
    low_stock_threshold: 6,
    main_image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: mockCategories[2],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000004',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Stand Laptop Ergonomis Aluminium Lipat 7 Sudut',
    slug: 'stand-laptop-ergonomis-aluminium-lipat',
    sku: 'LPT-STD-ALU',
    description: 'Penyangga laptop bahan aluminium alloy kokoh dengan 7 tingkat penyesuaian sudut ketinggian untuk postur tubuh ergonomis.',
    specifications: {
      Kompatibilitas: 'Laptop 11 - 17.3 Inci',
      Material: 'Full Aluminium Alloy',
      Bantalan: 'Silicone Anti-Slip',
      Fitur: 'Dapat Dilipat Masuk Tas',
    },
    price: 95000,
    sale_price: 75000,
    stock: 40,
    low_stock_threshold: 8,
    main_image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: mockCategories[3],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000005',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Powerbank Fast Charging 20000mAh 22.5W Digital Display',
    slug: 'powerbank-fast-charging-20000mah-225w',
    sku: 'PB-20K-225W',
    description: 'Powerbank kapasitas jumbo 20.000 mAh dengan LED display indikator persentase akurat. Mendukung fast charging VOOC, QC 3.0 dan PD.',
    specifications: {
      Kapasitas: '20.000 mAh',
      Output: 'USB-A 22.5W, Type-C 20W PD',
      Indikator: 'LED Real-time Digit Display',
      Garansi: '12 Bulan',
    },
    price: 220000,
    sale_price: 185000,
    stock: 18,
    low_stock_threshold: 4,
    main_image_url: 'https://images.unsplash.com/photo-1609592426507-285640733a87?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: mockCategories[4],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000006',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Mouse Wireless Silent Click Dual Mode 2.4G & Bluetooth',
    slug: 'mouse-wireless-silent-click-dual-mode',
    sku: 'MOU-SLNT-DM',
    description: 'Mouse senyap tanpa suara klik dengan koneksi fleksibel USB dongle 2.4G dan Bluetooth 5.0. Baterai isi ulang Type-C.',
    specifications: {
      DPI: '800/1200/1600 Adjustable',
      Koneksi: '2.4GHz + BT 5.0 Dual Mode',
      Baterai: 'Rechargeable 500mAh',
      Garansi: '6 Bulan',
    },
    price: 85000,
    sale_price: 69000,
    stock: 45,
    low_stock_threshold: 5,
    main_image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    is_active: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    category: mockCategories[3],
  },
]

// ==========================================
// STORE SETTINGS SERVICE
// ==========================================
export const StoreService = {
  async getSettings(): Promise<StoreSettings> {
    if (!isSupabaseConfigured()) {
      const local = localStorage.getItem('tok_settings')
      return local ? JSON.parse(local) : mockStoreSettings
    }
    const { data, error } = await supabase.from('store_settings').select('*').limit(1).maybeSingle()
    if (error || !data) return mockStoreSettings
    return data as StoreSettings
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<void> {
    if (!isSupabaseConfigured()) {
      const cur = await this.getSettings()
      const updated = { ...cur, ...settings, updated_at: new Date().toISOString() }
      localStorage.setItem('tok_settings', JSON.stringify(updated))
      return
    }
    const { error } = await supabase.from('store_settings').update(settings).eq('id', settings.id!)
    if (error) throw error
  },
}

// ==========================================
// CATEGORY SERVICE
// ==========================================
export const CategoryService = {
  async getAll(): Promise<Category[]> {
    if (!isSupabaseConfigured()) {
      const local = localStorage.getItem('tok_categories')
      return local ? JSON.parse(local) : mockCategories
    }
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const list = await this.getAll()
    return list.find((c) => c.slug === slug) || null
  },

  async create(payload: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    if (!isSupabaseConfigured()) {
      const list = await this.getAll()
      const newCat: Category = {
        ...payload,
        id: 'cat-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('tok_categories', JSON.stringify([...list, newCat]))
      return newCat
    }
    const { data, error } = await supabase.from('categories').insert(payload).select().single()
    if (error) throw error
    return data
  },

  async update(id: string, payload: Partial<Category>): Promise<Category> {
    if (!isSupabaseConfigured()) {
      const list = await this.getAll()
      const updatedList = list.map((c) => (c.id === id ? { ...c, ...payload, updated_at: new Date().toISOString() } : c))
      localStorage.setItem('tok_categories', JSON.stringify(updatedList))
      return updatedList.find((c) => c.id === id)!
    }
    const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const list = await this.getAll()
      localStorage.setItem('tok_categories', JSON.stringify(list.filter((c) => c.id !== id)))
      return
    }
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  },
}

// ==========================================
// PRODUCT SERVICE
// ==========================================
export const ProductService = {
  async getAll(options?: {
    categorySlug?: string
    search?: string
    featuredOnly?: boolean
    includeInactive?: boolean
  }): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      const local = localStorage.getItem('tok_products')
      let list: Product[] = local ? JSON.parse(local) : mockProducts

      if (!options?.includeInactive) {
        list = list.filter((p) => p.is_active && !p.deleted_at)
      }
      if (options?.featuredOnly) {
        list = list.filter((p) => p.is_featured)
      }
      if (options?.categorySlug) {
        const cat = mockCategories.find((c) => c.slug === options.categorySlug)
        if (cat) {
          list = list.filter((p) => p.category_id === cat.id)
        }
      }
      if (options?.search) {
        const q = options.search.toLowerCase()
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      }
      return list
    }

    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (!options?.includeInactive) {
      query = query.eq('is_active', true)
    }
    if (options?.featuredOnly) {
      query = query.eq('is_featured', true)
    }
    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`)
    }

    const { data, error } = await query
    if (error) throw error

    let result = (data as Product[]) || []
    if (options?.categorySlug) {
      result = result.filter((p) => p.category?.slug === options.categorySlug)
    }
    return result
  },

  async getBySlug(slug: string): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      const list = await this.getAll({ includeInactive: true })
      return list.find((p) => p.slug === slug) || null
    }
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .is('deleted_at', null)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async getById(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      const list = await this.getAll({ includeInactive: true })
      return list.find((p) => p.id === id) || null
    }
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async create(payload: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Product> {
    if (!isSupabaseConfigured()) {
      const list = await this.getAll({ includeInactive: true })
      const newProd: Product = {
        ...payload,
        id: 'prod-' + Date.now(),
        deleted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('tok_products', JSON.stringify([...list, newProd]))
      return newProd
    }
    const { data, error } = await supabase.from('products').insert(payload).select().single()
    if (error) throw error
    return data
  },

  async update(id: string, payload: Partial<Product>): Promise<Product> {
    if (!isSupabaseConfigured()) {
      const list = await this.getAll({ includeInactive: true })
      const updatedList = list.map((p) => (p.id === id ? { ...p, ...payload, updated_at: new Date().toISOString() } : p))
      localStorage.setItem('tok_products', JSON.stringify(updatedList))
      return updatedList.find((p) => p.id === id)!
    }
    const { data, error } = await supabase.from('products').update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async softDelete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const list = await this.getAll({ includeInactive: true })
      const updatedList = list.map((p) => (p.id === id ? { ...p, deleted_at: new Date().toISOString() } : p))
      localStorage.setItem('tok_products', JSON.stringify(updatedList))
      return
    }
    const { error } = await supabase.from('products').update({ deleted_at: new Date().toISOString(), is_active: false }).eq('id', id)
    if (error) throw error
  },
}

// ==========================================
// CHECKOUT & ORDER SERVICE
// ==========================================
export interface CheckoutPayload {
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerAddress?: string
  deliveryMethod: 'pickup' | 'delivery'
  paymentMethod: 'manual_transfer' | 'cash_pickup'
  customerNote?: string
  promoCode?: string
  items: Array<{ productId: string; quantity: number }>
}

export interface CheckoutResult {
  success: boolean
  order_number: string
  tracking_token: string
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export const OrderService = {
  async processCheckout(payload: CheckoutPayload): Promise<CheckoutResult> {
    if (!isSupabaseConfigured()) {
      // Offline / Pre-config local simulation
      const products = await ProductService.getAll({ includeInactive: true })
      let subtotal = 0
      for (const it of payload.items) {
        const prod = products.find((p) => p.id === it.productId)
        if (!prod || prod.stock < it.quantity) {
          throw new Error(`Stok tidak mencukupi untuk item: ${prod?.name || 'Produk'}`)
        }
        const effPrice = prod.sale_price !== null ? prod.sale_price : prod.price
        subtotal += effPrice * it.quantity
      }
      const shipping = payload.deliveryMethod === 'delivery' ? 15000 : 0
      const discount = payload.promoCode ? 10000 : 0
      const total = Math.max(0, subtotal - discount + shipping)
      const orderNumber = `AKM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
      const trackingToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      // Store in local storage orders
      const existing = JSON.parse(localStorage.getItem('tok_orders') || '[]')
      existing.unshift({
        id: 'ord-' + Date.now(),
        order_number: orderNumber,
        customer_name: payload.customerName,
        customer_phone: payload.customerPhone,
        status: 'pending',
        payment_method: payload.paymentMethod,
        payment_status: 'unpaid',
        delivery_method: payload.deliveryMethod,
        subtotal,
        discount_amount: discount,
        shipping_cost: shipping,
        total,
        customer_note: payload.customerNote,
        tracking_token: trackingToken,
        created_at: new Date().toISOString(),
        items: payload.items.map((it) => {
          const pr = products.find((p) => p.id === it.productId)
          return {
            product_name: pr?.name || 'Produk',
            product_sku: pr?.sku || '-',
            quantity: it.quantity,
            unit_price: pr?.sale_price || pr?.price || 0,
            subtotal: (pr?.sale_price || pr?.price || 0) * it.quantity,
          }
        }),
      })
      localStorage.setItem('tok_orders', JSON.stringify(existing))

      return {
        success: true,
        order_number: orderNumber,
        tracking_token: trackingToken,
        subtotal,
        discount,
        shipping,
        total,
      }
    }

    // Server-side atomic RPC via Supabase
    const { data, error } = await supabase.rpc('process_checkout', {
      p_customer_name: payload.customerName,
      p_customer_phone: payload.customerPhone,
      p_customer_email: payload.customerEmail || null,
      p_customer_address: payload.customerAddress || null,
      p_delivery_method: payload.deliveryMethod,
      p_payment_method: payload.paymentMethod,
      p_customer_note: payload.customerNote || null,
      p_promotion_code: payload.promoCode || null,
      p_items: payload.items.map((it) => ({
        product_id: it.productId,
        quantity: it.quantity,
      })),
    })

    if (error) {
      throw new Error(error.message)
    }

    return data as CheckoutResult
  },

  async trackOrder(orderNumber: string, trackingToken: string) {
    if (!isSupabaseConfigured()) {
      const orders = JSON.parse(localStorage.getItem('tok_orders') || '[]')
      const found = orders.find(
        (o: any) =>
          o.order_number.toUpperCase() === orderNumber.toUpperCase().trim() &&
          o.tracking_token === trackingToken.trim()
      )
      if (!found) {
        return { success: false, message: 'Pesanan tidak ditemukan atau token tidak sesuai.' }
      }
      return { success: true, order: found }
    }

    const { data, error } = await supabase.rpc('track_order', {
      p_order_number: orderNumber.trim(),
      p_tracking_token: trackingToken.trim(),
    })

    if (error) throw new Error(error.message)
    return data
  },

  async getAllAdminOrders(): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return JSON.parse(localStorage.getItem('tok_orders') || '[]')
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:customers(*), items:order_items(*)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async updateOrderStatus(orderId: string, status: string, paymentStatus: string) {
    if (!isSupabaseConfigured()) {
      const orders = JSON.parse(localStorage.getItem('tok_orders') || '[]')
      const updated = orders.map((o: any) =>
        o.id === orderId ? { ...o, status, payment_status: paymentStatus } : o
      )
      localStorage.setItem('tok_orders', JSON.stringify(updated))
      return { success: true }
    }

    const { data, error } = await supabase.rpc('admin_update_order_status', {
      p_order_id: orderId,
      p_status: status,
      p_payment_status: paymentStatus,
    })
    if (error) throw error
    return data
  },
}
