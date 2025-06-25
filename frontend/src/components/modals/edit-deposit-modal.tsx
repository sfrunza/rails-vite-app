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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAppDispatch, useAppSelector } from '@/store';
import { Input } from '@/components/ui/input';
import { updateField } from '@/slices/request-slice';
import { formatCentsToDollars } from '@/lib/helpers';
import { useModal } from '@/components/modal-provider';

const formSchema = z.object({
  deposit: z.number(),
});

export type Inputs = z.infer<typeof formSchema>;

export function EditDepositModal() {
  const { close } = useModal();
  const dispatch = useAppDispatch();
  const deposit = useAppSelector((state) => state.request.request?.deposit);

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      deposit,
    },
  });

  function onSubmit(values: Inputs) {
    dispatch(updateField({ deposit: values.deposit }));
    form.reset();
    close('editDeposit');
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reservation price</DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    pattern="[0-9]+"
                    value={formatCentsToDollars(form.watch('deposit')) || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        field.onChange(Math.round(parseFloat(value) * 100));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
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
