import { LoadingButton } from '@/components/loading-button';
import { formatDate } from '@/lib/utils';
import { useUnpairRequestsMutation } from '@/services/requests-api';
import { Trash2Icon } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

interface PairedRequestInfoProps {
  currentRequestId: number;
  serviceName: string;
  pairedRequestId: number | null;
  movingDate: string | null | undefined;
  type: 'in' | 'out';
}

type TStorageIcons = {
  [key: string]: string;
};

const storageIcons = {
  'Moving & Storage': '/svg-icons/warehouse.svg',
  'Overnight Truck Storage': '/svg-icons/truck.svg',
} as TStorageIcons;

export default function PairedRequestInfo({
  currentRequestId,
  serviceName,
  pairedRequestId,
  movingDate,
  type,
}: PairedRequestInfoProps) {
  const [unpairRequests, { isLoading }] = useUnpairRequestsMutation();

  async function handleDisconnectRequests() {
    if (!pairedRequestId) {
      toast.error('Paired request ID is missing.');
      return;
    }
    await unpairRequests({
      requestId: currentRequestId,
      pairedRequestId: pairedRequestId,
    })
      .unwrap()
      .then(() => {
        toast.success('Requests disconnected successfully!');
      })
      .catch((err) => {
        toast.error('Error', {
          description: err.data.error,
        });
      });
  }

  return (
    <div className="flex justify-between gap-2 md:pl-6">
      <div className="relative flex-1 space-y-2 text-sm">
        <p className="font-semibold">Company storage</p>
        <div className="text-primary">
          <Link to={`/crm/requests/${pairedRequestId}`}>
            Request #{pairedRequestId}
          </Link>
        </div>
        <p className="text-muted-foreground">
          Move {type} date: {movingDate && formatDate(movingDate)}
        </p>
        <img
          src={storageIcons[serviceName]}
          className="absolute right-0 top-0 size-10"
        />
      </div>
      <div>
        <LoadingButton
          size="icon"
          variant="ghost"
          disabled={isLoading}
          loading={isLoading}
          onClick={handleDisconnectRequests}
        >
          <Trash2Icon />
        </LoadingButton>
      </div>
    </div>
  );
}
