# 🤍 Brechó da Vez - Guia de Produção

## 📋 Configuração para VPS

### 1. Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e configure:

```bash
# Google Sheets CSV URL (planilha publicada)
VITE_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vSRarPXxFKCAPHaW9qOk9cSeTUHZqGlQThvnGVSfHxEOwL2MdpBs_FmFo01zk-xqA/pub?output=csv

# WhatsApp Business Number (com código do país, sem +)
VITE_WA_NUMBER=5541995299244

# URL do site para compartilhamento
VITE_SITE_URL=http://brechodavez.com.br

# Nome da marca
VITE_BRAND_NAME=Brechó da Vez

# ID da pasta do Google Drive com imagens
VITE_DRIVE_FOLDER_ID=1Zbz9K6kMMj2woxUIkdySPrAnxLaZgi-R
```

### 2. Build de Produção

```bash
# Instalar dependências
npm install

# Gerar build
npm run build

# Preview local (opcional)
npm run preview
```

### 3. Deploy no Servidor

O build gera uma pasta `dist/` com arquivos estáticos. Configure seu servidor web (nginx/apache) para servir esta pasta.

**Nginx exemplo:**
```nginx
server {
    listen 80;
    server_name brechodavez.com.br;
    root /caminho/para/projeto/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🗂️ Configuração da Planilha Google Sheets

### Estrutura da Planilha
A planilha deve ter estas colunas na **linha 1** (cabeçalhos):

| Coluna | Tipo | Exemplo | Obrigatório |
|--------|------|---------|-------------|
| `codigo` | Texto | BDV-0001 | ✅ |
| `nome` | Texto | Vestido Vintage Floral | ✅ |
| `descricao` | Texto | Lindo vestido com estampa... | ✅ |
| `preco_brl` | Número | 89.90 | ✅ |
| `moeda` | Texto | BRL | ❌ |
| `categoria` | Texto | Vestido | ✅ |
| `tamanho` | Texto | M | ✅ |
| `condicao` | Texto | Como novo | ❌ |
| `medidas` | Texto | Busto: 92cm, Cintura: 78cm | ❌ |
| `tags` | Texto | vintage,floral,verão | ❌ |
| `capa_file_id` | Texto | 1ABC...XYZ | ❌ |
| `galeria_file_ids` | Texto | 1ABC,2DEF,3GHI | ❌ |
| `status` | Texto | disponivel | ✅ |
| `created_at` | Data | 2024-01-15 | ❌ |
| `updated_at` | Data | 2024-01-15 | ❌ |

### Status Válidos
- `disponivel` - Produto disponível para compra
- `reservado` - Produto reservado (mostra botão "Avisar quando liberar")
- `vendido` - Produto vendido (oculto por padrão)

### Publicar a Planilha
1. Na planilha, vá em **Arquivo > Compartilhar > Publicar na web**
2. Escolha **Toda a planilha** e formato **CSV**
3. Marque **"Republicar automaticamente quando mudanças forem feitas"**
4. Copie o link gerado e use na variável `VITE_SHEET_CSV_URL`

## 📷 Configuração do Google Drive

### Estrutura de Pastas
```
📁 Brechó da Vez - Imagens/
  📁 BDV-0001/
    🖼️ BDV-0001-front.jpg
    🖼️ BDV-0001-back.jpg
    🖼️ BDV-0001-detail1.jpg
    🖼️ BDV-0001-detail2.jpg
    🖼️ BDV-0001-detail3.jpg
  📁 BDV-0002/
    🖼️ BDV-0002-front.jpg
    🖼️ BDV-0002-back.jpg
    ...
```

### Obter IDs dos Arquivos
1. **Abra a imagem no Google Drive**
2. **Copie o ID da URL**: `https://drive.google.com/file/d/[ID_AQUI]/view`
3. **Cole na planilha**: 
   - `capa_file_id`: ID da foto principal
   - `galeria_file_ids`: IDs separados por vírgula (ex: `1ABC,2DEF,3GHI`)

### Tornar Imagens Públicas
1. **Clique com botão direito na pasta** com todas as imagens
2. **Compartilhar > Alterar para qualquer pessoa com o link**
3. **Definir como "Visualizador"**

## 🚀 Funcionalidades

### ✅ Implementado
- [x] Catálogo responsivo com grid de produtos
- [x] Filtros por categoria, tamanho, status
- [x] Busca por texto (nome, código, tags)
- [x] Página de detalhes do produto
- [x] Galeria de imagens com navegação
- [x] Integração WhatsApp com mensagens pré-preenchidas
- [x] Status de produtos (disponível/reservado/vendido)
- [x] Design aconchegante com cores e tipografia do brand
- [x] Carregamento automático da planilha Google Sheets
- [x] **MODO PRODUÇÃO ATIVO** - Dados mock removidos
- [x] Imagens diretas do Google Drive
- [x] Loading states e error handling
- [x] SEO otimizado

### 🔄 Próximas Versões
- [ ] Página de administração para alterar status
- [ ] Sistema de favoritos (localStorage)
- [ ] Filtro por faixa de preço
- [ ] Ordenação avançada (preço, data, alfabética)
- [ ] Compartilhamento de produtos em redes sociais
- [ ] Analytics de visualizações

## 📞 Suporte

Para dúvidas sobre configuração ou problemas técnicos, entre em contato com o desenvolvedor.

---

**🤍 Feito com carinho para o Brechó da Vez**