import { format } from 'date-fns';
import { InfoIcon } from 'lucide-react';
import { memo, type ReactElement, useCallback, useMemo, useState } from 'react';
import { type DayButtonProps, DayPicker } from 'react-day-picker';

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
import { type CalendarRate, type Rate } from '@/types/rate';
import React from 'react';
import { Calendar } from './ui/calendar';
import { Skeleton } from './ui/skeleton';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onSelectDate: (date: Date, rateData: CalendarRate) => void;
  showFooter?: boolean;
  calendarProps?: React.ComponentProps<typeof DayPicker>;
};

// Memoized DayButton component
const MemoizedDayButton = memo(function DayButton({
  day,
  calendarRates,
  rateById,
  onSelectDate,
  isLoading,
  ...props
}: {
  day: DayButtonProps['day'];
  calendarRates: Record<string, CalendarRate> | undefined;
  rateById: Record<number, Rate>;
  onSelectDate: (date: Date, rateData: CalendarRate) => void;
  isLoading: boolean;
} & Omit<DayButtonProps, 'day'>) {
  const date = day.date;
  const formattedDate = format(date, 'yyyy-MM-dd') as string;
  const rateData = calendarRates?.[formattedDate];
  const rate = rateById?.[rateData?.rate_id ?? ''];

  const styles = useMemo(() => {
    const baseStyles = {
      color: 'inherit',
      backgroundColor: 'inherit',
      opacity: 1,
    };

    if (rateData?.is_blocked) {
      return {
        ...baseStyles,
        color: 'black',
        backgroundColor: '#dcdcdc',
      };
    }

    if (rate) {
      return {
        ...baseStyles,
        color: rate.color,
        backgroundColor: `rgba(${hexToRgb(rate?.color)}, 0.1)`,
      };
    }

    return baseStyles;
  }, [rateData?.is_blocked, rate]);

  if (isLoading) {
    return <Skeleton className="h-8 w-8" />;
  }

  if (!calendarRates || !rateData) {
    return (
      <button
        {...props}
        className={cn(buttonVariants({ variant: 'ghost' }), 'h-8 w-8 p-0')}
      >
        <time dateTime={formattedDate}>{date.getDate()}</time>
      </button>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call the original onClick if it exists
    props.onClick?.(e);
    // Call our custom onSelectDate
    onSelectDate(date, rateData);
  };

  return (
    <button
      {...props}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'h-8 w-8 p-0 aria-selected:opacity-100 hover:ring font-semibold',
        props.className
      )}
      style={{ ...styles, ...props.style }}
      onClick={handleClick}
    >
      <time dateTime={formattedDate}>{date.getDate()}</time>
    </button>
  );
});

export const CalendarWithRates = memo(function CalendarWithRates({
  onSelectDate,
  showFooter = false,
  calendarProps,
}: CalendarProps) {
  const { data: calendarRates, isLoading } = useGetCalendarRatesQuery();
  const { data: rates } = useGetRatesQuery();

  const rateById = useMemo(() => {
    if (!rates) return {};
    return rates.reduce((acc, rate) => {
      acc[rate.id] = rate;
      return acc;
    }, {} as Record<number, Rate>);
  }, [rates]);

  const [selectedMonth, setSelectedMonth] = useState(
    calendarProps?.month ?? new Date()
  );

  const startMonth = calendarProps?.startMonth ?? new Date();

  const handleDayButtonClick = useCallback(
    (date: Date, rateData: CalendarRate) => {
      onSelectDate(date, rateData);
    },
    [onSelectDate]
  );

  const dayButtonComponent = useCallback(
    (props: DayButtonProps): ReactElement => (
      <MemoizedDayButton
        calendarRates={calendarRates}
        rateById={rateById}
        onSelectDate={handleDayButtonClick}
        isLoading={isLoading}
        {...props}
      />
    ),
    [calendarRates, rateById, handleDayButtonClick, isLoading]
  );

  return (
    <>
      <Calendar
        startMonth={startMonth}
        month={selectedMonth}
        onMonthChange={setSelectedMonth}
        className={cn('p-3', calendarProps?.className)}
        components={{
          DayButton: dayButtonComponent,
        }}
        footer={showFooter ? <CalendarFooter /> : undefined}
        {...calendarProps}
      />
      {/* {showFooter && <CalendarFooter />} */}
    </>
  );
});

// Memoize the CalendarFooter component
const CalendarFooter = memo(function CalendarFooter() {
  const { data: dbRates } = useGetRatesQuery();

  const rateElements = useMemo(() => {
    if (!dbRates) return null;

    return dbRates.map((rate) => (
      <TooltipProvider key={rate.id}>
        <Tooltip delayDuration={20}>
          <TooltipTrigger asChild className="cursor-help">
            <div
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
          <TooltipContent className="min-w-60" side="top">
            {Object.keys(rate.movers_rates)
              .slice(0, 3)
              .map((key) => {
                const hRate = rate.movers_rates[key].hourly_rate;
                return (
                  <div
                    key={key}
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
    ));
  }, [dbRates]);

  return (
    <div className="w-62 border-t rounded-b-md bg-muted">
      <div className="flex w-full flex-wrap items-center justify-center gap-2 p-4 text-xs font-semibold">
        {rateElements}
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
});
