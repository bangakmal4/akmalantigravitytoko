import React from 'react'
import { BarChart3, TrendingUp, Download } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Laporan &amp; Analisis Penjualan</h1>
          <p className="text-xs text-ink-muted mt-1">
            Rekapitulasi omzet dan performa penjualan produk aksesoris HP dan Laptop.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs text-slate-500 font-semibold uppercase">Omzet Bulan Ini</span>
          <div className="text-2xl font-bold text-navy mt-2">{formatRupiah(14850000)}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Berdasarkan order status completed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Transaksi Selesai</span>
          <div className="text-2xl font-bold text-navy mt-2">128 Transaksi</div>
          <span className="text-[11px] text-brand-blue font-medium">Rata-rata Rp 116.000 / transaksi</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <span className="text-xs text-slate-500 font-semibold uppercase">Kategori Terlaris</span>
          <div className="text-2xl font-bold text-navy mt-2">Charger &amp; Kabel</div>
          <span className="text-[11px] text-brand-orange font-medium">Menyumbang 42% total penjualan</span>
        </div>
      </div>
    </div>
  )
}
