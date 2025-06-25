import { LoadingButton } from '@/components/loading-button';
import { cn, handleApiError } from '@/lib/utils';
import { useUpdateRequestMutation } from '@/services/requests-api';
import { selectHasChanges } from '@/slices/request-slice';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

export function UpdateRequestButton() {
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
    <>
      {/* Desktop view */}
      <div
        className={cn('hidden transition-opacity duration-500 lg:block', {
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

      {/* Mobile view */}
      <div
        className={cn('absolute bottom-0 left-0 z-50 w-full lg:hidden', {
          'invisible opacity-0': !hasChanges,
          'visible opacity-100': isUpdating || hasChanges,
        })}
      >
        <LoadingButton
          loading={isUpdating}
          disabled={isUpdating}
          size="lg"
          className="w-full rounded-none rounded-t-xl py-8 text-base"
          onClick={onClickUpdate}
        >
          Update request
        </LoadingButton>
      </div>
    </>
  );
}
