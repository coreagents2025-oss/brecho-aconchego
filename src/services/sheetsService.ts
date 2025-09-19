import { Product } from '@/types/product';

const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL || '';

interface RawProductData {
  codigo: string;
  nome: string;
  descricao: string;
  preco_brl: string;
  moeda: string;
  categoria: string;
  tamanho: string;
  condicao: string;
  medidas: string;
  tags: string;
  capa_file_id: string;
  galeria_file_ids: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function csvToProducts(csvText: string): Product[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    console.warn('CSV tem menos de 2 linhas');
    return [];
  }

  const headers = parseCSVLine(lines[0]);
  const products: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length < headers.length || !values[0]?.trim()) {
      continue; // Skip empty or invalid rows
    }

    const rawData: any = {};
    headers.forEach((header, index) => {
      rawData[header.toLowerCase().trim()] = values[index]?.trim() || '';
    });

    try {
      const product: Product = {
        codigo: rawData.codigo || `TEMP-${Date.now()}-${i}`,
        nome: rawData.nome || 'Produto sem nome',
        descricao: rawData.descricao || '',
        preco_brl: parseFloat(rawData.preco_brl) || 0,
        moeda: rawData.moeda || 'BRL',
        categoria: rawData.categoria || 'Outros',
        tamanho: rawData.tamanho || 'Único',
        condicao: rawData.condicao || 'Bom estado',
        medidas: rawData.medidas || '',
        tags: rawData.tags ? rawData.tags.split(',').map((tag: string) => tag.trim()) : [],
        capa_file_id: rawData.capa_file_id || '',
        galeria_file_ids: rawData.galeria_file_ids 
          ? rawData.galeria_file_ids.split(',').map((id: string) => id.trim()).filter(Boolean)
          : [],
        status: (rawData.status as Product['status']) || 'disponivel',
        created_at: rawData.created_at || new Date().toISOString(),
        updated_at: rawData.updated_at || new Date().toISOString(),
      };

      products.push(product);
    } catch (error) {
      console.warn(`Erro ao processar linha ${i}:`, error);
    }
  }

  return products;
}

export async function fetchProductsFromSheet(): Promise<Product[]> {
  if (!SHEET_CSV_URL) {
    console.warn('URL da planilha não configurada');
    return [];
  }

  try {
    const response = await fetch(SHEET_CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const csvText = await response.text();
    return csvToProducts(csvText);
  } catch (error) {
    console.error('Erro ao carregar produtos da planilha:', error);
    return [];
  }
}

export async function fetchProducts(): Promise<Product[]> {
  return await fetchProductsFromSheet();
}