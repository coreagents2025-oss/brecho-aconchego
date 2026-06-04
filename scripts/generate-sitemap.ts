// Generates public/sitemap.xml at predev/prebuild. Pulls public products from Supabase.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://app.brechodavez.com.br";
const SUPABASE_URL = "https://gaqlbytjwvejwcunwpck.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcWxieXRqd3ZlandjdW53cGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTY5NjUsImV4cCI6MjA5NDUzMjk2NX0.h826WsSYmtHHyPiu_O1Oa9NrLa2ZBH4nGwQin9QcctQ";

interface Entry { path: string; lastmod?: string; changefreq?: string; priority?: string }

async function fetchProducts(): Promise<Array<{ codigo: string; updated_at: string }>> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=codigo,updated_at&status=neq.Vendido`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

function build(entries: Entry[]) {
  const urls = entries.map((e) => [
    `  <url>`,
    `    <loc>${BASE_URL}${e.path}</loc>`,
    e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
    e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
    e.priority ? `    <priority>${e.priority}</priority>` : null,
    `  </url>`,
  ].filter(Boolean).join("\n"));
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

const products = await fetchProducts();
const entries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  ...products.map((p) => ({
    path: `/p/${p.codigo}`,
    lastmod: p.updated_at?.slice(0, 10),
    changefreq: "weekly",
    priority: "0.8",
  })),
];

writeFileSync(resolve("public/sitemap.xml"), build(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
