import { useEffect, useState } from 'react';

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

import { cn, handleApiError } from '@/lib/utils';

import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useBulkUpdatePackingsMutation,
  useGetPackingsQuery,
} from '@/services/packings-api';
import { type Packing } from '@/types/packing';
import { toast } from 'sonner';
import PackingItem from './packing-item';

export default function PackingList() {
  const { data: packings, isLoading, isError } = useGetPackingsQuery();
  const [bulkUpdatePackings, { isLoading: isBulkUpdating }] =
    useBulkUpdatePackingsMutation();

  const [items, setItems] = useState<Packing[]>([]);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (packings) {
      setItems(packings);
    }
  }, [packings]);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const updatedItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({ ...item, index: index })
      );

      setItems(updatedItems);
      setOrderChanged(true);
    }
  }

  if (isError) {
    return (
      <div className="flex w-full items-center justify-center text-muted-foreground">
        <p>Failed to fetch packings</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton className="h-17.5 w-full" key={i} />
          ))}
        </div>
      )}
      {packings && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement]}
        >
          <SortableContext items={items}>
            <div className="space-y-2">
              {items.map((item) => (
                <PackingItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
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
              setItems(packings!);
              setOrderChanged(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            type="button"
            className="w-full sm:w-auto"
            disabled={isBulkUpdating}
            loading={isBulkUpdating}
            onClick={() => {
              bulkUpdatePackings({ packings: items })
                .unwrap()
                .then(() => {
                  setOrderChanged(false);
                  toast.success('Changes saved');
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
