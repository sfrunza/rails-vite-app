import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useGetMoveSizesQuery } from '@/services/move-sizes-api';
import { updateField } from '@/slices/request-slice';
import { useAppDispatch, useAppSelector } from '@/store';
import { useModal } from '@/components/modal-provider';
import { SelectDropdown } from '@/components/select-dropdown';

const formSchema = z.object({
  move_size_id: z.string(),
});

export type Inputs = z.infer<typeof formSchema>;

export function EditMoveSizeModal() {
  const { close } = useModal();
  const dispatch = useAppDispatch();
  const move_size_id = useAppSelector(
    (state) => state.request.request?.move_size_id
  );
  const { data: moveSizes } = useGetMoveSizesQuery();

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      move_size_id: move_size_id?.toString(),
    },
  });

  function onSubmit(values: Inputs) {
    dispatch(updateField({ move_size_id: Number(values.move_size_id) }));
    form.reset();
    close('editMoveSize');
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit move size</DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="move_size_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Move Size</FormLabel>
                <SelectDropdown
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a move size"
                  className="w-full"
                  items={moveSizes?.map((item) => ({
                    label: item.name,
                    value: item.id.toString(),
                  }))}
                />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
