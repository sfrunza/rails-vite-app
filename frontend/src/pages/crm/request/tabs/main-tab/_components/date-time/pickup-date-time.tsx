import { DatePickerWithRates } from '@/components/date-picker-with-rates';
import { SelectWithSearch } from '@/components/select-with-search';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TIME_OPTIONS } from '@/constants/request';
import { formatCentsToDollars } from '@/lib/helpers';
import { useGetServicesQuery } from '@/services/services-api';
import { updateField } from '@/slices/request-slice';
import { useAppDispatch, useAppSelector } from '@/store';
import StartTimeRangeSelect from '../../_components/start-time-range-select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function PickupDateTime() {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request.request);
  const { data: services } = useGetServicesQuery();

  const flatRateServiceId = services?.find(
    (service) => service.name === 'Flat Rate'
  )?.id;

  if (!request) return null;

  const isFlatRate = request.service_id === flatRateServiceId;
  const currentTravelTime = request.travel_time;
  const currentCrewSize = request.crew_size;
  const currentMinTotalTime = request.min_total_time;
  const currentRate = request.rate;

  return (
    <div className="flex flex-wrap justify-start gap-4 p-4">
      {/* Move Date */}
      <div className="space-y-2">
        <Label htmlFor="moving-date">Move Date</Label>
        <DatePickerWithRates
          value={
            request.moving_date ? new Date(request.moving_date) : undefined
          }
          onChange={(date) => {
            dispatch(updateField({ moving_date: date?.toISOString() ?? null }));
          }}
          id="moving-date"
        />
      </div>

      {/* Start time window */}
      <div className="space-y-2">
        <Label htmlFor="start-time-window">Start time window</Label>
        <StartTimeRangeSelect />
      </div>

      {/* Work time window */}
      <div className="space-y-2">
        <Label htmlFor="work-time">Work time</Label>
        <div className="flex h-9">
          <SelectWithSearch
            options={TIME_OPTIONS}
            value={request.work_time.min}
            handleSelect={(val) =>
              dispatch(
                updateField({
                  work_time: {
                    ...request.work_time,
                    min: val,
                  },
                })
              )
            }
            id="work-time"
            className="rounded-r-none border-r-0"
          />
          <Separator orientation="vertical" />
          <SelectWithSearch
            options={TIME_OPTIONS}
            value={request.work_time.max}
            handleSelect={(val) =>
              dispatch(
                updateField({
                  work_time: {
                    ...request.work_time,
                    max: val,
                  },
                })
              )
            }
            className="rounded-l-none border-l-0"
          />
        </div>
      </div>

      {/* Travel time */}
      <div className="space-y-2">
        <Label htmlFor="travel-time">Travel time</Label>
        <SelectWithSearch
          options={TIME_OPTIONS}
          value={currentTravelTime}
          handleSelect={(val) => dispatch(updateField({ travel_time: val }))}
          id="travel-time"
        />
      </div>

      {/* Crew size */}
      <div className="space-y-2">
        <Label htmlFor="crew-size">Crew size</Label>
        <Input
          id="crew-size"
          pattern="[0-9]+"
          inputMode="numeric"
          value={currentCrewSize || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              dispatch(updateField({ crew_size: parseInt(value) }));
            }
          }}
          className="w-16"
        />
      </div>

      {/* Rate */}
      <div className="space-y-2">
        <Label htmlFor="rate">{`${isFlatRate ? 'Flat ' : ''}Rate`}</Label>
        <Input
          id="rate"
          pattern="[0-9]+"
          inputMode="numeric"
          value={formatCentsToDollars(currentRate!) || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              dispatch(
                updateField({ rate: Math.round(parseFloat(value) * 100) })
              );
            }
          }}
          className="w-24"
        />
      </div>

      {/* Min. hours */}
      <div className="space-y-2">
        <Label htmlFor="min-total-time">Min. hours</Label>
        <SelectWithSearch
          options={TIME_OPTIONS}
          value={currentMinTotalTime}
          handleSelect={(val: number) =>
            dispatch(updateField({ min_total_time: val }))
          }
          id="min-total-time"
        />
      </div>

      {/* Is one day delivery */}
      <div className="space-y-2">
        <Label htmlFor="is_same_day_delivery">Is one day delivery</Label>
        <div className="flex items-center justify-center h-9">
          <Switch
            id="is_same_day_delivery"
            checked={request.is_same_day_delivery}
            onCheckedChange={(checked) =>
              dispatch(updateField({ is_same_day_delivery: checked }))
            }
          />
        </div>
      </div>
    </div>
  );
}
