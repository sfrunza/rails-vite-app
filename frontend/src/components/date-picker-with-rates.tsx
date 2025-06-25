import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDate } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { CalendarWithRates } from './calendar-with-rates';

interface DatePickerWithRatesProps {
  value: Date | undefined;
  id?: string;
  onChange: (date: Date | undefined) => void;
}

export function DatePickerWithRates({
  value,
  id,
  onChange,
}: DatePickerWithRatesProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          className="justify-between font-normal"
        >
          {value ? formatDate(value) : 'Select date'}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <CalendarWithRates
          calendarProps={{
            showOutsideDays: false,
            mode: 'single',
            selected: value,
            // captionLayout: 'dropdown',
          }}
          onSelectDate={(date) => {
            onChange(date);
            setOpen(false);
          }}
          showFooter={true}
        />
      </PopoverContent>
    </Popover>
  );
}
