import { cn } from '@/lib/utils';
import { ProductStatus } from '@/types/product';

interface StatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  'Disponível': {
    label: 'Disponível',
    className: 'bg-background/85 backdrop-blur-sm text-foreground',
  },
  'Reservado': {
    label: 'Reservado',
    className: 'bg-secondary text-secondary-foreground',
  },
  'Vendido': {
    label: 'Novo lar encontrado',
    className: 'bg-foreground/70 backdrop-blur-sm text-background',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center text-[9px] uppercase tracking-[0.3em] py-1.5 px-3 font-body font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
