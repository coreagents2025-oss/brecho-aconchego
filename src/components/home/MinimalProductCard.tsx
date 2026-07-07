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
      className="group relative block w-full h-full bg-transparent overflow-hidden border border-border/50 hover:border-secondary/60 transition-colors duration-700"
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

        <div className="absolute inset-0 bg-gradient-to-t from-warm-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-700 z-30 ${
            active
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          }`}
        >
          <Link
            to={`/p/${product.codigo}`}
            className="block bg-background/90 backdrop-blur-md text-foreground text-[10px] uppercase tracking-[0.3em] font-body font-semibold py-3 px-8 rounded-full border border-border whitespace-nowrap shadow-hover hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
          >
            Ver peça
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center text-center p-4 sm:p-6 bg-transparent relative z-20">
        <span className="text-[9px] text-secondary uppercase tracking-[0.4em] mb-2 font-body font-semibold">
          {product.categoria}
        </span>
        <h4 className="font-display italic text-base sm:text-lg text-foreground mb-2 line-clamp-2 tracking-wide">
          {product.nome}
        </h4>
        <span className="font-body text-sm tracking-[0.15em] text-foreground/80 group-hover:text-secondary transition-colors duration-500">
          {formatPrice(product.preco_brl)}
        </span>
      </div>

      <div className="absolute top-0 left-0 w-8 h-[1px] bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 left-0 w-[1px] h-8 bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 right-0 w-8 h-[1px] bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 right-0 w-[1px] h-8 bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
}
