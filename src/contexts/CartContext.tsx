import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product } from '@/types/product';

export interface CartItem {
  codigo: string;
  nome: string;
  tamanho: string;
  preco_brl: number;
  url_capa: string;
  addedAt: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (codigo: string) => void;
  clear: () => void;
  has: (codigo: string) => boolean;
  count: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'bdv_cart_v1';
const EXPIRY_DAYS = 7;

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    const cutoff = Date.now() - EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return parsed.filter((i) => i.addedAt > cutoff);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadFromStorage());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (product: Product) => {
    if (product.status !== 'Disponível') return;
    setItems((prev) => {
      if (prev.some((i) => i.codigo === product.codigo)) return prev;
      return [
        ...prev,
        {
          codigo: product.codigo,
          nome: product.nome,
          tamanho: product.tamanho,
          preco_brl: product.preco_brl,
          url_capa: product.url_capa,
          addedAt: Date.now(),
        },
      ];
    });
    setIsOpen(true);
  };

  const remove = (codigo: string) =>
    setItems((prev) => prev.filter((i) => i.codigo !== codigo));

  const clear = () => setItems([]);
  const has = (codigo: string) => items.some((i) => i.codigo === codigo);

  const total = items.reduce((s, i) => s + i.preco_brl, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        remove,
        clear,
        has,
        count: items.length,
        total,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
