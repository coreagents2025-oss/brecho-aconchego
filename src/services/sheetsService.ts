import { Product } from '@/types/product';

const CATALOG_JSON_URL = 'https://fotos.brechodavez.com.br/public/catalogo.json';
const CATALOG_CSV_URL = 'https://fotos.brechodavez.com.br/public/catalogo_urls.csv';

async function fetchProductsFromJSON(): Promise<Product[]> {
  try {
    const response = await fetch(CATALOG_JSON_URL);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // Transformar os dados para o formato esperado
    return data.map((item: any) => ({
      codigo: item.codigo || `TEMP-${Date.now()}`,
      categoria: item.categoria || 'Outros',
      nome: item.nome || 'Produto sem nome',
      descricao: item.descricao || '',
      marca: item.marca || '',
      tecido: item.tecido || '',
      medidas: item.medidas || '',
      cor: item.cor || '',
      tamanho: item.tamanho || 'Único',
      tag: item.tag ? (Array.isArray(item.tag) ? item.tag : item.tag.split(',').map((t: string) => t.trim())) : [],
      preco_brl: parseFloat(item.preco_brl) || 0,
      condicao: item.condicao || 'Usado',
      status: item.status || 'Disponível',
      url_capa: item.url_capa || '',
      url_galeria_1: item.url_galeria_1 || '',
      url_galeria_2: item.url_galeria_2 || '',
      url_galeria_3: item.url_galeria_3 || '',
    }));
  } catch (error) {
    console.error('Erro ao carregar produtos do JSON:', error);
    throw error;
  }
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

async function fetchProductsFromCSV(): Promise<Product[]> {
  try {
    const response = await fetch(CATALOG_CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const csvText = await response.text();
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
        continue;
      }

      const rawData: any = {};
      headers.forEach((header, index) => {
        rawData[header.toLowerCase().trim()] = values[index]?.trim() || '';
      });

      try {
        const product: Product = {
          codigo: rawData.codigo || `TEMP-${Date.now()}-${i}`,
          categoria: rawData.categoria || 'Outros',
          nome: rawData.nome || 'Produto sem nome',
          descricao: rawData.descricao || '',
          marca: rawData.marca || '',
          tecido: rawData.tecido || '',
          medidas: rawData.medidas || '',
          cor: rawData.cor || '',
          tamanho: rawData.tamanho || 'Único',
          tag: rawData.tag ? rawData.tag.split(',').map((tag: string) => tag.trim()) : [],
          preco_brl: parseFloat(rawData.preco_brl) || 0,
          condicao: rawData.condicao || 'Usado',
          status: rawData.status || 'Disponível',
          url_capa: rawData.url_capa || '',
          url_galeria_1: rawData.url_galeria_1 || '',
          url_galeria_2: rawData.url_galeria_2 || '',
          url_galeria_3: rawData.url_galeria_3 || '',
        };

        products.push(product);
      } catch (error) {
        console.warn(`Erro ao processar linha ${i}:`, error);
      }
    }

    return products;
  } catch (error) {
    console.error('Erro ao carregar produtos do CSV:', error);
    throw error;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    // Tenta JSON primeiro, depois CSV como fallback
    return await fetchProductsFromJSON();
  } catch (error) {
    console.warn('Falha ao carregar JSON, tentando CSV:', error);
    try {
      return await fetchProductsFromCSV();
    } catch (csvError) {
      console.error('Falha ao carregar CSV também:', csvError);
      return [];
    }
  }
}