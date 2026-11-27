-- ==============================================================================
-- TOKO AKMAL ACCESSORIES HP & LAPTOP
-- SUPABASE POSTGRESQL MIGRATION SCHEMA (INITIAL SETUP)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS & HELPER TYPES
-- ==============================================================================
DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM (
        'pending',
        'confirmed',
        'processing',
        'ready_for_pickup',
        'shipped',
        'completed',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM (
        'unpaid',
        'paid',
        'refunded',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE delivery_method_enum AS ENUM (
        'pickup',
        'delivery'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM (
        'manual_transfer',
        'cash_pickup'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inventory_movement_type_enum AS ENUM (
        'purchase_restock',
        'order_deduction',
        'order_cancellation_restore',
        'manual_adjustment',
        'damage_writeoff'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE discount_type_enum AS ENUM (
        'percentage',
        'fixed_amount'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. TABLES DEFINITION
-- ==============================================================================

-- 2.1 Profiles (Admin & Staff)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Store Settings
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'Toko Akmal Accessories HP & Laptop',
    tagline TEXT NOT NULL DEFAULT 'Belanja lengkap, murah, terjangkau dan terpercaya',
    logo_url TEXT,
    store_description TEXT,
    whatsapp_number TEXT NOT NULL DEFAULT '6282369310034',
    email TEXT NOT NULL DEFAULT 'kontak@tokoakmal.com',
    address TEXT NOT NULL DEFAULT 'Jl. Raya Utama No. 123, Indonesia',
    opening_hours TEXT NOT NULL DEFAULT 'Senin - Minggu: 09:00 - 21:00 WIB',
    bank_name TEXT NOT NULL DEFAULT 'BCA',
    bank_account_number TEXT NOT NULL DEFAULT '1234567890',
    bank_account_holder TEXT NOT NULL DEFAULT 'Toko Akmal',
    qris_image_url TEXT,
    shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 15000.00 CHECK (shipping_cost >= 0),
    pickup_instructions TEXT DEFAULT 'Silakan tunjukkan nomor pesanan saat pengambilan di kasir toko.',
    is_store_open BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 Products
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    description TEXT,
    specifications JSONB DEFAULT '{}'::jsonb,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price < price)),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    main_image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2.5 Product Images (Gallery)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 Customers (Guest / Regular Directory)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.7 Promotions
CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_type discount_type_enum NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC(12, 2) NOT NULL CHECK (discount_value > 0),
    minimum_order NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (minimum_order >= 0),
    maximum_discount NUMERIC(12, 2) CHECK (maximum_discount IS NULL OR maximum_discount > 0),
    usage_limit INT CHECK (usage_limit IS NULL OR usage_limit > 0),
    usage_count INT NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.8 Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    status order_status_enum NOT NULL DEFAULT 'pending',
    payment_method payment_method_enum NOT NULL DEFAULT 'manual_transfer',
    payment_status payment_status_enum NOT NULL DEFAULT 'unpaid',
    delivery_method delivery_method_enum NOT NULL DEFAULT 'pickup',
    delivery_address TEXT,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    customer_note TEXT,
    promotion_code TEXT,
    tracking_token_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.9 Order Items (Snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.10 Inventory Movements
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    movement_type inventory_movement_type_enum NOT NULL,
    quantity INT NOT NULL,
    stock_before INT NOT NULL,
    stock_after INT NOT NULL,
    reason TEXT NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.11 Admin Audit Logs
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON public.products(is_active, is_featured) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_token_hash ON public.orders(tracking_token_hash);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_product ON public.inventory_movements(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.admin_audit_logs(actor_id, created_at DESC);

-- ==============================================================================
-- 4. TRIGGERS FOR updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_store_settings_updated_at ON public.store_settings;
CREATE TRIGGER trg_store_settings_updated_at BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_promotions_updated_at ON public.promotions;
CREATE TRIGGER trg_promotions_updated_at BEFORE UPDATE ON public.promotions FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an active admin or staff?
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
    v_active BOOLEAN;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    SELECT role, is_active INTO v_role, v_active
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_role IN ('admin', 'staff') AND v_active = TRUE THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Helper function: is current user super admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
    v_active BOOLEAN;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    SELECT role, is_active INTO v_role, v_active
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_role = 'admin' AND v_active = TRUE THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Profiles: Admins can manage all, users can read own
DROP POLICY IF EXISTS "Admins can view and manage profiles" ON public.profiles;
CREATE POLICY "Admins can view and manage profiles"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Store Settings: Public can read, only admin can update
DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings"
    ON public.store_settings FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Admins can update store settings" ON public.store_settings;
CREATE POLICY "Admins can update store settings"
    ON public.store_settings FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Categories: Public can read active, admins manage all
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    TO public
    USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;
CREATE POLICY "Admins manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Products: Public can read active non-deleted, admins manage all
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    TO public
    USING (is_active = true AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Admins manage products" ON public.products;
CREATE POLICY "Admins manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Product Images: Public can view images of active products
DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images"
    ON public.product_images FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_images.product_id
              AND p.is_active = true
              AND p.deleted_at IS NULL
        )
    );

DROP POLICY IF EXISTS "Admins manage product images" ON public.product_images;
CREATE POLICY "Admins manage product images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Customers: Strictly admin access (public uses RPC to checkout)
DROP POLICY IF EXISTS "Only admin can view and manage customers" ON public.customers;
CREATE POLICY "Only admin can view and manage customers"
    ON public.customers FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Promotions: Public can view active promotions, admin manages all
DROP POLICY IF EXISTS "Public can view active promotions" ON public.promotions;
CREATE POLICY "Public can view active promotions"
    ON public.promotions FOR SELECT
    TO public
    USING (is_active = true AND (end_date IS NULL OR end_date > NOW()));

DROP POLICY IF EXISTS "Admins manage promotions" ON public.promotions;
CREATE POLICY "Admins manage promotions"
    ON public.promotions FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Orders: Strictly admin access for direct SELECT/UPDATE
DROP POLICY IF EXISTS "Admins can view and manage orders" ON public.orders;
CREATE POLICY "Admins can view and manage orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Order Items: Strictly admin access
DROP POLICY IF EXISTS "Admins can view and manage order items" ON public.order_items;
CREATE POLICY "Admins can view and manage order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Inventory Movements: Strictly admin access
DROP POLICY IF EXISTS "Admins can view and manage inventory movements" ON public.inventory_movements;
CREATE POLICY "Admins can view and manage inventory movements"
    ON public.inventory_movements FOR ALL
    TO authenticated
    USING (public.is_admin_or_staff());

-- Admin Audit Logs: Strictly admin access
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins can view audit logs"
    ON public.admin_audit_logs FOR ALL
    TO authenticated
    USING (public.is_admin());

-- ==============================================================================
-- 6. SECURE BUSINESS LOGIC (RPCs)
-- ==============================================================================

-- Function 6.1: Generate Order Number (e.g. AKM-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    v_prefix TEXT;
    v_random TEXT;
    v_order_num TEXT;
    v_exists BOOLEAN;
BEGIN
    v_prefix := 'AKM-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
    LOOP
        v_random := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        v_order_num := v_prefix || v_random;
        SELECT EXISTS(SELECT 1 FROM public.orders WHERE order_number = v_order_num) INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;
    RETURN v_order_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function 6.2: Secure Atomic Checkout RPC
-- Takes items JSON, customer data, delivery & payment selection, promo code
CREATE OR REPLACE FUNCTION public.process_checkout(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_email TEXT,
    p_customer_address TEXT,
    p_delivery_method delivery_method_enum,
    p_payment_method payment_method_enum,
    p_customer_note TEXT,
    p_promotion_code TEXT,
    p_items JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_customer_id UUID;
    v_order_id UUID;
    v_order_number TEXT;
    v_tracking_token TEXT;
    v_tracking_token_hash TEXT;
    v_subtotal NUMERIC(12, 2) := 0.00;
    v_discount NUMERIC(12, 2) := 0.00;
    v_shipping NUMERIC(12, 2) := 0.00;
    v_total NUMERIC(12, 2) := 0.00;
    v_item RECORD;
    v_product RECORD;
    v_promo RECORD;
    v_shipping_rate NUMERIC(12, 2) := 0.00;
    v_is_store_open BOOLEAN := true;
BEGIN
    -- 1. Check Store Status
    SELECT is_store_open, shipping_cost INTO v_is_store_open, v_shipping_rate 
    FROM public.store_settings LIMIT 1;
    
    IF v_is_store_open = FALSE THEN
        RAISE EXCEPTION 'Mohon maaf, toko saat ini sedang tidak menerima pesanan baru.';
    END IF;

    -- 2. Validate Customer Parameters
    IF TRIM(p_customer_name) = '' THEN
        RAISE EXCEPTION 'Nama pemesan wajib diisi.';
    END IF;
    IF TRIM(p_customer_phone) = '' THEN
        RAISE EXCEPTION 'Nomor WhatsApp wajib diisi.';
    END IF;
    IF p_delivery_method = 'delivery' AND (p_customer_address IS NULL OR TRIM(p_customer_address) = '') THEN
        RAISE EXCEPTION 'Alamat pengiriman wajib diisi untuk metode kurir antar.';
    END IF;

    IF p_delivery_method = 'delivery' THEN
        v_shipping := COALESCE(v_shipping_rate, 15000.00);
    ELSE
        v_shipping := 0.00;
    END IF;

    -- Validate Items Array
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Keranjang belanja kosong.';
    END IF;

    -- 3. Find or Create Customer
    SELECT id INTO v_customer_id FROM public.customers WHERE phone = TRIM(p_customer_phone) LIMIT 1;
    IF v_customer_id IS NULL THEN
        INSERT INTO public.customers (full_name, phone, email, address)
        VALUES (TRIM(p_customer_name), TRIM(p_customer_phone), NULLIF(TRIM(p_customer_email), ''), TRIM(p_customer_address))
        RETURNING id INTO v_customer_id;
    ELSE
        UPDATE public.customers
        SET full_name = TRIM(p_customer_name),
            email = COALESCE(NULLIF(TRIM(p_customer_email), ''), email),
            address = COALESCE(NULLIF(TRIM(p_customer_address), ''), address),
            updated_at = NOW()
        WHERE id = v_customer_id;
    END IF;

    -- 4. Calculate Subtotal & Validate Stock Atomically with FOR UPDATE
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INT)
    LOOP
        IF v_item.quantity <= 0 THEN
            RAISE EXCEPTION 'Kuantitas produk tidak valid.';
        END IF;

        -- Lock product row for atomic stock verification
        SELECT id, name, sku, price, sale_price, stock, is_active, deleted_at
        INTO v_product
        FROM public.products
        WHERE id = v_item.product_id
        FOR UPDATE;

        IF NOT FOUND OR v_product.is_active = FALSE OR v_product.deleted_at IS NOT NULL THEN
            RAISE EXCEPTION 'Produk tidak ditemukan atau sudah tidak aktif.';
        END IF;

        IF v_product.stock < v_item.quantity THEN
            RAISE EXCEPTION 'Stok tidak mencukupi untuk produk "%" (Sisa stok: %).', v_product.name, v_product.stock;
        END IF;

        -- Use current active price (sale_price if valid, otherwise regular price)
        DECLARE
            v_effective_price NUMERIC(12, 2);
            v_line_subtotal NUMERIC(12, 2);
        BEGIN
            v_effective_price := COALESCE(v_product.sale_price, v_product.price);
            v_line_subtotal := v_effective_price * v_item.quantity;
            v_subtotal := v_subtotal + v_line_subtotal;
        END;
    END LOOP;

    -- 5. Validate & Apply Promotion if provided
    IF p_promotion_code IS NOT NULL AND TRIM(p_promotion_code) <> '' THEN
        SELECT * INTO v_promo
        FROM public.promotions
        WHERE UPPER(code) = UPPER(TRIM(p_promotion_code))
          AND is_active = TRUE
          AND (start_date <= NOW())
          AND (end_date IS NULL OR end_date >= NOW())
        FOR UPDATE;

        IF FOUND THEN
            IF v_promo.usage_limit IS NOT NULL AND v_promo.usage_count >= v_promo.usage_limit THEN
                RAISE EXCEPTION 'Voucher diskon sudah mencapai batas maksimal penggunaan.';
            END IF;

            IF v_subtotal < v_promo.minimum_order THEN
                RAISE EXCEPTION 'Minimal belanja untuk voucher ini adalah Rp %', TO_CHAR(v_promo.minimum_order, 'FM999,999,999');
            END IF;

            IF v_promo.discount_type = 'percentage' THEN
                v_discount := (v_subtotal * (v_promo.discount_value / 100.0));
                IF v_promo.maximum_discount IS NOT NULL AND v_discount > v_promo.maximum_discount THEN
                    v_discount := v_promo.maximum_discount;
                END IF;
            ELSE
                v_discount := LEAST(v_promo.discount_value, v_subtotal);
            END IF;

            -- Increment usage
            UPDATE public.promotions
            SET usage_count = usage_count + 1,
                updated_at = NOW()
            WHERE id = v_promo.id;
        ELSE
            RAISE EXCEPTION 'Kode voucher diskon tidak valid atau telah kedaluwarsa.';
        END IF;
    END IF;

    -- Total calculation
    v_total := (v_subtotal - v_discount) + v_shipping;
    IF v_total < 0 THEN
        v_total := 0;
    END IF;

    -- 6. Generate Order Numbers & Tracking Token
    v_order_number := public.generate_order_number();
    v_tracking_token := encode(gen_random_bytes(16), 'hex');
    v_tracking_token_hash := encode(digest(v_tracking_token, 'sha256'), 'hex');

    -- 7. Insert Order
    INSERT INTO public.orders (
        order_number,
        customer_id,
        status,
        payment_method,
        payment_status,
        delivery_method,
        delivery_address,
        subtotal,
        discount_amount,
        shipping_cost,
        total,
        customer_note,
        promotion_code,
        tracking_token_hash
    ) VALUES (
        v_order_number,
        v_customer_id,
        'pending',
        p_payment_method,
        'unpaid',
        p_delivery_method,
        TRIM(p_customer_address),
        v_subtotal,
        v_discount,
        v_shipping,
        v_total,
        p_customer_note,
        NULLIF(TRIM(p_promotion_code), ''),
        v_tracking_token_hash
    ) RETURNING id INTO v_order_id;

    -- 8. Insert Order Items, Decrement Stock, and Record Inventory Movements
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INT)
    LOOP
        SELECT id, name, sku, price, sale_price, stock
        INTO v_product
        FROM public.products
        WHERE id = v_item.product_id;

        DECLARE
            v_eff_price NUMERIC(12, 2);
            v_item_subtotal NUMERIC(12, 2);
            v_stock_before INT;
            v_stock_after INT;
        BEGIN
            v_eff_price := COALESCE(v_product.sale_price, v_product.price);
            v_item_subtotal := v_eff_price * v_item.quantity;
            v_stock_before := v_product.stock;
            v_stock_after := v_product.stock - v_item.quantity;

            -- Order item snapshot
            INSERT INTO public.order_items (
                order_id,
                product_id,
                product_name,
                product_sku,
                quantity,
                unit_price,
                subtotal
            ) VALUES (
                v_order_id,
                v_product.id,
                v_product.name,
                v_product.sku,
                v_item.quantity,
                v_eff_price,
                v_item_subtotal
            );

            -- Deduct stock
            UPDATE public.products
            SET stock = v_stock_after,
                updated_at = NOW()
            WHERE id = v_product.id;

            -- Record inventory movement
            INSERT INTO public.inventory_movements (
                product_id,
                movement_type,
                quantity,
                stock_before,
                stock_after,
                reason,
                order_id
            ) VALUES (
                v_product.id,
                'order_deduction',
                v_item.quantity,
                v_stock_before,
                v_stock_after,
                'Pengurangan pesanan ' || v_order_number,
                v_order_id
            );
        END;
    END LOOP;

    -- Return safe tracking credentials and order overview
    RETURN jsonb_build_object(
        'success', true,
        'order_number', v_order_number,
        'tracking_token', v_tracking_token,
        'subtotal', v_subtotal,
        'discount', v_discount,
        'shipping', v_shipping,
        'total', v_total
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function 6.3: Safe Order Tracking RPC (Prevents data leaks of arbitrary orders)
CREATE OR REPLACE FUNCTION public.track_order(
    p_order_number TEXT,
    p_tracking_token TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_items JSONB;
    v_hashed_token TEXT;
BEGIN
    v_hashed_token := encode(digest(TRIM(p_tracking_token), 'sha256'), 'hex');

    SELECT o.id, o.order_number, o.status, o.payment_method, o.payment_status,
           o.delivery_method, o.subtotal, o.discount_amount, o.shipping_cost, o.total,
           o.created_at, o.customer_note, c.full_name as customer_name
    INTO v_order
    FROM public.orders o
    LEFT JOIN public.customers c ON c.id = o.customer_id
    WHERE UPPER(o.order_number) = UPPER(TRIM(p_order_number))
      AND o.tracking_token_hash = v_hashed_token;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Pesanan tidak ditemukan atau kode pelacakan salah.');
    END IF;

    SELECT jsonb_agg(
        jsonb_build_object(
            'product_name', oi.product_name,
            'product_sku', oi.product_sku,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
        )
    ) INTO v_items
    FROM public.order_items oi
    WHERE oi.order_id = v_order.id;

    RETURN jsonb_build_object(
        'success', true,
        'order', jsonb_build_object(
            'order_number', v_order.order_number,
            'customer_name', v_order.customer_name,
            'status', v_order.status,
            'payment_method', v_order.payment_method,
            'payment_status', v_order.payment_status,
            'delivery_method', v_order.delivery_method,
            'subtotal', v_order.subtotal,
            'discount_amount', v_order.discount_amount,
            'shipping_cost', v_order.shipping_cost,
            'total', v_order.total,
            'created_at', v_order.created_at,
            'customer_note', v_order.customer_note,
            'items', COALESCE(v_items, '[]'::jsonb)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function 6.4: Update Order Status RPC (With stock reversal on cancellation)
CREATE OR REPLACE FUNCTION public.admin_update_order_status(
    p_order_id UUID,
    p_status order_status_enum,
    p_payment_status payment_status_enum
)
RETURNS JSONB AS $$
DECLARE
    v_old_status order_status_enum;
    v_order_number TEXT;
    v_item RECORD;
    v_cur_stock INT;
BEGIN
    IF NOT public.is_admin_or_staff() THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya admin atau staf yang berwenang.';
    END IF;

    SELECT status, order_number INTO v_old_status, v_order_number
    FROM public.orders WHERE id = p_order_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pesanan tidak ditemukan.';
    END IF;

    -- If transitioning to 'cancelled' from a non-cancelled status, restore stock
    IF p_status = 'cancelled' AND v_old_status <> 'cancelled' THEN
        FOR v_item IN SELECT product_id, quantity FROM public.order_items WHERE order_id = p_order_id
        LOOP
            IF v_item.product_id IS NOT NULL THEN
                SELECT stock INTO v_cur_stock FROM public.products WHERE id = v_item.product_id FOR UPDATE;
                IF FOUND THEN
                    UPDATE public.products
                    SET stock = stock + v_item.quantity,
                        updated_at = NOW()
                    WHERE id = v_item.product_id;

                    INSERT INTO public.inventory_movements (
                        product_id,
                        movement_type,
                        quantity,
                        stock_before,
                        stock_after,
                        reason,
                        order_id,
                        actor_id
                    ) VALUES (
                        v_item.product_id,
                        'order_cancellation_restore',
                        v_item.quantity,
                        v_cur_stock,
                        v_cur_stock + v_item.quantity,
                        'Pengembalian stok pesanan dibatalkan ' || v_order_number,
                        p_order_id,
                        auth.uid()
                    );
                END IF;
            END IF;
        END LOOP;
    END IF;

    UPDATE public.orders
    SET status = p_status,
        payment_status = p_payment_status,
        updated_at = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant EXECUTE permissions on public RPCs
GRANT EXECUTE ON FUNCTION public.process_checkout TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_order TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_order_status TO authenticated;
