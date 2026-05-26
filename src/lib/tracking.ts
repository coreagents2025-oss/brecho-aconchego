import { supabase } from "@/integrations/supabase/client";

const KEY = "bdv_session_id";

export function getSessionId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

function detectSource(referrer: string): string {
  if (!referrer) return "direct";
  const r = referrer.toLowerCase();
  if (r.includes("instagram")) return "instagram";
  if (r.includes("google")) return "google";
  if (r.includes("facebook")) return "facebook";
  if (r.includes("whatsapp") || r.includes("wa.me")) return "whatsapp";
  if (r.includes("brechodavez") || r.includes(location.host)) return "internal";
  return "outros";
}

export async function trackPageView(path: string) {
  try {
    await supabase.from("page_visits").insert({
      path,
      session_id: getSessionId(),
      referrer: document.referrer || "",
      source: detectSource(document.referrer || ""),
      user_agent: navigator.userAgent.slice(0, 200),
    });
  } catch {}
}

export async function trackProductView(codigo: string) {
  try {
    await supabase.from("product_views").insert({
      product_codigo: codigo,
      session_id: getSessionId(),
    });
  } catch {}
}

export async function trackWhatsAppClick(codigo?: string) {
  try {
    await supabase.from("whatsapp_clicks").insert({
      product_codigo: codigo ?? null,
      session_id: getSessionId(),
    });
  } catch {}
}
