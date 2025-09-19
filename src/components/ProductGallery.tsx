import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { driveImageUrl } from '@/utils/driveImage';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const imageUrls = images.map(id => driveImageUrl(id));
  const hasMultipleImages = imageUrls.length > 1;

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Image */}
      <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden group">
        <img
          src={imageUrls[currentImageIndex]}
          alt={`${productName} - Imagem ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth bg-white/90 backdrop-blur-sm border-0 shadow-soft"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth bg-white/90 backdrop-blur-sm border-0 shadow-soft"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 right-3 bg-warm-black/80 text-white px-2 py-1 rounded-full text-sm font-body">
            {currentImageIndex + 1} / {imageUrls.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-smooth',
                index === currentImageIndex
                  ? 'border-secondary'
                  : 'border-border hover:border-muted-foreground'
              )}
            >
              <img
                src={url}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}