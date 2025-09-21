import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { WhatsAppButton } from './WhatsAppButton';
import { Product } from '@/types/product';

import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  const imageUrl = product.url_capa;
  
  return (
    <Card className={cn(
      'group overflow-hidden shadow-card hover:shadow-hover transition-smooth border-0 bg-card',
      className
    )}>
      <Link to={`/p/${product.codigo}`} className="block">
        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              <span className="text-sm">Sem imagem</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <StatusBadge status={product.status} />
          </div>
          {product.marca && (
            <div className="absolute bottom-3 right-3">
              <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-body font-medium text-warm-black">
                {product.marca}
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/p/${product.codigo}`} className="block mb-3">
          <h3 className="font-display font-medium text-lg text-foreground mb-1 group-hover:text-secondary transition-smooth">
            {product.nome}
          </h3>
          <p className="text-muted-foreground text-sm font-body line-clamp-2 mb-2">
            {product.descricao}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="font-display font-medium text-xl text-foreground">
              {formatPrice(product.preco_brl)}
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
              <span className="bg-muted px-2 py-1 rounded-full">
                {product.tamanho}
              </span>
              <span className="bg-muted px-2 py-1 rounded-full">
                {product.categoria}
              </span>
            </div>
          </div>
        </Link>
        
        <WhatsAppButton
          codigo={product.codigo}
          tamanho={product.tamanho}
          status={product.status}
          productUrl={`${window.location.origin}/p/${product.codigo}`}
          size="sm"
        />
      </CardContent>
    </Card>
  );
}