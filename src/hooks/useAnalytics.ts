import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TopProduct { product_codigo: string; nome: string; url_capa: string; views: number; wa_clicks: number; }
export interface DailyVisit { dia: string; total: number; unicos: number; }
export interface TrafficSource { source: string; total: number; }
export interface WaConversion { total_views: number; total_clicks: number; }

export function useAnalytics(days = 30) {
  const [top, setTop] = useState<TopProduct[]>([]);
  const [daily, setDaily] = useState<DailyVisit[]>([]);
  const [sources, setSources] = useState<TrafficSource[]>([]);
  const [conv, setConv] = useState<WaConversion>({ total_views: 0, total_clicks: 0 });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [a, b, c, d] = await Promise.all([
      supabase.rpc("top_products", { days }),
      supabase.rpc("daily_visits", { days }),
      supabase.rpc("traffic_sources", { days }),
      supabase.rpc("whatsapp_conversion", { days }),
    ]);
    setTop((a.data as TopProduct[]) || []);
    setDaily((b.data as DailyVisit[]) || []);
    setSources((c.data as TrafficSource[]) || []);
    setConv(((d.data as WaConversion[])?.[0]) || { total_views: 0, total_clicks: 0 });
    setLoading(false);
  }

  useEffect(() => { load(); }, [days]);
  return { top, daily, sources, conv, loading, reload: load };
}
