import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';

import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import {
  useCreateRequestMutation,
  useUpdateRequestMutation,
} from '@/services/requests-api';
import { useGetServicesQuery } from '@/services/services-api';
import { selectHasChanges, updateField } from '@/slices/request-slice';
import { toast } from 'sonner';
import { AddressHeader, AddressForm, AddressWrapper } from './address-form';
import ConnectRequestForm from './connect-request-form';
import PairedRequestInfo from './paired-request-info';
import type { Stop } from '@/types/request';

export default function Addresses() {
  const dispatch = useAppDispatch();
  const [createRequest, { isLoading: isCreating }] = useCreateRequestMutation();
  const [updateRequest] = useUpdateRequestMutation();
  const request = useAppSelector((state) => state.request.request);
  const originalRequest = useAppSelector(
    (state) => state.request.originalRequest
  );
  const hasChanges = useAppSelector(selectHasChanges);
  const { data: services } = useGetServicesQuery();

  if (!originalRequest || !request) return null;

  const { service_id, is_moving_from_storage, paired_request_id } =
    originalRequest;

  const { id: requestId, stops } = request;

  const service = services?.find((s) => s.id === service_id);

  const hasOrigin = service?.name !== 'Unloading help';
  const hasDestination =
    service?.name !== 'Loading help' &&
    service?.name !== 'Packing only' &&
    service?.name !== 'Inside move';

  const withStorage =
    service?.name === 'Moving & Storage' ||
    service?.name === 'Overnight Truck Storage';
  const isMovingFromStorage = is_moving_from_storage;
  const hasPairedRequest = !!paired_request_id;

  const showOrigin = withStorage ? !isMovingFromStorage : hasOrigin;
  const showDestination = withStorage ? isMovingFromStorage : hasDestination;

  const showStorageOrigin =
    withStorage && isMovingFromStorage && hasPairedRequest;
  const showStorageDestination =
    withStorage && !isMovingFromStorage && hasPairedRequest;

  const showPairRequestsButtons = withStorage && !hasPairedRequest;

  async function handleCreateDeliveryRequest() {
    if (!request) return;
    const newRequest = await createRequest({
      ...request,
      status: 'pending',
      paired_request_id: request.id,
      is_moving_from_storage: true,
    }).unwrap();

    if (newRequest) {
      await updateRequest({
        id: request?.id,
        data: {
          paired_request_id: newRequest.id,
          is_moving_from_storage: false,
        },
      });
    } else {
      toast.error('Error', {
        description: 'Failed to create delivery request.',
      });
    }
  }

  function handleAddExtraPickup(type: 'pick_up' | 'drop_off') {
    const newStop: Stop = {
      type,
      street: '',
      city: '',
      state: '',
      zip: '',
      floor: 0,
      apt: '',
      location: { lat: 0, lng: 0 },
    };
    dispatch(updateField({ stops: [...stops, newStop] }));
  }

  function handleDeleteAddress(idx: number) {
    const newStops = stops.filter((_, i) => i !== idx);
    dispatch(updateField({ stops: newStops }));
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Origin */}
      <AddressWrapper>
        {hasOrigin && (
          <AddressHeader
            addressType="origin"
            addressLocation={request.origin.location}
          />
        )}
        {showOrigin && (
          <AddressForm addressType="origin" data={request.origin} />
        )}
        {showStorageOrigin && (
          <PairedRequestInfo
            currentRequestId={requestId}
            serviceName={service.name}
            movingDate={request.paired_request?.moving_date}
            pairedRequestId={request.paired_request_id}
            type="in"
          />
        )}
      </AddressWrapper>

      {/* Destination */}
      <AddressWrapper>
        {hasDestination && (
          <AddressHeader
            addressType="destination"
            addressLocation={request.destination.location}
            addressAction={
              <Button
                variant="outline"
                className="rounded-full text-green-600 hover:text-green-600 shadow-md"
              >
                Total distance 2.7 miles
              </Button>
            }
          />
        )}
        {showPairRequestsButtons && (
          <div className="space-y-2 md:pl-6">
            <LoadingButton
              disabled={isCreating || hasChanges}
              loading={isCreating}
              onClick={handleCreateDeliveryRequest}
              className="w-full"
              variant="outline"
            >
              <span className="flex items-center">
                <PlusIcon className="mr-2 size-4" />
                Create delivery request
              </span>
            </LoadingButton>
            <ConnectRequestForm />
          </div>
        )}
        {showDestination && (
          <AddressForm addressType="destination" data={request.destination} />
        )}
        {showStorageDestination && (
          <PairedRequestInfo
            currentRequestId={requestId}
            serviceName={service.name}
            movingDate={request.paired_request?.moving_date}
            pairedRequestId={request.paired_request_id}
            type="out"
          />
        )}
      </AddressWrapper>

      {/* Extra Stops */}
      {stops.map((stop, i) => (
        <AddressWrapper key={i}>
          <AddressHeader
            addressType={stop.type}
            addressLocation={stop.location}
            addressAction={
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDeleteAddress(i)}
              >
                <Trash2Icon />
              </Button>
            }
          />
          <AddressForm addressType={stop.type} data={stop} stopIdx={i} />
        </AddressWrapper>
      ))}

      {/* Add Extra Stops Buttons */}
      <div className="lg:col-span-2 grid grid-cols-2 gap-6">
        {/* <div className="col-span-2 flex gap-2 lg:col-span-1"> */}
        <Button
          className="w-full"
          variant="outline"
          onClick={() => handleAddExtraPickup('pick_up')}
        >
          <PlusIcon />
          Add pickup
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => handleAddExtraPickup('drop_off')}
        >
          <PlusIcon />
          Add drop off
        </Button>
        {/* </div> */}
      </div>
    </div>
  );
}
