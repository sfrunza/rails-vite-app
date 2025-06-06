import { CalendarWithRates } from '@/components/calendar-with-rates';
import { type CalendarRate } from '@/types/rate';
import { useState } from 'react';
import SelectRateModal from './select-rate-modal';

const getNextSixMonths = (): Date[] => {
  const months: Date[] = [];
  const currentDate = new Date();

  for (let i = 0; i <= 11; i++) {
    const month = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + i,
      1
    ); // First day of each month
    months.push(month);
  }

  return months;
};

export default function CalendarRatesList() {
  const months = getNextSixMonths();
  const [isOpen, setIsOpen] = useState(false);
  const [calendarDayInfo, setCalendarDayInfo] = useState<CalendarRate>();

  function handleSelectDate(_: Date, rateData: CalendarRate): void {
    setIsOpen(true);
    setCalendarDayInfo(rateData);
  }

  return (
    <>
      <div className="grid justify-items-center gap-y-6 xl:grid-cols-2">
        {months.map((monthDate, i) => {
          return (
            <CalendarWithRates
              onSelectDate={handleSelectDate}
              mode="single"
              today={monthDate}
              disableNavigation
              showFooter={false}
              className="rounded-xl border"
              key={i}
              hideNavigation
            />
          );
        })}
      </div>
      {calendarDayInfo && (
        <SelectRateModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          calendarDayInfo={calendarDayInfo}
        />
      )}
    </>
  );
}
