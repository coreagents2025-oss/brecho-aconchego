
## Objetivo

Alinhar a seção de catálogo, a barra de filtros e o CTA de rodapé ao mesmo tom editorial/cinematográfico das novas seções (hero, ProductHero, coleção horizontal), removendo o visual de "ecommerce genérico" atual.

Referência escolhida: **Galeria editorial com CTA cheio** — cards sem contorno, foto em `aspect-[3/4]` que "sangra", nome em Cormorant italic, código à direita, preço em cobre com tracking, botão "Adicionar à sacola" em largura total, ação WhatsApp aparece em hover como bolha circular sobre a foto, status como micro-tag flutuante.

## O que muda

### 1. `src/components/ProductCard.tsx` (reescrever visual, manter API e lógica)
- Remover `bg-card`, `rounded-2xl`, `shadow`, `border`. Card = coluna simples.
- Foto: `aspect-[3/4]`, fundo `#EAE5DE` (muted), `object-cover`, `transition-transform duration-1000 group-hover:scale-110`. Link mantido para `/p/:codigo`.
- Status como micro-tag no canto superior direito (`text-[9px] uppercase tracking-[0.3em] px-4 py-1.5`):
  - Disponível → fundo `bg-background/80 backdrop-blur` texto foreground
  - Reservado com carinho → fundo `bg-secondary` (cobre) texto branco
  - Novo lar encontrado (vendido) → fundo `bg-muted-foreground/80` texto branco + foto com `opacity-60`
- Overlay hover só para Disponível: bolha circular `w-12 h-12 rounded-full bg-background` com ícone WhatsApp, dispara `openWhatsAppForProduct`.
- Metadados abaixo da foto (`mt-8 space-y-3`):
  - Linha 1: `<h3 font-display italic text-2xl>` nome | `<span text-[11px] tracking wide muted>` código
  - Linha 2: preço em `text-[13px] uppercase tracking-[0.2em] text-secondary font-medium` (para vendido: "Esgotado", em muted)
  - Linha 3: botão largo `py-4 border border-foreground/10 text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background` = `AddToCartButton` (variante ghost editorial); para vendido = "Vendido" desabilitado; para reservado = "Avisar quando liberar" continua abrindo WhatsApp.
- Chips de tamanho/categoria embaixo removidos (já ficam no filtro); manter marca só se existir, como texto pequeno em muted acima do nome.

### 2. `src/components/AddToCartButton.tsx`
- Adicionar variante `editorial` (ou aceitar `className` para sobrescrever) para casar com o botão largo do card sem quebrar usos existentes na página de detalhe.

### 3. `src/components/FiltersBar.tsx` (reescrever visual, manter props)
Layout de barra editorial em cima do grid:
```
┌──────────────────────────────────────────────────────────────┐
│ O Acervo (Cormorant italic)     [BUSCAR....] [TAM ▾] ○ Ver vendidos │
│ Todos · Vestidos · Blusas · Calças · Saias · Sapatos · …     │
└──────────────────────────────────────────────────────────────┘  border-b hairline
```
- Título "O Acervo" (Cormorant italic 5xl).
- Categorias como links de texto uppercase `tracking-[0.25em]`, ativa recebe `border-b border-secondary pb-1 font-bold`. Preenche a partir de categorias existentes no dataset.
- Input de busca minimal (só border-b, expande no focus).
- Select nativo estilizado para tamanho + botão toggle "Ocultar vendidos" (radio dot cobre quando ativo).
- Remover o filtro de status (redundante com "Ver vendidos") — mantém prop mas passa `'all'` fixo. Se a estatística mostrar necessidade, adicionar seletor pequeno estilo select.
- Sem card container `bg-card rounded-2xl` externo. Só `border-b border-foreground/10 pb-10`.

### 4. `src/pages/Index.tsx`
- Substituir o bloco `Coleção completa` / `text-center` + wrapper `container mx-auto px-4 py-16` por seção nova baseada na referência:
  - `<section id="catalog" className="bg-background py-24 md:py-32 px-6">` `<div className="max-w-6xl mx-auto">`
  - Cabeçalho + filtros = `<FiltersBar />` reescrito.
  - Contador de peças em `text-[10px] uppercase tracking-[0.3em] text-muted-foreground` acima do grid.
  - Grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24`.
  - Skeleton e vazio reescritos no mesmo tom (sem emojis; usar linha divisória hairline + texto italic Cormorant).
- Substituir o CTA rodapé (bloco `bg-gradient-warm rounded-3xl`) por um encerramento editorial:
  - `<div className="mt-32 border-t border-foreground/10 pt-20 text-center">`
  - Frase em Cormorant italic + botão "Conversar no WhatsApp" no mesmo estilo do direção escolhida (link com haste vertical animada de cobre).

### 5. `src/index.css`
- Adicionar utilitário `.hairline-reveal` (haste vertical do CTA) se necessário — reaproveitar keyframes já existentes.

## Fora de escopo
- Não mexer no CinematicHero, ProductHero, HorizontalCollection, MinimalProductCard.
- Não mexer no CartDrawer, CartContext, useProducts, PromoPopup, admin, rotas.
- Não alterar página de detalhe (`/p/:codigo`).
- Não trocar paleta nem fontes.

## Detalhes técnicos

- Tokens: usar `text-foreground`, `bg-background`, `text-secondary` (cobre), `bg-muted`, `border-foreground/10` — nada de cores hardcoded.
- Ícone WhatsApp: `lucide-react` `MessageCircle` (já em uso) para bolha hover.
- Categorias dinâmicas: derivar de `products` via `useMemo(() => Array.from(new Set(products.map(p => p.categoria))).sort())`.
- Acessibilidade: cada botão editorial mantém `aria-label` descritivo; status tag como `<span role="status">`.
- Responsivo mobile: cabeçalho de filtros vira coluna (`flex-col`), grid cai para 1 coluna, botões continuam largura total.
