import { type Packing } from '@/types/packing';
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
import PackingItem from './packing-item';

interface PackingListProps {
  items: Packing[];
  setItems: (items: Packing[]) => void;
  setOrderChanged: (orderChanged: boolean) => void;
}

export default function PackingList({
  items,
  setItems,
  setOrderChanged,
}: PackingListProps) {
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

      const updatedItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({ ...item, index: index })
      );

      setItems(updatedItems);
      setOrderChanged(true);
    }
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
            <PackingItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
