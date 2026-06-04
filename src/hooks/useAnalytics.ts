import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TopProduct { product_codigo: string; nome: string; url_capa: string; views: number; wa_clicks: number; }
export interface DailyVisit { dia: string; total: number; unicos: number; }
export interface TrafficSource { source: string; total: number; }
export interface WaConversion { total_views: number; total_clicks: number; }

interface RpcTop { product_codigo: string; total: number }
interface RpcDaily { day: string; total: number; unique_sessions: number }
interface RpcConv { visits: number; clicks: number; conversion: number }

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

    const rpcTop = (a.data as RpcTop[] | null) || [];
    const codes = rpcTop.map((r) => r.product_codigo);

    let products: Record<string, { nome: string; url_capa: string }> = {};
    let waByCode: Record<string, number> = {};
    if (codes.length > 0) {
      const [{ data: prods }, { data: clicks }] = await Promise.all([
        supabase.from("products").select("codigo,nome,url_capa").in("codigo", codes),
        supabase.from("whatsapp_clicks").select("product_codigo").in("product_codigo", codes),
      ]);
      (prods || []).forEach((p: any) => { products[p.codigo] = { nome: p.nome, url_capa: p.url_capa }; });
      (clicks || []).forEach((c: any) => { waByCode[c.product_codigo] = (waByCode[c.product_codigo] || 0) + 1; });
    }

    setTop(rpcTop.map((r) => ({
      product_codigo: r.product_codigo,
      nome: products[r.product_codigo]?.nome || r.product_codigo,
      url_capa: products[r.product_codigo]?.url_capa || "",
      views: Number(r.total) || 0,
      wa_clicks: waByCode[r.product_codigo] || 0,
    })));

    setDaily(((b.data as RpcDaily[] | null) || []).map((r) => ({
      dia: String(r.day),
      total: Number(r.total) || 0,
      unicos: Number(r.unique_sessions) || 0,
    })));

    setSources((c.data as TrafficSource[] | null) || []);

    const cv = ((d.data as RpcConv[] | null) || [])[0];
    setConv({
      total_views: Number(cv?.visits) || 0,
      total_clicks: Number(cv?.clicks) || 0,
    });

    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [days]);
  return { top, daily, sources, conv, loading, reload: load };
}
