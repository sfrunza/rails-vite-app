import { useGetEntranceTypesQuery } from '@/services/entrance-types-api';
import type { Address } from '@/types/request';

interface AddressItemProps {
  type: 'Origin' | 'Destination' | 'Extra pickup' | 'Extra dropoff';
  address: Address;
  isCompanyStorage?: boolean;
}

export function AddressItem({
  type,
  address,
  isCompanyStorage,
}: AddressItemProps) {
  const { data: entranceTypes } = useGetEntranceTypesQuery();

  const floorName = address.floor
    ? entranceTypes?.find((f) => f.id === address.floor)?.name
    : 'Floor not selected';

  if (isCompanyStorage)
    return (
      <div>
        <b>{type}</b>
        <p>Company Storage</p>
      </div>
    );

  return (
    <div>
      <p>
        <b>{type}</b> <span>({floorName})</span>
      </p>
      <p>
        {address.street}
        {address.apt ? `, apt #${address.apt}` : ''}
      </p>
      <p>
        {address.city ? `${address.city}, ` : ''}
        {address.state} {address.zip}
      </p>
    </div>
  );
}
