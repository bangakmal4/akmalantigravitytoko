import React from 'react'
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react'

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-navy">Hubungi Toko Akmal</h1>
        <p className="text-xs sm:text-sm text-ink-muted">
          Kami siap melayani pertanyaan seputar aksesoris HP &amp; Laptop serta pemesanan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-soft space-y-6">
          <h2 className="text-base font-bold text-navy">Informasi Toko Fisik &amp; Layanan</h2>

          <div className="space-y-4 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <strong className="text-navy block">Alamat Toko:</strong>
                Pertokoan Niaga Utama Blok C No. 15, Jl. Pemuda Raya, Indonesia
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-navy block">WhatsApp / Telepon:</strong>
                0823-6931-0034
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-blue shrink-0" />
              <div>
                <strong className="text-navy block">Email Resmi:</strong>
                kontak@tokoakmal.com
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <strong className="text-navy block">Jam Operasional:</strong>
                Senin - Minggu: 09:00 - 21:00 WIB
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/6282369310034?text=Halo%20Toko%20Akmal,%20saya%20ingin%20tanya%20produk%20aksesoris"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
          >
            <MessageSquare className="w-4 h-4" /> Chat Langsung via WhatsApp
          </a>
        </div>

        {/* Pickup Guidance */}
        <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 text-xs space-y-4 text-slate-700 leading-relaxed">
          <h3 className="font-bold text-navy text-sm">Panduan Pengambilan Pesanan di Toko (Pickup)</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Lakukan pemesanan di website dan pilih metode <strong>"Ambil di Toko Fisik"</strong>.</li>
            <li>Simpan <strong>Nomor Pesanan</strong> yang muncul di halaman Order Success.</li>
            <li>Datang ke kasir Toko Akmal dan tunjukkan nomor pesanan tersebut kepada staf kami.</li>
            <li>Periksa kelengkapan aksesoris langsung di tempat dan lakukan pembayaran tunai (jika memilih opsi tunai).</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
