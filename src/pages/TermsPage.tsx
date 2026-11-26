import React from 'react'

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-xs text-slate-600 leading-relaxed">
      <h1 className="text-2xl font-extrabold text-navy">Syarat &amp; Ketentuan</h1>
      <p className="text-ink-muted">Terakhir diperbarui: 26 November 2026</p>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-navy">1. Ketentuan Pemesanan</h2>
        <p>
          Pemesanan di Toko Akmal Accessories HP &amp; Laptop dapat dilakukan tanpa pendaftaran akun. Pelanggan wajib memberikan nomor WhatsApp yang valid agar staf kami dapat mengonfirmasi ketersediaan barang.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-navy">2. Harga &amp; Ketersediaan Stok</h2>
        <p>
          Harga dan stok diverifikasi secara server-side pada database kami saat checkout dilakukan untuk mencegah overselling.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-navy">3. Kebijakan Garansi Toko</h2>
        <p>
          Produk aksesoris elektronik (adaptor charger, TWS, powerbank) memiliki garansi fungsional toko. Pelanggan wajib menyimpan nomor pesanan atau bukti transaksi untuk klaim garansi.
        </p>
      </section>
    </div>
  )
}
