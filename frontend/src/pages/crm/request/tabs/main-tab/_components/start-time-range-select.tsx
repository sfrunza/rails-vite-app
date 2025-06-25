import { useState } from 'react';

import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppDispatch, useAppSelector } from '@/store';

import { Separator } from '@/components/ui/separator';
import { TIME_OPTIONS_WITH_MERIDIEM } from '@/constants/request';
import { updateField } from '@/slices/request-slice';

export default function StartTimeRangeSelect() {
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [valueStart, setValueStart] = useState<string>('');
  const [valueEnd, setValueEnd] = useState<string>('');

  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request.request);

  if (!request) return null;

  const surrentStartTimeWindow = request.start_time_window;

  const surrentEndTimeWindow = request.end_time_window;

  // const currentMovingDate = request.moving_date;

  // const timeOptions = generateTimeOptions(currentMovingDate);

  return (
    <div className="flex h-9">
      <Popover open={openStart} onOpenChange={setOpenStart}>
        <PopoverTrigger asChild id="start-time-window">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openStart}
            className="justify-between rounded-r-none border-r-0 min-w-22.5"
          >
            <span className="min-w-16">
              {surrentStartTimeWindow
                ? TIME_OPTIONS_WITH_MERIDIEM.find(
                    (framework) => framework.value === surrentStartTimeWindow
                  )?.label
                : ''}
            </span>
            <ChevronsUpDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput />
            <CommandList>
              <CommandEmpty>No time found.</CommandEmpty>
              <CommandGroup>
                {TIME_OPTIONS_WITH_MERIDIEM.map((framework) => (
                  <CommandItem
                    itemType="tel"
                    key={framework.value}
                    value={framework.label}
                    onSelect={(currentValue: string) => {
                      const newStartTimeValue = TIME_OPTIONS_WITH_MERIDIEM.find(
                        (time) => time.label === currentValue
                      )?.value;
                      dispatch(
                        updateField({
                          start_time_window: newStartTimeValue,
                        })
                      );
                      setValueStart(
                        currentValue === valueStart ? '' : currentValue
                      );
                      setOpenStart(false);
                    }}
                  >
                    {framework.label}
                    <CheckIcon
                      className={cn(
                        'ml-auto',
                        valueStart === framework.label
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Separator orientation="vertical" className="h-full" />
      <Popover open={openEnd} onOpenChange={setOpenEnd}>
        <div className="relative flex items-center">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openEnd}
              className="justify-between flex-1 rounded-l-none border-l-0 min-w-22.5 !pr-5"
            >
              <span className="min-w-16">
                {surrentEndTimeWindow
                  ? TIME_OPTIONS_WITH_MERIDIEM.find(
                      (framework) => framework.value === surrentEndTimeWindow
                    )?.label
                  : ''}
              </span>
              <ChevronsUpDownIcon />
            </Button>
          </PopoverTrigger>
          {/* Clear button OUTSIDE PopoverTrigger */}
          {surrentEndTimeWindow && (
            <XIcon
              className="size-4 absolute hover:text-muted-foreground right-1 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setValueEnd('');
                dispatch(updateField({ end_time_window: null }));
              }}
            />
          )}
        </div>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput />
            <CommandList>
              <CommandEmpty>No time found.</CommandEmpty>
              <CommandGroup>
                {TIME_OPTIONS_WITH_MERIDIEM.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.label}
                    onSelect={(currentValue: string) => {
                      const newStartTimeValue = TIME_OPTIONS_WITH_MERIDIEM.find(
                        (time) => time.label === currentValue
                      )?.value;
                      dispatch(
                        updateField({
                          end_time_window: newStartTimeValue,
                        })
                      );
                      setValueEnd(
                        currentValue === valueEnd ? '' : currentValue
                      );
                      setOpenEnd(false);
                    }}
                  >
                    {framework.label}
                    <CheckIcon
                      className={cn(
                        'ml-auto',
                        valueEnd === framework.label
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
