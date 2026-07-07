import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { Product } from '@/types/product';
import { MinimalProductCard } from './MinimalProductCard';

interface Props {
  products: Product[];
}

export function HorizontalCollection({ products }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!rootRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered.current && rootRef.current) {
          triggered.current = true;
          animate(rootRef.current.querySelectorAll('.anime-card'), {
            translateY: [-120, 0],
            opacity: [0, 1],
            delay: stagger(120),
            duration: 900,
            easing: 'easeOutElastic(1, .6)',
          });
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      const indicator = indicatorRef.current;
      const track = indicator?.parentElement;
      if (!indicator || !track) return;
      const max = container.scrollWidth - container.clientWidth;
      if (max <= 0) {
        track.style.display = 'none';
        return;
      }
      track.style.display = 'block';
      const pct = (container.scrollLeft / max) * 100;
      indicator.style.left = `${pct * 0.7}%`;
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    const t = setTimeout(onScroll, 100);
    window.addEventListener('resize', onScroll);
    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(t);
    };
  }, [products.length]);

  if (products.length === 0) return null;

  return (
    <div ref={rootRef} className="bg-background w-full py-24 md:py-32 border-t border-foreground/10">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between border-b border-foreground/10 pb-6 mb-12">
          <span className="text-[10px] font-medium tracking-[0.4em] text-muted-foreground uppercase font-body">
            Panorama
          </span>
          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-body text-[10px] uppercase tracking-[0.3em] text-foreground border-b border-foreground/20 pb-1 hover:border-secondary hover:text-secondary transition-colors"
          >
            Ver catálogo
          </a>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 md:gap-10 pb-8 no-scrollbar snap-x snap-mandatory"
        >
          {products.map((p) => (
            <div
              key={p.codigo}
              className="anime-card w-[calc(75%-12px)] min-w-[calc(75%-12px)] sm:w-[calc(45%-16px)] sm:min-w-[calc(45%-16px)] md:w-[300px] md:min-w-[300px] md:max-w-[320px] snap-center flex-shrink-0 opacity-0"
            >
              <MinimalProductCard product={p} />
            </div>
          ))}
        </div>

        <div className="w-24 h-[1px] bg-foreground/10 mx-auto mt-4 relative overflow-hidden">
          <div
            ref={indicatorRef}
            className="h-full bg-foreground w-8 absolute left-0 transition-all duration-75"
          />
        </div>
      </div>
    </div>
  );
}
