import { Button } from '@/components/ui/button';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { trackAddToCart } from '@/lib/tracking';

interface Props {
  product: Product;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function AddToCartButton({ product, size = 'sm', className }: Props) {
  const { add, has } = useCart();
  if (product.status !== 'Disponível') return null;
  const already = has(product.codigo);

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!already) {
          add(product);
          trackAddToCart(product.codigo);
        }
      }}
      className={cn(
        'w-full font-body font-medium border-secondary/40 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-smooth',
        already && 'bg-secondary/10',
        className
      )}
    >
      {already ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Na sacola
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 mr-2" />
          Adicionar à sacola
        </>
      )}
    </Button>
  );
}
