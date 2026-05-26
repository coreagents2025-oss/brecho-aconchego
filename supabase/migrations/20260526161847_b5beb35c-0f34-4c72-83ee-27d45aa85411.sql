
REVOKE EXECUTE ON FUNCTION public.top_products(int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.daily_visits(int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.traffic_sources(int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.whatsapp_conversion(int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.top_products(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.daily_visits(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.traffic_sources(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.whatsapp_conversion(int) TO authenticated;
