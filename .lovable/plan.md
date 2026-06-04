## Auditoria pré-produção — Brechó da Vez

Relatório de achados (banco, rotas, funcionalidades) + roadmap dividido em sprints.

---

### 🔴 Banco de dados — Críticos

1. **Funções `SECURITY DEFINER` executáveis por qualquer usuário autenticado** (5 ocorrências: `top_products`, `daily_visits`, `traffic_sources`, `whatsapp_conversion`, `has_role`).
   - Mesmo com check interno `has_role`, o linter alerta. Solução: `REVOKE EXECUTE ... FROM authenticated, anon` nas 4 funções de analytics (manter só `service_role` + admin via RPC com check). `has_role` deve continuar acessível.
2. **`page_visits` / `product_views` / `whatsapp_clicks` aceitam INSERT anônimo com `WITH CHECK (true)`** — exposto a flood/spam.
   - Adicionar rate-limit por IP/sessão (trigger) ou ao menos validar formato de `session_id` e `path`. Considerar Edge Function intermediária com captcha leve ou throttle.
3. **Leaked Password Protection desativado** no Supabase Auth — habilitar HIBP.

### 🟠 Banco — Altos

4. Tabela **`products` com `SELECT` público (`USING true`)** — OK para catálogo, mas colunas `cost_price`, margens, ou campos internos (se houver) ficam expostos. Validar se todas as 21 colunas devem ser públicas; caso negativo, criar view pública.
5. **`sales` tem todas as policies corretas, mas falta índice** em `sold_at` (consulta mensal em `useMetrics`) e em `product_views.created_at` / `page_visits.created_at` (RPCs de analytics ficam lentas com volume).
6. **Sem política de retenção** para `page_visits` / `product_views` — vão crescer indefinidamente. Criar job/cron de purge > 180 dias.
7. **Bucket `product-images` é público** — confirmar que é intencional e adicionar política de tamanho/tipo no upload.

### 🟡 Banco — Médios

8. Faltam constraints: `products.status` deveria ser ENUM (hoje texto livre — "Disponível"/"Reservado"/"Vendido" depende de string).
9. Sem `updated_at` trigger em `banners`, `popup`, `sales` (verificar).
10. `whatsapp_clicks.product_codigo` sem FK para `products.codigo` — permite lixo.

---

### 🔴 Rotas & Funcionalidades — Críticos

1. **Edge function `bootstrap-admin` com email/senha hardcoded** em `supabase/functions/bootstrap-admin/index.ts` — **REMOVER antes do deploy**. Risco de criação não autorizada de admin.
2. **`.env.example` ainda referencia Google Sheets/Drive** (memória diz: usar VPS). Limpar para não confundir deploy.
3. **Service `src/services/sheetsService.ts` e `src/data/mockData.ts` ainda existem** e `useProducts` consome `sheetsService` — código morto que pode quebrar build de produção ou ser usado por engano.

### 🟠 Rotas — Altos

4. `/admin` sem **skeleton de loading** — flash de conteúdo / redirect visível.
5. Rota `*` (NotFound) precisa retornar status semântico e ter CTA de voltar (verificar).
6. Sem rota `/admin/*` aninhada — todas as tabs vivem em querystring/state; refresh perde a tab ativa.
7. **Sitemap estático** gerado em prebuild — produtos novos só aparecem em redeploy. Considerar gerar via Edge Function on-demand.

### 🟡 Funcionalidades — Médios

8. Popup: sem controle de frequência configurável (hoje fixo 1x/sessão).
9. Banners carrossel: sem preview de ordem no admin antes de salvar.
10. Falta confirmação dupla em exclusão de produto com vendas associadas.
11. Sem export CSV de vendas/analytics no admin.
12. Sem busca/paginação na lista de produtos do admin (carrega tudo).

### 🔵 Baixos

13. Imagens sem `srcset` / dimensões responsivas.
14. Falta favicon/manifest da marca (PWA leve).
15. Sem monitoramento de erros (Sentry ou similar).
16. Sem testes E2E mínimos (Playwright em fluxo de compra).

---

## Roadmap — 4 Sprints

### Sprint 1 — Segurança & Hardening (bloqueante para produção)
- Revogar EXECUTE das funções analytics para `authenticated`/`anon`.
- Habilitar Leaked Password Protection.
- Remover `bootstrap-admin` edge function (ou mover para script local com service key).
- Adicionar rate-limit nas tabelas de tracking (trigger por session_id + janela de tempo).
- Limpar `.env.example`, deletar `mockData.ts`, `sheetsService.ts`, `useProducts.ts` legado.
- Audit RLS final + rodar linter zerado.

### Sprint 2 — Integridade de Dados & Performance DB
- Migrar `products.status` para ENUM.
- Adicionar FKs faltantes (`whatsapp_clicks → products`).
- Criar índices: `sales.sold_at`, `product_views(product_codigo, created_at)`, `page_visits(created_at, session_id)`.
- Triggers `updated_at` onde faltar.
- Job de purge de analytics > 180 dias (pg_cron).
- View pública de `products` se houver colunas sensíveis.

### Sprint 3 — UX Admin & Funcionalidades
- Rotas aninhadas `/admin/produtos`, `/admin/vendas`, `/admin/analytics`, `/admin/banners`, `/admin/popup` com persistência de tab.
- Skeletons de loading em Admin e Index.
- Busca + paginação na lista de produtos do admin.
- Export CSV de vendas e analytics.
- Confirmação reforçada em exclusões com dependências.
- Popup: frequência configurável (1x/sessão, 1x/dia, sempre).
- Preview de ordem no banners manager (drag-and-drop).

### Sprint 4 — SEO, Observabilidade & Polish
- Sitemap dinâmico via Edge Function.
- `srcset` + dimensões nas imagens, favicon e manifest da marca.
- Integração Sentry (free tier) para erros em produção.
- Testes E2E Playwright: fluxo de compra WhatsApp + admin login + cadastro de produto.
- Lighthouse target ≥ 90 em Performance/SEO/A11y/Best Practices.
- Documentação final de deploy + runbook.

---

## Fora de escopo
- Mudanças de design / paleta / tipografia.
- Migração de hospedagem de imagens (já na VPS).
- Novas integrações de pagamento.

Aprove para começarmos pelo **Sprint 1** (bloqueante para go-live).
