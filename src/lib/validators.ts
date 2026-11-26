import { z } from 'zod'

export const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama terlalu panjang'),
  whatsappNumber: z
    .string()
    .min(10, 'Nomor WhatsApp minimal 10 digit')
    .max(16, 'Nomor WhatsApp maksimal 16 digit')
    .regex(/^[0-9+]+$/, 'Format nomor WhatsApp tidak valid (hanya angka)'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  deliveryMethod: z.enum(['pickup', 'delivery']),
  deliveryAddress: z.string().optional(),
  paymentMethod: z.enum(['manual_transfer', 'cash_pickup']),
  customerNote: z.string().max(300, 'Catatan maksimal 300 karakter').optional(),
  promoCode: z.string().optional(),
}).refine(
  (data) => {
    if (data.deliveryMethod === 'delivery') {
      return !!data.deliveryAddress && data.deliveryAddress.trim().length >= 5
    }
    return true
  },
  {
    message: 'Alamat lengkap wajib diisi untuk pengiriman kurir',
    path: ['deliveryAddress'],
  }
)

export type CheckoutFormData = z.infer<typeof checkoutSchema>

export const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  slug: z.string().min(3, 'Slug produk minimal 3 karakter'),
  sku: z.string().min(2, 'SKU produk minimal 2 karakter'),
  category_id: z.string().min(1, 'Kategori harus dipilih'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Harga normal harus lebih dari 0'),
  sale_price: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Stok tidak boleh negatif'),
  low_stock_threshold: z.coerce.number().int().min(0, 'Ambang batas tidak boleh negatif'),
  main_image_url: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  specifications: z.record(z.string(), z.string()).optional(),
})

export type ProductFormData = z.infer<typeof productSchema>

export const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  slug: z.string().min(2, 'Slug minimal 2 karakter'),
  description: z.string().optional(),
  image_url: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
})

export type CategoryFormData = z.infer<typeof categorySchema>

export const promotionSchema = z.object({
  code: z.string().min(3, 'Kode promo minimal 3 karakter').toUpperCase(),
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.coerce.number().positive('Nilai diskon harus lebih dari 0'),
  minimum_order: z.coerce.number().min(0, 'Minimal belanja tidak boleh negatif'),
  maximum_discount: z.coerce.number().optional().nullable(),
  usage_limit: z.coerce.number().int().optional().nullable(),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
})

export type PromotionFormData = z.infer<typeof promotionSchema>

export const storeSettingsSchema = z.object({
  store_name: z.string().min(2, 'Nama toko minimal 2 karakter'),
  tagline: z.string().optional(),
  whatsapp_number: z.string().min(9, 'Nomor WhatsApp tidak valid'),
  email: z.string().email('Format email tidak valid'),
  address: z.string().min(5, 'Alamat wajib diisi'),
  opening_hours: z.string().min(3, 'Jam operasional wajib diisi'),
  bank_name: z.string().min(2, 'Nama bank wajib diisi'),
  bank_account_number: z.string().min(4, 'Nomor rekening wajib diisi'),
  bank_account_holder: z.string().min(2, 'Nama pemilik rekening wajib diisi'),
  qris_image_url: z.string().optional().nullable(),
  shipping_cost: z.coerce.number().min(0, 'Ongkos kirim tidak boleh negatif'),
  pickup_instructions: z.string().optional().nullable(),
  is_store_open: z.boolean().default(true),
})

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>
