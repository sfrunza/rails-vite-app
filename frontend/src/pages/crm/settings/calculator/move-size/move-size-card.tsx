import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, handleApiError } from '@/lib/utils';
import {
  useBulkUpdateMoveSizesMutation,
  useGetMoveSizesQuery,
} from '@/services/move-sizes-api';
import type { MoveSize } from '@/types/move-size';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MoveSizeFormSheet from './move-size-form-sheet';
import MoveSizeList from './move-size-list';

export default function MoveSizeCard() {
  const { data, isLoading, isError } = useGetMoveSizesQuery();
  const [bulkUpdateMoveSizes, { isLoading: isUpdating }] =
    useBulkUpdateMoveSizesMutation();

  const [items, setItems] = useState<MoveSize[]>([]);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);
  return (
    <Card className="max-w-3xl">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Move Size</CardTitle>
        <MoveSizeFormSheet />
      </CardHeader>
      <CardContent>
        {isError && (
          <div>
            <p className="text-muted-foreground text-center">
              Failed to fetch move sizes
            </p>
          </div>
        )}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton className="h-18.5 w-full" key={i} />
            ))}
          </div>
        )}
        {data && (
          <MoveSizeList
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
              bulkUpdateMoveSizes({
                moveSizes: items,
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
