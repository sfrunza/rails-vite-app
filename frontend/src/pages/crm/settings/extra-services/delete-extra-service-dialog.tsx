import { LoadingButton } from '@/components/loading-button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { handleApiError } from '@/lib/utils';
import { useDeleteExtraServiceMutation } from '@/services/extra-services-api';
import type { ExtraService } from '@/types/extra-service';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type DeleteExtraServiceDialogProps = {
  extraService: ExtraService;
};

export default function DeleteExtraServiceDialog({
  extraService,
}: DeleteExtraServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteExtraService, { isLoading: isDeleting }] =
    useDeleteExtraServiceMutation();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-destructive">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete extra service?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete <b>{extraService.name}.</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            type="button"
            loading={isDeleting}
            disabled={isDeleting}
            variant="destructive"
            onClick={() => {
              deleteExtraService({ id: extraService.id! })
                .unwrap()
                .then(() => {
                  toast.success('Extra service deleted');
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
  );
}
