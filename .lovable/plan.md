# Plano: Gestão & Analytics no Painel Admin

Expandir o `/admin` para além do cadastro: banners do carrossel, popup promocional, métricas de visitas e ranking de produtos.

## 1. Banco de dados (nova migration)

Tabelas novas no schema `public`:

- **`banners`** — `id`, `titulo`, `subtitulo`, `imagem_url`, `link_url`, `ordem` (int), `ativo` (bool), `created_at`, `updated_at`. RLS: leitura pública dos ativos; admin gerencia.
- **`popup`** — `id`, `titulo`, `mensagem`, `imagem_url`, `cta_texto`, `cta_url`, `ativo` (bool, único ativo por vez), `updated_at`. RLS: leitura pública do ativo; admin gerencia.
- **`page_visits`** — `id`, `path`, `session_id` (uuid gerado no client e salvo no localStorage), `referrer`, `source` (direct/instagram/google/whatsapp/outros — derivado do referrer), `user_agent`, `created_at`. RLS: INSERT público; SELECT só admin.
- **`product_views`** — `id`, `product_codigo`, `session_id`, `created_at`. RLS: INSERT público; SELECT só admin.
- **`whatsapp_clicks`** — `id`, `product_codigo` (nullable, p/ cliques genéricos), `session_id`, `created_at`. RLS: INSERT público; SELECT só admin.

Índices em `created_at`, `product_codigo`, `session_id`. GRANTs apropriados (anon: INSERT em tabelas de tracking + SELECT em banners/popup ativos; authenticated/service_role completos).

Funções SQL `SECURITY DEFINER` para agregações (admin only):
- `top_products(days int)` → top 10 por views + cliques WA.
- `daily_visits(days int)` → série diária total/único.
- `traffic_sources(days int)` → contagem por source.
- `whatsapp_conversion(days int)` → views vs cliques por produto.

## 2. Storage

Reaproveitar bucket `product-images` com pastas `banners/` e `popup/` (ou criar bucket `marketing` público — pendente decisão simples; vou usar pastas no bucket existente para manter simplicidade).

## 3. Tracking (front público)

- `src/lib/tracking.ts`: gera/lê `session_id` em localStorage; expõe `trackPageView(path)`, `trackProductView(codigo)`, `trackWhatsAppClick(codigo?)`. Calcula `source` a partir de `document.referrer`.
- Hook `useTrackPageView()` chamado em `Index.tsx` e `ProductDetail.tsx` (no `useEffect` com path).
- `trackProductView` disparado em `ProductDetail.tsx` ao carregar o produto.
- `trackWhatsAppClick` inserido em `WhatsAppButton.tsx` e nos CTAs do admin/site que abrem WhatsApp.
- Inserts feitos com Supabase client (RLS permite INSERT anônimo).

## 4. Consumo público de banners e popup

- `useBanners()` lê banners ativos ordenados; substitui imagens fixas do Hero/Carrossel da Home.
- `usePopup()` lê popup ativo; novo componente `PromoPopup.tsx` exibe 1x por sessão (flag em sessionStorage), botão fechar + CTA.

## 5. Painel admin — novas abas

`Admin.tsx` ganha mais tabs no `<Tabs>`:

```text
[ Dashboard ] [ Produtos ] [ Vendas ] [ Banners ] [ Popup ]
```

- **Dashboard** (`AnalyticsDashboard.tsx`): seletor de período (7/30 dias) + 4 blocos:
  - Top 10 produtos (tabela com foto, nome, views, cliques WA, taxa).
  - Visitas por dia (gráfico de linha — recharts).
  - Conversão WhatsApp (total views vs cliques, % geral e por produto top).
  - Origem do tráfego (gráfico de pizza/barras).
- **Banners** (`BannersManager.tsx`): lista com drag-handle p/ ordem, toggle ativo, editar, excluir, novo. Form com upload (reusa `GalleryUploader` simplificado p/ 1 imagem), título, subtítulo, link.
- **Popup** (`PopupManager.tsx`): form único editando o registro ativo; preview ao lado; switch para ativar/desativar.

Métricas atuais (`MetricsBar`) ficam no topo do Dashboard.

## 6. Arquivos a criar/editar

**Novos**
- `supabase/migrations/<ts>_marketing_analytics.sql`
- `src/lib/tracking.ts`
- `src/hooks/useTracking.ts`, `useBanners.ts`, `usePopup.ts`, `useAnalytics.ts`
- `src/components/PromoPopup.tsx`
- `src/components/admin/AnalyticsDashboard.tsx`
- `src/components/admin/BannersManager.tsx`
- `src/components/admin/BannerForm.tsx`
- `src/components/admin/PopupManager.tsx`

**Editados**
- `src/pages/Admin.tsx` — novas tabs.
- `src/pages/Index.tsx` — `useBanners`, tracking, render do `<PromoPopup/>`.
- `src/pages/ProductDetail.tsx` — `trackProductView`.
- `src/components/WhatsAppButton.tsx` — `trackWhatsAppClick`.
- `src/App.tsx` — chamar `usePageViewTracker` global (route change).

## 7. Não muda

Auth, fluxo WhatsApp, design (cream/cobre, rounded-2xl, Cormorant), import do VPS, tabelas existentes (`products`, `sales`, `user_roles`).

Posso seguir com a migration?
