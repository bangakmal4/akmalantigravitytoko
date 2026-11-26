import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { ProductService, CategoryService } from '@/services/api'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types/database.types'

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category_id: '',
    description: '',
    price: 0,
    sale_price: '',
    stock: 0,
    low_stock_threshold: 5,
    main_image_url: '',
    is_active: true,
    is_featured: false,
  })

  useEffect(() => {
    const init = async () => {
      const cats = await CategoryService.getAll()
      setCategories(cats)
      if (cats.length > 0 && !formData.category_id) {
        setFormData((prev) => ({ ...prev, category_id: cats[0].id }))
      }

      if (isEdit && id) {
        setLoading(true)
        const prod = await ProductService.getById(id)
        if (prod) {
          setFormData({
            name: prod.name,
            slug: prod.slug,
            sku: prod.sku,
            category_id: prod.category_id || (cats[0]?.id ?? ''),
            description: prod.description || '',
            price: prod.price,
            sale_price: prod.sale_price !== null ? String(prod.sale_price) : '',
            stock: prod.stock,
            low_stock_threshold: prod.low_stock_threshold,
            main_image_url: prod.main_image_url || '',
            is_active: prod.is_active,
            is_featured: prod.is_featured,
          })
        }
        setLoading(false)
      }
    }
    init()
  }, [id, isEdit])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: isEdit ? prev.slug : slugify(val),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        category_id: formData.category_id,
        description: formData.description,
        price: Number(formData.price),
        sale_price: formData.sale_price ? Number(formData.sale_price) : null,
        stock: Number(formData.stock),
        low_stock_threshold: Number(formData.low_stock_threshold),
        main_image_url: formData.main_image_url,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        specifications: {},
      }

      if (isEdit && id) {
        await ProductService.update(id, payload)
      } else {
        await ProductService.create(payload)
      }
      navigate('/admin/products')
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Produk
        </Link>
        <h1 className="text-xl font-bold text-navy">
          {isEdit ? 'Ubah Informasi Produk' : 'Tambah Produk Aksesoris Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Nama Produk Aksesoris *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Contoh: Adaptor Charger GaN 65W Multi-Port"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Slug URL *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">SKU / Kode Barang *</label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
              placeholder="Contoh: CHG-65W-GAN"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kategori Produk *</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">URL Foto Produk Utama</label>
            <input
              type="url"
              value={formData.main_image_url}
              onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Harga Normal (Rp) *</label>
            <input
              type="number"
              required
              min={0}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Harga Diskon/Promo (Rp)</label>
            <input
              type="number"
              min={0}
              value={formData.sale_price}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
              placeholder="Kosongkan jika tidak ada diskon"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Jumlah Stok Fisik *</label>
            <input
              type="number"
              required
              min={0}
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Ambang Batas Stok Menipis</label>
            <input
              type="number"
              min={0}
              value={formData.low_stock_threshold}
              onChange={(e) => setFormData({ ...formData, low_stock_threshold: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Deskripsi Lengkap &amp; Garansi</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi fitur, kompatibilitas perangkat, kelengkapan isi box..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-blue"
            ></textarea>
          </div>

          <div className="flex items-center gap-6 md:col-span-2 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded text-brand-blue"
              />
              Tampilkan Produk di Katalog Publik
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded text-brand-orange"
              />
              Tandai sebagai Produk Unggulan di Homepage
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Menyimpan...' : 'Simpan Produk'}
          </button>
        </div>
      </form>
    </div>
  )
}
