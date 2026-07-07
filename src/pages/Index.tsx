import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { FiltersBar } from '@/components/FiltersBar';
import { useProducts } from '@/hooks/useProducts';
import { ProductStatus } from '@/types/product';
import { useBanners } from '@/hooks/useBanners';
import { PromoPopup } from '@/components/PromoPopup';
import { CartButton } from '@/components/CartButton';
import { CategoryStrip } from '@/components/CategoryStrip';
import { EditorialStrip } from '@/components/EditorialStrip';
import { trackWhatsAppClick } from '@/lib/tracking';
import heroBoutique from '@/assets/hero-boutique.jpg';

export default function Index() {
  const { products, loading, error } = useProducts();
  const { banners } = useBanners(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'all'>('all');
  const [showSoldItems, setShowSoldItems] = useState(true);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length]);

  const activeBanner = banners[bannerIdx];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!showSoldItems && product.status === 'Vendido') return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          product.nome.toLowerCase().includes(query) ||
          product.codigo.toLowerCase().includes(query) ||
          product.descricao.toLowerCase().includes(query) ||
          (product.tag && product.tag.some((tag) => tag.toLowerCase().includes(query))) ||
          (product.marca && product.marca.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      if (selectedCategory !== 'all' && product.categoria !== selectedCategory) return false;
      if (selectedSize !== 'all' && product.tamanho !== selectedSize) return false;
      if (selectedStatus !== 'all' && product.status !== selectedStatus) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedSize, selectedStatus, showSoldItems]);

  return (
    <div className="min-h-dvh bg-background">
      <Helmet>
        <title>Brechó da Vez — Moda feminina com alma e história</title>
        <meta name="description" content="Loja online do Brechó da Vez: vestidos, blusas, saias e acessórios femininos vintage selecionados com carinho. Monte sua sacola e finalize pelo WhatsApp." />
        <link rel="canonical" href="https://app.brechodavez.com.br/" />
        <meta property="og:title" content="Brechó da Vez — Moda feminina com alma e história" />
        <meta property="og:url" content="https://app.brechodavez.com.br/" />
      </Helmet>
      <PromoPopup />

      {/* Floating cart button */}
      <div className="fixed top-4 right-4 z-40">
        <CartButton />
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
          <img
            src={activeBanner?.imagem_url || heroBoutique}
            alt={activeBanner?.titulo || 'Coleção feminina Brechó da Vez — peças vintage selecionadas'}
            className="w-full h-full object-cover animate-[kenburns_20s_ease-in-out_infinite]"
            style={{ animation: 'kenburns 24s ease-in-out infinite alternate' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-warm-black/20 via-warm-black/30 to-warm-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white space-y-5 px-4 max-w-3xl">
              <span className="inline-block px-4 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 font-body text-xs md:text-sm tracking-widest uppercase">
                Curadoria semanal · Peças únicas
              </span>
              <h1 className="font-display italic text-5xl md:text-7xl font-medium text-shadow leading-tight">
                {activeBanner?.titulo || 'Moda feminina com alma'}
              </h1>
              <p className="font-body text-lg md:text-2xl font-light text-shadow max-w-2xl mx-auto">
                {activeBanner?.subtitulo || 'Achadinhos vintage escolhidos a dedo — vestidos, blusas, saias e acessórios que contam histórias.'}
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-body font-medium shadow-hover transition-bounce"
                  onClick={() => {
                    if (activeBanner?.link_url) window.open(activeBanner.link_url, '_blank');
                    else document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {activeBanner?.link_url ? 'Saiba mais ✨' : 'Ver coleção ✨'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/60 text-white hover:bg-white hover:text-foreground font-body font-medium"
                  onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Novidades da semana
                </Button>
              </div>
            </div>
          </div>
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIdx(i)}
                  aria-label={`Banner ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === bannerIdx ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
                />
              ))}
            </div>
          )}
        </div>
        <style>{`@keyframes kenburns { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }`}</style>
      </section>

      {/* Categorias */}
      <CategoryStrip selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* Editorial strip */}
      <EditorialStrip />

      {/* Catálogo */}
      <main className="container mx-auto px-4 py-14" id="catalog">
        <div className="text-center mb-10">
          <span className="font-body text-xs tracking-widest uppercase text-secondary">Coleção</span>
          <h2 className="font-display italic text-3xl md:text-5xl font-medium text-foreground mt-2 mb-4">
            Peças à espera de você
          </h2>
          <div className="w-16 h-px bg-secondary/40 mx-auto mb-4" />
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Navegue, monte sua sacola com quantas peças quiser e finalize tudo em uma só conversa no WhatsApp.
          </p>
        </div>

        <div className="mb-8">
          <FiltersBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            showSoldItems={showSoldItems}
            onShowSoldChange={setShowSoldItems}
          />
        </div>

        <div className="mb-6">
          <p className="font-body text-muted-foreground">
            {filteredProducts.length === 0
              ? 'Nenhuma peça encontrada com os filtros selecionados'
              : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'peça encontrada' : 'peças encontradas'}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6"><span className="text-6xl">⚠️</span></div>
              <h3 className="font-display text-xl font-medium text-foreground mb-2">Ops! Erro ao carregar produtos</h3>
              <p className="font-body text-muted-foreground mb-6">{error}. Tente recarregar a página.</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.codigo} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6"><span className="text-6xl">🤍</span></div>
              <h3 className="font-display text-xl font-medium text-foreground mb-2">Ops! Nenhuma peça encontrada</h3>
              <p className="font-body text-muted-foreground mb-6">
                Tente ajustar os filtros ou fazer uma nova busca. Sempre temos novidades chegando!
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSize('all');
                  setSelectedStatus('all');
                  setShowSoldItems(true);
                }}
                className="font-body"
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <section className="mt-20 text-center bg-gradient-warm rounded-3xl p-12">
          <h2 className="font-display italic text-2xl md:text-4xl font-medium text-foreground mb-4">
            Procurando algo especial para um look?
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Chama a gente no WhatsApp 💌 — ajudamos você a encontrar a peça certa para o seu momento.
          </p>
          <Button
            size="lg"
            onClick={() => {
              const message = encodeURIComponent('Oi! Estou procurando uma peça especial. Vocês podem me ajudar? 🤍');
              const waNumber = import.meta.env.VITE_WA_NUMBER || '5541995299244';
              trackWhatsAppClick();
              window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
            }}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-medium shadow-hover transition-bounce"
          >
            Conversar no WhatsApp 💬
          </Button>
        </section>
      </main>
    </div>
  );
}
