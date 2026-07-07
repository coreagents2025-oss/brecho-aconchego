## Objetivo

Substituir todo o layout atual da home (`src/pages/Index.tsx`) por uma versão adaptada do componente "Cinematic Product Scroll", usando os produtos reais do catálogo, mantendo toda a lógica de negócio (filtros, sacola, WhatsApp, banners, popup, tracking).

## O que muda visualmente

```
┌──────────────────────────────────────────────┐
│  HERO CINEMATOGRÁFICO                        │
│  "BRECHÓ DA VEZ" em tipografia gigante       │
│  subtítulo · descrição · scroll indicator    │
│  (usa banner do admin como fundo se houver)  │
├──────────────────────────────────────────────┤
│  PRODUCT HERO (produto em destaque #1)       │
│  Imagem grande P&B → colorida no scroll      │
│  Lado oposto: título, preço, descrição,      │
│  tamanho, botão "Ver detalhes / Adicionar"   │
├──────────────────────────────────────────────┤
│  PRODUCT HERO #2 (invertido)                 │
├──────────────────────────────────────────────┤
│  PRODUCT HERO #3                             │
├──────────────────────────────────────────────┤
│  CATÁLOGO COMPLETO                           │
│  Filtros + grid de todos os produtos         │
│  (mantém ProductCard + AddToCartButton)      │
├──────────────────────────────────────────────┤
│  OVERVIEW — carrossel horizontal             │
│  (destaques com animação stagger de entrada) │
├──────────────────────────────────────────────┤
│  CTA WhatsApp final                          │
└──────────────────────────────────────────────┘
```

## Regras de adaptação (Next.js → Vite)

- `next/image` → `<img loading="lazy">`
- `next/link` → `Link` do `react-router-dom`, apontando para `/p/:codigo`
- `animejs` → instalar como dependência
- Cores: **NÃO** usar as cores do mock (`bg-primary/text-primary-foreground`). Usar os tokens do projeto: `bg-background`, `text-foreground`, `text-secondary` (copper), `bg-cream`, fonte `font-display` (Cormorant) para títulos e `font-body` (Quicksand) para corpo — mantendo a estética feminina/vintage já definida.
- Texto: "CLOSET STUDIO / EST. 2024" → "BRECHÓ DA VEZ / desde 2024 · curadoria feminina", descrição em português.
- Botão "QUICK VIEW" → dois botões: "Ver peça" (link para `/p/:codigo`) e "Adicionar à sacola" (usa `AddToCartButton`).

## Seleção de produtos em destaque

Os 3 primeiros produtos com `status === 'Disponível'` da lista real (`useProducts`) alimentam os `ProductHero`. O carrossel "Overview" mostra os próximos 8 disponíveis. Se houver menos de 3 disponíveis, ocultamos as seções vazias.

## Arquivos

**Novos**
- `src/components/home/CinematicHero.tsx` — hero fullscreen com título grande e scroll indicator
- `src/components/home/ProductHero.tsx` — seção 250vh com máscara de cor que revela no scroll
- `src/components/home/MinimalProductCard.tsx` — card do carrossel com clip-path circular no hover
- `src/components/home/HorizontalCollection.tsx` — carrossel horizontal com barra de progresso e animação anime.js
- `src/index.css` — adicionar keyframes `scroll-light`, `reveal`, e classe `.no-scrollbar`

**Modificados**
- `src/pages/Index.tsx` — reescrito compondo os novos componentes + mantendo `PromoPopup`, `CartButton`, `FiltersBar`, grid de catálogo, CTA WhatsApp final
- `package.json` — adicionar `animejs` + `@types/animejs`

**Preservado (sem tocar)**
- Toda a lógica de sacola (`CartContext`, `CartDrawer`, `AddToCartButton`)
- `useProducts`, `useBanners`, `PromoPopup`, `FiltersBar`, `ProductCard`, `WhatsAppButton`
- Tracking, admin, autenticação, rotas

## Detalhes técnicos

- Máscara de cor no `ProductHero`: `clip-path: inset(0 0 X% 0)` controlado por scroll listener (`passive: true`), com fallback horizontal em `< 768px`.
- Reveal steps: `IntersectionObserver` + classes `.active` aplicadas por `data-progress` (0.2 / 0.4 / 0.6 / 0.8).
- Animação de entrada do carrossel: `anime.js` com `stagger(150)`, easing `easeOutElastic(1, .6)`, disparado uma única vez via `IntersectionObserver` com `threshold: 0.2`.
- Imagens: usamos `product.url_capa` diretamente; se ausente, placeholder cinza.
- Responsivo: ProductHero vira layout empilhado (`grid-cols-1`) em mobile, altura auto em vez de 250vh.
- Acessibilidade: `alt` descritivo em cada imagem, `aria-label` nos botões do carrossel, foco visível preservado.

## Fora do escopo

- Filtros novos, wishlist, mudança de paleta, mudança do fluxo de checkout WhatsApp, mudanças em `/p/:codigo` ou admin.
