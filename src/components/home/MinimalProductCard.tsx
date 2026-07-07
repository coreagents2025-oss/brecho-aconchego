import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';

interface Props {
  product: Product;
}

export function MinimalProductCard({ product }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const imageUrl = product.url_capa;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p);

  const setReveal = (clientX: number, clientY: number) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--reveal-x', `${x}%`);
    card.style.setProperty('--reveal-y', `${y}%`);
    setActive(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={(e) => setReveal(e.clientX, e.clientY)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={(e) => setReveal(e.touches[0].clientX, e.touches[0].clientY)}
      className="group relative block w-full h-full"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.nome}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
          />
        )}
        {imageUrl && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              clipPath: `circle(${active ? '150%' : '0%'} at var(--reveal-x, 50%) var(--reveal-y, 50%))`,
              transition: 'clip-path 2.4s cubic-bezier(0.15, 0.85, 0.35, 1)',
            }}
          >
            <img
              src={imageUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 z-30 ${
            active
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          }`}
        >
          <Link
            to={`/p/${product.codigo}`}
            className="block bg-background text-foreground text-[10px] uppercase tracking-[0.3em] font-body font-medium py-3 px-8 whitespace-nowrap hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            Ver peça
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-2 relative z-20">
        <div className="flex justify-between items-baseline gap-3">
          <h4 className="font-display italic text-xl text-foreground truncate">
            {product.nome}
          </h4>
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground shrink-0">
            {product.codigo}
          </span>
        </div>
        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-secondary font-medium">
          {formatPrice(product.preco_brl)}
        </p>
      </div>
    </div>
  );
}
