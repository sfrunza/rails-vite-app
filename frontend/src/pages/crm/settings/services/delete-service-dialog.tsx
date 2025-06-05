import { LoadingButton } from '@/components/loading-button';
// import { StyledAlertDialog } from '@/components/styled-alert-dialog';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/lib/utils';
import { useDeleteServiceMutation } from '@/services/services-api';
import type { Service } from '@/types/service';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type DeleteServiceDialogProps = {
  service: Service;
};

export default function DeleteServiceDialog({
  service,
}: DeleteServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  // console.log(service.id);
  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete moving service?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete <b>{service.name}.</b> Services that have already
              been used cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton
              type="button"
              loading={isDeleting}
              disabled={isDeleting}
              className="mt-2 sm:mt-0"
              variant="destructive"
              onClick={() => {
                deleteService({ id: service.id! })
                  .unwrap()
                  .then(() => {
                    toast.success('Moving service deleted');
                    setOpen(false);
                  })
                  .catch((error) => {
                    handleApiError(error);
                  });
              }}
            >
              Delete
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
