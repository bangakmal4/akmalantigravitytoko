import React, { useState } from 'react'
import { Tag, Plus } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

export const AdminPromotionsPage: React.FC = () => {
  const [promos] = useState([
    {
      code: 'AKMALHEMAT',
      type: 'percentage',
      value: 10,
      min: 100000,
      max: 25000,
      usage: '12 / 500',
      active: true,
    },
    {
      code: 'AKMALKILAT',
      type: 'fixed_amount',
      value: 20000,
      min: 150000,
      max: null,
      usage: '4 / 200',
      active: true,
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Voucher &amp; Diskon Promosi</h1>
        <p className="text-xs text-ink-muted mt-1">Kelola kode diskon promosi untuk pembeli aksesoris.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-soft overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Kode Kupon</th>
              <th className="px-5 py-3">Tipe Potongan</th>
              <th className="px-5 py-3">Nilai Diskon</th>
              <th className="px-5 py-3">Minimal Belanja</th>
              <th className="px-5 py-3">Penggunaan</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {promos.map((p) => (
              <tr key={p.code} className="hover:bg-slate-50/70">
                <td className="px-5 py-3.5 font-bold font-mono text-brand-blue">{p.code}</td>
                <td className="px-5 py-3.5 capitalize">{p.type === 'percentage' ? 'Persentase' : 'Nominal Tetap'}</td>
                <td className="px-5 py-3.5 font-bold text-navy">
                  {p.type === 'percentage' ? `${p.value}%` : formatRupiah(p.value)}
                </td>
                <td className="px-5 py-3.5">{formatRupiah(p.min)}</td>
                <td className="px-5 py-3.5 font-mono">{p.usage}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Aktif
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
