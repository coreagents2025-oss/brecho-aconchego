
ALTER TABLE public.popup
  ADD COLUMN IF NOT EXISTS frequencia text NOT NULL DEFAULT 'sessao'
  CHECK (frequencia IN ('sessao','dia','sempre'));
