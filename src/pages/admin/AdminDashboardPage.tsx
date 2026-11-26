import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { ProductService, OrderService } from '@/services/api'
import { formatRupiah } from '@/lib/utils'

export const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodList, ordList] = await Promise.all([
          ProductService.getAll({ includeInactive: true }),
          OrderService.getAllAdminOrders(),
        ])
        setProducts(prodList)
        setOrders(ordList)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Calculate statistics with strict consistency
  const completedOrders = orders.filter((o) => o.status === 'completed')
  const totalCompletedSales = completedOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending')
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.low_stock_threshold)
  const outOfStockProducts = products.filter((p) => p.stock <= 0)

  // Chart data simulation / aggregation
  const chartData = [
    { name: 'Senin', penjualan: 420000 },
    { name: 'Selasa', penjualan: 680000 },
    { name: 'Rabu', penjualan: 510000 },
    { name: 'Kamis', penjualan: 890000 },
    { name: 'Jumat', penjualan: 1250000 },
    { name: 'Sabtu', penjualan: 1780000 },
    { name: 'Minggu', penjualan: 1450000 },
  ]

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Memuat statistik dashboard...</div>
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Ringkasan Operasional Toko</h1>
          <p className="text-xs text-ink-muted mt-1">
            Status real-time transaksi, inventaris produk, dan performa pesanan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Toko Aktif Menerima Pesanan
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Penjualan Sukses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-ink-muted tracking-wider">Total Penjualan Selesai</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-navy">{formatRupiah(totalCompletedSales)}</div>
            <div className="text-[11px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Berdasarkan transaksi berstatus completed
            </div>
          </div>
        </div>

        {/* Total Pesanan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-ink-muted tracking-wider">Total Pesanan</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-navy">{orders.length} Pesanan</div>
            <div className="text-[11px] text-ink-muted mt-1">
              {completedOrders.length} berhasil selesai
            </div>
          </div>
        </div>

        {/* Pesanan Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-ink-muted tracking-wider">Menunggu Diproses</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-brand-orange flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-orange">{pendingOrders.length} Pesanan</div>
            <div className="text-[11px] text-amber-700 mt-1 font-medium">
              Perlu konfirmasi &amp; validasi pembayaran
            </div>
          </div>
        </div>

        {/* Status Stok */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-ink-muted tracking-wider">Peringatan Stok</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-navy">
              {lowStockProducts.length + outOfStockProducts.length} Produk
            </div>
            <div className="text-[11px] text-rose-600 mt-1 font-medium">
              {outOfStockProducts.length} habis, {lowStockProducts.length} stok menipis
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-navy">Grafik Tren Penjualan Mingguan</h2>
            <p className="text-xs text-ink-muted">Estimasi volume omzet harian Toko Akmal</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                stroke="#CBD5E1"
                tickFormatter={(val) => `Rp${val / 1000}k`}
              />
              <Tooltip
                formatter={(value: any) => [formatRupiah(Number(value)), 'Penjualan']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
              />
              <Bar dataKey="penjualan" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy">Pesanan Terbaru Masuk</h2>
            <p className="text-xs text-ink-muted">Daftar pesanan pelanggan yang perlu ditindaklanjuti</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1"
          >
            Lihat Semua Pesanan <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">No. Pesanan</th>
                <th className="px-5 py-3">Pelanggan</th>
                <th className="px-5 py-3">Metode</th>
                <th className="px-5 py-3">Total Belanja</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    Belum ada data pesanan yang masuk.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 font-bold text-navy">{ord.order_number}</td>
                    <td className="px-5 py-3.5 text-slate-700">
                      {ord.customer?.full_name || ord.customer_name || 'Pelanggan'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="capitalize">{ord.delivery_method}</span> (
                      {ord.payment_method === 'cash_pickup' ? 'Tunai' : 'Transfer'})
                    </td>
                    <td className="px-5 py-3.5 font-bold text-navy">{formatRupiah(ord.total)}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="text-brand-blue hover:underline font-semibold"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
