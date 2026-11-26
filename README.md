# Toko Akmal Accessories HP & Laptop

Website E-Commerce dan Pemesanan Online Resmi untuk **Toko Akmal Accessories HP & Laptop**.
> *"Belanja lengkap, murah, terjangkau dan terpercaya."*

Aplikasi modern full-stack berbasis **React + Vite + TypeScript**, **Tailwind CSS**, **Supabase PostgreSQL & Auth**, didesain untuk performa tinggi, keamanan transaksi atomic, mobile-first, dan siap dideploy langsung ke **Vercel**.

---

## 🚀 Fitur Utama

### 1. Public Storefront (Pelanggan)
- **Homepage Premium**: Hero banner dinamis, kategori produk interaktif, showcase produk unggulan & best-seller, penawaran promo kilat, dan footer informasi toko lengkap.
- **Katalog & Filter Produk**: Pencarian real-time berdasarkan nama atau SKU barang, filter per kategori, filter harga rendah/tinggi, status ketersediaan stok, dan badge promo.
- **Detail Produk Lengkap**: Galeri foto, SKU, kategori, tabel spesifikasi teknis, harga diskon, kontrol kuantitas, dan rekomendasi aksesoris terkait.
- **Keranjang Belanja (Cart)**: Sinkronisasi penyimpanan lokal, penyesuaian jumlah kuantitas, subtotal dinamis, dan validasi ketersediaan stok sebelum checkout.
- **Checkout Guest Cepat & Aman**:
  - Tanpa perlu daftar akun pelanggan.
  - Opsi Pengiriman: **Ambil di Toko Fisik (Pickup)** atau **Kurir Antar (Delivery)**.
  - Opsi Pembayaran: **Transfer Bank BCA** atau **Bayar Tunai di Kasir Toko**.
  - Validasi voucher diskon promo.
  - Transaksi atomic database RPC Supabase yang mengunci baris produk (`FOR UPDATE`), mencegah overselling, dan mencatat mutasi stok secara otomatis.
- **Order Tracking & Keamanan**:
  - Pelacakan progres status: *Pending*, *Confirmed*, *Processing*, *Ready for Pickup*, *Shipped*, *Completed*, *Cancelled*.
  - Dilindungi menggunakan verifikasi kombinasi **Nomor Pesanan + Token Hash SHA-256** agar data pelanggan lain tidak bocor.

### 2. Admin Dashboard (Staf & Pemilik Toko)
- **Autentikasi Aman**: Login admin terlindungi dengan Supabase Auth & Row Level Security (RLS). Dilengkapi mode demo standalone bawaan.
- **Dashboard Ringkasan Operasional**: Statistik total omzet transaksi *completed*, total pesanan baru, peringatan stok menipis/habis, serta grafik tren penjualan mingguan dengan Recharts.
- **CRUD Produk Lengkap**: Tambah, ubah, dan soft-delete produk aksesoris HP/laptop, pengaturan harga coret, ambang batas stok menipis (*low stock threshold*), dan status unggulan.
- **Manajemen Kategori**: Atur klasifikasi kategori aksesoris, slug SEO-friendly, dan urutan tampilan (*sort order*).
- **Kelola Pesanan**: Filter pesanan berdasarkan status, pembaruan status pengiriman & pembayaran. Pembatalan pesanan otomatis mengembalikan stok fisik produk ke database via RPC.
- **Kontrol Stok & Mutasi Inventaris**: Penyesuaian cepat stok masuk (*restock*) dan audit jejak pergerakan stok.
- **Pengaturan Toko**: Konfigurasi nama toko, nomor WhatsApp CS, rekening bank, jam operasional, dan tarif ongkir kurir.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS
- **Routing**: React Router DOM (v7) dengan SPA Rewrite untuk Vercel
- **State & Query**: TanStack Query, Context API (AuthContext & CartContext)
- **Database & Auth**: Supabase PostgreSQL, Row Level Security (RLS), Supabase Storage
- **Validasi & Form**: Zod, React Hook Form
- **Komponen UI & Ikon**: Lucide React, Recharts, Sonner

