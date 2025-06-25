import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAppSelector } from '@/store';
import { ChevronLeft, ChevronRight, ImageIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import FileUpload, { ImagePreview } from './file-upload';

export default function PhotosTab() {
  const request = useAppSelector((state) => state.request.request);
  if (!request) return null;
  const [active, setActive] = useState<string | null>(null);

  const images = request.image_urls ?? [];

  // Add current index tracking
  const currentIndex = active
    ? images.findIndex((img) => img.url === active)
    : -1;

  // Handle navigation
  const showNext = () => {
    if (currentIndex < images.length - 1) {
      setActive(images[currentIndex + 1].url);
    }
  };

  const showPrevious = () => {
    if (currentIndex > 0) {
      setActive(images[currentIndex - 1].url);
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!active) return;

      if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'ArrowLeft') {
        showPrevious();
      } else if (e.key === 'Escape') {
        setActive(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, currentIndex]);

  const handleDeleteImage = async (imageId: number) => {
    await api.delete(`/requests/${request.id}/images/${imageId}`);
  };

  return (
    <div className="p-4 bg-muted h-full dark:bg-background">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Photo Gallery</h2>
          <p className="text-muted-foreground">
            {images.length} {images.length === 1 ? 'photo' : 'photos'} uploaded
          </p>
        </div>

        {/* Upload Section */}
        <Card>
          <CardContent>
            <FileUpload requestId={request.id} />
          </CardContent>
        </Card>
      </div>

      {/* Modal Overlay */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActive(null)}
        >
          <div className="relative max-h-[95vh] max-w-[95vw] group">
            {/* Close Button */}
            <Button
              onClick={() => setActive(null)}
              size="icon"
              variant="secondary"
              className="absolute -right-4 -top-4 rounded-full bg-background/90 hover:bg-background shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevious();
                }}
                size="icon"
                variant="secondary"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}

            {currentIndex < images.length - 1 && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                size="icon"
                variant="secondary"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentIndex + 1} of {images.length}
            </div>

            {/* Main Image */}
            <img
              className="max-h-[95vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
              src={active}
              alt=""
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((image) => (
            <ImagePreview
              key={image.id}
              url={image.thumb}
              onRemove={() => {
                handleDeleteImage(image.id);
              }}
              onClick={() => setActive(image.url)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-background dark:bg-muted rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No photos yet
          </h3>
          <p className="text-muted-foreground">
            Upload your first photo to get started
          </p>
        </div>
      )}
    </div>
  );
}
