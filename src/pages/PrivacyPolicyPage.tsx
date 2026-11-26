import React from 'react'

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-xs text-slate-600 leading-relaxed">
      <h1 className="text-2xl font-extrabold text-navy">Kebijakan Privasi</h1>
      <p className="text-ink-muted">Terakhir diperbarui: 26 November 2026</p>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-navy">1. Informasi yang Kami Kumpulkan</h2>
        <p>
          Kami hanya mengumpulkan data yang mutlak diperlukan untuk menyelesaikan transaksi pemesanan produk aksesoris HP dan Laptop, seperti Nama Lengkap, Nomor WhatsApp, Email (opsional), dan Alamat Pengiriman.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-navy">2. Penggunaan Informasi</h2>
        <p>
          Data pelanggan digunakan secara ketat untuk:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Memproses verifikasi dan konfirmasi pesanan melalui WhatsApp.</li>
          <li>Mengirimkan paket pesanan ke alamat tujuan bagi pemesan yang memilih pengiriman kurir.</li>
          <li>Memberikan layanan purna jual atau garansi tukar produk.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-navy">3. Keamanan Data &amp; Token Pelacakan</h2>
        <p>
          Sistem kami menggunakan enkripsi token hash untuk melacak pesanan. Pengguna publik tidak dapat melihat data pelanggan lain tanpa memiliki Nomor Pesanan dan Token Pelacakan yang sah.
        </p>
      </section>
    </div>
  )
}
