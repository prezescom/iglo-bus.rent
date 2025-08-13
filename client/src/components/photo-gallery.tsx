import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  initialIndex?: number;
}

export default function PhotoGallery({ 
  isOpen, 
  onClose, 
  photos, 
  initialIndex = 0 
}: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onClose();
  };

  if (!photos.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-5xl w-full p-0 bg-black/95 border-none"
        onKeyDown={handleKeyDown}
        data-testid="photo-gallery"
      >
        <div className="relative h-[80vh] flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            data-testid="gallery-close-button"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                data-testid="gallery-prev-button"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                data-testid="gallery-next-button"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Main image */}
          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src={photos[currentIndex].src}
              alt={photos[currentIndex].alt}
              className="max-w-full max-h-full object-contain"
              data-testid={`gallery-image-${currentIndex}`}
            />
          </div>

          {/* Image counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
              {currentIndex + 1} / {photos.length}
            </div>
          )}

          {/* Image title */}
          {photos[currentIndex].title && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/70 text-white text-center rounded-lg max-w-md">
              <h3 className="font-medium">{photos[currentIndex].title}</h3>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {photos.length > 1 && (
          <div className="bg-black/80 p-4">
            <div className="flex gap-2 justify-center overflow-x-auto">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentIndex
                      ? "border-brand-blue"
                      : "border-transparent hover:border-white/50"
                  }`}
                  data-testid={`gallery-thumbnail-${index}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}