import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { formatPhone } from '@/lib/utils';
// import { openModal } from '@/slices/modal-slice';
import { selectHasChanges } from '@/slices/request-slice';
import { useAppSelector } from '@/store';
import type { Customer, Request } from '@/types/request';
import { ChevronDownIcon, MailIcon, PhoneCallIcon, XIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function TopNav() {
  const navigate = useNavigate();
  const request = useAppSelector((state) => state.request.request);
  const hasChanges = useAppSelector(selectHasChanges);

  if (!request) return null;

  function minimizeRequest(request: Request): void {
    console.log('minimizeRequest', request);
    navigate(-1);
  }

  function closeRequest(requestId: number): void {
    console.log('closeRequest', requestId);
    navigate(-1);
  }

  return (
    <div className="flex justify-between p-4 md:items-center bg-background">
      <CustomerData customer={request.customer} />
      <div className="flex gap-2">
        <ModeToggle />
        <Button
          variant="outline"
          size="icon"
          onClick={() => minimizeRequest(request)}
        >
          <ChevronDownIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (hasChanges) {
              closeRequest(request.id);
            } else {
              closeRequest(request.id);
            }
          }}
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );
}

interface CustomerDataProps {
  customer: Customer | null;
}

function CustomerData({ customer }: CustomerDataProps) {
  const fullName =
    customer?.first_name && customer?.last_name
      ? `${customer.first_name} ${customer.last_name}`
      : 'No customer';
  const email = customer?.email_address ?? 'No email';
  const phone = customer?.phone
    ? formatPhone(customer.phone)
    : 'No phone number';

  return (
    <div className="flex flex-col flex-wrap gap-2 md:flex-row md:items-center md:gap-8">
      <h1>{fullName}</h1>
      <a
        href={customer?.phone ? `tel:${customer.phone}` : undefined}
        className="flex items-center gap-4"
      >
        <PhoneCallIcon className="size-4" />
        {phone}
      </a>
      <p className="flex items-center gap-4">
        <MailIcon className="size-4" />
        {email}
      </p>
    </div>
  );
}
