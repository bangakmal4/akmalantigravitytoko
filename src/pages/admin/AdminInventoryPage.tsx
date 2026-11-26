import React, { useEffect, useState } from 'react'
import { Warehouse, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react'
import { ProductService } from '@/services/api'
import type { Product } from '@/types/database.types'

export const AdminInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const list = await ProductService.getAll({ includeInactive: true })
    setProducts(list)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdjustStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta)
    await ProductService.update(product.id, { stock: newStock })
    loadData()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Manajemen &amp; Kontrol Stok Fisik</h1>
        <p className="text-xs text-ink-muted mt-1">
          Pantau persediaan aksesoris HP &amp; Laptop, atur restock barang, dan cegah kehabisan stok.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-soft overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3">Nama Aksesoris</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Stok Saat Ini</th>
              <th className="px-5 py-3">Batas Minimum</th>
              <th className="px-5 py-3">Status Gudang</th>
              <th className="px-5 py-3 text-right">Penyesuaian Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => {
              const isOut = p.stock <= 0
              const isLow = p.stock > 0 && p.stock <= p.low_stock_threshold

              return (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 font-semibold text-navy">{p.name}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-500">{p.sku}</td>
                  <td className="px-5 py-3.5 font-bold text-base text-navy">{p.stock} unit</td>
                  <td className="px-5 py-3.5 text-slate-600">{p.low_stock_threshold} unit</td>
                  <td className="px-5 py-3.5">
                    {isOut ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                        HABIS TOTAL
                      </span>
                    ) : isLow ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        MENIPIS (PERLU RESTOCK)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        AMAN
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAdjustStock(p, -1)}
                        className="p-1 px-2 rounded bg-slate-100 hover:bg-slate-200 font-bold"
                        title="Kurangi 1"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleAdjustStock(p, 5)}
                        className="p-1 px-2.5 rounded bg-brand-blue text-white hover:bg-brand-blue-hover font-semibold"
                        title="Tambah Restock +5"
                      >
                        +5 Restock
                      </button>
                      <button
                        onClick={() => handleAdjustStock(p, 10)}
                        className="p-1 px-2.5 rounded bg-slate-800 text-white hover:bg-slate-900 font-semibold"
                        title="Tambah Restock +10"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
