import React from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom'
import { CheckCircle2, Copy, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation()
  const state = location.state as { orderNumber: string; trackingToken: string; total: number } | undefined

  if (!state?.orderNumber) {
    return <Navigate to="/" replace />
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Kode berhasil disalin ke clipboard!')
  }

  const waMessage = `Halo Toko Akmal, saya sudah membuat pesanan dengan No. Pesanan ${state.orderNumber}. Mohon bantuannya untuk proses selanjutnya. Terima kasih!`
  const waUrl = `https://wa.me/6282369310034?text=${encodeURIComponent(waMessage)}`

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-8 text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Pesanan Berhasil Dibuat!</h1>
        <p className="text-xs sm:text-sm text-ink-muted mt-2">
          Terima kasih telah berbelanja di Toko Akmal Accessories HP &amp; Laptop.
        </p>
      </div>

      {/* Order Credentials Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-soft text-left space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-xs text-slate-500 font-semibold uppercase">Nomor Pesanan</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-navy text-sm">{state.orderNumber}</span>
            <button
              onClick={() => copyToClipboard(state.orderNumber)}
              className="text-brand-blue hover:text-brand-blue-hover"
              title="Salin No. Pesanan"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-xs text-slate-500 font-semibold uppercase">Token Pelacakan</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
              {state.trackingToken}
            </span>
            <button
              onClick={() => copyToClipboard(state.trackingToken)}
              className="text-brand-blue hover:text-brand-blue-hover"
              title="Salin Token"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Tagihan</span>
          <span className="text-lg font-extrabold text-navy">{formatRupiah(state.total)}</span>
        </div>
      </div>

      {/* Important instructions */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left leading-relaxed">
        <strong>PENTING:</strong> Simpan <em>Nomor Pesanan</em> dan <em>Token Pelacakan</em> di atas. Anda dapat menggunakan keduanya untuk mengecek progres status pesanan kapan saja di halaman <strong>Lacak Pesanan</strong>.
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
        >
          <MessageSquare className="w-4 h-4" /> Konfirmasi ke WhatsApp Toko
        </a>
        <Link
          to={`/track-order?order=${state.orderNumber}&token=${state.trackingToken}`}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-brand-orange" /> Buka Halaman Pelacakan
        </Link>
      </div>
    </div>
  )
}
