import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, handleApiError } from '@/lib/utils';
import { useBulkUpdateServicesMutation } from '@/services/services-api';
import type { Service } from '@/types/service';
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
import ServiceItem from './service-item';

interface ServiceListProps {
  movingServices: Service[];
}

export default function ServiceList({ movingServices }: ServiceListProps) {
  const [bulkUpdateServices, { isLoading }] = useBulkUpdateServicesMutation();

  const [items, setItems] = useState<Service[]>(movingServices);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setItems(movingServices);
  }, [movingServices]);

  function handleDragEnd(event: any) {
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

  function onEnabledChange(itemId: number, value: boolean) {
    setItems((prev: Service[]) => {
      return prev.map((item) =>
        item.id === itemId ? { ...item, enabled: value } : item
      );
    });
    setOrderChanged(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <SortableContext items={items}>
          <div className="space-y-2">
            {items.map((item) => (
              <ServiceItem
                key={item.id}
                id={item.id}
                item={item}
                onEnabledChange={onEnabledChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Separator />
      <div
        className={cn('flex transition-opacity duration-500 sm:justify-end', {
          'invisible opacity-0': !orderChanged,
          'visible opacity-100': orderChanged,
        })}
      >
        <div className="flex min-h-9 w-full gap-3 sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              setItems(movingServices!);
              setOrderChanged(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            type="button"
            className="w-full sm:w-auto"
            disabled={isLoading}
            loading={isLoading}
            onClick={() => {
              bulkUpdateServices({ services: items })
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
    </div>
  );
}
