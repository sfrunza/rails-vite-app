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
import { useDeletePackingMutation } from '@/services/packings-api';
import type { Packing } from '@/types/packing';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type DeletePackingDialogProps = {
  packing: Packing;
};

export default function DeletePackingDialog({
  packing,
}: DeletePackingDialogProps) {
  const [open, setOpen] = useState(false);
  const [deletePacking, { isLoading: isDeleting }] = useDeletePackingMutation();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:text-destructive">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete packing?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete <b>{packing.name}.</b>
            <br />
            Packing services that have already been used cannot be deleted.
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
              deletePacking({ id: packing.id! })
                .unwrap()
                .then(() => {
                  toast.success('Packing deleted');
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
