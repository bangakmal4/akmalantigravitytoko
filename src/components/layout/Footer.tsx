import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, ShieldCheck, Truck, RefreshCw } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-slate-400 text-sm mt-20 border-t border-slate-800">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-800 py-10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Produk Terpercaya</h4>
              <p className="text-xs text-slate-400 mt-0.5">Semua aksesoris dicek fisik &amp; bergaransi toko</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Pickup &amp; Kirim Cepat</h4>
              <p className="text-xs text-slate-400 mt-0.5">Ambil langsung di toko atau kirim kurir ke alamat</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">Layanan Ramah</h4>
              <p className="text-xs text-slate-400 mt-0.5">Konsultasi kecocokan aksesoris langsung via WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Toko Akmal" className="w-8 h-8 rounded-lg" />
            <span className="text-lg font-bold text-white tracking-wide">
              TOKO <span className="text-brand-blue">AKMAL</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Pusat aksesoris HP dan Laptop terlengkap, murah, terjangkau, dan terpercaya. Memberikan solusi kebutuhan gadget harian Anda.
          </p>
          <p className="text-xs text-slate-400">
            Tagline: <em className="text-slate-300">"Belanja lengkap, murah, terjangkau dan terpercaya."</em>
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Menu Utama</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-brand-blue transition">Beranda</Link></li>
            <li><Link to="/products" className="hover:text-brand-blue transition">Katalog Produk</Link></li>
            <li><Link to="/cart" className="hover:text-brand-blue transition">Keranjang Belanja</Link></li>
            <li><Link to="/track-order" className="hover:text-brand-blue transition text-brand-orange">Lacak Pesanan</Link></li>
            <li><Link to="/about" className="hover:text-brand-blue transition">Tentang Kami</Link></li>
            <li><Link to="/contact" className="hover:text-brand-blue transition">Hubungi Kami</Link></li>
          </ul>
        </div>

        {/* Legal & Policy */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Bantuan &amp; Kebijakan</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/privacy-policy" className="hover:text-brand-blue transition">Kebijakan Privasi</Link></li>
            <li><Link to="/terms" className="hover:text-brand-blue transition">Syarat &amp; Ketentuan</Link></li>
            <li><Link to="/contact" className="hover:text-brand-blue transition">Cara Pengambilan Toko</Link></li>
            <li><Link to="/admin/login" className="hover:text-slate-200 transition text-slate-400">Portal Admin Staf</Link></li>
          </ul>
        </div>

        {/* Store Info & Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Informasi Toko</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
              <span>Pertokoan Niaga Utama Blok C No. 15, Jl. Pemuda Raya, Indonesia</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-white">
                0812-3456-7890 (WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-blue shrink-0" />
              <span>kontak@tokoakmal.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>09:00 - 21:00 WIB Setiap Hari</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Toko Akmal Accessories HP &amp; Laptop. Seluruh hak cipta dilindungi.</p>
      </div>
    </footer>
  )
}
