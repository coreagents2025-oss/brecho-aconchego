## O que vai mudar

### 1. Mockups nas galerias
Hoje, quando um produto não tem `url_galeria_1/2/3`, a galeria fica vazia ou mostra só a capa. Vou adicionar **imagens mockup hardcoded** que entram automaticamente nos slots vazios da galeria, garantindo que toda peça tenha uma galeria visualmente completa (4 slots).

- Crio 3 imagens mockup decorativas no estilo da marca (creme + cobre/musgo, ex: textura de tecido, etiqueta, fundo aconchegante) em `src/assets/`.
- No `ProductDetail.tsx`, ao montar `galleryImages`, preencho os slots faltantes com os mockups na ordem.
- Os mockups aparecem **só na galeria da página de produto** (ProductGallery). O `ProductCard` continua mostrando só a capa real (sem mockup), porque mockup em card de listagem polui a navegação.

> Obs.: você respondeu "em todas as fotos do site", mas faz mais sentido aplicar só nas galerias do detalhe — colocar mockup nos cards do catálogo faria parecer que existem peças que não existem. Se preferir aplicar nos cards também, me avise.

### 2. Vídeo na galeria (embed YouTube/Instagram)
- Adiciono campo opcional `url_video` no tipo `Product` e no parser do `sheetsService.ts` (lendo do JSON).
- Na galeria, se o produto tem `url_video`, ele entra como **mais um item** (após as fotos), exibindo:
  - Thumbnail (capa do produto com overlay escuro + ícone de Play grande no centro).
  - Ao clicar, o slot principal troca da imagem para um `<iframe>` do YouTube/Instagram embed.
  - Detecção automática da plataforma pela URL (youtube.com, youtu.be, instagram.com/reel|p).
- Thumbnail também aparece na faixa de miniaturas com um ícone de play sobreposto, para diferenciar de fotos.

### 3. JSON / catálogo
Adicionar `url_video` é opcional — produtos antigos sem o campo continuam funcionando normalmente. Você só precisa incluir `"url_video": "https://..."` no `catalogo.json` quando quiser.

## Arquivos afetados

- `src/types/product.ts` — adicionar `url_video?: string`
- `src/services/sheetsService.ts` — mapear `item.url_video`
- `src/assets/mockup-1.jpg`, `mockup-2.jpg`, `mockup-3.jpg` — gerar 3 imagens decorativas (premium quality)
- `src/components/ProductGallery.tsx` — aceitar `videoUrl?`, renderizar item de vídeo com play overlay, trocar para iframe quando selecionado, helper para extrair embed URL do YouTube/Instagram
- `src/pages/ProductDetail.tsx` — preencher slots vazios com mockups, passar `videoUrl` para `ProductGallery`

## Detalhes técnicos

- Helper `getEmbedUrl(url)` reconhece:
  - `youtube.com/watch?v=ID` → `youtube.com/embed/ID`
  - `youtu.be/ID` → `youtube.com/embed/ID`
  - `instagram.com/reel/ID` ou `/p/ID` → `instagram.com/reel/ID/embed`
- Mockups: `import mockup1 from '@/assets/mockup-1.jpg'` etc., em uma constante `FALLBACK_GALLERY = [mockup1, mockup2, mockup3]`.
- Slot do vídeo no array da galeria marcado como `{ type: 'video', url }` vs `{ type: 'image', url }` para o componente saber o que renderizar.
