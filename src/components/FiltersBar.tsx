import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Filter, X } from 'lucide-react';
import { categories, sizes } from '@/data/mockData';
import { ProductStatus } from '@/types/product';

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
}

export function FiltersBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSize,
  onSizeChange,
  selectedStatus,
  onStatusChange,
  showSoldItems,
  onShowSoldChange,
}: FiltersBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const hasActiveFilters = selectedCategory !== 'all' || selectedSize !== 'all' || selectedStatus !== 'all' || searchQuery.length > 0;

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onSizeChange('all');
    onStatusChange('all');
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar por nome, código ou tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background border-border font-body"
        />
      </div>

      {/* Filters Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="font-body"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs">
              Ativos
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground font-body"
          >
            <X className="w-4 h-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filters Content */}
      {isFiltersOpen && (
        <div className="space-y-4 border-t border-border pt-4">
          {/* Category and Size Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-body font-medium text-foreground mb-2 block">
                Categoria
              </Label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-body font-medium text-foreground mb-2 block">
                Tamanho
              </Label>
              <Select value={selectedSize} onValueChange={onSizeChange}>
                <SelectTrigger className="font-body">
                  <SelectValue placeholder="Todos os tamanhos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tamanhos</SelectItem>
                  {sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Label className="text-sm font-body font-medium text-foreground mb-2 block">
              Status
            </Label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="font-body">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Disponível">Disponível</SelectItem>
                <SelectItem value="Reservado">Reservado</SelectItem>
                <SelectItem value="Vendido">Vendido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Sold Items Toggle */}
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="show-sold"
              checked={showSoldItems}
              onCheckedChange={onShowSoldChange}
            />
            <Label htmlFor="show-sold" className="text-sm font-body text-muted-foreground">
              Mostrar peças que já encontraram novo lar
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}