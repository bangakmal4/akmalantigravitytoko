import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatRupiah } from '@/lib/utils'

export const CartPage: React.FC = () => {
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy">Keranjang Belanja Masih Kosong</h1>
          <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
            Yuk pilih aksesoris smartphone dan laptop favorit Anda di katalog Toko Akmal!
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-hover shadow-md transition"
        >
          Lihat Katalog Produk <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Keranjang Belanja</h1>
          <p className="text-xs text-ink-muted mt-1">Total {totalItems} item siap diproses checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition"
        >
          Kosongkan Keranjang
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden divide-y divide-slate-100">
          {items.map(({ product, quantity }) => {
            const effPrice = product.sale_price !== null ? product.sale_price : product.price
            const lineSubtotal = effPrice * quantity

            return (
              <div key={product.id} className="p-4 sm:p-5 flex items-center gap-4">
                <img
                  src={product.main_image_url || '/logo.svg'}
                  alt={product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-ink-muted font-mono uppercase">{product.sku}</div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-xs sm:text-sm font-semibold text-navy hover:text-brand-blue transition line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <div className="text-xs font-bold text-navy mt-1">{formatRupiah(effPrice)}</div>
                </div>

                {/* Qty Stepper */}
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-navy">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-bold text-navy">{formatRupiah(lineSubtotal)}</div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition mt-1"
                    title="Hapus Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary & Checkout CTA */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
          <h2 className="text-base font-bold text-navy">Ringkasan Pesanan</h2>

          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex justify-between text-slate-600 pt-2">
              <span>Total Item ({totalItems})</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-2">
              <span>Ongkos Kirim</span>
              <span className="text-[11px] text-slate-400">Dihitung saat checkout</span>
            </div>
            <div className="flex justify-between text-navy font-bold text-base pt-3">
              <span>Subtotal Belanja</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
          >
            Lanjut ke Form Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-slate-400">
            Tanpa perlu buat akun. Cepat, aman, &amp; praktis.
          </p>
        </div>
      </div>
    </div>
  )
}
