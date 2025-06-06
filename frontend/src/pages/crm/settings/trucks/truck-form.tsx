import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateTruckMutation } from '@/services/trucks-api';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/utils';

const FormDataSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Truck name must be at least 1 character' }),
});

type Inputs = z.infer<typeof FormDataSchema>;

export default function TruckForm() {
  const [createTruck, { isLoading: isCreating }] = useCreateTruckMutation();

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: Inputs) {
    createTruck(values)
      .unwrap()
      .then(() => {
        toast.success('Truck successfully added');
        form.reset();
      })
      .catch((error) => {
        handleApiError(error);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input {...field} placeholder="Truck name" autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton disabled={isCreating} loading={isCreating}>
          Add truck
        </LoadingButton>
      </form>
    </Form>
  );
}
