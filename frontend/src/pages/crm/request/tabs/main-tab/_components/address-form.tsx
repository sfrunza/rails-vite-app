import { AutocompleteInput } from '@/components/autocompete-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetEntranceTypesQuery } from '@/services/entrance-types-api';
import { updateField, updateStopField } from '@/slices/request-slice';
import { useAppDispatch } from '@/store';
import type { Address, Stop } from '@/types/request';
import { MapPinIcon } from 'lucide-react';

interface AddressFormProps {
  addressType: 'origin' | 'destination' | 'pick_up' | 'drop_off';
  data: Address | Stop;
  stopIdx?: number;
}

export function AddressForm({ addressType, data, stopIdx }: AddressFormProps) {
  const dispatch = useAppDispatch();
  const { data: floorOptions } = useGetEntranceTypesQuery();

  function updateAddressObject(addressData: Partial<Address>) {
    if (stopIdx !== undefined) {
      dispatch(
        updateStopField({
          index: stopIdx,
          value: {
            ...data,
            ...addressData,
          },
        })
      );
    } else {
      dispatch(
        updateField({
          [addressType]: {
            ...data,
            ...addressData,
          },
        })
      );
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    let value = e.target.value;

    if (name === 'zip') {
      value = value.replace(/\D/g, ''); // Remove non-numeric characters
    }

    if (stopIdx !== undefined) {
      dispatch(
        updateStopField({
          index: stopIdx,
          field: name as keyof Stop,
          value,
        })
      );
    } else {
      dispatch(
        updateField({
          [addressType]: {
            ...data,
            [name]: value,
          },
        })
      );
    }
  }

  // async function handleZipCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const zipCode = e.target.value;

  //   dispatch(
  //     updateField({
  //       [addressType]: {
  //         ...data,
  //         zip: zipCode,
  //       },
  //     })
  //   );
  // }

  function handleFloorChange(entranceTypeId: number) {
    const newData = {
      ...data,
      floor: entranceTypeId,
    };

    if (stopIdx !== undefined) {
      dispatch(
        updateStopField({
          index: stopIdx,
          field: 'floor',
          value: entranceTypeId,
        })
      );
    } else {
      dispatch(
        updateField({
          [addressType]: newData,
        })
      );
    }
  }

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-8">
        <AutocompleteInput
          name="street"
          value={data.street}
          onAddressSelect={updateAddressObject}
          placeholder="Full Address"
          title="Please enter your Full Address"
          onChange={handleInputChange}
        />
      </div>
      <div className="col-span-4">
        <Input
          name="apt"
          value={data.apt}
          placeholder="Apt."
          title="Please enter your Apartment"
          onChange={handleInputChange}
        />
      </div>
      <div className="col-span-6">
        <Input
          name="city"
          value={data.city}
          placeholder="City"
          title="Please enter your City"
          onChange={handleInputChange}
        />
      </div>
      <div className="col-span-3">
        <Input
          name="state"
          value={data.state}
          placeholder="State"
          title="Please enter your State"
          onChange={handleInputChange}
        />
      </div>
      <div className="col-span-3">
        <Input
          name="zip"
          value={data.zip}
          placeholder="ZIP"
          title="Please enter your Zip"
          pattern="[0-9]{5}"
          inputMode="numeric"
          maxLength={5}
          onChange={handleInputChange}
        />
      </div>
      <div className="col-span-12">
        <Select
          value={data.floor ? data.floor.toString() : ''}
          onValueChange={(val) => handleFloorChange(parseInt(val))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select floor" />
          </SelectTrigger>
          <SelectContent>
            {floorOptions?.map((item, i) => (
              <SelectItem
                key={i}
                value={item.id.toString()}
                className="hover:cursor-pointer"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function AddressWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function openGoogleMapsAtLocation(
  location: { lat: number; lng: number } | undefined
) {
  if (!location) return;
  const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  window.open(url, '_blank');
}

export function AddressHeader({
  addressType,
  addressAction,
  addressLocation,
}: {
  addressType: 'origin' | 'destination' | 'pick_up' | 'drop_off';
  addressAction?: React.ReactNode;
  addressLocation: { lat: number; lng: number } | undefined;
}) {
  const disableLocationButton =
    addressLocation?.lat === 0 && addressLocation?.lng === 0;
  return (
    <div className="flex items-center gap-4">
      <Button
        size="icon"
        variant="outline"
        className="rounded-full text-green-600 shadow-md hover:text-green-600"
        onClick={() => openGoogleMapsAtLocation(addressLocation)}
        disabled={disableLocationButton}
      >
        <MapPinIcon />
      </Button>
      <div className="flex flex-1 items-center justify-between">
        <p className="capitalize text-sm font-medium text-muted-foreground">
          {addressType.split('_').join(' ')}
        </p>
        {addressAction}
      </div>
    </div>
  );
}
