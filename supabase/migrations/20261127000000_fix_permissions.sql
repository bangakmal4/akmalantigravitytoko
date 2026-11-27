-- ==============================================================================
-- TOKO AKMAL ACCESSORIES - FIX POSTGRES ROLE PERMISSIONS FOR SUPABASE
-- Berikan izin USAGE pada schema public dan SELECT/INSERT/UPDATE untuk anon & authenticated
-- ==============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role;

-- Public (anon & authenticated) read access yang dibatasi oleh RLS
GRANT SELECT ON public.store_settings TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT SELECT ON public.promotions TO anon, authenticated;

-- Authenticated (admin / staff) full access (dibatasi oleh RLS is_admin_or_staff)
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.store_settings TO authenticated;
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.product_images TO authenticated;
GRANT ALL ON public.customers TO authenticated;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.order_items TO authenticated;
GRANT ALL ON public.inventory_movements TO authenticated;
GRANT ALL ON public.promotions TO authenticated;
GRANT ALL ON public.admin_audit_logs TO authenticated;

-- Pastikan RPCs dapat dieksekusi
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
