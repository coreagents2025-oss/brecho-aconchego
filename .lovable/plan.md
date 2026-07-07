
## Diagnóstico

Ao rolar a home, três problemas quebram o ritmo:

1. **Botões inconsistentes**: pílulas arredondadas no hero e no ProductHero (`rounded-full` cobre + `Ver peça` preto pill) e a "pill verde" de status ainda com emoji — nada disso combina com o botão editorial largo do catálogo (borda hairline + uppercase tracking).
2. **Voids brancos entre seções**: cada `ProductHero` mede `250vh` com o conteúdo lateral só aparecendo depois de `data-progress > 0.15`. Antes disso metade da tela fica creme vazio. E as três seções seguidas amplificam a sensação de "bagunça".
3. **HorizontalCollection e MinimalProductCard** ainda usam pílula "Ver peça", cantos serifados e borda que destoam do catálogo.

## O que muda

### 1. `src/components/StatusBadge.tsx` — repaginar como micro-tag editorial
- Remover emojis, `rounded-full`, cores berrantes.
- Novo estilo (mesmo padrão do `ProductCard`): `text-[9px] uppercase tracking-[0.3em] py-1.5 px-3 font-body font-medium`, quadrado.
  - Disponível: `bg-background/85 backdrop-blur text-foreground`
  - Reservado: `bg-secondary text-secondary-foreground`
  - Vendido: `bg-foreground/70 text-background backdrop-blur`
- Isso corrige automaticamente a "pill verde" que aparecia no `ProductHero`.

### 2. `src/components/home/CinematicHero.tsx` — CTAs editoriais + limpeza
- Substituir os dois `Button` cobre pill por dupla de botões editoriais:
  - Primário: `Ver destaques` → botão cheio `bg-foreground text-background py-4 px-10 text-[10px] uppercase tracking-[0.4em]` (quadrado, sem `rounded-full`).
  - Secundário: `Catálogo completo` → `border border-foreground/30 text-foreground bg-background/40 backdrop-blur py-4 px-10 text-[10px] uppercase tracking-[0.4em]` com hover invertendo para foreground.
- Remover emoji ✨ do label.
- Manter animação `reveal` e o indicador de scroll "ROLE PARA VER" (já editorial).

### 3. `src/components/home/ProductHero.tsx` — eliminar o void e padronizar botões
- Reduzir `md:h-[250vh]` para `md:h-[200vh]` (menos "corredor" vazio) e diminuir gap entre seções.
- Mudar os `data-progress` dos reveal-steps para: título `0`, descrição `0.05`, meta `0.1`, botões `0.15` — o conteúdo já entra "montado" quando a seção sticka, acabando com a coluna direita em branco.
- Aplicar `bg-muted` na coluna direita (mesmo creme do restante) mas com um leve `border-l border-foreground/5` para dar acabamento sem cair para branco puro.
- Substituir os dois botões finais:
  - "Ver peça": `w-full py-4 border border-foreground/20 text-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors` (quadrado, sem `rounded-full`, sem ícone olho).
  - `AddToCartButton` recebe o mesmo `className` editorial (`w-full py-4 rounded-none bg-foreground text-background border border-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-background hover:text-foreground`) — invertido para diferenciar do "Ver peça" fora do sticky.
- Header "categoria · tamanho" continua, mas o preço em `text-secondary uppercase tracking-[0.2em]` (mesma linguagem do card).

### 4. `src/components/home/MinimalProductCard.tsx` — alinhar ao card editorial
- Remover as 4 marcas serifadas de canto (`w-8 h-[1px] bg-secondary/50` × 4).
- Remover `border border-border/50 hover:border-secondary/60` — deixar card sem contorno.
- Substituir a pílula "Ver peça" por link hairline centralizado com underline animado (mesmo estilo do CTA de rodapé), ou `py-3 px-6 border border-background text-background text-[10px] uppercase tracking-[0.3em]` quadrado, mantendo aparição no hover.
- Legenda embaixo alinhada à esquerda em vez de centralizada, e usando a mesma hierarquia do `ProductCard` (nome italic, preço cobre uppercase).

### 5. `src/components/home/HorizontalCollection.tsx` — ritmo e header consistente
- Padronizar spacing: `py-24 md:py-32` como o catálogo (em vez de `pt-16 pb-8`), com `border-t border-foreground/10` no topo (já tem, ok).
- Header: kicker `Panorama` em `text-muted-foreground` (não cobre) e link `Ver catálogo` em `text-[10px] uppercase tracking-[0.3em] border-b border-foreground/20 hover:border-secondary` (sem seta pra baixo grande).
- Indicador de progresso hairline `bg-foreground/10` (já ok), mas cursor em `bg-foreground` para reduzir uso de cobre.

### 6. Ritmo global (em `src/pages/Index.tsx`)
- Já usa `py-24 md:py-32` no catálogo. Não precisa mexer no Index; o gap "sobrando" some quando (a) ProductHero preenche a coluna e (b) HorizontalCollection tem o mesmo padding vertical.

## Fora de escopo
- Página de detalhe (`/p/:codigo`), `WhatsAppButton`, `CartDrawer`, `PromoPopup`, admin, tokens de cor/tipografia.
- Nenhuma mudança em conteúdo, roteamento ou dados.

## Detalhes técnicos
- Sem cores hardcoded — apenas tokens (`foreground`, `background`, `secondary`, `muted`, `muted-foreground`).
- `StatusBadge` mantém API (mesmo `status`/`className`) — todas as chamadas continuam funcionando; ProductCard já contém tag inline mas ainda usa componente em ProductHero.
- Reveal-steps: só ajustar valores em `data-progress`, sem mexer no observer.
- Nenhuma dependência nova.

## Validação
- `bunx tsgo --noEmit`.
- Playwright: screenshots em 1280px e 390px cobrindo hero, dois ProductHeros consecutivos e HorizontalCollection para confirmar que:
  1. Botões seguem mesmo padrão do catálogo.
  2. Não há mais faixa branca vazia ao lado da imagem do ProductHero.
  3. Espaçamento vertical entre seções é uniforme.
