
# Painel admin: melhorias práticas

Manter a base atual (lista + formulário) e adicionar 5 frentes objetivas, sem inflar a UI.

## 1. Dashboard de métricas (topo do /admin)

Faixa de cards compactos acima da lista, com dados calculados em tempo real da tabela `products` e `sales`:

- Total de peças cadastradas
- Disponíveis / Reservadas / Vendidas (3 contadores)
- Valor do estoque disponível (soma de `preco_brl` onde status = Disponível)
- Vendas do mês (qtde + R$ faturado, da tabela `sales`)
- Ticket médio do mês

Layout: grid responsivo de cards `rounded-2xl` em creme, ícones lucide, números grandes em Cormorant. Recolhível em mobile.

## 2. Registro de vendas

Nova tabela `sales` no banco para guardar histórico completo:

- referência ao produto (codigo)
- data da venda
- canal: WhatsApp / Instagram / Presencial / Outro
- valor final (pode diferir do preço de tabela — desconto)
- nome do comprador (opcional)
- contato do comprador (opcional)
- observações

**Fluxo:** quando o admin muda status para "Vendido" (na lista ou no form), abre modal pedindo esses dados antes de confirmar. Cancelar = não muda o status. Confirmar = grava venda + atualiza produto.

Aba/seção "Vendas" no painel mostra histórico em tabela com filtro por mês, busca por código/comprador, e botão para editar/excluir um registro (caso de erro).

Reverter "Vendido → Disponível" pergunta se quer apagar o registro de venda correspondente.

## 3. Ações em massa

Checkbox na primeira coluna da lista + checkbox no header (selecionar todos da página).

Barra flutuante aparece quando há seleção, com:

- Mudar status (Disponível / Reservado / Vendido) — se Vendido, abre modal de venda por item
- Excluir selecionados (confirmação)
- Duplicar selecionados

## 4. Duplicar produto

Botão "Duplicar" (ícone Copy) em cada linha + opção em ações em massa.

Comportamento: abre o formulário pré-preenchido com todos os campos do produto original **exceto** código (sugere `{codigo}-COPIA` editável) e status (volta pra Disponível). Imagens vêm preenchidas com as URLs originais — admin pode trocar antes de salvar.

## 5. Upload múltiplo de fotos

Reformular `ImageUploader` para um componente único `GalleryUploader` que aceita:

- Drag-and-drop de várias imagens de uma vez (até 4: capa + 3 galeria)
- Cada thumbnail mostra badge "Capa" / "Galeria 1/2/3"
- Drag para reordenar (a primeira vira capa)
- Botão X para remover
- Upload simultâneo com indicador de progresso por foto
- Validação: máx 4 imagens, formatos jpg/png/webp, tamanho máx 5MB cada

Salva no bucket `product-images` em `{codigo}/capa.jpg`, `{codigo}/galeria-N.jpg` e grava URLs públicas no produto.

## 6. Filtro por categoria

Adicionar Select "Todas as categorias" ao lado do filtro de status. Categorias carregadas dinamicamente (distinct) da tabela.

---

## Estrutura técnica

**Migração SQL:**

```text
- CREATE TABLE public.sales (
    id, product_codigo, sold_at, channel, final_price,
    buyer_name, buyer_contact, notes, created_at
  )
- GRANT + RLS: leitura/escrita só para admins
- Índice em product_codigo e sold_at
```

**Arquivos novos:**

- `src/components/admin/MetricsBar.tsx` — cards do dashboard
- `src/components/admin/SaleDialog.tsx` — modal de registro de venda
- `src/components/admin/SalesHistory.tsx` — tabela de vendas
- `src/components/admin/GalleryUploader.tsx` — substitui `ImageUploader` (mantém antigo só se necessário)
- `src/components/admin/BulkActionsBar.tsx` — barra flutuante de seleção
- `src/hooks/useMetrics.ts` — agrega contadores e valores

**Arquivos editados:**

- `src/pages/Admin.tsx` — abas "Produtos | Vendas", métricas no topo, seleção múltipla, filtro categoria
- `src/components/admin/ProductForm.tsx` — usa novo `GalleryUploader`, intercepta mudança para "Vendido"
- `src/integrations/supabase/types.ts` — auto-regenerado

**Não muda:** site público, fluxo WhatsApp, autenticação, tipografia, paleta. A estética cozy/cream com `rounded-2xl` e Cormorant é preservada em todos os novos componentes.

## Fluxo final pra você

1. Entra em `/admin` → vê o pulso do brechó na hora (estoque, vendas do mês)
2. Aba "Produtos": lista com filtros, seleção múltipla, duplicar com 1 clique
3. Cadastra novo produto arrastando 4 fotos de uma vez, reordena a capa
4. Marca como vendido → modal pede canal, valor final, comprador → salva histórico
5. Aba "Vendas": vê tudo que vendeu no mês, faturamento, edita se errou algo
