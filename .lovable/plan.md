## Objetivo
Melhorar a legibilidade do headline "Brechó da Vez" no banner principal (`CinematicHero`), que está se perdendo sobre a foto de fundo — especialmente o "da Vez" em itálico cor cobre.

## Diagnóstico
- Overlay atual é muito claro (`from-cream/70 via-cream/40 to-cream/90`) e deixa a foto competir com o texto.
- "da Vez" usa `text-secondary` (cobre) em `font-light`, que quase desaparece sobre os tons quentes da imagem.
- "Brechó" em `text-foreground` sem sombra também perde contraste em áreas claras da foto.
- Kicker e parágrafo sofrem do mesmo problema em menor grau.

## Alterações (apenas `src/components/home/CinematicHero.tsx`)

1. **Overlay mais forte e direcional**  
   Trocar o gradiente por um combo que escureça o centro sem apagar a foto:
   - Camada 1: `bg-gradient-to-b from-background/60 via-background/30 to-background/85` (mantém respiração topo/base).
   - Camada 2 (nova): viñeta radial suave centrada — `radial-gradient(ellipse at center, hsl(var(--background)/0.55) 0%, transparent 65%)` via `style` — foca contraste atrás do headline.

2. **Headline com mais peso e contraste**
   - "Brechó": `font-medium` → mantém, adicionar `drop-shadow-[0_2px_20px_hsl(var(--background)/0.6)]`.
   - "da Vez": trocar `text-secondary font-light` por `text-foreground/90 font-normal italic` e aplicar `drop-shadow` igual. O tom cobre pode voltar como sublinhado/detalhe se necessário, mas não como cor principal do texto.
   - Reduzir levemente o tamanho no desktop: `lg:text-[9rem]` (em vez de 10rem) para caber melhor com a foto e reduzir área de conflito.

3. **Kicker e parágrafo**
   - Kicker: `text-secondary` → `text-foreground/80` mantendo tracking; adicionar `drop-shadow-sm`.
   - Parágrafo: `text-muted-foreground` → `text-foreground/75` com `drop-shadow-sm`.

4. **CTA "Catálogo completo"**  
   Aumentar backdrop para `bg-background/60` para não sumir sobre áreas claras.

## Fora de escopo
- Trocar a imagem de fundo.
- Alterar tokens de cor globais, tipografia ou animação de reveal/parallax.
- Mexer em outras seções (`ProductHero`, catálogo, footer).

## Verificação
- `bunx tsgo --noEmit`.
- Playwright screenshots em 1280px e 390px comparando antes/depois do headline.
