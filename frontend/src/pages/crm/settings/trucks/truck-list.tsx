import { TruckIcon } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { type Truck } from '@/types/truck';

interface TruckListProps {
  items: Truck[];
  setItems: (items: Truck[]) => void;
  setIsTouched: (isTouched: boolean) => void;
}

export default function TruckList({
  items,
  setItems,
  setIsTouched,
}: TruckListProps) {
  function handleChange(
    truck: Truck,
    name: keyof Truck,
    value: (typeof truck)[keyof Truck]
  ) {
    const newPackingList = items.map((t) =>
      t.id === truck.id
        ? {
            ...t,
            [name]: value,
          }
        : t
    );
    setItems(newPackingList);
    setIsTouched(true);
  }

  return (
    <div className="space-y-4">
      {items?.map((truck, idx) => (
        <div
          key={truck.id}
          className="grid grid-cols-[6rem_3rem_1fr] gap-6 items-center"
        >
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <TruckIcon className="size-5" />
            <span>Truck {idx + 1}</span>
          </div>
          <Switch
            checked={truck.is_active}
            onCheckedChange={(checked) => {
              const value = checked;
              handleChange(truck, 'is_active', value);
            }}
          />
          <Input
            value={truck.name}
            onChange={(e) => {
              const value = e.target.value;
              handleChange(truck, 'name', value);
            }}
          />
        </div>
      ))}
    </div>
  );
}
