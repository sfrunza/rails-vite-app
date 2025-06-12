import { format } from 'date-fns';
import { hexToRgb } from '@/lib/helpers';
import { type CalendarRate } from '@/types/rate';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetRatesQuery } from '@/services/rates-api';
import { useUpdateCalendarRateMutation } from '@/services/calendar-rates-api';
import { handleApiError } from '@/lib/utils';

interface SelectRateModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  calendarDayInfo: CalendarRate;
}

export default function SelectRateModal({
  isOpen,
  setIsOpen,
  calendarDayInfo,
}: SelectRateModalProps) {
  const { data: dbRates } = useGetRatesQuery();
  const [updateCalendarRate] = useUpdateCalendarRateMutation();

  const filteredRates = dbRates?.filter((rate) => rate.enable);

  if (!isOpen && !calendarDayInfo) return null;

  const { id: calendarDateId, rate_id, is_blocked } = calendarDayInfo;
  const selectedRateId = rate_id ?? 0;
  const formattedDate = format(
    new Date(calendarDayInfo.formatted_date + 'T00:00:00'),
    'PPP'
  );

  function handleSaveRate(id: number, newRateId: number) {
    const newData: Partial<CalendarRate> = {};
    if (newRateId === 0) {
      newData['is_blocked'] = true;
      newData['rate_id'] = null;
    } else {
      newData['rate_id'] = newRateId;
      newData['is_blocked'] = false;
    }
    updateCalendarRate({ id, newData })
      .unwrap()
      .catch((error) => {
        handleApiError(error);
      });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>{formattedDate}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <RadioGroup
          defaultValue={is_blocked ? '0' : selectedRateId.toString()}
          onValueChange={(value) => {
            handleSaveRate(calendarDateId, parseInt(value));
          }}
          className="gap-4"
        >
          {filteredRates?.map((rate, i) => (
            <Label
              htmlFor={rate.id.toString()}
              className="flex w-full cursor-pointer items-center gap-6 rounded-md p-3 transition-all hover:ring"
              style={{
                color: rate.color,
                backgroundColor: `rgba(${hexToRgb(rate.color)}, 0.1)`,
              }}
              key={i}
            >
              <RadioGroupItem
                value={rate.id.toString()}
                id={rate.id.toString()}
              />
              <span className="flex flex-grow items-center gap-2">
                {rate.name}
                <span
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: rate.color,
                  }}
                ></span>
              </span>
            </Label>
          ))}
          <div className="flex items-center space-x-2">
            <Label
              htmlFor="0"
              className="flex w-full cursor-pointer items-center gap-6 rounded-md bg-foreground/20 p-3 text-foreground transition-all hover:ring"
            >
              <RadioGroupItem value="0" id="0" />
              <span className="flex flex-grow items-center gap-2">
                Blocked
                <span className="size-2 rounded-full bg-black"></span>
              </span>
            </Label>
          </div>
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
}
