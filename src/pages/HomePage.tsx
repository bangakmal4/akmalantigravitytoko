import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Truck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductService, CategoryService } from '@/services/api'
import type { Product, Category } from '@/types/database.types'

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          ProductService.getAll({ featuredOnly: true }),
          CategoryService.getAll(),
        ])
        setFeaturedProducts(prods)
        setCategories(cats)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-slate-900 to-navy text-white py-16 sm:py-24">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-brand-orange">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pusat Aksesoris HP &amp; Laptop Terpercaya</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Belanja Lengkap, <span className="text-brand-blue">Murah</span>, &amp;{' '}
                <span className="text-brand-orange">Terpercaya.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Lengkapi kebutuhan gadget harian Anda dengan adaptor GaN, kabel braided tahan lama, earphone TWS, powerbank berkapasitas besar, stand laptop aluminium, dan pelindung layar bergaransi.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold shadow-lg shadow-brand-blue/30 transition flex items-center justify-center gap-2"
                >
                  Lihat Katalog Produk <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/track-order"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-orange" />
                  Lacak Pesanan Anda
                </Link>
              </div>

              {/* Badges / Micro Features */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Jaminan 100% Original</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-blue shrink-0" />
                  <span>Bisa Diantar / Ambil Toko</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Garansi Tukar Baru</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Mockup */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800/50 p-2">
                <img
                  src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1000&auto=format&fit=crop&q=80"
                  alt="Aksesoris HP & Laptop"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-navy/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Flash Promo Hari Ini</span>
                    <span className="text-xs font-bold text-white">Diskon s/d 25% Aksesoris Pilihan</span>
                  </div>
                  <span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-lg">
                    HOT DEAL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy">Kategori Produk</h2>
            <p className="text-xs text-ink-muted mt-1">Pilih aksesoris sesuai kategori perangkat Anda</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-premium hover:border-brand-blue transition duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 bg-slate-100">
                <img
                  src={cat.image_url || '/logo.svg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-navy group-hover:text-brand-blue transition line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" /> Paling Banyak Dicari
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy">Produk Unggulan &amp; Best Seller</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover flex items-center gap-1"
          >
            Katalog Lengkap <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-200 animate-pulse rounded-2xl aspect-[3/4]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Information / Store Pickup Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-premium">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/30">
              Layanan Fleksibel
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Pesan Online Sekarang, Ambil Langsung di Toko Tanpa Antre!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pilih opsi "Ambil di Toko" saat checkout untuk menyiapkan pesanan Anda terlebih dahulu. Bayar tunai di kasir saat paket sudah siap.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition shadow-md"
              >
                Mulai Belanja Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
