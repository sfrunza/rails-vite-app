import { TIME_OPTIONS_WITH_MERIDIEM } from '@/constants/request';

import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateField } from '@/slices/request-slice';
import { DatePickerRange } from '@/components/date-picker-range';
import { SelectWithSearch } from '@/components/select-with-search';

export default function TransitDateTime() {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request.request);
  if (!request) return null;

  return (
    <div className="flex flex-wrap justify-start gap-4 p-4 bg-muted">
      <div className="text-muted-foreground w-full md:w-auto">
        <p className="text-xl uppercase font-semibold">In Transit:</p>
        <p className="text-sm">Visible only in schedule</p>
      </div>
      {/* Move Date */}
      <div className="space-y-2 w-full md:w-auto">
        <Label htmlFor="schedule-date-window">Trucks delivery dates</Label>
        <DatePickerRange
          dateRange={{
            from: request.schedule_date_window_start
              ? new Date(request.schedule_date_window_start)
              : undefined,
            to: request.schedule_date_window_end
              ? new Date(request.schedule_date_window_end)
              : undefined,
          }}
          onChange={(dateRange) => {
            if (dateRange?.from && dateRange?.to) {
              dispatch(
                updateField({
                  schedule_date_window_start: dateRange.from.toISOString(),
                  schedule_date_window_end: dateRange.to.toISOString(),
                })
              );
            }
          }}
          id="schedule-date-window"
        />
      </div>

      {/* Delivery truck start */}
      <div className="space-y-2">
        <Label htmlFor="start_time_window_schedule">Delivery truck start</Label>
        <SelectWithSearch
          options={TIME_OPTIONS_WITH_MERIDIEM}
          value={request.start_time_window_schedule ?? ''}
          handleSelect={(val) =>
            dispatch(updateField({ start_time_window_schedule: val }))
          }
          id="start_time_window_schedule"
        />
      </div>

      {/* Delivery truck end */}
      <div className="space-y-2">
        <Label htmlFor="end_time_window_schedule">Delivery truck end</Label>
        <SelectWithSearch
          options={TIME_OPTIONS_WITH_MERIDIEM}
          value={request.end_time_window_schedule ?? ''}
          handleSelect={(val) =>
            dispatch(updateField({ end_time_window_schedule: val }))
          }
          id="end_time_window_schedule"
        />
      </div>
    </div>
  );
}
