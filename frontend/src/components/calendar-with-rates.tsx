import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { type DayProps, DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCentsToDollarsString, hexToRgb } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useGetCalendarRatesQuery } from '@/services/calendar-rates-api';
import { useGetRatesQuery } from '@/services/rates-api';
import { type CalendarRate } from '@/types/rate';
import { Skeleton } from './ui/skeleton';

const getEndOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onSelectDate: (date: Date, rateData: CalendarRate) => void;
  showFooter?: boolean;
};

function CalendarWithRates({
  onSelectDate,
  className,
  classNames,
  showOutsideDays = false,
  showFooter = true,
  ...props
}: CalendarProps) {
  const { data: calendarRates, isLoading } = useGetCalendarRatesQuery();
  const { data: rates } = useGetRatesQuery();
  const [selectedMonth, setSelectedMonth] = useState(props.today ?? new Date());

  const today = new Date();
  const elevenMonthsAhead = new Date();
  elevenMonthsAhead.setMonth(today.getMonth() + 11);

  return (
    <>
      <DayPicker
        month={selectedMonth}
        onMonthChange={setSelectedMonth}
        showOutsideDays={showOutsideDays}
        className={cn('p-3', className)}
        startMonth={today}
        endMonth={getEndOfMonth(elevenMonthsAhead)}
        classNames={{
          month: 'space-y-4',
          months: 'flex flex-col sm:flex-row space-y-4 sm:space-y-0 relative',
          month_caption: 'flex justify-center pt-1 relative items-center',
          month_grid: 'w-full border-collapse space-y-1',
          caption_label: 'text-sm font-medium',
          nav: 'flex items-center justify-between absolute inset-x-0',
          button_previous: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10'
          ),
          button_next: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 z-10'
          ),
          weeks: 'w-full border-collapse space-y-',
          weekdays: 'flex',
          weekday:
            'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
          week: 'flex w-full mt-2 gap-1',
          day_button:
            'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
          ),
          range_end: 'day-range-end',
          selected:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          today: 'bg-accent text-accent-foreground',
          outside:
            'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
          disabled: 'text-muted-foreground opacity-50',
          range_middle:
            'aria-selected:bg-accent aria-selected:text-accent-foreground',
          hidden: 'invisible',
          ...classNames,
        }}
        components={{
          Chevron: ({ ...props }) =>
            props.orientation === 'left' ? (
              <ChevronLeftIcon {...props} className="h-4 w-4" />
            ) : (
              <ChevronRightIcon {...props} className="h-4 w-4" />
            ),
          Day: (props: DayProps): ReactElement<any, any> => {
            const { day } = props;
            const date = day.date;

            if (isLoading) {
              return (
                <td>
                  <Skeleton className="h-8 w-8 p-0" />
                </td>
              );
            }

            if (!calendarRates) return <></>;

            const isSameMonth = date.getMonth() === selectedMonth.getMonth();

            const formattedDate = format(date, 'yyyy-MM-dd') as string;
            const rateData = calendarRates[formattedDate];
            const rate = rates?.find((r) => r.id === rateData?.rate_id);

            const styles = {
              color: 'inherit',
              backgroundColor: 'inherit',
              opacity: 1,
            };

            if (rateData?.is_blocked) {
              styles.color = 'black';
              styles.backgroundColor = '#dcdcdc';
            }

            if (rate) {
              styles.color = rate.color;
              styles.backgroundColor = `rgba(${hexToRgb(rate?.color)}, 0.1)`;
            }

            if (!isSameMonth) {
              styles.backgroundColor = '#f3f3f3';
              styles.color = '#7e7e7e';
              styles.opacity = 0.5;
            }

            return (
              <td>
                <button
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-8 w-8 p-0 font-semibold aria-selected:opacity-100'
                  )}
                  disabled={!isSameMonth}
                  style={styles}
                  onClick={() => {
                    onSelectDate(date, rateData);
                  }}
                >
                  {date.getDate()}
                </button>
              </td>
            );
          },
        }}
        {...props}
      />
      {showFooter && <CalendarFooter />}
    </>
  );
}
CalendarWithRates.displayName = 'CalendarWithRates';

export { CalendarWithRates };

function CalendarFooter() {
  const { data: dbRates } = useGetRatesQuery();
  return (
    <div className="w-full border-t bg-muted">
      <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 py-4 text-xs font-semibold">
        {dbRates?.map((rate, i) => {
          return (
            <TooltipProvider key={i}>
              <Tooltip delayDuration={20}>
                <TooltipTrigger asChild className="cursor-help">
                  <div
                    key={rate.id}
                    className="flex items-center gap-2 rounded-md px-1.5 py-1"
                    style={{
                      color: rate.color,
                      backgroundColor: `rgba(${hexToRgb(rate.color)}, 0.1)`,
                    }}
                  >
                    {rate.name}
                    <InfoIcon className="size-4" />
                  </div>
                </TooltipTrigger>
                {/* min-w-md */}
                <TooltipContent className="min-w-60 divide-y border bg-background text-foreground shadow-lg">
                  {Object.keys(rate.movers_rates)
                    .slice(0, 3)
                    .map((key, i) => {
                      const hRate = rate.movers_rates[key].hourly_rate;
                      return (
                        <div
                          key={i}
                          className="flex justify-between py-1 font-medium"
                        >
                          <span>{key} movers & truck</span>
                          <span>{formatCentsToDollarsString(hRate)}</span>
                        </div>
                      );
                    })}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}

        <div
          className="flex items-center gap-2 rounded-md px-1.5 py-1"
          style={{
            color: '#000000',
            backgroundColor: '#dcdcdc',
          }}
        >
          Blocked
          <span
            className="size-1.5 rounded-full"
            style={{
              backgroundColor: '#000000',
            }}
          />
        </div>
      </div>
    </div>
  );
}
