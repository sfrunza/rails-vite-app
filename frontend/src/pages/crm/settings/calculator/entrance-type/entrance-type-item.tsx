import type { EntranceType } from '@/types/entrance-type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import DeleteEntranceDialog from './delete-entrance-dialog';

interface EntranceTypeItemProps {
  item: EntranceType;
  onChange: (itemId: number, values: Partial<EntranceType>) => void;
}

export default function EntranceTypeItem({
  item,
  onChange,
}: EntranceTypeItemProps) {
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
    <div className="flex items-center gap-2" ref={setNodeRef} style={style}>
      <GripVerticalIcon
        className="size-5 min-w-5 cursor-grab text-muted-foreground"
        {...attributes}
        {...listeners}
      />
      <div
        className={cn('grid auto-cols-auto grid-flow-col gap-2', {
          'bg-background': isDragging,
        })}
      >
        <Input
          id={`long-name-${item.id}`}
          type="text"
          value={item.name}
          onChange={(e) => {
            onChange(item.id, { name: e.target.value });
          }}
        />
        <Input
          id={`short-name-${item.id}`}
          type="text"
          value={item.form_name}
          onChange={(e) => {
            onChange(item.id, { form_name: e.target.value });
          }}
        />
        <DeleteEntranceDialog entrance={item} />
      </div>
    </div>
  );
}
