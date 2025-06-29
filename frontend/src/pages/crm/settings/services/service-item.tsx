import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { Service } from '@/types/service';
import DeleteServiceDialog from './delete-service-dialog';

export default function ServiceItem({
  id,
  item,
  onEnabledChange,
}: {
  id: number;
  item: Service;
  onEnabledChange: (index: number, value: boolean) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    position: isDragging ? 'relative' : 'static',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'grid grid-cols-[max-content_1fr_max-content_max-content] border rounded-md items-center gap-2 p-2',
        {
          'bg-background shadow-lg': isDragging,
        }
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        className="cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon />
      </Button>
      <div className="overflow-hidden">
        <p className="truncate text-sm font-medium">{item.name}</p>
      </div>
      <Switch
        checked={item.enabled}
        onCheckedChange={(val) => {
          onEnabledChange(item.id, val);
        }}
      />
      {!item.is_default ? (
        <DeleteServiceDialog service={item} />
      ) : (
        <div className="size-9" />
      )}
    </div>
  );
}
