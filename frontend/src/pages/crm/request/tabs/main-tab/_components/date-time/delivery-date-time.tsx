import { TIME_OPTIONS_WITH_MERIDIEM } from '@/constants/request';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { SelectWithSearch } from '@/components/ui/select-with-search';
import { useAppDispatch, useAppSelector } from '@/store';
// import useCalendarRates from '@/hooks/use-calendar-rates';
import { updateField } from '@/slices/request-slice';
// import { centsToDollars } from "@/lib/helpers";
import { DatePickerRange } from '@/components/date-picker-range';
import { SelectWithSearch } from '@/components/select-with-search';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function DeliveryDateTime() {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request.request);
  if (!request) return null;

  return (
    <div className="flex flex-wrap justify-start gap-4 p-4">
      {/* Move Date */}
      <div className="space-y-2">
        <Label htmlFor="delivery-date-window">Delivery window</Label>
        <DatePickerRange
          dateRange={{
            from: request.delivery_date_window_start
              ? new Date(request.delivery_date_window_start)
              : undefined,
            to: request.delivery_date_window_end
              ? new Date(request.delivery_date_window_end)
              : undefined,
          }}
          onChange={(dateRange) => {
            if (dateRange?.from && dateRange?.to) {
              dispatch(
                updateField({
                  delivery_date_window_start: dateRange.from.toISOString(),
                  delivery_date_window_end: dateRange.to.toISOString(),
                })
              );
            }
          }}
          id="delivery-date-window"
        />
      </div>

      {/* Start time window */}
      <div className="space-y-2">
        <Label htmlFor="delivery-time-window">Delivery time window</Label>
        {/* <StartTimeRangeSelect /> */}
        <div className="flex h-9">
          <SelectWithSearch
            options={TIME_OPTIONS_WITH_MERIDIEM}
            value={request.start_time_window_delivery ?? ''}
            handleSelect={(val) =>
              dispatch(updateField({ start_time_window_delivery: val }))
            }
            className="rounded-r-none border-r-0 min-w-28"
            id="delivery-time-window"
          />
          <Separator orientation="vertical" className="h-full" />
          <SelectWithSearch
            options={TIME_OPTIONS_WITH_MERIDIEM}
            value={request.end_time_window_delivery ?? ''}
            handleSelect={(val) =>
              dispatch(updateField({ end_time_window_delivery: val }))
            }
            className="rounded-l-none border-l-0 min-w-28"
          />
        </div>
      </div>

      {/* Crew size */}
      <div className="space-y-2">
        <Label htmlFor="crew-size-delivery">Crew size</Label>
        <Input
          id="crew-size-delivery"
          pattern="[0-9]+"
          inputMode="numeric"
          value={request.crew_size_delivery || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              dispatch(updateField({ crew_size_delivery: parseInt(value) }));
            }
          }}
          className="w-16"
        />
      </div>

      {/* Is delivery now */}
      <div className="space-y-2">
        <Label htmlFor="is_delivery_now">Is delivery now</Label>
        <div className="flex items-center justify-center h-9">
          <Switch
            id="is_delivery_now"
            checked={request.is_delivery_now}
            onCheckedChange={(checked) =>
              dispatch(updateField({ is_delivery_now: checked }))
            }
          />
        </div>
      </div>
    </div>
  );
}
