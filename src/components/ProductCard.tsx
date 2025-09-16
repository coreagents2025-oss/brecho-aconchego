import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { WhatsAppButton } from './WhatsAppButton';
import { Product } from '@/types/product';
import { formatPrice } from '@/utils/driveImage';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Mock image mapping for demo
const mockImages: Record<string, string> = {
  'vintage-dress-1': '/src/assets/vintage-dress-1.jpg',
  'denim-jacket-1': '/src/assets/denim-jacket-1.jpg',
  'silk-blouse-1': '/src/assets/silk-blouse-1.jpg',
  'pleated-skirt-1': '/placeholder.svg',
  'knit-cardigan-1': '/placeholder.svg',
  'wide-leg-pants-1': '/placeholder.svg',
};

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const imageUrl = mockImages[product.galeria_file_ids[0]] || '/placeholder.svg';
  
  return (
    <Card className={cn(
      'group overflow-hidden shadow-card hover:shadow-hover transition-smooth border-0 bg-card',
      className
    )}>
      <Link to={`/p/${product.codigo}`} className="block">
        <div className="aspect-[3/4] relative overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
          <div className="absolute top-3 right-3">
            <StatusBadge status={product.status} />
          </div>
          {product.marca && (
            <div className="absolute bottom-3 left-3">
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