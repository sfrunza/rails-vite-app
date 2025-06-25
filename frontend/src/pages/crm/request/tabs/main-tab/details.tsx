import { Separator } from '@/components/ui/separator';
import {
  convertMinutesToHoursAndMinutes,
  formatCentsToDollarsString,
  priceObjectToString,
  timeObjectToString,
  timeWindowToString,
} from '@/lib/helpers';
import { formatDate, formatPhone } from '@/lib/utils';
import { useGetPackingsQuery } from '@/services/packings-api';
import { AddressItem } from '@/shared/address-item/address-item';
import { useAppSelector } from '@/store';
import type { Packing } from '@/types/packing';
import type { Address } from '@/types/request';

export default function Details() {
  const request = useAppSelector((state) => state.request.originalRequest);
  const { data: packings } = useGetPackingsQuery();
  if (!request) return null;

  const {
    id,
    moving_date,
    customer,
    origin,
    destination,
    stops,
    start_time_window,
    end_time_window,
    crew_size,
    travel_time,
    rate,
    work_time,
    total_time,
    total_price,
    details,
    packing_id,
  } = request;

  const packing = packings?.find((p: Packing) => p.id === packing_id);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="text-sm md:col-span-1 [&>*]:flex [&>*]:justify-between [&>*]:items-start">
          <div>
            <p>Request</p>
            <b>#{id}</b>
          </div>
          <div>
            <p>Client</p>
            <div className="text-right flex flex-col">
              <b>
                {customer?.first_name} {customer?.last_name}
              </b>
              <b>{formatPhone(customer?.phone)}</b>
              <b>{customer?.email_address}</b>
            </div>
          </div>
          <div>
            <p>Date</p>
            <b>{formatDate(moving_date)}</b>
          </div>
          <div>
            <p>Start time</p>
            <b>{timeWindowToString(start_time_window, end_time_window)}</b>
          </div>
          <div>
            <p>Hourly rate</p>
            <b>{formatCentsToDollarsString(rate || 0)}</b>
          </div>
          <div>
            <p>Crew size</p>
            <b>{crew_size} movers</b>
          </div>
          <div>
            <p>Travel time</p>
            <b>{convertMinutesToHoursAndMinutes(travel_time || 0)}</b>
          </div>

          <div>
            <p>Estimated labor time</p>
            <b>{timeObjectToString(work_time)}</b>
          </div>

          <div>
            <p>Estimated total time</p>
            <b>{timeObjectToString(total_time)}</b>
          </div>

          <div>
            <p>Estimated quote</p>
            <b>{priceObjectToString(total_price)}</b>
          </div>
          <div>
            <p>Paid deposit</p>
            <b>0</b>
          </div>
        </div>
      </div>
      <Separator />
      <div className="grid gap-6 text-sm md:grid-cols-2">
        <AddressItem
          type="Origin"
          address={origin}
          // isCompanyStorage={
          //   paired_request_id !== null && is_moving_from_storage
          // }
        />

        <AddressItem
          type="Destination"
          address={destination}
          // isCompanyStorage={
          //   paired_request_id !== null && !is_moving_from_storage
          // }
        />

        {stops?.map((stop, i) => (
          <AddressItem
            key={i}
            type={stop.type === 'pick_up' ? 'Extra pickup' : 'Extra dropoff'}
            address={stop as Address}
          />
        ))}
      </div>
      <Separator />
      <div>
        <p className="font-bold uppercase">Additional Details</p>
        <p className="whitespace-pre-line text-sm">
          {details.comments || 'N/A'}
        </p>
      </div>
      <Separator />
      <div className="flex justify-between text-sm">
        <p className="font-bold uppercase">Packing</p>
        <p>{packing?.name}</p>
      </div>
      <Separator />
    </div>
  );
}
