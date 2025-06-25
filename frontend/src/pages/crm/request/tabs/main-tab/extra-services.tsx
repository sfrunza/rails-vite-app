import { useModal } from '@/components/modal-provider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCentsToDollarsString, priceObjectToString } from '@/lib/helpers';
import { useGetMoveSizesQuery } from '@/services/move-sizes-api';
import { useGetPackingsQuery } from '@/services/packings-api';
import { useAppSelector } from '@/store';
import { HomeIcon, SquarePenIcon } from 'lucide-react';

const packingIcons = {
  1: '',
  2: '👜',
  3: '📦',
} as any;

export default function ExtraServices() {
  const { open } = useModal();
  const request = useAppSelector((state) => state.request.request);
  if (!request) return null;

  const { data: packings } = useGetPackingsQuery();
  const { data: moveSizes } = useGetMoveSizesQuery();

  const {
    total_price,
    deposit,
    move_size_id,
    packing_id,
    extra_services_total,
  } = request;
  const currentPacking = packings?.find((p: any) => p.id === packing_id);
  const currentSize = moveSizes?.find((s: any) => s.id === move_size_id);

  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="flex flex-row items-center justify-between pt-6">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted p-2">
            <HomeIcon className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">{currentSize?.name}</CardTitle>
            <CardDescription>{currentSize?.description}</CardDescription>
          </div>
        </div>
        <Button
          size="sm"
          className="right-4 top-4 mt-0"
          variant="outline"
          onClick={() => open('editMoveSize')}
        >
          <SquarePenIcon className="size-3" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-sm font-medium [&>*:nth-child(odd)]:bg-muted">
          <div
            className="group flex items-center justify-between px-8 py-3 hover:cursor-pointer hover:bg-muted"
            onClick={() => open('editDeposit')}
          >
            <p className="text-muted-foreground group-hover:text-accent-foreground">
              Reservation price
            </p>
            <p className="group-hover:text-primary">
              {formatCentsToDollarsString(deposit)}
            </p>
          </div>
          <div
            className="group flex items-center justify-between px-8 py-3 hover:cursor-pointer hover:bg-muted"
            onClick={() => open('editPacking')}
          >
            <p className="text-muted-foreground group-hover:text-accent-foreground">
              Packing
            </p>
            <p className="group-hover:text-primary">
              <span className="mr-2">{packingIcons[packing_id]}</span>
              {currentPacking?.name}
            </p>
          </div>
          <div
            className="group flex items-center justify-between px-8 py-3 hover:cursor-pointer hover:bg-muted"
            onClick={() => open('editExtraServices')}
          >
            <p className="text-muted-foreground group-hover:text-accent-foreground">
              Extra services
            </p>
            <p className="group-hover:text-primary">
              {formatCentsToDollarsString(extra_services_total)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-foreground px-8 py-3 text-sm font-bold text-muted">
        <p>Total price</p>
        <p>{priceObjectToString(total_price)}</p>
      </CardFooter>
    </Card>
  );
}
