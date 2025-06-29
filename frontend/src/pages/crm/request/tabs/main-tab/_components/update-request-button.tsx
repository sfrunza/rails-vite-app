import { LoadingButton } from '@/components/loading-button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, handleApiError } from '@/lib/utils';
import { useUpdateRequestMutation } from '@/services/requests-api';
import { selectHasChanges } from '@/slices/request-slice';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

export function UpdateRequestButton() {
  const isMobile = useIsMobile();
  const request = useAppSelector((state) => state.request.request);

  const hasChanges = useAppSelector(selectHasChanges);
  const [updateRequest, { isLoading: isUpdating }] = useUpdateRequestMutation();

  function onClickUpdate() {
    if (!request) return;
    updateRequest({
      id: request.id,
      data: { ...request },
    })
      .unwrap()
      .then(() => {
        toast.success('Request updated');
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  return (
    <div
      className={cn('transition-opacity duration-500', {
        'fixed bottom-6 right-4 z-50': isMobile,
        'invisible opacity-0': !hasChanges,
        'visible opacity-100': isUpdating || hasChanges,
      })}
    >
      <LoadingButton
        loading={isUpdating}
        disabled={isUpdating}
        size="lg"
        onClick={onClickUpdate}
      >
        Update request
      </LoadingButton>
    </div>
  );
}
