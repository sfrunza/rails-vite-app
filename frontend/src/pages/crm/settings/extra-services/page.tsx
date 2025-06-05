import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGetExtraServicesQuery } from '@/services/extra-services-api';
import SettingPageWrapper from '../setting-page-wrapper';
import ExtraServiceFormSheet from './extra-service-form-sheet';
import ExtraServiceList from './extra-service-list';

function ExtraServicesPage() {
  const { data, isLoading, isError } = useGetExtraServicesQuery();
  return (
    <SettingPageWrapper>
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Extra Services</CardTitle>
          <CardAction>
            <ExtraServiceFormSheet />
          </CardAction>
        </CardHeader>
        <CardContent>
          {isError && (
            <div>
              <p className="text-muted-foreground text-center">
                Failed to fetch services
              </p>
            </div>
          )}
          <ExtraServiceList extraServices={data ?? []} isLoading={isLoading} />
        </CardContent>
      </Card>
    </SettingPageWrapper>
  );
}

export const Component = ExtraServicesPage;
