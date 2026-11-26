import React, { useEffect, useState } from 'react'
import { Users, Search, Phone, Mail, MapPin } from 'lucide-react'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      if (!isSupabaseConfigured()) {
        const orders = JSON.parse(localStorage.getItem('tok_orders') || '[]')
        const custs = orders.map((o: any) => ({
          id: o.id,
          full_name: o.customer_name || 'Pelanggan',
          phone: o.customer_phone || '-',
          email: o.customer_email || '-',
          address: o.delivery_address || 'Ambil di Toko',
          created_at: o.created_at,
        }))
        setCustomers(custs)
      } else {
        const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
        setCustomers(data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase()
    return c.full_name?.toLowerCase().includes(q) || c.phone?.includes(q)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Direktori Pelanggan</h1>
        <p className="text-xs text-ink-muted mt-1">Data kontak pemesan aksesoris HP dan Laptop.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft">
        <input
          type="text"
          placeholder="Cari pelanggan berdasarkan nama atau no WhatsApp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-soft overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Nama Pelanggan</th>
              <th className="px-5 py-3">WhatsApp</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Alamat</th>
              <th className="px-5 py-3">Terdaftar Sejak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-3.5 font-bold text-navy">{c.full_name}</td>
                <td className="px-5 py-3.5 font-mono text-slate-600">{c.phone}</td>
                <td className="px-5 py-3.5 text-slate-500">{c.email || '-'}</td>
                <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{c.address || '-'}</td>
                <td className="px-5 py-3.5 text-slate-500">{formatDate(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
