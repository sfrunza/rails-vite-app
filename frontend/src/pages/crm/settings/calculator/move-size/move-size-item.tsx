import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon, Move3DIcon, TruckIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';
import { type MoveSize } from '@/types/move-size';
import MoveSizeFormSheet from './move-size-form-sheet';
import { Button } from '@/components/ui/button';

interface MoveSizeItemProps {
  item: MoveSize;
}

export default function MoveSizeItem({ item }: MoveSizeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    position: isDragging ? 'relative' : 'static',
    // touchAction: 'none',
  };

  return (
    <div className="flex items-center gap-2" ref={setNodeRef} style={style}>
      <Button
        size="icon"
        variant="ghost"
        className="cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon />
      </Button>
      <div className="@container w-full">
        <div
          className={cn(
            'grid w-full grid-cols-[max-content_1fr_max-content] @lg:grid-cols-9 border rounded-md items-center gap-2 p-4',
            {
              'bg-background shadow-lg': isDragging,
            }
          )}
        >
          <div>
            <img
              src={
                item.image_url ??
                'https://www.thehighlands.org/sites/default/files/styles/hero/public/one-bedroom-3d.png?itok=1Y5yuPSu'
              }
              alt={item.name}
              className="size-10 object-cover"
            />
          </div>
          <div className="overflow-hidden @lg:col-span-4">
            <p className="truncate font-semibold">{item.name}</p>
            <p className="truncate text-sm">{item.description}</p>
          </div>
          <div className="hidden @lg:flex @lg:col-span-2 gap-4">
            <div className="items-center flex gap-2 text-muted-foreground">
              <TruckIcon className="size-4" />
              <p className="truncate text-sm font-medium">
                {item.truck_count ?? 1}
              </p>
            </div>
            <div className="items-center flex gap-2 text-muted-foreground">
              <Move3DIcon className="size-4" />
              <p className="truncate text-sm font-medium">
                {item.volume || 100} cbf
              </p>
            </div>
          </div>
          <div className="flex justify-end @lg:col-span-2">
            <MoveSizeFormSheet data={item} />
          </div>
        </div>
      </div>
    </div>
  );
}
