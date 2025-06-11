import type { EntranceType } from '@/types/entrance-type';
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
import EntranceTypeItem from './entrance-type-item';

interface EntranceTypeListProps {
  items: EntranceType[];
  setItems: (items: EntranceType[]) => void;
  setOrderChanged: (orderChanged: boolean) => void;
}

export default function EntranceTypeList({
  items,
  setItems,
  setOrderChanged,
}: EntranceTypeListProps) {
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

  function onChange(itemId: number, values: Partial<EntranceType>) {
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, ...values } : item))
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
        <div className="space-y-4">
          {items.map((item) => (
            <EntranceTypeItem key={item.id} item={item} onChange={onChange} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
