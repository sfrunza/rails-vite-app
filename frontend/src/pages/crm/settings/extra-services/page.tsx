import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  useBulkUpdateExtraServicesMutation,
  useGetExtraServicesQuery,
} from '@/services/extra-services-api';
import SettingPageWrapper from '../setting-page-wrapper';
import ExtraServiceFormSheet from './extra-service-form-sheet';
import ExtraServiceList from './extra-service-list';
import { useEffect, useState } from 'react';
import type { ExtraService } from '@/types/extra-service';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, handleApiError } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/loading-button';
import { toast } from 'sonner';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

function ExtraServicesPage() {
  const { data, isLoading, isError } = useGetExtraServicesQuery();
  const [bulkUpdateExtraServices, { isLoading: isUpdating }] =
    useBulkUpdateExtraServicesMutation();

  const [items, setItems] = useState<ExtraService[]>([]);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

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
          <ScrollArea>
            <div className="mb-4 grid grid-cols-[max-content_2fr_1fr_1fr_1fr] items-center gap-4 text-sm font-medium text-muted-foreground">
              <p />
              <p className="ml-9">Service name</p>
              <p>Service cost, $</p>
              <p className="w-full">Enable</p>
              <p></p>
            </div>
            <Separator />
            {isError && (
              <div>
                <p className="text-muted-foreground text-center">
                  Failed to fetch packings
                </p>
              </div>
            )}
            {isLoading && (
              <div className="space-y-2 pt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton className="h-13 w-full" key={i} />
                ))}
              </div>
            )}
            {data && (
              <ExtraServiceList
                items={items}
                setItems={setItems}
                setOrderChanged={setOrderChanged}
              />
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
        <CardFooter className="justify-end border-t">
          <div
            className={cn('flex transition-opacity duration-500 gap-3', {
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
                bulkUpdateExtraServices({ extra_services: items })
                  .unwrap()
                  .then(() => {
                    setOrderChanged(false);
                    toast.success('Changes saved');
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

export const Component = ExtraServicesPage;
