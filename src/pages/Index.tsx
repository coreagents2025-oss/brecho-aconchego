import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { FiltersBar } from '@/components/FiltersBar';
import { useProducts } from '@/hooks/useProducts';
import { ProductStatus } from '@/types/product';
import heroImage from '@/assets/hero-image.jpg';

export default function Index() {
  const { products, loading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'all'>('all');
  const [showSoldItems, setShowSoldItems] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Hide sold items by default unless explicitly shown
      if (!showSoldItems && product.status === 'vendido') return false;

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          product.nome.toLowerCase().includes(query) ||
          product.codigo.toLowerCase().includes(query) ||
          product.descricao.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query)) ||
          (product.marca && product.marca.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && product.categoria !== selectedCategory) return false;

      // Size filter
      if (selectedSize !== 'all' && product.tamanho !== selectedSize) return false;

      // Status filter
      if (selectedStatus !== 'all' && product.status !== selectedStatus) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, selectedSize, selectedStatus, showSoldItems]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img
            src={heroImage}
            alt="Brechó da Vez - Peças vintage com história"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-warm-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white space-y-4 px-4">
              <h1 className="font-display text-5xl md:text-6xl font-medium text-shadow">
                Brechó da Vez
              </h1>
              <p className="font-body text-xl md:text-2xl font-light text-shadow">
                Peças com história, novo amor
              </p>
              <p className="font-body text-base md:text-lg opacity-90 max-w-2xl mx-auto">
                Cada peça no nosso catálogo tem uma história especial. 
                Encontre tesouros únicos que estão esperando por um novo lar cheio de carinho.
              </p>
              <Button
                size="lg"
                className="mt-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-body font-medium shadow-hover transition-bounce"
                onClick={() => {
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Descobrir peças especiais ✨
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12" id="catalog">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">
            Nosso Catálogo Especial
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Navegue por nossa coleção cuidadosamente selecionada. Cada peça foi escolhida 
            com carinho e está pronta para fazer parte da sua história.
          </p>
        </div>

        {/* Filters */}
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-body text-muted-foreground">
            {filteredProducts.length === 0 
              ? 'Nenhuma peça encontrada com os filtros selecionados' 
              : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'peça encontrada' : 'peças encontradas'}`
            }
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <span className="text-6xl">⚠️</span>
              </div>
              <h3 className="font-display text-xl font-medium text-foreground mb-2">
                Ops! Erro ao carregar produtos
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                {error}. Tente recarregar a página.
              </p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.codigo} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <span className="text-6xl">🤍</span>
              </div>
              <h3 className="font-display text-xl font-medium text-foreground mb-2">
                Ops! Nenhuma peça encontrada
              </h3>
              <p className="font-body text-muted-foreground mb-6">
                Tente ajustar os filtros ou fazer uma nova busca. 
                Sempre temos novidades chegando!
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSize('all');
                  setSelectedStatus('all');
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
          <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-4">
            Tem alguma peça especial em mente?
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contato conosco! Adoramos ajudar nossos clientes a encontrar 
            exatamente o que estão procurando. Cada peça merece o lar perfeito.
          </p>
          <Button
            size="lg"
            onClick={() => {
              const message = encodeURIComponent('Oi! Estou procurando uma peça específica. Vocês podem me ajudar? 🤍');
              const waNumber = import.meta.env.VITE_WA_NUMBER || '5541995299244';
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