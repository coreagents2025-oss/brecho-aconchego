## Auditoria pré-produção — Brechó da Vez

Vou rodar uma varredura completa do app antes do go-live e entregar (1) um **relatório** com achados classificados por severidade e (2) **correções aplicadas** dos itens críticos e altos. Itens médios/baixos ficam listados com recomendação para você decidir se quer corrigir agora.

### Escopo

1. **Rotas & Navegação**
   - Verificar todas as rotas (`/`, `/p/:codigo`, `/auth`, `/admin`, `*`) — fallback 404, deep-links, refresh, redirect quando não autenticado/sem admin.
   - Links internos (Header/Footer/ProductCard/voltar) — alvos quebrados, `target=_blank` sem `rel=noopener`.
   - Botão voltar do navegador e scroll restoration entre rotas.
   - Guard do `/admin` (já redireciona para `/auth` se não admin — validar edge cases).

2. **Usabilidade**
   - Fluxo de compra via WhatsApp (CTA visível, mensagem pré-preenchida correta, tracking disparando).
   - Filtros (busca, categoria, tamanho, status, mostrar vendidos) — estado vazio, reset, combinações.
   - Galeria do produto, badges de status, produtos relacionados.
   - Popup promocional (1x por sessão, fechar, CTA).
   - Banners carrossel (autoplay, dots, click link).
   - Admin: formulário de produto, upload de imagens, ações em massa, registro de venda, dashboard de analytics.
   - Mensagens de erro/sucesso (toasts), estados de loading, confirmações de exclusão.

3. **Responsividade**
   - Testar viewports: 360, 390, 414, 768, 1024, 1280, 1920.
   - Hero (texto legível em mobile), grid do catálogo, filtros (overflow), galeria do produto, tabelas do admin, modais e tabs em mobile.
   - Tap targets ≥ 44×44, ausência de scroll horizontal, `h-screen` vs `h-dvh`.

4. **Layout & Design System**
   - Uso de tokens semânticos vs cores hardcoded (`text-white`, `bg-black`, `text-gray-*`).
   - Consistência tipográfica (Cormorant Garamond/Quicksand), espaçamentos, radius, sombras.
   - Contraste WCAG AA em textos sobre imagens (overlay do hero) e estados desabilitados.
   - Alinhamento de cards, alturas de imagem consistentes (`aspect-[3/4]`).

5. **Acessibilidade**
   - `alt` em imagens (hero/banner/produtos/galeria), `aria-label` em botões icon-only, labels em inputs/filtros, hierarquia de headings (h1 único por página), landmarks (`<main>`).
   - Foco visível, navegação por teclado em Dialog/Tabs/Select.

6. **SEO & Meta**
   - `index.html`: title atual OK, mas `og:title` está com UUID do projeto (corrigir), `og:image` é placeholder do Lovable (trocar pela imagem da marca), faltam `canonical` e `og:url`.
   - `<html lang="en">` deveria ser `pt-BR`.
   - Página de produto sem meta dinâmica (title/description/og por produto) — adicionar via `react-helmet-async` ou efeito que atualiza `document.title`.
   - JSON-LD `Product` na página de detalhe (nome, imagem, preço, disponibilidade).
   - `robots.txt` e sitemap (gerado estático com lista de produtos disponíveis).

7. **Performance & Console**
   - Console limpo (sem erros/warnings de React, chaves duplicadas, hooks).
   - Network: requisições falhando, imagens muito pesadas (lazy-loading no grid), preconnect ao host de imagens.
   - Bundle: revisar imports não usados.

8. **Segurança / Backend**
   - Rodar linter do Supabase (RLS, search_path em funções, policies anônimas indevidas).
   - Confirmar que tabelas de tracking aceitam INSERT anônimo apenas, SELECT só admin.
   - Conferir GRANTs em tabelas novas (`banners`, `popup`, `page_visits`, `product_views`, `whatsapp_clicks`).

### Entrega

- **Relatório** em chat agrupado por: 🔴 Crítico · 🟠 Alto · 🟡 Médio · 🔵 Baixo, com arquivo/linha e impacto.
- **Correções aplicadas** automaticamente para Crítico + Alto (ex.: lang pt-BR, og tags, meta dinâmica do produto, JSON-LD, alts faltando, aria-labels, tokens de cor, h-dvh, rel=noopener, fixes de responsividade).
- **Lista de Médios/Baixos** com sugestão — você decide se quero seguir.

### Fora de escopo (não toco)

- Mudanças de design / paleta / tipografia.
- Funcionalidades novas (apenas correções).
- Integração com Google Drive/Sheets (memória diz: usar VPS).
- Lógica de negócio do WhatsApp/fluxo de venda.

Pode aprovar que eu começo a auditoria.