import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Ruler, Tag, Calendar, Package } from 'lucide-react';
import { ProductGallery } from '@/components/ProductGallery';
import { StatusBadge } from '@/components/StatusBadge';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { useProducts } from '@/hooks/useProducts';
import mockup1 from '@/assets/mockup-1.jpg';
import mockup2 from '@/assets/mockup-2.jpg';
import mockup3 from '@/assets/mockup-3.jpg';

const FALLBACK_GALLERY = [mockup1, mockup2, mockup3];


export default function ProductDetail() {
  const { codigo } = useParams<{ codigo: string }>();
  const { products, loading } = useProducts();
  const product = products.find(p => p.codigo === codigo);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [codigo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="font-body text-muted-foreground">Carregando peça especial...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const relatedProducts = products
    .filter(p => p.codigo !== product.codigo && p.categoria === product.categoria && p.status === 'Disponível')
    .slice(0, 3);
    
  const realImages = [
    product.url_capa,
    product.url_galeria_1,
    product.url_galeria_2,
    product.url_galeria_3,
  ].filter(Boolean) as string[];

  const needed = Math.max(0, 4 - realImages.length);
  const galleryImages = [...realImages, ...FALLBACK_GALLERY.slice(0, needed)];
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao catálogo
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="font-display text-2xl font-medium text-foreground">
                Brechó da Vez
              </h1>
              <p className="text-muted-foreground font-body text-sm">
                Peças com história, novo amor
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div>
            <ProductGallery
              images={galleryImages}
              videoUrl={product.url_video}
              productName={product.nome}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="font-display text-3xl font-medium text-foreground mb-2">
                    {product.nome}
                  </h1>
                  <p className="text-muted-foreground font-body text-lg">
                    Código: {product.codigo}
                  </p>
                </div>
                <StatusBadge status={product.status} />
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="font-display text-4xl font-semibold text-foreground">
                  {formatPrice(product.preco_brl)}
                </span>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="font-body">
                    {product.tamanho}
                  </Badge>
                  <Badge variant="outline" className="font-body">
                    {product.categoria}
                  </Badge>
                </div>
              </div>

              <p className="text-foreground font-body text-base leading-relaxed">
                {product.descricao}
              </p>
            </div>

            {/* CTA Button */}
            <WhatsAppButton
              codigo={product.codigo}
              tamanho={product.tamanho}
              status={product.status}
              size="lg"
            />

            <Separator />

            {/* Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-display text-lg font-medium text-foreground mb-4">
                  Detalhes da peça
                </h3>
                
                <div className="grid gap-4">
                  {product.marca && (
                    <div className="flex items-center gap-3">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="font-body text-sm font-medium text-foreground">Marca:</span>
                      <span className="font-body text-sm text-muted-foreground">{product.marca}</span>
                    </div>
                  )}
                  
                  {product.tecido && (
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="font-body text-sm font-medium text-foreground">Tecido:</span>
                      <span className="font-body text-sm text-muted-foreground">{product.tecido}</span>
                    </div>
                  )}
                  
                  {product.cor && (
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="font-body text-sm font-medium text-foreground">Cor:</span>
                      <span className="font-body text-sm text-muted-foreground">{product.cor}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Ruler className="w-4 h-4 text-muted-foreground" />
                    <span className="font-body text-sm font-medium text-foreground">Medidas:</span>
                    <span className="font-body text-sm text-muted-foreground">{product.medidas}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-body text-sm font-medium text-foreground">Condição:</span>
                    <span className="font-body text-sm text-muted-foreground">{product.condicao}</span>
                  </div>
                </div>

                {product.tag && product.tag.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <span className="font-body text-sm font-medium text-foreground block mb-2">
                      Tags:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.tag.map((tag) => (
                        <Badge key={tag} variant="outline" className="font-body text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Messages */}
            {product.status === 'Reservado' && (
              <Card className="border-reserved bg-reserved/5">
                <CardContent className="p-4">
                  <p className="font-body text-sm text-reserved font-medium">
                    💕 Esta peça está reservada com carinho, mas você pode demonstrar interesse 
                    para entrar na lista de espera caso ela fique disponível novamente.
                  </p>
                </CardContent>
              </Card>
            )}

            {product.status === 'Vendido' && (
              <Card className="border-sold bg-sold/5">
                <CardContent className="p-4">
                  <p className="font-body text-sm text-sold font-medium">
                    💛 Esta peça especial já encontrou seu novo lar! Mas continue navegando, 
                    temos outras peças lindas esperando por você.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-medium text-foreground mb-2">
                Peças similares que você vai amar
              </h2>
              <p className="text-muted-foreground font-body">
                Outras peças da categoria {product.categoria}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.codigo} className="overflow-hidden shadow-card hover:shadow-hover transition-smooth">
                  <Link to={`/p/${relatedProduct.codigo}`}>
                    <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                      <img
                        src={relatedProduct.url_capa || '/placeholder.svg'}
                        alt={relatedProduct.nome}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <StatusBadge status={relatedProduct.status} />
                      </div>
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <Link to={`/p/${relatedProduct.codigo}`}>
                      <h3 className="font-display font-medium text-lg text-foreground mb-1 hover:text-secondary transition-smooth">
                        {relatedProduct.nome}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-medium text-xl text-foreground">
                          {formatPrice(relatedProduct.preco_brl)}
                        </span>
                        <Badge variant="outline" className="font-body">
                          {relatedProduct.tamanho}
                        </Badge>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}