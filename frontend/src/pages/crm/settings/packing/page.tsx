import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SettingPageWrapper from '../setting-page-wrapper';
import PackingFormSheet from './packing-form-sheet';
import PackingList from './packing-list';

function PackingPage() {
  return (
    <SettingPageWrapper>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Packing Services</CardTitle>
          <CardAction>
            <PackingFormSheet />
          </CardAction>
        </CardHeader>
        <CardContent>
          <PackingList />
        </CardContent>
      </Card>
    </SettingPageWrapper>
  );
}

export const Component = PackingPage;
