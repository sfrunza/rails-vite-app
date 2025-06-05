import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useBulkUpdateServicesMutation,
  useGetServicesQuery,
} from '@/services/services-api';
import SettingPageWrapper from '../setting-page-wrapper';
import ServiceList from './service-list';
import ServiceSheetForm from './service-form-sheet';
import type { Service } from '@/types/service';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/loading-button';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/utils';

function MovingServicesPage() {
  const { data, isLoading, isError } = useGetServicesQuery();
  const [bulkUpdateServices, { isLoading: isUpdating }] =
    useBulkUpdateServicesMutation();

  const [items, setItems] = useState<Service[]>([]);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  return (
    <SettingPageWrapper>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Moving Services</CardTitle>
          <CardAction>
            <ServiceSheetForm />
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
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton className="h-13.5 w-full" key={i} />
              ))}
            </div>
          )}
          {data && (
            <ServiceList
              items={items}
              setItems={setItems}
              setOrderChanged={setOrderChanged}
            />
          )}
        </CardContent>
        <CardFooter className="justify-end border-t">
          <div
            className={cn('flex transition-opacity gap-3 duration-500', {
              'invisible opacity-0': !orderChanged,
              'visible opacity-100': orderChanged,
            })}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setItems(data ?? []);
                setOrderChanged(false);
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              type="button"
              disabled={isUpdating}
              loading={isUpdating}
              onClick={() => {
                bulkUpdateServices({ services: items })
                  .unwrap()
                  .then(() => {
                    toast.success('Changes saved');
                    setOrderChanged(false);
                  })
                  .catch((error) => {
                    handleApiError(error);
                  });
              }}
            >
              Save changes
            </LoadingButton>
          </div>
        </CardFooter>
      </Card>
    </SettingPageWrapper>
  );
}

export const Component = MovingServicesPage;
