import { Search } from 'lucide-react';
import { sizes as defaultSizes } from '@/data/mockData';
import { ProductStatus } from '@/types/product';
import { cn } from '@/lib/utils';

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  selectedStatus: ProductStatus | 'all';
  onStatusChange: (status: ProductStatus | 'all') => void;
  showSoldItems: boolean;
  onShowSoldChange: (show: boolean) => void;
  availableCategories?: string[];
  availableSizes?: string[];
}

export function FiltersBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSize,
  onSizeChange,
  showSoldItems,
  onShowSoldChange,
  availableCategories,
  availableSizes,
}: FiltersBarProps) {
  const categoryList = availableCategories ?? [];
  const sizeList = availableSizes ?? defaultSizes;

  const categoryTabs: { value: string; label: string }[] = [
    { value: 'all', label: 'Coleção completa' },
    ...categoryList.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="border-b border-foreground/10 pb-10 mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-8">
      {/* Left: title + category nav */}
      <div className="space-y-6 min-w-0">
        <h2 className="font-display italic text-4xl md:text-5xl leading-none text-foreground">
          O Acervo
        </h2>
        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {categoryTabs.map((tab) => {
            const active = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onCategoryChange(tab.value)}
                className={cn(
                  'font-body text-[11px] uppercase tracking-[0.25em] pb-1 border-b transition-colors',
                  active
                    ? 'text-foreground border-secondary font-semibold'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: search + size + sold toggle */}
      <div className="flex flex-wrap items-end gap-6 md:gap-8 md:justify-end">
        <label className="relative border-b border-foreground/20 py-2 flex items-center gap-2 focus-within:border-secondary transition-colors">
          <Search className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="BUSCAR..."
            className="bg-transparent font-body text-[11px] tracking-[0.2em] outline-none placeholder:text-muted-foreground/60 w-28 focus:w-48 transition-[width] duration-500"
          />
        </label>

        <select
          value={selectedSize}
          onChange={(e) => onSizeChange(e.target.value)}
          className="font-body text-[11px] uppercase tracking-[0.2em] bg-transparent border-b border-foreground/20 pb-2 cursor-pointer outline-none text-muted-foreground hover:text-foreground focus:border-secondary transition-colors"
          aria-label="Filtrar por tamanho"
        >
          <option value="all">Tamanho</option>
          {sizeList.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onShowSoldChange(!showSoldItems)}
          className="font-body text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 text-muted-foreground hover:text-foreground pb-2 border-b border-transparent transition-colors"
          aria-pressed={!showSoldItems}
        >
          <span
            className={cn(
              'w-3 h-3 rounded-full border flex items-center justify-center transition-colors',
              !showSoldItems ? 'border-secondary' : 'border-foreground/30'
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                !showSoldItems ? 'bg-secondary' : 'bg-transparent'
              )}
            />
          </span>
          Ocultar vendidos
        </button>
      </div>
    </div>
  );
}
