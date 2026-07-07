import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface Props { className?: string }

export function CartButton({ className }: Props) {
  const { count, openCart } = useCart();
  return (
    <button
      onClick={openCart}
      aria-label={`Abrir sacola (${count} ${count === 1 ? 'item' : 'itens'})`}
      className={cn(
        'relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-card/90 backdrop-blur-sm shadow-card hover:shadow-hover transition-smooth text-foreground hover:text-secondary',
        className
      )}
    >
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-secondary text-secondary-foreground text-[11px] font-body font-semibold flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
