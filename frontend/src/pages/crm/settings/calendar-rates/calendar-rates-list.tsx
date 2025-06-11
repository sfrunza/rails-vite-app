import { CalendarWithRates } from '@/components/calendar-with-rates';
import { type CalendarRate } from '@/types/rate';
import { useState } from 'react';
import SelectRateModal from './select-rate-modal';

function getNext11Months(): Date[] {
  const months: Date[] = [];
  const today = new Date();

  for (let i = 0; i < 11; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push(month);
  }

  return months;
}

export default function CalendarRatesList() {
  const months = getNext11Months();
  const [isOpen, setIsOpen] = useState(false);
  const [calendarDayInfo, setCalendarDayInfo] = useState<CalendarRate>();

  function handleSelectDate(_: Date, rateData: CalendarRate): void {
    setIsOpen(true);
    setCalendarDayInfo(rateData);
  }

  return (
    <>
      <div className="grid xl:grid-cols-2 gap-6 justify-items-center">
        {months.map((monthDate, i) => (
          <CalendarWithRates
            key={i}
            calendarProps={{
              month: monthDate,
              mode: 'single',
              disableNavigation: true,
              hideNavigation: true,
              showOutsideDays: false,
              className: 'rounded-xl border',
            }}
            onSelectDate={handleSelectDate}
          />
        ))}
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
