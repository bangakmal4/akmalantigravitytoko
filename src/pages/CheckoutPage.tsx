import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShieldCheck,
  Truck,
  Store,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { OrderService } from '@/services/api'
import { formatRupiah } from '@/lib/utils'

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [email, setEmail] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'manual_transfer' | 'cash_pickup'>('manual_transfer')
  const [customerNote, setCustomerNote] = useState('')
  const [promoCode, setPromoCode] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const shippingCost = deliveryMethod === 'delivery' ? 15000 : 0
  const estimatedTotal = subtotal + shippingCost

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy">Keranjang Anda Masih Kosong</h2>
        <Link to="/products" className="text-xs text-brand-blue font-semibold underline">
          &larr; Kembali ke Katalog
        </Link>
      </div>
    )
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      if (deliveryMethod === 'delivery' && (!deliveryAddress || deliveryAddress.trim().length < 5)) {
        throw new Error('Alamat pengiriman lengkap wajib diisi untuk kurir antar.')
      }

      const res = await OrderService.processCheckout({
        customerName,
        customerPhone: whatsappNumber,
        customerEmail: email || undefined,
        customerAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
        deliveryMethod,
        paymentMethod,
        customerNote: customerNote || undefined,
        promoCode: promoCode || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      })

      if (res.success) {
        clearCart()
        navigate('/order-success', {
          state: {
            orderNumber: res.order_number,
            trackingToken: res.tracking_token,
            total: res.total,
          },
        })
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses pesanan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Checkout Pemesanan</h1>
        <p className="text-xs text-ink-muted mt-1">
          Lengkapi data pemesan tanpa perlu membuat akun pendaftaran.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Data Pemesan */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-6">
          {/* 1. Identitas Pemesan */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-navy uppercase tracking-wider border-b pb-2">
              1. Identitas Pemesan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nomor WhatsApp Aktif *</label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-brand-blue"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Email (Opsional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* 2. Metode Pengiriman */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-navy uppercase tracking-wider border-b pb-2">
              2. Metode Pengiriman
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label
                className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                  deliveryMethod === 'pickup'
                    ? 'border-brand-blue bg-blue-50/40 text-navy'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => {
                    setDeliveryMethod('pickup')
                    setPaymentMethod('manual_transfer')
                  }}
                  className="text-brand-blue"
                />
                <Store className="w-5 h-5 text-brand-blue shrink-0" />
                <div>
                  <div className="font-bold">Ambil di Toko Fisik</div>
                  <div className="text-[11px] text-slate-500">Gratis ongkir (Siap ambil di kasir)</div>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                  deliveryMethod === 'delivery'
                    ? 'border-brand-blue bg-blue-50/40 text-navy'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={() => {
                    setDeliveryMethod('delivery')
                    setPaymentMethod('manual_transfer')
                  }}
                  className="text-brand-blue"
                />
                <Truck className="w-5 h-5 text-brand-orange shrink-0" />
                <div>
                  <div className="font-bold">Kirim ke Alamat Kurir</div>
                  <div className="text-[11px] text-slate-500">Tarif tetap Rp 15.000</div>
                </div>
              </label>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="text-xs pt-2">
                <label className="block font-medium text-slate-700 mb-1">
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  rows={3}
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Nama jalan, RT/RW, nomor rumah, patokan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-brand-blue"
                ></textarea>
              </div>
            )}
          </div>

          {/* 3. Metode Pembayaran */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-navy uppercase tracking-wider border-b pb-2">
              3. Metode Pembayaran
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label
                className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                  paymentMethod === 'manual_transfer'
                    ? 'border-brand-blue bg-blue-50/40 text-navy'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="manual_transfer"
                  checked={paymentMethod === 'manual_transfer'}
                  onChange={() => setPaymentMethod('manual_transfer')}
                  className="text-brand-blue"
                />
                <CreditCard className="w-5 h-5 text-brand-blue shrink-0" />
                <div>
                  <div className="font-bold">Transfer Bank BCA</div>
                  <div className="text-[11px] text-slate-500">Upload bukti saat konfirmasi WhatsApp</div>
                </div>
              </label>

              {deliveryMethod === 'pickup' && (
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === 'cash_pickup'
                      ? 'border-brand-blue bg-blue-50/40 text-navy'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_pickup"
                    checked={paymentMethod === 'cash_pickup'}
                    onChange={() => setPaymentMethod('cash_pickup')}
                    className="text-brand-blue"
                  />
                  <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold">Bayar Tunai di Kasir</div>
                    <div className="text-[11px] text-slate-500">Bayar saat ambil barang di toko</div>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div className="text-xs">
            <label className="block font-medium text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="Misal: titip di satpam / packing ekstra buble wrap"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Ringkasan Belanja Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 space-y-4">
          <h2 className="text-base font-bold text-navy">Item Pesanan ({items.length})</h2>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="py-2.5 flex justify-between gap-2">
                <div>
                  <div className="font-medium text-navy line-clamp-1">{product.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {quantity} x {formatRupiah(product.sale_price || product.price)}
                  </div>
                </div>
                <div className="font-bold text-navy shrink-0">
                  {formatRupiah((product.sale_price || product.price) * quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code Input */}
          <div className="pt-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Kode Voucher Diskon</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="AKMALHEMAT"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono uppercase focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-xs pt-3 border-t border-slate-100 divide-y divide-slate-100">
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Subtotal Produk</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-2">
              <span>Ongkos Pengiriman</span>
              <span>{shippingCost === 0 ? 'Gratis' : formatRupiah(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-navy font-bold text-base pt-3">
              <span>Total Pembayaran</span>
              <span className="text-brand-blue">{formatRupiah(estimatedTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Memvalidasi Pesanan...' : 'Konfirmasi & Buat Pesanan'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
