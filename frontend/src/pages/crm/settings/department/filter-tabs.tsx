import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type Tab = 'all' | 'admin' | 'manager' | 'foreman' | 'driver' | 'helper';

const tabs: Tab[] = ['all', 'admin', 'manager', 'foreman', 'driver', 'helper'];

interface FilterTabsProps {
  filter: Tab;
  handleSetFilter: (value: Tab) => void;
}

export function FilterTabs({ filter, handleSetFilter }: FilterTabsProps) {
  return (
    <Tabs
      value={filter}
      onValueChange={(value) => {
        handleSetFilter(value as Tab);
      }}
    >
      <ScrollArea className="pb-2">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  );
}
