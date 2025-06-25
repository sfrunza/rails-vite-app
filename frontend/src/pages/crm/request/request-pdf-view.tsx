import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  convertMinutesToHoursAndMinutes,
  formatCentsToDollarsString,
  formatTimeWindow,
  timeObjectToString,
} from '@/lib/helpers';
import { formatDate, formatPhone } from '@/lib/utils';
import { useGetMoveSizesQuery } from '@/services/move-sizes-api';
import { useGetPackingsQuery } from '@/services/packings-api';
import { useGetRequestByIdQuery } from '@/services/requests-api';
import { useGetServicesQuery } from '@/services/services-api';
import { useGetSettingsQuery } from '@/services/settings-api';
import { AddressItem } from '@/shared/address-item/address-item';
import type { Address } from '@/types/request';
import { PrinterIcon } from 'lucide-react';
import { useRef } from 'react';
import { useParams } from 'react-router';

function RequestPdfView() {
  const { id } = useParams<{ id: string }>();
  const {
    data: request,
    isLoading: isRequestLoading,
    error: requestError,
  } = useGetRequestByIdQuery({ id: Number(id) }, { skip: !id });
  const {
    data: services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = useGetServicesQuery();
  const {
    data: packings,
    isLoading: isPackingsLoading,
    error: packingsError,
  } = useGetPackingsQuery();
  const {
    data: moveSizes,
    isLoading: isMoveSizesLoading,
    error: moveSizesError,
  } = useGetMoveSizesQuery();
  const {
    data: companySettings,
    isLoading: isCompanySettingsLoading,
    error: companySettingsError,
  } = useGetSettingsQuery();
  const printRef = useRef<HTMLDivElement>(null);

  const service = services?.find((s) => s.id === request?.service_id);

  const moveSize = moveSizes?.find((m) => m.id === request?.move_size_id);

  const packing = packings?.find((p) => p.id === request?.packing_id);

  if (
    isRequestLoading ||
    isServicesLoading ||
    isMoveSizesLoading ||
    isCompanySettingsLoading ||
    isPackingsLoading
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (
    requestError ||
    servicesError ||
    moveSizesError ||
    companySettingsError ||
    packingsError
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Something went wrong. Please try again.</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Request not found</p>
      </div>
    );
  }

  const companyLogo = companySettings?.company_logo;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="p-4 print:p-0 bg-muted">
      <div className="mb-4 flex justify-end print:hidden w-full">
        <Button onClick={handlePrint}>
          <PrinterIcon /> Print
        </Button>
      </div>
      {/* PDF Content - Will be printed */}
      <div
        ref={printRef}
        className="mx-auto bg-background p-8 rounded-md shadow-sm print:shadow-none text-xs"
        style={{ width: '210mm', minHeight: '297mm' }} // A4 size
      >
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold uppercase">
              {request.status.replace('_', ' ')}
            </h1>
            <div className="flex h-5 items-center space-x-2 font-medium divide-x divide-border uppercase text-muted-foreground">
              <p className="pr-2">Moving plan #{request.id}</p>
              <p>{service?.name}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <img src={companyLogo} alt="Company Logo" className="w-16" />
          </div>
        </div>

        <div className="space-y-4">
          {/* Request Details */}
          <section className="border-b pb-4">
            <div className="grid grid-cols-2 gap-20">
              {/* Move Details */}
              <div className="[&>*]:flex [&>*]:justify-between [&>*]:items-center">
                <div>
                  <p>Move date</p>
                  <b>
                    {request.moving_date
                      ? formatDate(request.moving_date)
                      : 'N/A'}
                  </b>
                </div>
                <div>
                  <p>Start time</p>
                  <b>{formatTimeWindow(request?.start_time_window || 0)}</b>
                </div>
                <div>
                  <p>Move size</p>
                  <b>{moveSize?.name}</b>
                </div>
                <div>
                  <p>Hourly rate</p>
                  <b>{formatCentsToDollarsString(request?.rate || 0)}/hr</b>
                </div>
                <div>
                  <p>Crew size</p>
                  <b>{request?.crew_size} movers</b>
                </div>
                <div>
                  <p>Trucks</p>
                  <b>
                    {request?.truck_ids.length}{' '}
                    {request?.truck_ids.length > 1 ? 'trucks' : 'truck'}
                  </b>
                </div>
                <div>
                  <p>Travel time</p>
                  <b>
                    {convertMinutesToHoursAndMinutes(request?.travel_time || 0)}
                  </b>
                </div>
                <div>
                  <p>Est. Labor Time</p>
                  <b>{timeObjectToString(request.work_time)}</b>
                </div>
                <div>
                  <p>Est. Total Time</p>
                  <b>{timeObjectToString(request.total_time)}</b>
                </div>
              </div>

              {/* Client */}
              <div className="flex justify-between">
                <p>Client</p>
                <div className="flex flex-col items-end">
                  <b>
                    {request.customer
                      ? `${request.customer.first_name} ${request.customer.last_name}`
                      : 'N/A'}
                  </b>
                  <p>{formatPhone(request.customer?.phone)}</p>
                  <p>{request.customer?.email_address}</p>
                </div>
              </div>
            </div>
          </section>
          {/* Addresses */}
          <section className="border-b pb-4">
            <div className="grid grid-cols-2 gap-4">
              <AddressItem
                type="Origin"
                address={request.origin}
                // isCompanyStorage={
                //   request.paired_request_id !== null &&
                //   request.is_moving_from_storage
                // }
              />

              <AddressItem
                type="Destination"
                address={request.destination}
                // isCompanyStorage={
                //   request.paired_request_id !== null &&
                //   !request.is_moving_from_storage
                // }
              />

              {request.stops?.map((stop, i) => (
                <AddressItem
                  key={i}
                  type={
                    stop.type === 'pick_up' ? 'Extra pickup' : 'Extra dropoff'
                  }
                  address={stop as Address}
                />
              ))}
            </div>
          </section>
          {/* Pricing Notes */}
          <section className="space-y-5 border-b pb-4">
            <p>
              <b>Please Note:</b> This quote is just an estimate and provided
              for your convenience. Actual move details will be provided during
              the move.
            </p>
            <p>
              Move cost is based on the size of your shipment and amount of
              packing to be performed. By entering the items through the online
              inventory our system will generate a quote based on a database
              average for generally similar moves.
            </p>
            <p>
              It is best to consider this a thinking tool. Your final cost will
              be based on hourly rate and actual time your move will take.
              Additional time may be required if your move involves long walks
              from your apartment to the truck, narrow hallways and/or tight
              staircases, disassembling and reassembling of furniture, hoisting,
              reassembling of furniture, hoisting, moving of oversized, antiques
              items, ones with glass and/or marble, appliances move and items
              over 300lb.
            </p>
            <p>
              It is important to understand, that the move time will also depend
              on how well you are packed and organized: all drawers of all the
              furniture must be emptied, and all miscellaneous items packed
              neatly into moving boxes of correct sizes.
            </p>
          </section>
          {/* Additional Notes */}
          <section className="flex justify-between gap-10 border-b pb-4">
            <b className="font-black uppercase">Additional Details</b>
            <p className="whitespace-break-spaces">
              {request.details.comments || 'N/A'}
            </p>
          </section>

          {/* Move Size */}
          <section className="flex justify-between gap-10 border-b pb-4">
            <b className="font-black uppercase">Move Size</b>
            <p className="whitespace-break-spaces">{moveSize?.name || 'N/A'}</p>
          </section>

          {/* Packing */}
          <section className="flex justify-between gap-10 border-b pb-4">
            <b className="font-black uppercase">Packing</b>
            <p className="whitespace-break-spaces">{packing?.name || 'N/A'}</p>
          </section>

          {/* Paid Deposit */}
          <section className="flex justify-between gap-10 border-b pb-4">
            <b className="font-black uppercase">Paid Deposit</b>
            <p className="whitespace-break-spaces">
              {formatCentsToDollarsString(request.deposit || 0)}
            </p>
          </section>

          {/* Extra Services */}
          {request.extra_services && request.extra_services.length > 0 && (
            <section>
              <h2 className="font-black uppercase mb-3">Extra Services</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 border">Name</th>
                    <th className="text-left p-2 border">Quantity</th>
                    <th className="text-left p-2 border">Price</th>
                    <th className="text-left p-2 border">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {request.extra_services.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border">{item.quantity}</td>
                      <td className="p-2 border">
                        {formatCentsToDollarsString(item.price || 0)}
                      </td>
                      <td className="p-2 border">
                        {formatCentsToDollarsString(item.total || 0)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={3} className="p-2 text-right">
                      Total:
                    </td>
                    <td className="p-2">
                      {formatCentsToDollarsString(
                        request.extra_services_total || 0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export const Component = RequestPdfView;
