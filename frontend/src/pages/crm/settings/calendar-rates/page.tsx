import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SettingPageWrapper from '../setting-page-wrapper';
import CalendarRatesList from './calendar-rates-list';

function CalendarRatesPage() {
  return (
    <SettingPageWrapper>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Calendar Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarRatesList />
        </CardContent>
      </Card>
    </SettingPageWrapper>
  );
}

export const Component = CalendarRatesPage;
