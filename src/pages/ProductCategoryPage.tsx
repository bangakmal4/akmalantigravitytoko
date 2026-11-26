import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductService, CategoryService } from '@/services/api'
import type { Product, Category } from '@/types/database.types'

export const ProductCategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!slug) return
      setLoading(true)
      const cat = await CategoryService.getBySlug(slug)
      setCategory(cat)
      if (cat) {
        const prods = await ProductService.getAll({ categorySlug: slug })
        setProducts(prods)
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return <div className="max-w-7xl mx-auto p-8 text-xs text-slate-400">Memuat kategori...</div>
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-navy">Kategori Tidak Ditemukan</h2>
        <Link to="/products" className="text-xs text-brand-blue font-semibold underline">
          Kembali ke Semua Produk
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-blue transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-soft">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">{category.name}</h1>
        {category.description && (
          <p className="text-xs sm:text-sm text-ink-muted mt-2 max-w-2xl">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  )
}
