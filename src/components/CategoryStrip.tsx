import { cn } from '@/lib/utils';

interface Category {
  label: string;
  value: string;
  emoji: string;
}

const CATEGORIES: Category[] = [
  { label: 'Todas', value: 'all', emoji: '✨' },
  { label: 'Vestidos', value: 'Vestido', emoji: '👗' },
  { label: 'Blusas', value: 'Blusa', emoji: '👚' },
  { label: 'Saias', value: 'Saia', emoji: '🌸' },
  { label: 'Calças', value: 'Calça', emoji: '👖' },
  { label: 'Acessórios', value: 'Acessório', emoji: '💍' },
];

interface Props {
  selected: string;
  onSelect: (value: string) => void;
}

export function CategoryStrip({ selected, onSelect }: Props) {
  return (
    <section className="container mx-auto px-4 pt-10 pb-4">
      <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide justify-start md:justify-center pb-2">
        {CATEGORIES.map((cat) => {
          const active = selected === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => {
                onSelect(cat.value);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex flex-col items-center gap-2 group flex-shrink-0"
            >
              <div
                className={cn(
                  'w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl transition-smooth border-2',
                  active
                    ? 'bg-secondary text-secondary-foreground border-secondary shadow-hover scale-105'
                    : 'bg-card border-border text-foreground group-hover:border-secondary/60 group-hover:shadow-card'
                )}
              >
                <span>{cat.emoji}</span>
              </div>
              <span
                className={cn(
                  'font-body text-xs md:text-sm transition-smooth',
                  active ? 'text-secondary font-medium' : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
