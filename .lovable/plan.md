# Plano: Sacola de Compras + Redesign Feminino

Duas entregas independentes, feitas em sequência num mesmo sprint.

---

## Parte 1 — Sacola (carrinho) com envio único no WhatsApp

**Objetivo:** cliente adiciona várias peças, revisa a sacola e envia UMA mensagem no WhatsApp com todos os itens.

### Fluxo do usuário
1. No card do produto e na página de detalhe, além do botão "Eu quero" atual, aparece "Adicionar à sacola".
2. Ícone de sacola fixo no topo (header) com contador de itens.
3. Ao clicar no ícone abre um **Drawer lateral** (shadcn `Sheet`) com:
   - Lista de itens (foto, nome, código, tamanho, preço, botão remover)
   - Subtotal
   - Botão "Finalizar pelo WhatsApp" (verde) — abre `wa.me` com mensagem consolidada
   - Botão "Continuar comprando"
4. Peças "Reservado" e "Vendido" **não** podem ir para a sacola (mantêm o CTA atual de interesse/indisponível).
5. Sacola persiste em `localStorage` (sobrevive a refresh, expira em 7 dias).

### Mensagem WhatsApp consolidada
```
Oi! Quero levar essas peças da sacola 💛

1. [Nome] — cód: XXX — tam: M — R$ 89,00
   🔗 link
2. ...

Total: R$ 267,00

Ainda estão disponíveis? ✨
```

### Arquivos a criar/editar
- **novo** `src/contexts/CartContext.tsx` — estado global (add, remove, clear, itens, total), persistência em localStorage
- **novo** `src/components/CartDrawer.tsx` — Sheet com lista e checkout
- **novo** `src/components/CartButton.tsx` — ícone + badge de contador
- **novo** `src/components/AddToCartButton.tsx` — botão "Adicionar à sacola" (some se Reservado/Vendido)
- **editar** `src/utils/whatsapp.ts` — nova função `generateCartWhatsAppLink(items)`
- **editar** `src/App.tsx` — envolver com `<CartProvider>`
- **editar** `src/components/ProductCard.tsx` — adicionar botão de sacola ao lado do WhatsApp
- **editar** `src/pages/ProductDetail.tsx` — adicionar botão de sacola
- **editar** `src/pages/Index.tsx` — mostrar `CartButton` no header
- **editar** `src/lib/tracking.ts` — evento `trackAddToCart` e `trackCartCheckout`

**Sem mudanças de banco.** A sacola é 100% client-side (localStorage). O rastreio de venda continua acontecendo quando o admin marca a peça como vendida no painel — nada muda no fluxo de sales.

---

## Parte 2 — Redesign feminino da home

**Objetivo:** deixar a página inicial com cara de **loja de roupas femininas** — mais editorial, delicada, aspiracional — mantendo a paleta atual (creme, cobre, verde musgo) que já é feminina/aconchegante.

### Mudanças visuais na home (`src/pages/Index.tsx`)
1. **Hero principal:**
   - Altura maior (70vh), imagem com leve zoom lento (Ken Burns)
   - Título em Cormorant Garamond itálico, escala maior (7xl no desktop)
   - Subtítulo curto e aspiracional: "Achadinhos com alma feminina"
   - CTA duplo: "Ver coleção" + "Novidades da semana"
   - Selo pequeno "Curadoria semanal • Peças únicas"
2. **Nova faixa de categorias** (logo abaixo do hero): cards circulares com foto para "Vestidos", "Blusas", "Saias", "Calças", "Acessórios" — funcionam como atalhos que filtram o catálogo.
3. **Faixa editorial** entre o hero e o catálogo: 3 mini-blocos com ícones + microtexto ("Peças selecionadas a mão", "Entrega no Brasil todo via correios/combinado", "Cada peça, uma história").
4. **Grid do catálogo:** cards com proporção mais alta (4:5), sombra mais suave, nome em serifada, preço destacado. Hover revela o botão "Adicionar à sacola".
5. **Nova seção "Peças em destaque"** antes do grid completo: 4 produtos aleatórios do status "Disponível" em layout maior/assimétrico.
6. **Footer CTA:** manter, mas com copy mais feminina ("Procurando algo especial para um look? Chama a gente 💌").

### Nova imagem de hero
Gerar 1 imagem hero premium: **still life feminino** — cabides de madeira com peças em tons terrosos/creme, luz natural quente, estética editorial de brechó boutique. Substitui `src/assets/hero-image.jpg` (usada como fallback quando não há banner ativo).

### Arquivos a editar/criar
- **editar** `src/pages/Index.tsx` — nova estrutura (hero + categorias + editorial + destaques + grid + footer)
- **novo** `src/components/CategoryStrip.tsx` — faixa circular de categorias
- **novo** `src/components/FeaturedGrid.tsx` — grid assimétrico de destaques
- **editar** `src/components/ProductCard.tsx` — refinamento visual (proporção 4:5, tipografia)
- **nova imagem** `src/assets/hero-boutique.jpg` (gerada via imagegen premium)

**Sem mudança na paleta/tokens** — o design system atual (`index.css`) já é feminino. Só ajustes de composição e tipografia.

---

## Fora deste plano (backlog)
- Wishlist/favoritos persistente por usuário (exigiria login para clientes)
- Checkout real com pagamento (mantemos WhatsApp como canal de fechamento)
- Reordenação drag-and-drop de banners

---

## Ordem de execução
1. Sacola (Parte 1) — funcionalidade
2. Redesign home (Parte 2) — visual
3. Verificação: testar adicionar 2–3 peças, abrir drawer, disparar WhatsApp e conferir mensagem consolidada.

Posso implementar?
