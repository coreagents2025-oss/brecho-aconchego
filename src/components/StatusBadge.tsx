import { cn } from '@/lib/utils';
import { ProductStatus } from '@/types/product';

interface StatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

const statusConfig = {
  disponivel: {
    label: 'Disponível',
    className: 'bg-available text-white',
    icon: '✨'
  },
  reservado: {
    label: 'Reservado com carinho',
    className: 'bg-reserved text-white',
    icon: '🤍'
  },
  vendido: {
    label: 'Novo lar encontrado',
    className: 'bg-sold text-white',
    icon: '💛'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium font-body transition-smooth',
        config.className,
        className
      )}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}