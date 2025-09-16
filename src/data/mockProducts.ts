import { Product } from '@/types/product';

export const mockProducts: Product[] = [
  {
    codigo: 'BDV-0001',
    nome: 'Vestido Vintage Floral',
    descricao: 'Lindo vestido vintage com estampa floral delicada, perfeito para ocasiões especiais. Tecido fluido e caimento perfeito.',
    preco_brl: 85,
    moeda: 'BRL',
    categoria: 'Vestido',
    tamanho: 'M',
    condicao: 'Como novo',
    medidas: 'Busto: 92cm, Cintura: 78cm, Comprimento: 115cm',
    tags: ['vintage', 'floral', 'festa', 'romântico'],
    galeria_file_ids: ['vintage-dress-1', 'vintage-dress-2'],
    status: 'disponivel',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    marca: 'Marca Independente',
    material: 'Viscose e elastano'
  },
  {
    codigo: 'BDV-0002',
    nome: 'Jaqueta Jeans Clássica',
    descricao: 'Jaqueta jeans atemporal, versátil para qualquer ocasião. Cor azul médio com lavagem suave.',
    preco_brl: 65,
    moeda: 'BRL',
    categoria: 'Jaqueta',
    tamanho: 'P',
    condicao: 'Vintage com charme',
    medidas: 'Busto: 88cm, Comprimento: 55cm, Manga: 58cm',
    tags: ['jeans', 'clássico', 'versátil', 'casual'],
    galeria_file_ids: ['denim-jacket-1', 'denim-jacket-2'],
    status: 'disponivel',
    created_at: '2024-01-14T14:30:00Z',
    updated_at: '2024-01-14T14:30:00Z',
    marca: 'Levi\'s',
    material: '100% algodão'
  },
  {
    codigo: 'BDV-0003',
    nome: 'Blusa de Seda Elegante',
    descricao: 'Blusa de seda pura em tom nude, ideal para o trabalho ou eventos. Caimento fluido e sofisticado.',
    preco_brl: 95,
    moeda: 'BRL',
    categoria: 'Blusa',
    tamanho: 'G',
    condicao: 'Como novo',
    medidas: 'Busto: 100cm, Comprimento: 62cm',
    tags: ['seda', 'elegante', 'trabalho', 'sofisticado'],
    galeria_file_ids: ['silk-blouse-1', 'silk-blouse-2'],
    status: 'reservado',
    created_at: '2024-01-13T09:15:00Z',
    updated_at: '2024-01-16T16:20:00Z',
    marca: 'Zara',
    material: '100% seda'
  },
  {
    codigo: 'BDV-0004',
    nome: 'Saia Midi Plissada',
    descricao: 'Saia midi plissada em tom rosa antigo, romântica e feminina. Perfeita para diversas ocasiões.',
    preco_brl: 55,
    moeda: 'BRL',
    categoria: 'Saia',
    tamanho: 'M',
    condicao: 'Como novo',
    medidas: 'Cintura: 72cm, Comprimento: 75cm',
    tags: ['plissada', 'midi', 'romântico', 'feminino'],
    galeria_file_ids: ['pleated-skirt-1', 'pleated-skirt-2'],
    status: 'disponivel',
    created_at: '2024-01-12T11:45:00Z',
    updated_at: '2024-01-12T11:45:00Z',
    marca: 'H&M',
    material: 'Poliéster'
  },
  {
    codigo: 'BDV-0005',
    nome: 'Casaco de Tricot Aconchegante',
    descricao: 'Casaco de tricot em tom bege, perfeito para os dias mais frescos. Muito macio e confortável.',
    preco_brl: 75,
    moeda: 'BRL',
    categoria: 'Casaco',
    tamanho: 'P',
    condicao: 'Vintage com charme',
    medidas: 'Busto: 90cm, Comprimento: 68cm, Manga: 60cm',
    tags: ['tricot', 'aconchegante', 'inverno', 'conforto'],
    galeria_file_ids: ['knit-cardigan-1', 'knit-cardigan-2'],
    status: 'vendido',
    created_at: '2024-01-11T16:20:00Z',
    updated_at: '2024-01-17T10:30:00Z',
    marca: 'Farm',
    material: 'Lã e acrílico'
  },
  {
    codigo: 'BDV-0006',
    nome: 'Calça Wide Leg Alfaiataria',
    descricao: 'Calça de alfaiataria com modelagem wide leg, em tom preto clássico. Elegante e moderna.',
    preco_brl: 88,
    moeda: 'BRL',
    categoria: 'Calça',
    tamanho: '38',
    condicao: 'Como novo',
    medidas: 'Cintura: 74cm, Quadril: 98cm, Comprimento: 105cm',
    tags: ['alfaiataria', 'wide leg', 'elegante', 'trabalho'],
    galeria_file_ids: ['wide-leg-pants-1', 'wide-leg-pants-2'],
    status: 'disponivel',
    created_at: '2024-01-10T13:10:00Z',
    updated_at: '2024-01-10T13:10:00Z',
    marca: 'Mango',
    material: 'Poliéster e elastano'
  }
];

export const categories = [
  'Vestido',
  'Jaqueta',
  'Blusa',
  'Saia',
  'Casaco',
  'Calça',
  'Acessório'
];

export const sizes = [
  'PP', 'P', 'M', 'G', 'GG',
  '34', '36', '38', '40', '42', '44'
];