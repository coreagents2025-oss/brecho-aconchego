import { Button } from '@/components/ui/button';
import { MessageCircle, Heart } from 'lucide-react';
import { generateWhatsAppLink, generateInterestWhatsAppLink } from '@/utils/whatsapp';
import { ProductStatus } from '@/types/product';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  codigo: string;
  tamanho: string;
  status: ProductStatus;
  productUrl?: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function WhatsAppButton({
  codigo,
  tamanho,
  status,
  productUrl = window.location.href,
  className,
  size = 'default'
}: WhatsAppButtonProps) {
  const isAvailable = status === 'Disponível';
  const isReserved = status === 'Reservado';
  const isSold = status === 'Vendido';

  const handleClick = () => {
    let link: string;
    
    if (isAvailable) {
      link = generateWhatsAppLink(codigo, tamanho, productUrl);
    } else if (isReserved) {
      link = generateInterestWhatsAppLink(codigo, tamanho);
    } else {
      return; // Don't handle sold items
    }
    
    window.open(link, '_blank');
  };

  if (isSold) {
    return (
      <Button
        disabled
        size={size}
        className={cn(
          'w-full font-body font-medium transition-smooth opacity-60 cursor-not-allowed',
          'bg-sold hover:bg-sold text-white',
          className
        )}
      >
        <Heart className="w-4 h-4 mr-2" />
        Peça já tem novo lar 💛
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      size={size}
      className={cn(
        'w-full font-body font-medium transition-bounce shadow-card hover:shadow-hover',
        isAvailable
          ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
          : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
        className
      )}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      {isAvailable ? 'Eu quero ✨' : 'Avisar quando liberar 🤍'}
    </Button>
  );
}