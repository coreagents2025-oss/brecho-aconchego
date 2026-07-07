import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { ArrowDown } from 'lucide-react';
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
    <div ref={rootRef} className="bg-background w-full pt-16 pb-8 border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-8">
          <span className="text-[10px] font-semibold tracking-[0.3em] text-secondary uppercase font-body">
            Panorama
          </span>
          <a
            href="#catalog"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase text-foreground hover:text-secondary transition-colors font-body"
          >
            <span className="tracking-[0.3em]">Ver catálogo</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-8 pb-8 no-scrollbar snap-x snap-mandatory"
        >
          {products.map((p) => (
            <div
              key={p.codigo}
              className="anime-card w-[calc(75%-8px)] min-w-[calc(75%-8px)] sm:w-[calc(45%-12px)] sm:min-w-[calc(45%-12px)] md:w-[300px] md:min-w-[300px] md:max-w-[320px] snap-center flex-shrink-0 opacity-0"
            >
              <MinimalProductCard product={p} />
            </div>
          ))}
        </div>

        <div className="w-24 h-[2px] bg-foreground/10 mx-auto mt-2 rounded-full overflow-hidden relative">
          <div
            ref={indicatorRef}
            className="h-full bg-secondary w-8 rounded-full absolute left-0 transition-all duration-75"
          />
        </div>
      </div>
    </div>
  );
}
