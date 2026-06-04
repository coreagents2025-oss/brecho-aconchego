DROP FUNCTION IF EXISTS public.top_products(int);
DROP FUNCTION IF EXISTS public.daily_visits(int);
DROP FUNCTION IF EXISTS public.traffic_sources(int);
DROP FUNCTION IF EXISTS public.whatsapp_conversion(int);

CREATE FUNCTION public.top_products(days int DEFAULT 30)
RETURNS TABLE(product_codigo text, total bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;
  RETURN QUERY
  SELECT pv.product_codigo, count(*)::bigint AS total
  FROM public.product_views pv
  WHERE pv.created_at >= now() - (days || ' days')::interval
  GROUP BY pv.product_codigo
  ORDER BY total DESC
  LIMIT 10;
END $$;

CREATE FUNCTION public.daily_visits(days int DEFAULT 30)
RETURNS TABLE(day date, total bigint, unique_sessions bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;
  RETURN QUERY
  SELECT (pv.created_at AT TIME ZONE 'UTC')::date AS day,
         count(*)::bigint AS total,
         count(DISTINCT pv.session_id)::bigint AS unique_sessions
  FROM public.page_visits pv
  WHERE pv.created_at >= now() - (days || ' days')::interval
  GROUP BY 1
  ORDER BY 1;
END $$;

CREATE FUNCTION public.traffic_sources(days int DEFAULT 30)
RETURNS TABLE(source text, total bigint)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;
  RETURN QUERY
  SELECT coalesce(pv.source, 'direto') AS source, count(*)::bigint AS total
  FROM public.page_visits pv
  WHERE pv.created_at >= now() - (days || ' days')::interval
  GROUP BY 1
  ORDER BY total DESC;
END $$;

CREATE FUNCTION public.whatsapp_conversion(days int DEFAULT 30)
RETURNS TABLE(visits bigint, clicks bigint, conversion numeric)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v bigint; c bigint;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;
  SELECT count(*) INTO v FROM public.page_visits WHERE created_at >= now() - (days || ' days')::interval;
  SELECT count(*) INTO c FROM public.whatsapp_clicks WHERE created_at >= now() - (days || ' days')::interval;
  RETURN QUERY SELECT v, c, CASE WHEN v > 0 THEN round((c::numeric / v::numeric) * 100, 2) ELSE 0 END;
END $$;

REVOKE EXECUTE ON FUNCTION public.top_products(int) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.daily_visits(int) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.traffic_sources(int) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.whatsapp_conversion(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.top_products(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.daily_visits(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.traffic_sources(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.whatsapp_conversion(int) TO authenticated;