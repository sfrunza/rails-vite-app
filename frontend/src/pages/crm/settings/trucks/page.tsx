import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, handleApiError } from '@/lib/utils';
import {
  useBulkUpdateTrucksMutation,
  useGetTrucksQuery,
} from '@/services/trucks-api';
import type { Truck } from '@/types/truck';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SettingPageWrapper from '../setting-page-wrapper';
import TruckFormSheet from './truck-form-sheet';
import TruckList from './truck-list';

function TrucksPage() {
  const { data, isLoading, isError } = useGetTrucksQuery();
  const [bulkUpdateTrucks, { isLoading: isUpdating }] =
    useBulkUpdateTrucksMutation();

  const [items, setItems] = useState<Truck[]>([]);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

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
          {isError && (
            <div>
              <p className="text-muted-foreground text-center">
                Failed to fetch trucks
              </p>
            </div>
          )}
          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton className="h-9 w-full" key={i} />
              ))}
            </div>
          )}
          {data && (
            <TruckList
              items={items}
              setItems={setItems}
              setIsTouched={setIsTouched}
            />
          )}
        </CardContent>
        <CardFooter className="justify-end border-t">
          <div
            className={cn('flex transition-opacity duration-500 gap-3', {
              'invisible opacity-0': !isTouched,
              'visible opacity-100': isTouched,
            })}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setItems(data ?? []);
                setIsTouched(false);
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              type="button"
              disabled={isUpdating}
              loading={isUpdating}
              onClick={() => {
                bulkUpdateTrucks({ trucks: items })
                  .unwrap()
                  .then(() => {
                    setIsTouched(false);
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

export const Component = TrucksPage;
