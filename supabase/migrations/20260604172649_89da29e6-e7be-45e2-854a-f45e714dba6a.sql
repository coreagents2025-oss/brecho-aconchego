
-- 1. CHECK constraint em products.status
ALTER TABLE public.products
  ADD CONSTRAINT products_status_check
  CHECK (status IN ('Disponível','Reservado','Vendido'));

-- 2. FK whatsapp_clicks -> products (limpa órfãos antes)
DELETE FROM public.whatsapp_clicks
 WHERE product_codigo IS NOT NULL
   AND product_codigo NOT IN (SELECT codigo FROM public.products);
ALTER TABLE public.whatsapp_clicks
  ADD CONSTRAINT whatsapp_clicks_product_codigo_fkey
  FOREIGN KEY (product_codigo) REFERENCES public.products(codigo) ON DELETE SET NULL;

-- 3. Índices de performance
CREATE INDEX IF NOT EXISTS idx_sales_sold_at ON public.sales (sold_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_views_codigo_created ON public.product_views (product_codigo, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_created ON public.page_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_session ON public.page_visits (session_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_created ON public.whatsapp_clicks (created_at DESC);

-- 4. Triggers updated_at para banners/popup
DROP TRIGGER IF EXISTS trg_banners_updated_at ON public.banners;
CREATE TRIGGER trg_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_popup_updated_at ON public.popup;
CREATE TRIGGER trg_popup_updated_at
  BEFORE UPDATE ON public.popup
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Extensões + função de purge + cron
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION public.purge_old_tracking()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.page_visits     WHERE created_at < now() - interval '180 days';
  DELETE FROM public.product_views   WHERE created_at < now() - interval '180 days';
  DELETE FROM public.whatsapp_clicks WHERE created_at < now() - interval '180 days';
END $$;

REVOKE EXECUTE ON FUNCTION public.purge_old_tracking() FROM PUBLIC, anon, authenticated;

SELECT cron.schedule(
  'purge-tracking-daily',
  '0 3 * * *',
  $$ SELECT public.purge_old_tracking(); $$
);
