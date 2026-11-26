import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { ProductService, CategoryService } from '@/services/api'
import { formatRupiah } from '@/lib/utils'
import type { Product, Category } from '@/types/database.types'

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [p, c] = await Promise.all([
        ProductService.getAll({ includeInactive: true }),
        CategoryService.getAll(),
      ])
      setProducts(p)
      setCategories(c)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menonaktifkan/hapus produk "${name}"?`)) {
      await ProductService.softDelete(id)
      await loadData()
    }
  }

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Manajemen Produk</h1>
          <p className="text-xs text-ink-muted mt-1">
            Kelola katalog aksesoris HP dan Laptop, harga promo, serta stok gudang.
          </p>
        </div>
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Tambah Produk Baru
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama produk atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-blue"
          />
        </div>
        <div className="text-xs text-ink-muted">
          Total: <strong className="text-navy">{filtered.length}</strong> produk
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Produk</th>
                <th className="px-5 py-3">SKU</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Harga Normal / Promo</th>
                <th className="px-5 py-3">Stok</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Memuat daftar produk...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Tidak ada produk yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const cat = categories.find((c) => c.id === prod.category_id)
                  const isLow = prod.stock > 0 && prod.stock <= prod.low_stock_threshold
                  const isOut = prod.stock <= 0

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.main_image_url || '/logo.svg'}
                            alt={prod.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-navy line-clamp-1">{prod.name}</div>
                            {prod.is_featured && (
                              <span className="text-[10px] text-brand-orange font-bold uppercase">
                                ★ Produk Unggulan
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-600">{prod.sku}</td>
                      <td className="px-5 py-3.5 text-slate-600">{cat?.name || '-'}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-navy">
                          {formatRupiah(prod.sale_price !== null ? prod.sale_price : prod.price)}
                        </div>
                        {prod.sale_price !== null && (
                          <div className="text-[10px] text-slate-400 line-through">
                            {formatRupiah(prod.price)}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`font-semibold ${
                            isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-700'
                          }`}
                        >
                          {prod.stock} unit
                        </span>
                        {isOut && <span className="block text-[10px] text-rose-500">Habis</span>}
                        {isLow && <span className="block text-[10px] text-amber-500">Menipis</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        {prod.is_active && !prod.deleted_at ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-semibold">
                            <Eye className="w-3.5 h-3.5" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] font-semibold">
                            <EyeOff className="w-3.5 h-3.5" /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${prod.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-brand-blue hover:bg-slate-100"
                            title="Edit Produk"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
