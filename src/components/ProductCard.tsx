import { Link } from 'react-router-dom';
import { MessageCircle, Bell } from 'lucide-react';
import { AddToCartButton } from './AddToCartButton';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import {
  generateWhatsAppLink,
  generateInterestWhatsAppLink,
} from '@/utils/whatsapp';
import { trackWhatsAppClick } from '@/lib/tracking';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const statusLabel: Record<string, string> = {
  Disponível: 'Disponível',
  Reservado: 'Reservado',
  Vendido: 'Novo lar encontrado',
};

export function ProductCard({ product, className }: ProductCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);

  const imageUrl = product.url_capa;
  const isAvailable = product.status === 'Disponível';
  const isReserved = product.status === 'Reservado';
  const isSold = product.status === 'Vendido';

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/p/${product.codigo}`
      : `/p/${product.codigo}`;

  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const link = isAvailable
      ? generateWhatsAppLink(product.codigo, product.tamanho, productUrl)
      : generateInterestWhatsAppLink(product.codigo, product.tamanho);
    trackWhatsAppClick(product.codigo);
    window.open(link, '_blank');
  };

  return (
    <article className={cn('group', className)}>
      <Link
        to={`/p/${product.codigo}`}
        className="block relative overflow-hidden bg-muted aspect-[3/4]"
        aria-label={`Ver detalhes de ${product.nome}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${product.nome} — ${product.categoria}`}
            loading="lazy"
            decoding="async"
            width={600}
            height={800}
            className={cn(
              'w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110',
              isSold && 'opacity-60'
            )}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-xs uppercase tracking-[0.3em]">
            Sem imagem
          </div>
        )}

        {/* Status micro-tag */}
        <div className="absolute top-4 right-4">
          <span
            role="status"
            className={cn(
              'text-[9px] uppercase tracking-[0.3em] py-1.5 px-3 font-body font-medium',
              isAvailable && 'bg-background/85 backdrop-blur-sm text-foreground',
              isReserved && 'bg-secondary text-secondary-foreground',
              isSold && 'bg-foreground/70 text-background backdrop-blur-sm'
            )}
          >
            {statusLabel[product.status] ?? product.status}
          </span>
        </div>

        {/* Hover WhatsApp bubble (available + reserved) */}
        {!isSold && (
          <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              onClick={openWhatsApp}
              aria-label={
                isAvailable
                  ? `Falar no WhatsApp sobre ${product.nome}`
                  : `Avisar quando ${product.nome} liberar`
              }
              className="pointer-events-auto w-12 h-12 rounded-full bg-background text-secondary hover:text-foreground shadow-md flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
            >
              {isAvailable ? (
                <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Bell className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        )}
      </Link>

      <div className="mt-6 space-y-3">
        {product.marca && (
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {product.marca}
          </p>
        )}

        <div className="flex justify-between items-baseline gap-4">
          <Link to={`/p/${product.codigo}`} className="min-w-0">
            <h3 className="font-display italic text-2xl leading-tight text-foreground truncate">
              {product.nome}
            </h3>
          </Link>
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground shrink-0">
            {product.codigo}
          </span>
        </div>

        <div className="flex items-center justify-between font-body">
          <p
            className={cn(
              'text-[13px] uppercase tracking-[0.2em] font-medium',
              isSold ? 'text-muted-foreground' : 'text-secondary'
            )}
          >
            {isSold ? 'Esgotado' : formatPrice(product.preco_brl)}
          </p>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {product.tamanho} · {product.categoria}
          </span>
        </div>

        <div className="pt-2">
          {isAvailable && (
            <AddToCartButton
              product={product}
              className="w-full h-auto py-4 rounded-none bg-transparent border border-foreground/10 text-foreground text-[10px] uppercase tracking-[0.3em] font-body font-medium hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-300"
            />
          )}
          {isReserved && (
            <button
              type="button"
              onClick={openWhatsApp}
              className="w-full py-4 border border-secondary/40 text-secondary text-[10px] uppercase tracking-[0.3em] font-body font-medium hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300"
            >
              Avisar quando liberar
            </button>
          )}
          {isSold && (
            <div className="w-full py-4 border border-foreground/10 text-muted-foreground text-[10px] uppercase tracking-[0.3em] font-body text-center cursor-not-allowed">
              Vendido
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
