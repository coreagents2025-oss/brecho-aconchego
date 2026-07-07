## Problema
Entre a `HorizontalCollection` e a seção `#catalog` há um espaço vertical grande porque as duas seções aplicam `py-24 md:py-32` — os paddings inferior e superior se somam (~192px no mobile, ~256px no desktop).

## Alteração
Apenas presentational, sem tocar em lógica.

1. **`src/components/home/HorizontalCollection.tsx` (linha 66)**  
   Trocar `py-24 md:py-32` por `pt-24 md:pt-32 pb-0` — mantém respiração no topo e zera o padding inferior.

2. **`src/pages/Index.tsx` (seção `#catalog`, linha ~119)**  
   Trocar `py-24 md:py-32` por `pt-16 md:pt-20 pb-24 md:pb-32` — o filtro passa a começar logo depois do divisor da coleção horizontal, com apenas um respiro leve.

Resultado: um único intervalo controlado (~64–80px) entre as duas seções, mantendo o padding inferior do catálogo intacto.

## Fora de escopo
Ajustes em outras seções, tokens, tipografia, hero, cards ou animações.

## Verificação
- `bunx tsgo --noEmit`.
- Playwright screenshots em 390px e 1280px focadas na transição HorizontalCollection → #catalog.
