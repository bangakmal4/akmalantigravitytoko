import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, ShieldCheck, MapPin, PhoneCall } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-navy text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Toko Buka Setiap Hari (09:00 - 21:00 WIB)</span>
            <span className="hidden md:inline">| Garansi Produk Original &amp; Terpercaya</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <Link to="/track-order" className="hover:text-white flex items-center gap-1 font-medium transition">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
              Lacak Pesanan
            </Link>
            <span className="hidden md:inline text-slate-600">|</span>
            <a
              href="https://wa.me/6282369310034"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 hover:text-white"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              CS WhatsApp: 0823-6931-0034
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Store Identity */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.svg" alt="Toko Akmal Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm" />
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-navy block leading-tight">
                TOKO <span className="text-brand-blue">AKMAL</span>
              </span>
              <span className="text-[10px] text-ink-muted font-medium block uppercase tracking-wider">
                Accessories HP &amp; Laptop
              </span>
            </div>
          </Link>

          {/* Search Form (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg items-center relative"
          >
            <input
              type="text"
              placeholder="Cari charger, tempered glass, audio, stand laptop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-ink text-sm rounded-full pl-4 pr-10 py-2.5 border border-transparent focus:border-brand-blue focus:bg-white focus:outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-3 text-slate-400 hover:text-brand-blue transition"
              title="Cari Produk"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Nav Links & Cart Action */}
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
              <Link to="/products" className="hover:text-brand-blue transition">Semua Produk</Link>
              <Link to="/category/charger-kabel" className="hover:text-brand-blue transition">Charger</Link>
              <Link to="/category/audio-tws" className="hover:text-brand-blue transition">Audio</Link>
              <Link to="/category/aksesoris-laptop" className="hover:text-brand-blue transition">Laptop</Link>
              <Link to="/about" className="hover:text-brand-blue transition">Tentang Kami</Link>
            </nav>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-slate-100 hover:bg-brand-blue hover:text-white text-navy transition duration-200"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="flex relative">
            <input
              type="text"
              placeholder="Cari aksesoris hp &amp; laptop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-ink text-sm rounded-lg pl-4 pr-10 py-2 border border-slate-200 focus:outline-none focus:border-brand-blue"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu Flyout */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-blue"
          >
            Katalog Semua Produk
          </Link>
          <Link
            to="/category/charger-kabel"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-blue"
          >
            Charger &amp; Kabel Fast Charging
          </Link>
          <Link
            to="/category/casing-tempered-glass"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-blue"
          >
            Casing &amp; Tempered Glass
          </Link>
          <Link
            to="/category/audio-tws"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-blue"
          >
            Audio &amp; Headset TWS
          </Link>
          <Link
            to="/category/aksesoris-laptop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-blue"
          >
            Aksesoris Laptop &amp; Komputer
          </Link>
          <Link
            to="/category/powerbank-baterai"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-blue"
          >
            Powerbank &amp; Baterai
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-brand-orange flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Cek Status Pesanan
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-slate-600"
            >
              Tentang Toko Akmal
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-slate-600"
            >
              Kontak &amp; Lokasi Toko
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
