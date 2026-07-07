import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { ProductCard } from '@/components/ProductCard';
import { FiltersBar } from '@/components/FiltersBar';
import { useProducts } from '@/hooks/useProducts';
import { ProductStatus } from '@/types/product';
import { useBanners } from '@/hooks/useBanners';
import { PromoPopup } from '@/components/PromoPopup';
import { CartButton } from '@/components/CartButton';
import { CinematicHero } from '@/components/home/CinematicHero';
import { ProductHero } from '@/components/home/ProductHero';
import { HorizontalCollection } from '@/components/home/HorizontalCollection';
import { trackWhatsAppClick } from '@/lib/tracking';

export default function Index() {
  const { products, loading, error } = useProducts();
  const { banners } = useBanners(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'all'>('all');
  const [showSoldItems, setShowSoldItems] = useState(true);

  const availableProducts = useMemo(
    () => products.filter((p) => p.status === 'Disponível' && p.url_capa),
    [products]
  );

  const featuredHeroes = useMemo(() => availableProducts.slice(0, 3), [availableProducts]);
  const overviewProducts = useMemo(
    () => availableProducts.slice(3, 11),
    [availableProducts]
  );

  const availableCategories = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.categoria).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
      ),
    [products]
  );

  const availableSizes = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.tamanho).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b, 'pt-BR', { numeric: true })
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!showSoldItems && product.status === 'Vendido') return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const match =
          product.nome.toLowerCase().includes(query) ||
          product.codigo.toLowerCase().includes(query) ||
          product.descricao.toLowerCase().includes(query) ||
          (product.tag && product.tag.some((t) => t.toLowerCase().includes(query))) ||
          (product.marca && product.marca.toLowerCase().includes(query));
        if (!match) return false;
      }
      if (selectedCategory !== 'all' && product.categoria !== selectedCategory) return false;
      if (selectedSize !== 'all' && product.tamanho !== selectedSize) return false;
      if (selectedStatus !== 'all' && product.status !== selectedStatus) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedSize, selectedStatus, showSoldItems]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedStatus('all');
    setShowSoldItems(true);
  };

  const openConciergeWhatsApp = () => {
    const message = encodeURIComponent(
      'Oi! Estou procurando uma peça especial. Vocês podem me ajudar? 🤍'
    );
    const waNumber = import.meta.env.VITE_WA_NUMBER || '5541995299244';
    trackWhatsAppClick();
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-dvh bg-background">
      <Helmet>
        <title>Brechó da Vez — Moda feminina com alma e história</title>
        <meta
          name="description"
          content="Loja online do Brechó da Vez: vestidos, blusas, saias e acessórios femininos vintage selecionados com carinho. Monte sua sacola e finalize pelo WhatsApp."
        />
        <link rel="canonical" href="https://app.brechodavez.com.br/" />
        <meta property="og:title" content="Brechó da Vez — Moda feminina com alma e história" />
        <meta property="og:url" content="https://app.brechodavez.com.br/" />
      </Helmet>
      <PromoPopup />

      <div className="fixed top-4 right-4 z-40">
        <CartButton />
      </div>

      <CinematicHero banners={banners} />

      {/* Featured product heroes */}
      <div id="featured">
        {featuredHeroes.map((product, i) => (
          <ProductHero key={product.codigo} product={product} reversed={i % 2 !== 0} />
        ))}
      </div>

      {/* Horizontal overview */}
      <HorizontalCollection products={overviewProducts} />

      {/* Full catalog */}
      <section id="catalog" className="bg-background px-6 md:px-10 pt-16 md:pt-20 pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto">
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
            availableCategories={availableCategories}
            availableSizes={availableSizes}
          />

          <div className="mb-10 flex items-center justify-between font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>
              {loading
                ? 'Carregando acervo…'
                : filteredProducts.length === 0
                ? 'Nenhuma peça encontrada'
                : `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? 'peça' : 'peças'
                  } no acervo`}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted" />
                  <div className="mt-6 space-y-3">
                    <div className="h-6 bg-muted w-2/3" />
                    <div className="h-3 bg-muted w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-24 border-t border-b border-foreground/10">
              <h3 className="font-display italic text-3xl text-foreground mb-4">
                Não foi possível carregar o acervo
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                {error}. Recarregue a página para tentar novamente.
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
              {filteredProducts.map((product) => (
                <ProductCard key={product.codigo} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-t border-b border-foreground/10">
              <h3 className="font-display italic text-3xl text-foreground mb-4">
                Nada encontrado por aqui
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Ajuste os filtros ou tente outra busca — novas peças chegam sempre.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="font-body text-[10px] uppercase tracking-[0.3em] border-b border-secondary text-foreground pb-1 hover:text-secondary transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Editorial closing CTA */}
          <div className="mt-32 border-t border-foreground/10 pt-20 flex flex-col items-center text-center">
            <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-6">
              Atendimento pessoal
            </p>
            <h2 className="font-display italic text-3xl md:text-5xl text-foreground max-w-2xl leading-tight mb-4">
              Procurando algo especial para um look?
            </h2>
            <p className="font-body text-base text-muted-foreground max-w-xl mb-10">
              Chame a gente no WhatsApp — ajudamos você a encontrar a peça certa para o seu momento.
            </p>
            <button
              type="button"
              onClick={openConciergeWhatsApp}
              className="group flex flex-col items-center gap-4"
              aria-label="Conversar no WhatsApp"
            >
              <span className="font-body text-[11px] uppercase tracking-[0.5em] text-foreground group-hover:text-secondary transition-colors">
                Conversar no WhatsApp
              </span>
              <span className="w-px h-16 bg-foreground/20 relative overflow-hidden">
                <span className="absolute inset-0 bg-secondary -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
