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
import ServiceItem from './service-item';

interface ServiceListProps {
  items: Service[];
  setItems: (items: Service[]) => void;
  setOrderChanged: (orderChanged: boolean) => void;
}

export default function ServiceList({
  items,
  setItems,
  setOrderChanged,
}: ServiceListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, enabled: value } : item
      )
    );
    setOrderChanged(true);
  }

  return (
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
  );
}
