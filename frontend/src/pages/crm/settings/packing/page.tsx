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
  useBulkUpdatePackingsMutation,
  useGetPackingsQuery,
} from '@/services/packings-api';
import type { Packing } from '@/types/packing';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SettingPageWrapper from '../setting-page-wrapper';
import PackingFormSheet from './packing-form-sheet';
import PackingList from './packing-list';

function PackingPage() {
  const { data, isLoading, isError } = useGetPackingsQuery();
  const [bulkUpdatePackings, { isLoading: isUpdating }] =
    useBulkUpdatePackingsMutation();

  const [items, setItems] = useState<Packing[]>([]);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

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
          {isError && (
            <div>
              <p className="text-muted-foreground text-center">
                Failed to fetch packings
              </p>
            </div>
          )}
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton className="h-17.5 w-full" key={i} />
              ))}
            </div>
          )}
          {data && (
            <PackingList
              items={items}
              setItems={setItems}
              setOrderChanged={setOrderChanged}
            />
          )}
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
                bulkUpdatePackings({ packings: items })
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

export const Component = PackingPage;
