import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Banner {
  id: string;
  titulo: string;
  subtitulo: string;
  imagem_url: string;
  link_url: string;
  ordem: number;
  ativo: boolean;
}

export function useBanners(onlyActive = true) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    let q = supabase.from("banners").select("*").order("ordem", { ascending: true });
    if (onlyActive) q = q.eq("ativo", true);
    const { data } = await q;
    setBanners((data as Banner[]) || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [onlyActive]);
  return { banners, loading, reload: load };
}
