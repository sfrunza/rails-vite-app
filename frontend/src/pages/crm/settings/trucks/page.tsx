import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SettingPageWrapper from '../setting-page-wrapper';
import TruckFormSheet from './truck-form-sheet';
import TruckList from './truck-list';

function TrucksPage() {
  return (
    <SettingPageWrapper>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Trucks</CardTitle>
          <CardAction>
            <TruckFormSheet />
          </CardAction>
        </CardHeader>
        <CardContent>
          <TruckList />
        </CardContent>
      </Card>
    </SettingPageWrapper>
  );
}

export const Component = TrucksPage;
