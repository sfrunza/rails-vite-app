import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Upload, XCircleIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface FileUploadProps {
  requestId: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ requestId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: unsupported file type (${file.type})`);
      } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`${file.name}: exceeds 10MB size limit`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length) {
      toast.error('Upload failed:\n' + errors.join('\n'));
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);

    const validFiles: File[] = [];
    const errors: string[] = [];

    droppedFiles.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: unsupported file type (${file.type})`);
      } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`${file.name}: exceeds 10MB size limit`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length) {
      toast.error('Upload failed:\n' + errors.join('\n'));
      return;
    }

    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async () => {
    if (files.length < 1) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images[]', file);
    });

    setIsUploading(true);
    try {
      await api.post(`requests/${requestId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFiles([]); // Clear files after successful upload
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images.');
    } finally {
      setIsUploading(false);
    }
  };

  const UploadArea = ({ className }: { className?: string }) => (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-md p-4 text-center transition-all duration-200 cursor-pointer',
        isDragOver
          ? 'border-blue-400 bg-blue-50'
          : 'hover:border-muted-foreground/50 bg-muted/40',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept="image/jpeg, image/png, image/gif, image/webp"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center justify-center h-full space-y-2">
        <Upload className="w-6 h-6 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {files.length === 0 ? 'Add images' : 'Add more'}
          </p>
          <p className="text-xs text-muted-foreground">Drop or click</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <UploadArea className="p-8" />

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">
              {files.length} {files.length === 1 ? 'file' : 'files'} selected
            </h4>
            <Button variant="outline" size="sm" onClick={() => setFiles([])}>
              Clear all
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {/* File previews */}
            {files.map((file, index) => (
              <ImagePreview
                key={index}
                url={URL.createObjectURL(file)}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex justify-end">
            <LoadingButton
              loading={isUploading}
              disabled={isUploading}
              onClick={handleFileUpload}
            >
              Upload {files.length} {files.length === 1 ? 'image' : 'images'}
            </LoadingButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

export const ImagePreview = ({
  url,
  onRemove,
  onClick,
  className,
}: {
  url: string;
  onRemove: () => void;
  onClick?: () => void;
  className?: string;
}) => (
  <div
    className={cn(
      'relative bg-background aspect-3/2 border rounded-md',
      className
    )}
    onClick={onClick}
  >
    <button
      className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
    >
      <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
    </button>
    <img
      src={url}
      height={200}
      width={200}
      alt=""
      className="h-full w-full object-contain rounded-md"
    />
  </div>
);
