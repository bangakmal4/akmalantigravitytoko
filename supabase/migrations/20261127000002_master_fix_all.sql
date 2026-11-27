-- ==============================================================================
-- TOKO AKMAL ACCESSORIES HP & LAPTOP
-- MASTER FIX FOR SUPABASE: PERMISSIONS & CHECKOUT RPC
-- Jalankan query ini di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ueysbgkcegvrwrsmhyer/sql
-- ==============================================================================

-- 1. Berikan hak akses penuh skema ke peran internal Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role;

-- 2. Berikan izin SELECT, INSERT, UPDATE untuk peran anon dan authenticated
GRANT SELECT, INSERT, UPDATE ON public.customers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.orders TO anon, authenticated;
GRANT SELECT, INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT, INSERT ON public.inventory_movements TO anon, authenticated;
GRANT SELECT, UPDATE ON public.products TO anon, authenticated;
GRANT SELECT, UPDATE ON public.promotions TO anon, authenticated;
GRANT SELECT ON public.store_settings TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.product_images TO anon, authenticated;

-- 3. Perbarui RLS Policies agar anon / customer publik dapat membuat order
DROP POLICY IF EXISTS "Public can insert customers" ON public.customers;
CREATE POLICY "Public can insert customers"
    ON public.customers FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select customers" ON public.customers;
CREATE POLICY "Public can select customers"
    ON public.customers FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Public can update own customer by phone" ON public.customers;
CREATE POLICY "Public can update own customer by phone"
    ON public.customers FOR UPDATE
    TO public
    USING (true);

DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders"
    ON public.orders FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items"
    ON public.order_items FOR INSERT
    TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings"
    ON public.store_settings FOR SELECT
    TO public
    USING (true);

-- 4. Perbarui Fungsi Atomic Checkout RPC (100% Native PostgreSQL MD5 tanpa pgcrypto)
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
    v_tracking_token := md5(random()::text || clock_timestamp()::text || v_order_number);
    v_tracking_token_hash := md5(v_tracking_token || 'akmal_salt_key');

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

            UPDATE public.products
            SET stock = v_stock_after,
                updated_at = NOW()
            WHERE id = v_product.id;

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

-- 5. Berikan izin eksekusi ke anon dan authenticated
GRANT EXECUTE ON FUNCTION public.process_checkout TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_order TO anon, authenticated;
