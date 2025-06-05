import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetServicesQuery } from '@/services/services-api';
import SettingPageWrapper from '../setting-page-wrapper';
// import ServiceSheetForm from './service-form-sheet';
import ServiceList from './service-list';
import ServiceSheetForm from './service-form-sheet';

function MovingServicesPage() {
  const { data, isLoading, isError } = useGetServicesQuery();

  return (
    <SettingPageWrapper>
      <Card className="max-w-xl">
        <CardHeader className="sm:flex-row items-start justify-between">
          <CardTitle>Moving Services</CardTitle>
          <CardAction>
            <ServiceSheetForm />
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">
          {isError && (
            <div>
              <p className="text-muted-foreground text-center">
                Failed to fetch services
              </p>
            </div>
          )}
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton className="h-13.5 w-full" key={i} />
              ))}
            </div>
          )}
          {data && <ServiceList movingServices={data} />}
        </CardContent>
      </Card>
    </SettingPageWrapper>
  );
}

export const Component = MovingServicesPage;
