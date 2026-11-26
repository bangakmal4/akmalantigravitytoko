import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ShieldCheck, Search, Clock, CheckCircle2, Truck, AlertCircle, ArrowLeft } from 'lucide-react'
import { OrderService } from '@/services/api'
import { formatRupiah, formatDate } from '@/lib/utils'

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialOrder = searchParams.get('order') || ''
  const initialToken = searchParams.get('token') || ''

  const [orderNumber, setOrderNumber] = useState(initialOrder)
  const [trackingToken, setTrackingToken] = useState(initialToken)
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!orderNumber.trim() || !trackingToken.trim()) {
      setErrorMsg('Harap masukkan Nomor Pesanan dan Token Pelacakan dengan lengkap.')
      return
    }

    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await OrderService.trackOrder(orderNumber, trackingToken)
      if (res.success && res.order) {
        setResult(res.order)
      } else {
        setErrorMsg(res.message || 'Data pesanan tidak ditemukan atau token tidak sesuai.')
        setResult(null)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat melacak pesanan.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialOrder && initialToken) {
      handleTrack()
    }
  }, [initialOrder, initialToken])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> Pelacakan Pesanan Aman
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Lacak Status Pesanan Anda</h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          Pantau progres persiapan paket kurir dan kesiapan pengambilan di Toko Akmal.
        </p>
      </div>

      {/* Tracking Search Box */}
      <form onSubmit={handleTrack} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Nomor Pesanan *</label>
            <input
              type="text"
              required
              placeholder="Contoh: AKM-20261126-1234"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono uppercase focus:outline-none focus:border-brand-blue"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">Token Pelacakan Rahasia *</label>
            <input
              type="text"
              required
              placeholder="Masukkan token dari nota pesanan"
              value={trackingToken}
              onChange={(e) => setTrackingToken(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono focus:outline-none focus:border-brand-blue"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> {loading ? 'Memeriksa Database...' : 'Cek Status Pesanan'}
        </button>
      </form>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {result && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-2">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Nomor Pesanan</span>
              <div className="text-lg font-bold text-navy">{result.order_number}</div>
              <div className="text-[11px] text-slate-500">{formatDate(result.created_at)}</div>
            </div>
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  result.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : result.status === 'cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                Status: {result.status}
              </span>
            </div>
          </div>

          {/* Delivery & Payment Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-500 block text-[10px]">Metode Antar</span>
              <strong className="capitalize text-navy">{result.delivery_method}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-slate-500 block text-[10px]">Metode Bayar</span>
              <strong className="text-navy">
                {result.payment_method === 'cash_pickup' ? 'Tunai di Kasir' : 'Transfer BCA'}
              </strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[10px]">Status Bayar</span>
              <strong className="capitalize text-navy">{result.payment_status}</strong>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">Barang yang Dipesan:</h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
              {result.items?.map((it: any, idx: number) => (
                <div key={idx} className="p-3 flex justify-between">
                  <div>
                    <div className="font-semibold text-navy">{it.product_name}</div>
                    <div className="text-[10px] text-slate-400">
                      SKU: {it.product_sku} | {it.quantity} x {formatRupiah(it.unit_price)}
                    </div>
                  </div>
                  <div className="font-bold text-navy">{formatRupiah(it.subtotal)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="pt-2 border-t text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatRupiah(result.subtotal)}</span>
            </div>
            {result.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Diskon Promo</span>
                <span>-{formatRupiah(result.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Ongkos Kirim</span>
              <span>{formatRupiah(result.shipping_cost)}</span>
            </div>
            <div className="flex justify-between text-navy font-bold text-base pt-2 border-t">
              <span>Total Pesanan</span>
              <span className="text-brand-blue">{formatRupiah(result.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
