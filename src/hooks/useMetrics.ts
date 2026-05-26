import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Metrics {
  total: number;
  disponivel: number;
  reservado: number;
  vendido: number;
  estoqueValor: number;
  vendasMesQtde: number;
  vendasMesValor: number;
  ticketMedio: number;
}

const empty: Metrics = {
  total: 0, disponivel: 0, reservado: 0, vendido: 0,
  estoqueValor: 0, vendasMesQtde: 0, vendasMesValor: 0, ticketMedio: 0,
};

export function useMetrics(refreshKey: number = 0) {
  const [metrics, setMetrics] = useState<Metrics>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const { data: products } = await supabase
        .from("products")
        .select("status, preco_brl");
      const firstDay = new Date();
      firstDay.setDate(1);
      firstDay.setHours(0, 0, 0, 0);
      const { data: sales } = await supabase
        .from("sales")
        .select("final_price, sold_at")
        .gte("sold_at", firstDay.toISOString());

      if (cancelled) return;
      const m: Metrics = { ...empty };
      (products || []).forEach((p: any) => {
        m.total++;
        const price = Number(p.preco_brl) || 0;
        if (p.status === "Disponível") { m.disponivel++; m.estoqueValor += price; }
        else if (p.status === "Reservado") m.reservado++;
        else if (p.status === "Vendido") m.vendido++;
      });
      (sales || []).forEach((s: any) => {
        m.vendasMesQtde++;
        m.vendasMesValor += Number(s.final_price) || 0;
      });
      m.ticketMedio = m.vendasMesQtde ? m.vendasMesValor / m.vendasMesQtde : 0;
      setMetrics(m);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  return { metrics, loading };
}
