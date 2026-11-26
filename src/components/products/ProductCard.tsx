import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Star, Zap } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/types/database.types'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart()
  const isOutOfStock = product.stock <= 0
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price
  const effectivePrice = hasDiscount ? product.sale_price! : product.price
  const discountPercent = hasDiscount ? Math.round(((product.price - product.sale_price!) / product.price) * 100) : 0

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {hasDiscount && (
          <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 fill-current" /> Hemat {discountPercent}%
          </span>
        )}
        {product.is_featured && (
          <span className="bg-brand-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Favorit
          </span>
        )}
      </div>

      {/* Image Gallery Link */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.main_image_url || '/logo.svg'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Stok Habis
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-ink-muted mb-1 font-mono uppercase tracking-wider">
            {product.sku}
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-semibold text-navy hover:text-brand-blue line-clamp-2 transition leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm sm:text-base font-bold text-navy">
              {formatRupiah(effectivePrice)}
            </div>
            {hasDiscount && (
              <div className="text-[10px] text-slate-400 line-through">
                {formatRupiah(product.price)}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => addItem(product, 1)}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="p-2.5 rounded-xl bg-brand-blue-light hover:bg-brand-blue text-brand-blue hover:text-white transition duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
