import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { statusBgColors, statusOptions } from '@/constants/request';
import { cn } from '@/lib/utils';
import { useGetServicesQuery } from '@/services/services-api';
import { updateField } from '@/slices/request-slice';
import { useAppDispatch, useAppSelector, type AppDispatch } from '@/store';
import type { Status } from '@/types/request';
import { UpdateRequestButton } from './_components/update-request-button';
import ActionIcons from './action-icons';

export default function StatusService() {
  const dispatch = useAppDispatch();
  const { status, service_id } = useAppSelector(
    (state) => state.request.request!
  );
  return (
    <div className="z-0 px-4 py-8">
      <div className="flex flex-col flex-wrap justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <StatusSelect status={status} dispatch={dispatch} />
          <ServiceSelect serviceId={service_id} dispatch={dispatch} />
          <ActionIcons />
        </div>
        <UpdateRequestButton />
      </div>
    </div>
  );
}

interface StatusSelectProps {
  status: Status;
  dispatch: AppDispatch;
}

function StatusSelect({ status, dispatch }: StatusSelectProps) {
  return (
    <Select
      value={status}
      onValueChange={(val: Status) => {
        dispatch(updateField({ status: val }));
      }}
    >
      <SelectTrigger
        className={cn(
          "data-[size=default]:h-10 [&_svg:not([class*='text-'])]:text-white data-[size=sm]:h-10 w-full px-4 text-sm font-medium text-white md:w-[14rem]",
          statusBgColors[status as Status]
        )}
      >
        <SelectValue placeholder="select status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((status, i) => {
          return (
            <SelectItem key={i} value={status.value}>
              {status.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

interface ServiceSelectProps {
  serviceId: number;
  dispatch: AppDispatch;
}

function ServiceSelect({ serviceId, dispatch }: ServiceSelectProps) {
  const { data: services } = useGetServicesQuery();

  return (
    <Select
      value={serviceId?.toString()}
      onValueChange={(val: string) => {
        dispatch(updateField({ service_id: parseInt(val) }));
      }}
    >
      <SelectTrigger className="data-[size=default]:h-10 data-[size=sm]:h-10 w-full bg-background px-4 text-sm font-medium md:w-[14rem]">
        <SelectValue placeholder="select status" />
      </SelectTrigger>
      <SelectContent>
        {services?.map((service, i) => {
          return (
            <SelectItem key={i} value={service.id.toString()}>
              {service.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
