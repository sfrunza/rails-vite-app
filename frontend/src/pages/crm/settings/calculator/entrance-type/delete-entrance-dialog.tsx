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
import { useDeleteEntranceTypeMutation } from '@/services/entrance-types-api';
import type { EntranceType } from '@/types/entrance-type';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type DeleteEntranceDialogProps = {
  entrance: EntranceType;
};

export default function DeleteEntranceDialog({
  entrance,
}: DeleteEntranceDialogProps) {
  const [open, setOpen] = useState(false);
  const [deleteEntranceType, { isLoading }] = useDeleteEntranceTypeMutation();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:text-destructive"
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete entrance type?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete <b>{entrance.name}.</b> Entrance types that have
            already been used cannot be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            type="button"
            loading={isLoading}
            disabled={isLoading}
            variant="destructive"
            onClick={() => {
              deleteEntranceType({ id: entrance.id! })
                .unwrap()
                .then(() => {
                  toast.success('Stairs deleted');
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
