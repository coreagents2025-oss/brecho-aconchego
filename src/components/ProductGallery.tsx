import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

// Import all product images
import vintageDress1 from '@/assets/vintage-dress-1.jpg';
import vintageDress2 from '@/assets/vintage-dress-2.jpg';
import vintageDress3 from '@/assets/vintage-dress-3.jpg';
import vintageDress4 from '@/assets/vintage-dress-4.jpg';
import vintageDress5 from '@/assets/vintage-dress-5.jpg';
import denimJacket1 from '@/assets/denim-jacket-1.jpg';
import denimJacket2 from '@/assets/denim-jacket-2.jpg';
import denimJacket3 from '@/assets/denim-jacket-3.jpg';
import denimJacket4 from '@/assets/denim-jacket-4.jpg';
import denimJacket5 from '@/assets/denim-jacket-5.jpg';
import silkBlouse1 from '@/assets/silk-blouse-1.jpg';
import silkBlouse2 from '@/assets/silk-blouse-2.jpg';
import silkBlouse3 from '@/assets/silk-blouse-3.jpg';
import silkBlouse4 from '@/assets/silk-blouse-4.jpg';
import silkBlouse5 from '@/assets/silk-blouse-5.jpg';
import pleatedSkirt1 from '@/assets/pleated-skirt-1.jpg';
import pleatedSkirt2 from '@/assets/pleated-skirt-2.jpg';
import pleatedSkirt3 from '@/assets/pleated-skirt-3.jpg';
import pleatedSkirt4 from '@/assets/pleated-skirt-4.jpg';
import pleatedSkirt5 from '@/assets/pleated-skirt-5.jpg';
import knitCardigan1 from '@/assets/knit-cardigan-1.jpg';
import knitCardigan2 from '@/assets/knit-cardigan-2.jpg';
import knitCardigan3 from '@/assets/knit-cardigan-3.jpg';
import knitCardigan4 from '@/assets/knit-cardigan-4.jpg';
import knitCardigan5 from '@/assets/knit-cardigan-5.jpg';
import wideLegPants1 from '@/assets/wide-leg-pants-1.jpg';
import wideLegPants2 from '@/assets/wide-leg-pants-2.jpg';
import wideLegPants3 from '@/assets/wide-leg-pants-3.jpg';
import wideLegPants4 from '@/assets/wide-leg-pants-4.jpg';
import wideLegPants5 from '@/assets/wide-leg-pants-5.jpg';

// Image mapping for demo
const mockImages: Record<string, string> = {
  'vintage-dress-1': vintageDress1,
  'vintage-dress-2': vintageDress2,
  'vintage-dress-3': vintageDress3,
  'vintage-dress-4': vintageDress4,
  'vintage-dress-5': vintageDress5,
  'denim-jacket-1': denimJacket1,
  'denim-jacket-2': denimJacket2,
  'denim-jacket-3': denimJacket3,
  'denim-jacket-4': denimJacket4,
  'denim-jacket-5': denimJacket5,
  'silk-blouse-1': silkBlouse1,
  'silk-blouse-2': silkBlouse2,
  'silk-blouse-3': silkBlouse3,
  'silk-blouse-4': silkBlouse4,
  'silk-blouse-5': silkBlouse5,
  'pleated-skirt-1': pleatedSkirt1,
  'pleated-skirt-2': pleatedSkirt2,
  'pleated-skirt-3': pleatedSkirt3,
  'pleated-skirt-4': pleatedSkirt4,
  'pleated-skirt-5': pleatedSkirt5,
  'knit-cardigan-1': knitCardigan1,
  'knit-cardigan-2': knitCardigan2,
  'knit-cardigan-3': knitCardigan3,
  'knit-cardigan-4': knitCardigan4,
  'knit-cardigan-5': knitCardigan5,
  'wide-leg-pants-1': wideLegPants1,
  'wide-leg-pants-2': wideLegPants2,
  'wide-leg-pants-3': wideLegPants3,
  'wide-leg-pants-4': wideLegPants4,
  'wide-leg-pants-5': wideLegPants5,
};

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const imageUrls = images.map(id => mockImages[id] || '/placeholder.svg');
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