import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { statusBgColors, statusTextColors } from '@/constants/request';
import { priceObjectToString } from '@/lib/helpers';
import { cn, formatDate, formatPhone } from '@/lib/utils';
import { useGetMoveSizesQuery } from '@/services/move-sizes-api';
import { requestsApi } from '@/services/requests-api';
import { useGetServicesQuery } from '@/services/services-api';
import { store } from '@/store';
import type { TableRequest } from '@/types/request';
import { format } from 'date-fns';
import { User2Icon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

type TStorageIcons = {
  [key: string]: string;
};

const storageIcons: TStorageIcons = {
  'Moving & Storage': '/svg-icons/warehouse.svg',
  'Overnight Truck Storage': '/svg-icons/truck.svg',
};

export function RequestsTable({ requests }: { requests: TableRequest[] }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: services } = useGetServicesQuery();
  const { data: moveSizes } = useGetMoveSizesQuery();

  function handleRowClick(id: number) {
    if (selectedId === id) {
      navigate(`/crm/requests/${id}`);
    } else {
      setSelectedId(id);
      store.dispatch(requestsApi.endpoints.getRequestById.initiate({ id }));
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Move date</TableHead>
            <TableHead>Customer, phone</TableHead>
            <TableHead>Moving from</TableHead>
            <TableHead>Moving to</TableHead>
            <TableHead>Size of move</TableHead>
            <TableHead>Crew</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Booked at</TableHead>
            <TableHead className="text-right">Est. Quote</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests?.map((request) => {
            const service = services?.find(
              (service) => service.id === request.service_id
            );
            const moveSize = moveSizes?.find(
              (moveSize) => moveSize.id === request.move_size_id
            );
            const fullName = request.customer
              ? `${request.customer?.first_name} ${request.customer?.last_name}`
              : '';
            const withStorage =
              service?.name === 'Moving & Storage' ||
              service?.name === 'Overnight Truck Storage';
            const isMovingFromStorage = request.is_moving_from_storage;
            const hasPairedRequest = request?.has_paired_request;
            const showStorageOrigin =
              withStorage && isMovingFromStorage && hasPairedRequest;

            const showStorageDestination =
              withStorage && !isMovingFromStorage && hasPairedRequest;

            return (
              <TableRow
                key={request.id}
                className={cn(
                  'h-16 text-xs font-medium hover:cursor-pointer',
                  selectedId === request.id && 'bg-muted'
                )}
                onClick={() => handleRowClick(request?.id!)}
                onSelect={() => handleRowClick(request?.id!)}
              >
                <TableCell className="text-sm font-bold">
                  {request.id}
                </TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      'capitalize py-1 relative overflow-hidden bg-transparent',
                      statusTextColors[request.status]
                    )}
                  >
                    <span
                      className={`${
                        statusBgColors[request.status]
                      } absolute inset-0 opacity-15`}
                    />
                    {request.status.replace('_', ' ')}
                    <div
                      className={cn(
                        'size-2 rounded-full ml-1',
                        statusBgColors[request.status]
                      )}
                    />
                  </Badge>
                </TableCell>
                <TableCell>{service?.name}</TableCell>
                <TableCell>
                  {formatDate(request.moving_date)}
                  <br />
                  <DaysUntilMove movingDate={request.moving_date} />
                </TableCell>
                <TableCell>
                  {fullName ?? ''}
                  <br />
                  {formatPhone(request.customer?.phone)}
                </TableCell>
                <TableCell>
                  {showStorageOrigin ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={storageIcons[service?.name ?? '']}
                        className="size-6"
                      />
                      From storage
                    </div>
                  ) : (
                    <>
                      {request.origin.city}
                      <br />
                      {request.origin.state} {request.origin.zip}
                    </>
                  )}
                </TableCell>
                <TableCell className="items-center gap-2">
                  {showStorageDestination ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={storageIcons[service?.name ?? '']}
                        className="size-6"
                      />
                      To storage
                    </div>
                  ) : (
                    <>
                      {request.destination.city}
                      <br />
                      {request.destination.state} {request.destination.zip}
                    </>
                  )}
                </TableCell>
                <TableCell>{moveSize?.name}</TableCell>
                <TableCell>
                  {request.crew_size && (
                    <span className="flex items-center gap-1">
                      <User2Icon className="size-4" />
                      {request.crew_size}
                    </span>
                  )}
                </TableCell>
                <TableCell>{format(request.created_at, 'P')}</TableCell>
                <TableCell>
                  {request.booked_at ? format(request.booked_at, 'P') : ''}
                </TableCell>
                <TableCell className="text-right">
                  {priceObjectToString(request.total_price)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DaysUntilMove({ movingDate }: { movingDate: string | null }) {
  if (!movingDate) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time portion for accurate day comparison
  const movingDateObj = new Date(movingDate);
  movingDateObj.setHours(0, 0, 0, 0);

  const diffTime = movingDateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Early return for past dates
  if (diffDays < 0) {
    return null;
  }

  let value: string;
  switch (diffDays) {
    case 0:
      value = 'today';
      break;
    case 1:
      value = 'tomorrow';
      break;
    default:
      value = `in ${diffDays} days`;
  }

  const color = diffDays < 2 ? 'text-destructive' : 'text-green-600';
  return <span className={color}>{value}</span>;
}
