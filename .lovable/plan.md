
# Painel admin do Brechó da Vez

Criar uma área administrativa protegida por login para você cadastrar, editar e excluir produtos com upload de fotos direto pelo navegador.

## 1. Banco de dados (Lovable Cloud)

Criar tabela `products` espelhando o schema atual do `catalogo.json`:

- codigo (único), categoria, nome, descricao, marca, tecido, medidas, cor, tamanho
- tag (array de texto)
- preco_brl (numérico)
- condicao, status (Disponível / Vendido / Reservado)
- url_capa, url_galeria_1, url_galeria_2, url_galeria_3, url_video
- created_at, updated_at

Tabela `user_roles` com enum `app_role` ('admin', 'user') e função `has_role()` security definer (padrão seguro, evita recursão em RLS).

**Políticas RLS:**
- Leitura pública dos produtos (catálogo continua aberto a todos)
- Apenas admins podem inserir, atualizar ou excluir
- `user_roles`: apenas admins gerenciam

## 2. Storage de fotos

Bucket público `product-images` no Lovable Cloud.
- Leitura pública (para o site mostrar as fotos)
- Upload/delete restrito a admins
- Organização: `{codigo}/capa.jpg`, `{codigo}/galeria-1.jpg`, etc.

## 3. Autenticação

- Login por email/senha (sem confirmação de email, para você entrar direto)
- Criar seu usuário admin: **duffrayermauro@gmail.com** com a senha informada
- Atribuir role `admin` automaticamente a esse usuário
- Página `/auth` simples com formulário de login
- Página `/admin` protegida — redireciona pra `/auth` se não estiver logado ou se não for admin

## 4. Importação do catálogo atual

Edge function `import-catalog` que:
1. Busca `https://fotos.brechodavez.com.br/public/catalogo.json`
2. Insere todos os produtos na tabela `products`
3. Mantém as URLs originais das fotos do VPS (não baixa as imagens — fica mais rápido e elas continuam funcionando)

Botão "Importar catálogo do VPS" no painel admin dispara essa função. Pode rodar uma vez para popular tudo. Produtos novos cadastrados depois vão pro storage do Lovable.

## 5. Painel admin (`/admin`)

**Lista de produtos** — tabela com busca, filtro por status, ações editar/excluir.

**Formulário de cadastro/edição** com todos os campos do produto e área de upload:
- Capa (1 foto)
- Galeria (até 3 fotos)
- Vídeo (URL YouTube/Instagram)
- Drag-and-drop ou clique para selecionar
- Preview das imagens antes de salvar
- Ao salvar: faz upload pro bucket e grava a URL pública no produto

**Ações rápidas na lista**: marcar como Vendido / Reservado / Disponível com um clique.

## 6. Site público

Atualizar `sheetsService.ts` para buscar produtos da tabela `products` do Cloud em vez do JSON do VPS. Todo o restante do site (cards, detalhe, WhatsApp) continua igual — só muda a fonte dos dados.

Manter o fallback pro JSON do VPS caso o Cloud esteja indisponível.

## Arquivos afetados

- Migração SQL: tabelas `products`, `user_roles`, enum, função `has_role`, políticas RLS, bucket de storage
- `src/pages/Auth.tsx` (novo) — tela de login
- `src/pages/Admin.tsx` (novo) — painel
- `src/components/admin/ProductForm.tsx` (novo)
- `src/components/admin/ProductTable.tsx` (novo)
- `src/components/admin/ImageUploader.tsx` (novo)
- `src/hooks/useAuth.ts` (novo)
- `supabase/functions/import-catalog/index.ts` (novo) — edge function
- `src/services/sheetsService.ts` — passa a ler do Cloud
- `src/App.tsx` — rotas `/auth` e `/admin`

## Fluxo após implantação

1. Você acessa `/auth`, loga com seu email/senha
2. Entra no `/admin`, clica "Importar catálogo do VPS" → todos os produtos atuais aparecem
3. Daí em diante: cadastra novos produtos pelo formulário com upload direto
4. Edita status (vendido/reservado) com um clique
5. Site público mostra automaticamente as mudanças
