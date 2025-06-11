import { Calendar } from '@/components/ui/calendar';
import { type CalendarRate } from '@/types/rate';
import { useGetRatesQuery } from '@/services/rates-api';
import { useGetCalendarRatesQuery } from '@/services/calendar-rates-api';
import { useMemo } from 'react';
import { format } from 'date-fns';

interface CalendarWithRatesProps {
  onSelectDate?: (date: Date, rateData: CalendarRate) => void;
  //showFooter?: boolean;
  calendarProps?: React.ComponentProps<typeof Calendar>;
}

export function CalendarWithRates({
  onSelectDate,
  //showFooter = false,
  calendarProps,
}: CalendarWithRatesProps) {
  const { data: rates } = useGetRatesQuery();
  const { data: calendarRates } = useGetCalendarRatesQuery();

  // Create modifiers and styles for the calendar
  const { modifiers, modifiersStyles } = useMemo(() => {
    if (!rates || !calendarRates) return { modifiers: {}, modifiersStyles: {} };

    // const rateMap = new Map(rates.map((rate) => [rate.id, rate]));
    const modifiers: Record<string, (date: Date) => boolean> = {};
    const modifiersStyles: Record<string, React.CSSProperties> = {};

    // Add a modifier for each rate
    rates.forEach((rate) => {
      const rateDates = Object.entries(calendarRates)
        .filter(
          ([_, calendarRate]) =>
            calendarRate.rate_id === rate.id && !calendarRate.is_blocked
        )
        .map(([date]) => date);

      modifiers[`rate-${rate.id}`] = (date: Date) =>
        rateDates.includes(format(date, 'yyyy-MM-dd'));

      modifiersStyles[`rate-${rate.id}`] = {
        backgroundColor: `${rate.color}20`,
        color: `${rate.color}`,
        fontWeight: 'bold',
      };
    });

    // Add modifier for blocked dates
    const blockedDates = Object.entries(calendarRates)
      .filter(([_, calendarRate]) => calendarRate.is_blocked)
      .map(([date]) => date);

    modifiers['blocked'] = (date: Date) =>
      blockedDates.includes(format(date, 'yyyy-MM-dd'));

    modifiersStyles['blocked'] = {
      backgroundColor: '#00000020',
    };

    return { modifiers, modifiersStyles };
  }, [rates, calendarRates]);

  const handleDayClick = (date: Date) => {
    if (!calendarRates || !onSelectDate) return;

    const formattedDate = format(date, 'yyyy-MM-dd');
    const rateData = calendarRates[formattedDate];

    if (rateData) {
      onSelectDate(date, rateData);
    }
  };

  return (
    <Calendar
      {...calendarProps}
      // className="rounded-md border"
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      onDayClick={handleDayClick}
    />
  );
}

export default CalendarWithRates;
