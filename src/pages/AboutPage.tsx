import React from 'react'
import { ShieldCheck, Award, ThumbsUp, HeartHandshake } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-navy">Tentang Toko Akmal</h1>
        <p className="text-sm text-brand-orange font-semibold">
          Belanja lengkap, murah, terjangkau dan terpercaya.
        </p>
      </div>

      <div className="prose text-slate-600 text-sm leading-relaxed space-y-4">
        <p>
          <strong>Toko Akmal Accessories HP &amp; Laptop</strong> berdiri sebagai solusi bagi para pengguna smartphone dan komputer jinjing (laptop) yang membutuhkan perlengkapan aksesoris fungsional, tahan lama, dan bergaransi dengan harga yang tetap terjangkau.
        </p>
        <p>
          Kami menyediakan berbagai kategori produk pilihan mulai dari teknologi pengisian daya cepat (GaN Fast Charger, kabel Type-C PD 100W), pelindung fisik perangkat (tempered glass, case tahan benturan), audio berkualitas tinggi (TWS earphone latency rendah), hingga perlengkapan ergonomis laptop (stand aluminium, mouse nirkabel silent).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue mx-auto flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-navy text-sm">Kualitas Teruji</h3>
          <p className="text-xs text-slate-500">Seluruh produk melewati kontrol kualitas dan uji fungsi fisik sebelum dikirim.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange mx-auto flex items-center justify-center">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-navy text-sm">Harga Bersahabat</h3>
          <p className="text-xs text-slate-500">Harga bersaing dengan jaminan produk original tanpa kompromi performa.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-navy text-sm">Layanan Ramah</h3>
          <p className="text-xs text-slate-500">Bebas konsultasi spesifikasi kecocokan aksesoris langsung via WhatsApp toko.</p>
        </div>
      </div>
    </div>
  )
}
