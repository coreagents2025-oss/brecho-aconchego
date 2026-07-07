import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { AddToCartButton } from '@/components/AddToCartButton';
import { StatusBadge } from '@/components/StatusBadge';

interface Props {
  product: Product;
  reversed?: boolean;
}

export function ProductHero({ product, reversed = false }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageUrl = product.url_capa;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const wh = window.innerHeight;
      const mask = section.querySelector<HTMLElement>('.color-mask');
      let progress = 0;

      if (window.innerWidth < 768) {
        const start = wh;
        const end = wh * 0.25;
        progress = (start - rect.top) / (start - end);
      } else if (rect.top <= 0) {
        const total = rect.height - wh;
        if (total > 0) progress = Math.abs(rect.top) / total;
      }
      progress = Math.min(Math.max(progress, 0), 1);

      if (mask) {
        mask.style.clipPath =
          window.innerWidth < 768
            ? `inset(0 ${100 - progress * 100}% 0 0)`
            : `inset(0 0 ${100 - progress * 100}% 0)`;
      }

      section.querySelectorAll<HTMLElement>('.reveal-step').forEach((step) => {
        const start = parseFloat(step.getAttribute('data-progress') || '0');
        step.classList.toggle('active', progress > start);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative h-auto md:h-[250vh] w-full group bg-background">
      <div className="relative md:sticky md:top-0 w-full h-auto md:h-screen overflow-hidden">
        <div className="w-full h-auto md:h-full grid grid-cols-1 md:grid-cols-2">
          <div
            className={`relative w-full flex items-center justify-center p-4 sm:p-8 md:p-0 max-w-[440px] md:max-w-none mx-auto ${
              reversed ? 'md:order-2' : ''
            }`}
          >
            <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-full overflow-hidden rounded-2xl md:rounded-none bg-muted">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={`${product.nome} — ${product.categoria}`}
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-105"
                  loading="lazy"
                />
              )}
              <div
                className="color-mask absolute inset-0 w-full h-full will-change-[clip-path]"
                style={{ clipPath: 'inset(0 0 100% 0)' }}
              >
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="absolute top-4 left-4 z-10">
                <StatusBadge status={product.status} />
              </div>
            </div>
          </div>

          <div
            className={`flex items-center justify-center py-8 px-6 md:p-12 relative z-10 ${
              reversed ? 'md:order-1' : ''
            }`}
          >
            <div className="max-w-md w-full flex flex-col gap-8 md:gap-10">
              <div
                className="reveal-step transition-all duration-1000 ease-out opacity-0 translate-y-10 [&.active]:opacity-100 [&.active]:translate-y-0"
                data-progress="0.15"
              >
                <span className="block text-[10px] text-secondary uppercase tracking-[0.4em] font-body font-semibold mb-3">
                  {product.categoria} · {product.tamanho}
                </span>
                <h2 className="font-display italic text-3xl md:text-5xl font-medium text-foreground leading-tight mb-3">
                  {product.nome}
                </h2>
                <div className="font-display text-2xl md:text-3xl text-foreground">
                  {formatPrice(product.preco_brl)}
                </div>
              </div>

              <div
                className="reveal-step transition-all duration-1000 ease-out opacity-0 translate-y-10 [&.active]:opacity-100 [&.active]:translate-y-0"
                data-progress="0.35"
              >
                <p className="font-body text-sm md:text-base leading-relaxed text-muted-foreground pt-6 border-t border-border">
                  {product.descricao}
                </p>
              </div>

              {(product.marca || product.tecido || product.cor) && (
                <div
                  className="reveal-step grid grid-cols-2 gap-6 transition-all duration-1000 ease-out opacity-0 translate-y-10 [&.active]:opacity-100 [&.active]:translate-y-0"
                  data-progress="0.55"
                >
                  {product.marca && (
                    <div>
                      <span className="block text-[10px] text-muted-foreground uppercase mb-2 tracking-[0.2em] font-body">
                        Marca
                      </span>
                      <span className="font-body text-sm text-foreground">{product.marca}</span>
                    </div>
                  )}
                  {product.cor && (
                    <div>
                      <span className="block text-[10px] text-muted-foreground uppercase mb-2 tracking-[0.2em] font-body">
                        Cor
                      </span>
                      <span className="font-body text-sm text-foreground">{product.cor}</span>
                    </div>
                  )}
                  {product.tecido && (
                    <div className="col-span-2">
                      <span className="block text-[10px] text-muted-foreground uppercase mb-2 tracking-[0.2em] font-body">
                        Tecido
                      </span>
                      <span className="font-body text-sm text-foreground">{product.tecido}</span>
                    </div>
                  )}
                </div>
              )}

              <div
                className="reveal-step space-y-3 pt-4 transition-all duration-1000 ease-out opacity-0 translate-y-10 [&.active]:opacity-100 [&.active]:translate-y-0"
                data-progress="0.75"
              >
                <Link to={`/p/${product.codigo}`} className="block">
                  <button className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 font-body text-xs font-semibold uppercase flex items-center justify-center gap-3 rounded-full transition-colors tracking-[0.3em]">
                    Ver peça
                    <Eye className="w-4 h-4" />
                  </button>
                </Link>
                <AddToCartButton product={product} size="lg" className="h-14 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
