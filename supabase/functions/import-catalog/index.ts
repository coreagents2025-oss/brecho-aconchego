import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATALOG_URL = "https://fotos.brechodavez.com.br/public/catalogo.json";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Sessão inválida" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: roleData } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Apenas admins podem importar" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch catalog
    const res = await fetch(CATALOG_URL);
    if (!res.ok) throw new Error(`Falha ao buscar catálogo: ${res.status}`);
    const items = await res.json();

    const rows = items.map((item: any) => ({
      codigo: item.codigo || `TEMP-${Date.now()}-${Math.random()}`,
      categoria: item.categoria || "Outros",
      nome: item.nome || "Produto sem nome",
      descricao: item.descricao || "",
      marca: item.marca || "",
      tecido: item.tecido || "",
      medidas: item.medidas || "",
      cor: item.cor || "",
      tamanho: item.tamanho || "Único",
      tag: Array.isArray(item.tag)
        ? item.tag
        : typeof item.tag === "string"
        ? item.tag.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      preco_brl: parseFloat(item.preco_brl) || 0,
      condicao: item.condicao || "Usado",
      status: item.status || "Disponível",
      url_capa: item.url_capa || "",
      url_galeria_1: item.galeria?.[0] || "",
      url_galeria_2: item.galeria?.[1] || "",
      url_galeria_3: item.galeria?.[2] || "",
      url_video: item.url_video || item.video || "",
    }));

    // Upsert by codigo
    const { error: upsertErr, count } = await admin
      .from("products")
      .upsert(rows, { onConflict: "codigo", count: "exact" });

    if (upsertErr) throw upsertErr;

    return new Response(
      JSON.stringify({ success: true, imported: rows.length, count }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Erro import:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
