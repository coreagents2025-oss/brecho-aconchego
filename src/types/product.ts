export interface Product {
  codigo: string;
  nome: string;
  descricao: string;
  preco_brl: number;
  moeda: string;
  categoria: string;
  tamanho: string;
  condicao: string;
  medidas: string;
  tags: string[];
  capa_file_id?: string;
  galeria_file_ids: string[];
  status: 'disponivel' | 'reservado' | 'vendido';
  created_at: string;
  updated_at: string;
  marca?: string;
  material?: string;
}

export type ProductStatus = Product['status'];
export type ProductCategory = string;
export type ProductSize = string;