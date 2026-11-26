import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Zap,
  PhoneCall,
  Clock,
  Layers,
} from 'lucide-react'
import { ProductService } from '@/services/api'
import { formatRupiah } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types/database.types'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const load = async () => {
      if (!slug) return
      setLoading(true)
      const p = await ProductService.getBySlug(slug)
      setProduct(p)
      if (p) {
        const rel = await ProductService.getAll()
        setRelated(rel.filter((r) => r.id !== p.id).slice(0, 4))
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-slate-400 text-xs">Memuat detail produk...</div>
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy">Produk Tidak Ditemukan</h2>
        <Link to="/products" className="text-xs text-brand-blue font-semibold underline">
          &larr; Lihat Produk Lainnya
        </Link>
      </div>
    )
  }

  const isOutOfStock = product.stock <= 0
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price
  const effPrice = hasDiscount ? product.sale_price! : product.price
  const specs = product.specifications || {}

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-blue transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog Produk
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Product Image Gallery */}
        <div className="lg:col-span-5">
          <div className="aspect-square bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden p-2">
            <img
              src={product.main_image_url || '/logo.svg'}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Product Specifications & Buy Action */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold">
                SKU: {product.sku}
              </span>
              {product.category && (
                <span className="text-[11px] bg-blue-50 text-brand-blue px-2.5 py-0.5 rounded-md font-semibold">
                  {product.category.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">{product.name}</h1>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-navy">{formatRupiah(effPrice)}</span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">{formatRupiah(product.price)}</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>{product.description}</p>
            </div>
          )}

          {/* Specs Table */}
          {Object.keys(specs).length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-2 font-bold text-navy border-b border-slate-200">
                Spesifikasi &amp; Fitur
              </div>
              <div className="divide-y divide-slate-100">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="px-4 py-2.5 grid grid-cols-3">
                    <span className="font-semibold text-slate-600">{key}</span>
                    <span className="col-span-2 text-navy">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock & Quantity Controls */}
          <div className="space-y-4 pt-2">
            <div className="text-xs">
              <span className="font-medium text-slate-600">Status Ketersediaan: </span>
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold">Stok Habis</span>
              ) : (
                <span className="text-emerald-700 font-bold">Tersedia ({product.stock} unit)</span>
              )}
            </div>

            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-semibold text-navy">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => addItem(product, qty)}
                  className="flex-1 py-3 px-6 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Masukkan ke Keranjang Belanja
                </button>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Garansi Fisik &amp; Fungsi Toko</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange" />
              <span>Bisa Ambil Langsung di Toko</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <h2 className="text-xl font-bold text-navy">Aksesoris Terkait Lainnya</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
