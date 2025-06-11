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
  useBulkUpdateEntranceTypesMutation,
  useGetEntranceTypesQuery,
} from '@/services/entrance-types-api';
import type { EntranceType } from '@/types/entrance-type';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import EntranceTypeFormSheet from './entrance-type-form-sheet';
import EntranceTypeList from './entrance-type-list';

export default function EntranceTypeCard() {
  const { data, isLoading, isError } = useGetEntranceTypesQuery();
  const [bulkUpdateEntranceTypes, { isLoading: isUpdating }] =
    useBulkUpdateEntranceTypesMutation();

  const [items, setItems] = useState<EntranceType[]>([]);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Stairs</CardTitle>
        <CardAction>
          <EntranceTypeFormSheet />
        </CardAction>
      </CardHeader>
      <CardContent>
        {isError && (
          <div>
            <p className="text-muted-foreground text-center">
              Failed to fetch stairs
            </p>
          </div>
        )}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton className="h-9" key={i} />
            ))}
          </div>
        )}
        {data && (
          <EntranceTypeList
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
              bulkUpdateEntranceTypes({
                entranceTypes: items,
              })
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
  );
}