---

## 📁 Struktur Direktori

```text
├── public/                 # Favicon, Logo SVG, assets publik
├── src/
│   ├── components/         # Komponen UI, Layout publik & Admin
│   │   ├── admin/          # AdminLayout, Sidebar, Guard
│   │   ├── layout/         # Header, Footer, PublicLayout
│   │   └── products/       # ProductCard, Badges
│   ├── contexts/           # AuthContext, CartContext
│   ├── lib/                # Supabase client, utils, formatRupiah, validators (Zod)
│   ├── pages/              # Halaman publik (Home, Products, Cart, Checkout, Tracking, dll.)
│   │   └── admin/          # Halaman admin (Dashboard, Products, Orders, Categories, Inventory, dll.)
│   ├── routes/             # AppRoutes & ProtectedAdminRoute
│   ├── services/           # Service API layer (ProductService, OrderService, StoreService)
│   └── types/              # TypeScript database schema & model types
├── supabase/
│   ├── migrations/         # Skrip SQL: 01_initial_schema (Tables, Triggers, RLS, RPC Checkout)
│   │                       # Skrip SQL: 02_storage_setup (Bucket & Storage Policies)
│   └── seed.sql            # Data awal kategori, produk, promo, dan toko
├── vercel.json             # Konfigurasi SPA rewrite untuk Vercel
└── tailwind.config.js      # Tema warna Toko Akmal (Navy, Blue, Orange, Inter)
```

---

## ⚙️ Panduan Menjalankan Secara Lokal

### 1. Klon dan Pasang Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di root direktori (atau salin dari `.env.example`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
> *Catatan: Jika variabel Supabase belum diisi dengan kredensial aktif, aplikasi secara otomatis berjalan dalam mode fallback offline/demo sehingga seluruh alur UI, keranjang, checkout, dan admin panel tetap dapat diuji secara mandiri.*

### 3. Akun Demo Admin Lokal
- **Email**: `admin@tokoakmal.com`
- **Password**: `Admin123!`

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 5. Build untuk Produksi
```bash
npm run build
npm run preview
```

---

## 🗄️ Menghubungkan ke Supabase Cloud

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor** pada Dashboard Supabase Anda.
3. Jalankan file SQL migrasi secara berurutan:
   - Salin isi `supabase/migrations/20261126000000_initial_schema.sql` dan klik **Run**.
   - Salin isi `supabase/migrations/20261126000001_storage_setup.sql` dan klik **Run**.
   - Salin isi `supabase/seed.sql` dan klik **Run** untuk mengisi produk dan kategori awal.
4. Buka menu **Authentication -> Users** dan buat akun admin (contoh: `admin@tokoakmal.com`).
5. Buat profil admin di tabel `profiles`:
   ```sql
   INSERT INTO public.profiles (id, email, full_name, role, is_active)
   VALUES ('<UID_USER_DARI_AUTH>', 'admin@tokoakmal.com', 'Akmal Hidayat', 'admin', true);
   ```
6. Salin **Project URL** dan **anon public key** dari menu *Project Settings -> API* ke file `.env` aplikasi Anda.

---

## 🚀 Panduan Deployment ke Vercel

Aplikasi telah dilengkapi dengan konfigurasi `vercel.json` untuk menangani client-side routing (SPA).

1. Push repository ini ke GitHub / GitLab.
2. Buka [Vercel Dashboard](https://vercel.com) dan pilih **Add New Project**.
3. Import repository project `akmalantigravity`.
4. Pada bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = URL project Supabase Anda
   - `VITE_SUPABASE_ANON_KEY` = Anon key project Supabase Anda
5. Klik tombol **Deploy**. Vercel akan menjalankan `npm run build` dan aplikasi langsung live dengan HTTPS!
