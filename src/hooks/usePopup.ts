import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PopupData {
  id: string;
  titulo: string;
  mensagem: string;
  imagem_url: string;
  cta_texto: string;
  cta_url: string;
  ativo: boolean;
}

export function usePopup() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("popup").select("*").eq("ativo", true).limit(1).maybeSingle();
    setPopup(data as PopupData | null);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);
  return { popup, loading, reload: load };
}
