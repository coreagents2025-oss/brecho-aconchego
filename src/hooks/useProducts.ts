import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { fetchProducts } from '@/services/sheetsService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('Erro ao carregar produtos');
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError('Erro ao recarregar produtos');
      console.error('Erro ao recarregar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch
  };
}