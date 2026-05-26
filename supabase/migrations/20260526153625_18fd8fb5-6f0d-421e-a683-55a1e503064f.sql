
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_codigo TEXT NOT NULL,
  sold_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  channel TEXT NOT NULL DEFAULT 'WhatsApp',
  final_price NUMERIC NOT NULL DEFAULT 0,
  buyer_name TEXT DEFAULT '',
  buyer_contact TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_sales_product_codigo ON public.sales(product_codigo);
CREATE INDEX idx_sales_sold_at ON public.sales(sold_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales TO authenticated;
GRANT ALL ON public.sales TO service_role;

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins veem vendas" ON public.sales FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins criam vendas" ON public.sales FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins atualizam vendas" ON public.sales FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins excluem vendas" ON public.sales FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
