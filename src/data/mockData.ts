import { Product } from '@/types/product';

export const categories = [
  'Vestido',
  'Camisa',
  'Blusa',
  'Jaqueta',
  'Casaco',
  'Saia',
  'Calça',
  'Shorts',
  'Acessório'
];

export const sizes = [
  'PP', 'P', 'M', 'G', 'GG',
  '34', '36', '38', '40', '42', '44', '46'
];

export const mockProducts: Product[] = [
  {
    codigo: 'BDV001',
    categoria: 'Vestido',
    nome: 'Vestido Vintage Floral',
    descricao: 'Lindo vestido vintage com estampa floral, perfeito para ocasiões especiais',
    marca: 'Vintage',
    tecido: 'Algodão',
    medidas: 'Busto: 90cm, Cintura: 70cm, Quadril: 95cm, Comprimento: 120cm',
    cor: 'Floral',
    tamanho: 'M',
    tag: ['vintage', 'floral', 'festa', 'elegante'],
    preco_brl: 89.90,
    condicao: 'Usado',
    status: 'Disponível',
    url_capa: 'https://fotos.brechodavez.com.br/public/produtos/vestido-vintage-floral-1.jpg',
    url_galeria_1: 'https://fotos.brechodavez.com.br/public/produtos/vestido-vintage-floral-2.jpg',
    url_galeria_2: 'https://fotos.brechodavez.com.br/public/produtos/vestido-vintage-floral-3.jpg',
    url_galeria_3: 'https://fotos.brechodavez.com.br/public/produtos/vestido-vintage-floral-4.jpg'
  },
  {
    codigo: 'BDV002',
    categoria: 'Blusa',
    nome: 'Blusa de Seda Elegante',
    descricao: 'Blusa de seda lisa, ideal para trabalho ou eventos sociais',
    marca: 'Zara',
    tecido: 'Seda',
    medidas: 'Busto: 88cm, Cintura: 86cm, Comprimento: 60cm',
    cor: 'Rosa',
    tamanho: 'P',
    tag: ['seda', 'elegante', 'trabalho', 'social'],
    preco_brl: 45.00,
    condicao: 'Usado',
    status: 'Disponível',
    url_capa: 'https://fotos.brechodavez.com.br/public/produtos/blusa-seda-rosa-1.jpg',
    url_galeria_1: 'https://fotos.brechodavez.com.br/public/produtos/blusa-seda-rosa-2.jpg',
    url_galeria_2: 'https://fotos.brechodavez.com.br/public/produtos/blusa-seda-rosa-3.jpg',
    url_galeria_3: ''
  },
  {
    codigo: 'BDV003',
    categoria: 'Jaqueta',
    nome: 'Jaqueta Jeans Clássica',
    descricao: 'Jaqueta jeans clássica, nunca sai de moda',
    marca: 'Levi\'s',
    tecido: 'Jeans',
    medidas: 'Busto: 92cm, Cintura: 88cm, Comprimento: 58cm',
    cor: 'Azul',
    tamanho: 'M',
    tag: ['jeans', 'clássica', 'casual', 'básica'],
    preco_brl: 75.00,
    condicao: 'Usado',
    status: 'Disponível',
    url_capa: 'https://fotos.brechodavez.com.br/public/produtos/jaqueta-jeans-azul-1.jpg',
    url_galeria_1: 'https://fotos.brechodavez.com.br/public/produtos/jaqueta-jeans-azul-2.jpg',
    url_galeria_2: '',
    url_galeria_3: ''
  }
];