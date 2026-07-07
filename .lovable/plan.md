## Problema

A seção "Panorama" (`HorizontalCollection`) renderiza o cabeçalho ("PANORAMA" / "VER CATÁLOGO"), mas a área dos cards fica em branco.

**Causa raiz:** cada card é envolvido em uma `div` com classe `opacity-0`, e só se torna visível quando um `IntersectionObserver` dispara uma animação do `anime.js`. Se o observer não dispara (seção já visível ao carregar sem cruzar o threshold de 0.2, animação falha silenciosamente, ou o navegador atrasa o callback), os cards permanecem invisíveis — a seção fica em branco.

Isso é frágil: a visibilidade do conteúdo depende 100% de JS externo funcionar.

## Correção

Arquivo: `src/components/home/HorizontalCollection.tsx`

1. Remover `opacity-0` do wrapper dos cards — cards ficam visíveis por padrão. A animação vira melhoria progressiva.
2. Simplificar o efeito: em vez de esconder e revelar via `IntersectionObserver` + `anime.js`, aplicar uma animação leve de entrada (fade + slide curto) só quando a seção entra na viewport, sem depender dela para exibir o conteúdo. Se algo falhar, os cards continuam visíveis.
3. Manter `anime.js` como enhancement — se não animar, sem prejuízo visual.

Nenhuma outra seção, layout, espaçamento, tipografia ou token é alterada. Escopo isolado ao `HorizontalCollection`.

## Verificação

- `bunx tsgo --noEmit`
- Playwright: abrir `/`, rolar até a seção Panorama, screenshot em 1280px e 390px confirmando cards visíveis.
- Checar console: sem erros de animejs.
