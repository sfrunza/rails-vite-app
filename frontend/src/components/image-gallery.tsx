import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

type ImageItem = {
  id: number;
  url: string;
};

type ImageGalleryProps = {
  images: ImageItem[];
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selected, setSelected] = useState<ImageItem | null>(null);

  return (
    <div>
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative group cursor-pointer overflow-hidden rounded-lg border hover:shadow-lg transition-all duration-200"
          >
            <img
              src={image.url}
              alt={`Image ${image.id}`}
              onClick={() => setSelected(image)}
              className="h-full w-full cursor-pointer object-contain object-center hover:opacity-80 transition"
            />
          </div>
        ))}
      </div>

      {/* ShadCN Dialog Preview */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="p-0 max-w-3xl">
          {selected && (
            <img
              src={selected.url}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
