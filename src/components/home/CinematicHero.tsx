import { useEffect, useState } from 'react';
import type { Banner } from '@/hooks/useBanners';
import heroBoutique from '@/assets/hero-boutique.jpg';

interface Props {
  banners: Banner[];
}

export function CinematicHero({ banners }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 7000);
    return () => clearInterval(t);
  }, [banners.length]);

  const active = banners[idx];
  const bg = active?.imagem_url || heroBoutique;

  const scrollToFeatured = () => {
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-background">
      <div className="absolute inset-0">
        <img
          src={bg}
          alt={active?.titulo || 'Brechó da Vez — curadoria feminina vintage'}
          className="w-full h-full object-cover"
          style={{ animation: 'kenburns 24s ease-in-out infinite alternate' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background/85" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, hsl(var(--background) / 0.55) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center px-6 -mt-10 md:-mt-20 w-full flex flex-col items-center justify-center">
        <div className="overflow-hidden mb-4 md:mb-6">
          <span
            className="block text-[10px] md:text-xs text-foreground/80 uppercase reveal tracking-[0.4em] md:tracking-[0.8em] font-body font-semibold drop-shadow-sm"
            style={{ animationDelay: '0.2s' }}
          >
            {active?.subtitulo || 'desde 2024 · curadoria feminina'}
          </span>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl md:text-[8rem] lg:text-[9rem] leading-[0.9] text-foreground flex flex-col items-center tracking-tight">
          <span className="overflow-hidden w-full flex justify-center">
            <span
              className="block reveal font-medium drop-shadow-[0_2px_20px_hsl(var(--background)/0.6)]"
              style={{ animationDelay: '0.4s' }}
            >
              {active?.titulo?.split(' ')[0] || 'Brechó'}
            </span>
          </span>
          <span className="overflow-hidden w-full flex justify-center mt-1 md:mt-2">
            <span
              className="block italic font-normal text-foreground/90 reveal drop-shadow-[0_2px_20px_hsl(var(--background)/0.6)]"
              style={{ animationDelay: '0.6s' }}
            >
              {active?.titulo?.split(' ').slice(1).join(' ') || 'da Vez'}
            </span>
          </span>
        </h1>

        <div className="mt-6 md:mt-10 overflow-hidden w-full flex justify-center">
          <p
            className="font-body text-foreground/75 text-center text-sm md:text-lg max-w-xl font-light leading-relaxed tracking-wide reveal drop-shadow-sm"
            style={{ animationDelay: '0.8s' }}
          >
            Vestidos, blusas, saias e acessórios vintage — escolhidos a dedo, com história e alma feminina.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 justify-center reveal" style={{ animationDelay: '1s' }}>
          <button
            type="button"
            onClick={scrollToFeatured}
            className="bg-foreground text-background border border-foreground py-4 px-10 font-body text-[10px] uppercase tracking-[0.4em] font-medium hover:bg-background hover:text-foreground transition-colors duration-300"
          >
            Ver destaques
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-background/60 backdrop-blur-sm border border-foreground/30 text-foreground py-4 px-10 font-body text-[10px] uppercase tracking-[0.4em] font-medium hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-300"
          >
            Catálogo completo
          </button>

        </div>
      </div>

      <button
        onClick={scrollToFeatured}
        aria-label="Rolar para destaques"
        className="absolute bottom-8 md:bottom-12 flex flex-col items-center gap-3 reveal group"
        style={{ animationDelay: '1.2s' }}
      >
        <div className="w-[1px] h-12 md:h-20 bg-foreground/20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent via-secondary to-transparent animate-scroll-light" />
        </div>
        <span className="text-[10px] font-semibold text-foreground/60 tracking-[0.3em] font-body group-hover:text-secondary transition-colors">
          ROLE PARA VER
        </span>
      </button>

      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Banner ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === idx ? 'bg-secondary w-6' : 'bg-foreground/30 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
