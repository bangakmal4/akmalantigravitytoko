import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { OrderService } from '@/services/api'
import { formatRupiah, formatDate } from '@/lib/utils'

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    setLoading(true)
    const list = await OrderService.getAllAdminOrders()
    setOrders(list)
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (id: string, newStatus: string, payStatus: string) => {
    await OrderService.updateOrderStatus(id, newStatus, payStatus)
    loadOrders()
  }

  const filtered = orders.filter((o) => {
    if (filterStatus === 'all') return true
    return o.status === filterStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Kelola Pesanan Masuk</h1>
          <p className="text-xs text-ink-muted mt-1">
            Pantau dan perbarui status pesanan kurir antar serta pengambilan langsung di toko.
          </p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                filterStatus === st
                  ? 'bg-brand-blue text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-soft overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">No. Pesanan</th>
              <th className="px-5 py-3">Tanggal</th>
              <th className="px-5 py-3">Pelanggan</th>
              <th className="px-5 py-3">Metode Antar / Bayar</th>
              <th className="px-5 py-3">Total Transaksi</th>
              <th className="px-5 py-3">Status Pesanan</th>
              <th className="px-5 py-3">Status Bayar</th>
              <th className="px-5 py-3 text-right">Ubah Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                  Memuat daftar pesanan...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                  Tidak ada pesanan pada kategori status ini.
                </td>
              </tr>
            ) : (
              filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-bold text-navy">{ord.order_number}</td>
                  <td className="px-5 py-3.5 text-slate-500">{formatDate(ord.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-navy">
                      {ord.customer?.full_name || ord.customer_name || 'Pelanggan'}
                    </div>
                    <div className="text-[10px] text-slate-500">{ord.customer?.phone || ord.customer_phone}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="capitalize font-medium">{ord.delivery_method}</span>
                    <span className="block text-[10px] text-slate-500">
                      {ord.payment_method === 'cash_pickup' ? 'Bayar di Kasir' : 'Transfer Manual'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-navy">{formatRupiah(ord.total)}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ord.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : ord.status === 'processing'
                          ? 'bg-blue-100 text-brand-blue'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ord.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ord.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        handleStatusChange(
                          ord.id,
                          e.target.value,
                          e.target.value === 'completed' ? 'paid' : ord.payment_status
                        )
                      }
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="ready_for_pickup">Ready for Pickup</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
