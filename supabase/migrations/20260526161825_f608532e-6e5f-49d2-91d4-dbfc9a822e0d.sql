
-- ============ BANNERS ============
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL DEFAULT '',
  subtitulo text NOT NULL DEFAULT '',
  imagem_url text NOT NULL DEFAULT '',
  link_url text NOT NULL DEFAULT '',
  ordem int NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Banners ativos públicos" ON public.banners FOR SELECT USING (ativo = true OR has_role(auth.uid(),'admin'));
CREATE POLICY "Admins gerenciam banners" ON public.banners FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_banners_updated BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ POPUP ============
CREATE TABLE public.popup (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL DEFAULT '',
  mensagem text NOT NULL DEFAULT '',
  imagem_url text NOT NULL DEFAULT '',
  cta_texto text NOT NULL DEFAULT '',
  cta_url text NOT NULL DEFAULT '',
  ativo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.popup TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.popup TO authenticated;
GRANT ALL ON public.popup TO service_role;
ALTER TABLE public.popup ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Popup ativo público" ON public.popup FOR SELECT USING (ativo = true OR has_role(auth.uid(),'admin'));
CREATE POLICY "Admins gerenciam popup" ON public.popup FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_popup_updated BEFORE UPDATE ON public.popup FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PAGE VISITS ============
CREATE TABLE public.page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  session_id text NOT NULL,
  referrer text DEFAULT '',
  source text DEFAULT 'direct',
  user_agent text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.page_visits TO anon, authenticated;
GRANT SELECT, DELETE ON public.page_visits TO authenticated;
GRANT ALL ON public.page_visits TO service_role;
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um registra visita" ON public.page_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins veem visitas" ON public.page_visits FOR SELECT USING (has_role(auth.uid(),'admin'));
CREATE INDEX idx_page_visits_created ON public.page_visits(created_at DESC);
CREATE INDEX idx_page_visits_session ON public.page_visits(session_id);

-- ============ PRODUCT VIEWS ============
CREATE TABLE public.product_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_codigo text NOT NULL,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.product_views TO anon, authenticated;
GRANT SELECT, DELETE ON public.product_views TO authenticated;
GRANT ALL ON public.product_views TO service_role;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um registra view" ON public.product_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins veem views" ON public.product_views FOR SELECT USING (has_role(auth.uid(),'admin'));
CREATE INDEX idx_product_views_codigo ON public.product_views(product_codigo);
CREATE INDEX idx_product_views_created ON public.product_views(created_at DESC);

-- ============ WHATSAPP CLICKS ============
CREATE TABLE public.whatsapp_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_codigo text,
  session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.whatsapp_clicks TO anon, authenticated;
GRANT SELECT, DELETE ON public.whatsapp_clicks TO authenticated;
GRANT ALL ON public.whatsapp_clicks TO service_role;
ALTER TABLE public.whatsapp_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Qualquer um registra clique wa" ON public.whatsapp_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins veem cliques wa" ON public.whatsapp_clicks FOR SELECT USING (has_role(auth.uid(),'admin'));
CREATE INDEX idx_wa_clicks_codigo ON public.whatsapp_clicks(product_codigo);
CREATE INDEX idx_wa_clicks_created ON public.whatsapp_clicks(created_at DESC);

-- ============ AGGREGATION FUNCTIONS (admin only) ============
CREATE OR REPLACE FUNCTION public.top_products(days int DEFAULT 30)
RETURNS TABLE(product_codigo text, nome text, url_capa text, views bigint, wa_clicks bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.codigo, p.nome, p.url_capa,
    COALESCE(v.c,0) AS views,
    COALESCE(w.c,0) AS wa_clicks
  FROM public.products p
  LEFT JOIN (SELECT product_codigo, count(*) c FROM public.product_views WHERE created_at > now() - (days||' days')::interval GROUP BY product_codigo) v ON v.product_codigo = p.codigo
  LEFT JOIN (SELECT product_codigo, count(*) c FROM public.whatsapp_clicks WHERE created_at > now() - (days||' days')::interval AND product_codigo IS NOT NULL GROUP BY product_codigo) w ON w.product_codigo = p.codigo
  WHERE has_role(auth.uid(),'admin') AND (COALESCE(v.c,0) + COALESCE(w.c,0)) > 0
  ORDER BY views DESC, wa_clicks DESC
  LIMIT 10;
$$;

CREATE OR REPLACE FUNCTION public.daily_visits(days int DEFAULT 30)
RETURNS TABLE(dia date, total bigint, unicos bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (created_at AT TIME ZONE 'America/Sao_Paulo')::date AS dia,
    count(*) AS total,
    count(DISTINCT session_id) AS unicos
  FROM public.page_visits
  WHERE created_at > now() - (days||' days')::interval
    AND has_role(auth.uid(),'admin')
  GROUP BY dia ORDER BY dia;
$$;

CREATE OR REPLACE FUNCTION public.traffic_sources(days int DEFAULT 30)
RETURNS TABLE(source text, total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(NULLIF(source,''),'direct') AS source, count(*) AS total
  FROM public.page_visits
  WHERE created_at > now() - (days||' days')::interval
    AND has_role(auth.uid(),'admin')
  GROUP BY 1 ORDER BY 2 DESC;
$$;

CREATE OR REPLACE FUNCTION public.whatsapp_conversion(days int DEFAULT 30)
RETURNS TABLE(total_views bigint, total_clicks bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    (SELECT count(*) FROM public.product_views WHERE created_at > now() - (days||' days')::interval) AS total_views,
    (SELECT count(*) FROM public.whatsapp_clicks WHERE created_at > now() - (days||' days')::interval) AS total_clicks
  WHERE has_role(auth.uid(),'admin');
$$;
