import { type MoveSize } from '@/types/move-size';
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
import MoveSizeItem from './move-size-item';

interface MoveSizeListProps {
  items: MoveSize[];
  setItems: (items: MoveSize[]) => void;
  setOrderChanged: (orderChanged: boolean) => void;
}

export default function MoveSizeList({
  items,
  setItems,
  setOrderChanged,
}: MoveSizeListProps) {
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext items={items}>
        <div className="space-y-4">
          {items?.map((item) => (
            <MoveSizeItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
