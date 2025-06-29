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
import { updateField } from '@/slices/request-slice';
import { formatCentsToDollars } from '@/lib/helpers';
import { useModal } from '@/components/modal-provider';
import { NumericInput } from '../numeric-input';

const formSchema = z.object({
  deposit: z.coerce.number(),
});

export type Inputs = z.infer<typeof formSchema>;

export function EditDepositModal() {
  const { close } = useModal();
  const dispatch = useAppDispatch();
  const deposit = useAppSelector((state) => state.request.request?.deposit);

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onChange',
    values: { deposit: deposit ?? 0 },
    defaultValues: {
      deposit: deposit ?? 0,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <NumericInput
                    {...field}
                    allowDecimals={true}
                    max={99999999}
                    value={formatCentsToDollars(field.value)}
                    onChange={(value) => {
                      field.onChange(Number.parseFloat(value) * 100);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
        <Button type="button" onClick={form.handleSubmit(onSubmit)}>
          Apply
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
