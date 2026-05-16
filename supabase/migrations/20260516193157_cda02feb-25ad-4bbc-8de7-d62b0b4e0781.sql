
-- Remove política de SELECT no storage.objects (fotos ainda acessíveis via URL pública do bucket)
DROP POLICY IF EXISTS "Imagens de produtos são públicas" ON storage.objects;

-- Revoga execute da função has_role para anon (autenticados precisam para RLS)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;
