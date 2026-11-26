-- ==============================================================================
-- TOKO AKMAL ACCESSORIES HP & LAPTOP
-- INITIAL SEED DATA (CATEGORIES, PRODUCTS, STORE SETTINGS & PROMO)
-- ==============================================================================

-- 1. Initial Store Settings
INSERT INTO public.store_settings (
    store_name,
    tagline,
    whatsapp_number,
    email,
    address,
    opening_hours,
    bank_name,
    bank_account_number,
    bank_account_holder,
    shipping_cost,
    pickup_instructions,
    is_store_open
) VALUES (
    'Toko Akmal Accessories HP & Laptop',
    'Belanja lengkap, murah, terjangkau dan terpercaya',
    '6281234567890',
    'kontak@tokoakmal.com',
    'Pertokoan Niaga Utama Blok C No. 15, Jl. Pemuda Raya, Jakarta',
    'Senin - Sabtu: 09:00 - 21:00 WIB, Minggu: 10:00 - 18:00 WIB',
    'BCA (Bank Central Asia)',
    '7890123456',
    'Akmal Hidayat',
    15000.00,
    'Tunjukkan bukti nomor pesanan atau struk digital saat mengambil paket di meja pickup.',
    true
) ON CONFLICT DO NOTHING;

-- 2. Initial Categories
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Charger & Kabel', 'charger-kabel', 'Fast charger, kabel data type-c, lightning, micro usb original dan bergaransi.', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80', 1),
('c1000000-0000-0000-0000-000000000002', 'Casing & Tempered Glass', 'casing-tempered-glass', 'Pelindung layar anti gores spy, clear, matte, dan casing hp benturan tinggi.', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80', 2),
('c1000000-0000-0000-0000-000000000003', 'Audio & TWS', 'audio-tws', 'Headset bluetooth, earphone gaming kabel, dan TWS bass jernih.', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80', 3),
('c1000000-0000-0000-0000-000000000004', 'Aksesoris Laptop', 'aksesoris-laptop', 'Stand laptop ergonomis, mouse wireless, keyboard mechanical, dan cooling pad.', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80', 4),
('c1000000-0000-0000-0000-000000000005', 'Powerbank & Baterai', 'powerbank-baterai', 'Powerbank kapasitas besar 10.000 - 30.000 mAh support Power Delivery dan Quick Charge.', 'https://images.unsplash.com/photo-1609592426507-285640733a87?w=600&auto=format&fit=crop&q=80', 5)
ON CONFLICT (slug) DO NOTHING;

-- 3. Initial Products
INSERT INTO public.products (
    id, category_id, name, slug, sku, description, specifications,
    price, sale_price, stock, low_stock_threshold, main_image_url, is_active, is_featured
) VALUES
(
    'p1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Adaptor Fast Charger 65W GaN Multi-Port Type-C',
    'adaptor-fast-charger-65w-gan-multi-port',
    'CHG-65W-GAN',
    'Kepala charger teknologi GaN 65W dengan 2 port USB-C dan 1 USB-A. Cocok untuk laptop MacBook, ultrabook, dan smartphone Samsung, iPhone, Xiaomi.',
    '{"Daya": "65 Watt", "Port": "2x Type-C, 1x USB-A", "Protokol": "PD 3.0, QC 4.0", "Garansi": "12 Bulan"}'::jsonb,
    185000.00,
    149000.00,
    25,
    5,
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    true,
    true
),
(
    'p1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'Kabel Data Braided Type-C to Type-C 100W PD 1.5M',
    'kabel-data-braided-type-c-100w',
    'KBL-CC-100W',
    'Kabel braided nylon anti putus mendukung transfer daya hingga 100 Watt serta transfer data berkecepatan 480 Mbps.',
    '{"Panjang": "1.5 Meter", "Arus Maksimal": "5A / 100W", "Material": "Braided Nylon", "Garansi": "6 Bulan"}'::jsonb,
    49000.00,
    35000.00,
    60,
    10,
    'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
    true,
    true
),
(
    'p1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000003',
    'TWS Earphone True Wireless Bluetooth 5.3 Low Latency',
    'tws-earphone-true-wireless-bluetooth-53',
    'AUD-TWS-530',
    'Earphone nirkabel dengan koneksi stabil Bluetooth 5.3, mode game latency rendah 45ms, dan ketahanan baterai total hingga 28 jam bersama charging case.',
    '{"Bluetooth": "Versi 5.3", "Baterai": "5 Jam Playtime + 23 Jam Case", "Fitur": "Touch Control, ENC Noise Reduction", "Garansi": "12 Bulan"}'::jsonb,
    179000.00,
    139000.00,
    30,
    6,
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    true,
    true
),
(
    'p1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000004',
    'Stand Laptop Ergonomis Aluminium Lipat 7 Sudut',
    'stand-laptop-ergonomis-aluminium-lipat',
    'LPT-STD-ALU',
    'Penyangga laptop bahan aluminium alloy kokoh dengan 7 tingkat penyesuaian ketinggian untuk mencegah nyeri leher saat bekerja.',
    '{"Kompatibilitas": "Laptop 11 - 17.3 Inci", "Material": "Full Aluminium Alloy", "Bantalan": "Anti-Slip Silicone Pad", "Fitur": "Dapat dilipat portabel"}'::jsonb,
    95000.00,
    75000.00,
    40,
    8,
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    true,
    true
),
(
    'p1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000005',
    'Powerbank Fast Charging 20000mAh 22.5W Digital Display',
    'powerbank-fast-charging-20000mah-225w',
    'PB-20K-225W',
    'Powerbank kapasitas jumbo 20.000 mAh dengan LED display indikator persentase akurat. Mendukung fast charging VOOC, QC 3.0 dan PD.',
    '{"Kapasitas": "20.000 mAh", "Output": "USB-A 22.5W, Type-C 20W PD", "Indikator": "LED Real-time Digit Display", "Garansi": "12 Bulan"}'::jsonb,
    220000.00,
    185000.00,
    18,
    4,
    'https://images.unsplash.com/photo-1609592426507-285640733a87?w=800&auto=format&fit=crop&q=80',
    true,
    false
),
(
    'p1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000004',
    'Mouse Wireless Silent Click 2.4GHz + Bluetooth Dual Mode',
    'mouse-wireless-silent-click-dual-mode',
    'MOU-SLNT-DM',
    'Mouse senyap tanpa suara klik dengan opsi koneksi USB dongle 2.4G dan Bluetooth 5.0. Baterai isi ulang rechargeable Type-C.',
    '{"DPI": "800/1200/1600 Adjustable", "Koneksi": "2.4GHz + BT 5.0 Dual Mode", "Baterai": "Rechargeable 500mAh", "Garansi": "6 Bulan"}'::jsonb,
    85000.00,
    69000.00,
    45,
    5,
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    true,
    false
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Initial Promotions
INSERT INTO public.promotions (
    code, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, is_active
) VALUES
('AKMALHEMAT', 'percentage', 10.00, 100000.00, 25000.00, 500, true),
('AKMALKILAT', 'fixed_amount', 20000.00, 150000.00, NULL, 200, true)
ON CONFLICT (code) DO NOTHING;
