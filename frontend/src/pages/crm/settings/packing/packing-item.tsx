import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type Packing } from '@/types/packing';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import DeletePackingDialog from './delete-packing-dialog';
import PackingSheetForm from './packing-form-sheet';

export default function PackingItem({ item }: { item: Packing }) {
  const isDefaultItem = item.is_default;
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
  };

  return (
    <div
      ref={!isDefaultItem ? setNodeRef : null}
      style={style}
      className={cn(
        'grid grid-cols-[max-content_1fr_auto_auto] border rounded-md items-center gap-2 p-4',
        {
          'bg-background shadow-lg': isDragging,
        }
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        className="flex min-w-6 cursor-grab"
        disabled={isDefaultItem}
        {...(!isDefaultItem ? attributes : {})}
        {...(!isDefaultItem ? listeners : {})}
      >
        <GripVerticalIcon />
      </Button>
      <div className="overflow-hidden">
        <p className="truncate text-sm font-medium">{item.name}</p>
      </div>
      <PackingSheetForm data={item} />
      {isDefaultItem ? (
        <Button variant="ghost" disabled size="icon">
          <span className="sr-only">Default</span>
        </Button>
      ) : null}
      {!isDefaultItem && <DeletePackingDialog packing={item} />}
    </div>
  );
}
