import type { CSSProperties } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVerticalIcon } from 'lucide-react';

import { NumericInput } from '@/components/numeric-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { type ExtraService } from '@/types/extra-service';
import DeleteExtraServiceDialog from './delete-extra-service-dialog';

export default function ExtraServiceItem({
  id,
  item,
  onChange,
}: {
  id: number;
  item: ExtraService;
  onChange: (itemId: number, value: Partial<ExtraService>) => void;
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
        'grid grid-cols-[max-content_3fr_1fr_1fr_1fr] items-center gap-4 p-2',
        {
          'bg-background shadow-lg': isDragging,
        }
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        className="flex min-w-6 cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon />
      </Button>
      <Input
        name={item.name}
        value={item.name}
        onChange={(e) => {
          const value = e.target.value;
          onChange(item.id, { name: value });
        }}
      />
      <NumericInput
        defaultValue={(item.price / 100).toString()}
        min={0}
        max={10000}
        allowDecimals={true}
        onChange={(value) => {
          onChange(item.id, { price: Number(value) * 100 });
        }}
      />
      <Switch
        checked={item.enabled}
        onCheckedChange={(val) => {
          onChange(item.id, { enabled: val });
        }}
      />
      <div className="flex justify-end">
        <DeleteExtraServiceDialog extraService={item} />
      </div>
    </div>
  );
}
