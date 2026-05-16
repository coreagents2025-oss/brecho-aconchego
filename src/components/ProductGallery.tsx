import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GalleryItem =
  | { type: 'image'; url: string }
  | { type: 'video'; url: string; thumbnail: string };

interface ProductGalleryProps {
  images: string[];
  videoUrl?: string;
  productName: string;
  className?: string;
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  try {
    // YouTube
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;

    // Instagram (reel or post)
    const igMatch = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/);
    if (igMatch) return `https://www.instagram.com/p/${igMatch[1]}/embed`;

    // Fallback: assume already-embeddable URL
    return url;
  } catch {
    return null;
  }
}

export function ProductGallery({ images, videoUrl, productName, className }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const imageItems: GalleryItem[] = images
    .filter(Boolean)
    .map((url) => ({ type: 'image' as const, url }));

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  const items: GalleryItem[] = embedUrl
    ? [
        ...imageItems,
        { type: 'video' as const, url: embedUrl, thumbnail: imageItems[0]?.url || '' },
      ]
    : imageItems;

  const hasMultiple = items.length > 1;

  if (items.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden flex items-center justify-center">
          <span className="text-muted-foreground">Sem imagens disponíveis</span>
        </div>
      </div>
    );
  }

  const goTo = (idx: number) => {
    setCurrentIndex(idx);
    setVideoPlaying(false);
  };

  const goToPrevious = () => goTo(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  const goToNext = () => goTo(currentIndex === items.length - 1 ? 0 : currentIndex + 1);

  const current = items[currentIndex];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main slot */}
      <div className="relative aspect-[3/4] bg-muted rounded-2xl overflow-hidden group">
        {current.type === 'image' ? (
          <img
            src={current.url}
            alt={`${productName} - Imagem ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : videoPlaying ? (
          <iframe
            src={current.url}
            title={`${productName} - vídeo`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setVideoPlaying(true)}
            className="w-full h-full relative block"
            aria-label="Reproduzir vídeo"
          >
            {current.thumbnail ? (
              <img
                src={current.thumbnail}
                alt={`${productName} - capa do vídeo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-warm-black/80" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-warm-black/30 group-hover:bg-warm-black/40 transition-smooth">
              <span className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-soft">
                <Play className="w-7 h-7 text-warm-black fill-warm-black ml-1" />
              </span>
            </div>
          </button>
        )}

        {hasMultiple && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth bg-white/90 backdrop-blur-sm border-0 shadow-soft"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-smooth bg-white/90 backdrop-blur-sm border-0 shadow-soft"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {hasMultiple && (
          <div className="absolute bottom-3 right-3 bg-warm-black/80 text-white px-2 py-1 rounded-full text-sm font-body">
            {currentIndex + 1} / {items.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto">
          {items.map((item, index) => {
            const thumb = item.type === 'image' ? item.url : item.thumbnail;
            return (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-smooth',
                  index === currentIndex
                    ? 'border-secondary'
                    : 'border-border hover:border-muted-foreground'
                )}
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt={`${productName} - Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
                {item.type === 'video' && (
                  <span className="absolute inset-0 flex items-center justify-center bg-warm-black/40">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
