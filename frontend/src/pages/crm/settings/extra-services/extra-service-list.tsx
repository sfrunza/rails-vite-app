import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn, handleApiError } from '@/lib/utils';
import { useBulkUpdateExtraServicesMutation } from '@/services/extra-services-api';
import { type ExtraService } from '@/types/extra-service';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ExtraServiceItem from './extra-service-item';
import { Skeleton } from '@/components/ui/skeleton';

interface ExtraServiceListProps {
  extraServices: ExtraService[];
  isLoading: boolean;
}

export default function ExtraServiceList({
  extraServices,
  isLoading,
}: ExtraServiceListProps) {
  const [bulkUpdateExtraServices, { isLoading: isBulkUpdating }] =
    useBulkUpdateExtraServicesMutation();

  const [items, setItems] = useState<ExtraService[]>([]);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (extraServices) {
      setItems(extraServices);
    }
  }, [extraServices]);

  function onDragEnd(event: any) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        index,
      }));

      setItems(updatedItems);
      setOrderChanged(true);
    }
  }

  function onChange(itemId: number, values: Partial<ExtraService>) {
    setItems((prev) => {
      return prev.map((item) =>
        item.id === itemId ? { ...item, ...values } : item
      );
    });
    setOrderChanged(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <ScrollArea className="w-full">
        <div className="mb-4 grid grid-cols-[max-content_3fr_1fr_1fr_1fr] items-center gap-4 text-sm font-medium text-muted-foreground">
          <p className="size-9" />
          <p>Service name</p>
          <p>Service cost, $</p>
          <p>Enable</p>
          <p></p>
        </div>
        <Separator />
        {isLoading && (
          <div className="space-y-2 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton className="h-13 w-full" key={i} />
            ))}
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext items={items}>
            <div className="pt-4 min-w-[700px] space-y-2">
              {items.map((item) => (
                <ExtraServiceItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  onChange={onChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <Separator />
      <div
        className={cn(
          'flex transition-opacity gap-3 duration-500 justify-end',
          {
            'invisible opacity-0': !orderChanged,
            'visible opacity-100': orderChanged,
          }
        )}
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setItems(extraServices!);
            setOrderChanged(false);
          }}
        >
          Cancel
        </Button>
        <LoadingButton
          type="button"
          disabled={isBulkUpdating}
          loading={isBulkUpdating}
          onClick={() => {
            bulkUpdateExtraServices({
              extra_services: items,
            })
              .unwrap()
              .then(() => {
                toast.success('Changes saved');
                setOrderChanged(false);
              })
              .catch((error) => {
                handleApiError(error);
              });
          }}
        >
          Save changes
        </LoadingButton>
      </div>
    </div>
  );
}
