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
import ExtraServiceItem from './extra-service-item';

interface ExtraServiceListProps {
  items: ExtraService[];
  setItems: (items: ExtraService[]) => void;
  setOrderChanged: (orderChanged: boolean) => void;
}

export default function ExtraServiceList({
  items,
  setItems,
  setOrderChanged,
}: ExtraServiceListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, ...values } : item))
    );
    setOrderChanged(true);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext items={items}>
        <div className="pt-4 min-w-[556px] space-y-2">
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
  );
}
