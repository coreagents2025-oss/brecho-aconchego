export interface Product {
  codigo: string;
  categoria: string;
  nome: string;
  descricao: string;
  marca: string;
  tecido: string;
  medidas: string;
  cor: string;
  tamanho: string;
  tag: string[];
  preco_brl: number;
  condicao: string;
  status: 'Disponível' | 'Vendido' | 'Reservado';
  url_capa: string;
  url_galeria_1?: string;
  url_galeria_2?: string;
  url_galeria_3?: string;
}

export type ProductStatus = Product['status'];
export type ProductCategory = string;
export type ProductSize = string;