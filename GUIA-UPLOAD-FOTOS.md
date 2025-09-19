# 📸 Guia de Upload de Fotos - Brechó da Vez

## 🎯 Recomendação: Google Drive (Método Atual)

### Por que Google Drive é a melhor opção:
- ✅ **Gratuito** - 15GB de espaço
- ✅ **Fácil de usar** - Interface simples
- ✅ **Já configurado** - Sistema funcionando
- ✅ **Compartilhamento público** - Links diretos
- ✅ **Backup automático** - Sincronização na nuvem

### Como fazer upload das fotos:

#### 1. Acesse sua pasta do Google Drive
```
https://drive.google.com/drive/folders/1Zbz9K6kMMj2woxUIkdySPrAnxLaZgi-R
```

#### 2. Organize as fotos por produto
```
📁 1Zbz9K6kMMj2woxUIkdySPrAnxLaZgi-R (pasta principal)
  ├── 📄 vestido-vintage-001-capa.jpg
  ├── 📄 vestido-vintage-001-detalhe1.jpg
  ├── 📄 vestido-vintage-001-detalhe2.jpg
  ├── 📄 jaqueta-jeans-002-capa.jpg
  └── 📄 jaqueta-jeans-002-detalhe1.jpg
```

#### 3. Nomenclatura recomendada:
```
[codigo-produto]-[tipo].jpg

Exemplos:
- vestido-vintage-001-capa.jpg
- vestido-vintage-001-frente.jpg
- vestido-vintage-001-costas.jpg
- vestido-vintage-001-detalhe.jpg
```

#### 4. Obter ID das fotos:
1. Clique com botão direito na foto
2. Selecione "Obter link"
3. Copie o ID da URL:
```
https://drive.google.com/file/d/1ABC123XYZ789/view
                              ↑
                        Este é o ID
```

#### 5. Adicionar na planilha:
```
Capa: 1ABC123XYZ789
Galeria: 1ABC123XYZ789,1DEF456UVW012,1GHI789RST345
```

## 📋 Especificações técnicas:

### Formatos aceitos:
- **JPG/JPEG** (recomendado)
- **PNG** (para imagens com transparência)
- **WebP** (menor tamanho)

### Tamanhos recomendados:
- **Foto principal**: 800x1000px (proporção 4:5)
- **Fotos da galeria**: 600x800px mínimo
- **Peso máximo**: 2MB por foto

### Qualidade das fotos:
- 📸 **Boa iluminação** - Natural de preferência
- 🎨 **Fundo neutro** - Branco ou claro
- 📐 **Enquadramento** - Produto centralizado
- 🔍 **Detalhes importantes** - Texturas, estampas, defeitos

## 🚀 Alternativas futuras (se necessário):

### 1. Cloudinary (Recomendado para crescimento)
- **Gratuito**: 25GB/mês
- **Vantagens**: Otimização automática, redimensionamento
- **Integração**: API simples

### 2. AWS S3 + CloudFront
- **Custo**: ~$5-10/mês para pequeno volume
- **Vantagens**: CDN global, alta performance
- **Complexidade**: Requer configuração técnica

### 3. Supabase Storage
- **Gratuito**: 1GB
- **Vantagens**: Integração com banco de dados
- **Limitação**: Menor espaço gratuito

## 📱 Fluxo de trabalho recomendado:

1. **Fotografar o produto** com boa qualidade
2. **Redimensionar** as fotos (opcional - o sistema otimiza)
3. **Fazer upload** na pasta do Google Drive
4. **Copiar os IDs** das fotos
5. **Atualizar a planilha** com os novos IDs
6. **Verificar** se as fotos aparecem no site

## 🔧 Manutenção:

### Backup das fotos:
- As fotos ficam na nuvem (Google Drive)
- Recomendado: backup local das fotos originais

### Organização:
- Manter nomenclatura consistente
- Remover fotos de produtos vendidos (opcional)
- Organizar em subpastas se necessário

## 📞 Suporte:

Se precisar de ajuda com:
- Configuração do Google Drive
- Otimização de fotos
- Migração para outro serviço
- Automação do processo

Entre em contato para assistência técnica!