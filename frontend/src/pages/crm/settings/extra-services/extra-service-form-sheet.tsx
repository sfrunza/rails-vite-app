import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import { NumericInput } from '@/components/numeric-input';
import { handleApiError } from '@/lib/utils';
import { useCreateExtraServiceMutation } from '@/services/extra-services-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required.' }).min(1, {
    message: 'Name must be at least 1 character long.',
  }),
  price: z.coerce.number().min(0),
});

type Inputs = z.infer<typeof formSchema>;

export default function ExtraServiceFormSheet() {
  const [createExtraService, { isLoading: isCreating }] =
    useCreateExtraServiceMutation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<Inputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
    },
  });

  function onSubmit(values: Inputs) {
    createExtraService(values)
      .unwrap()
      .then(() => {
        toast.success('Service created');
        setIsOpen(false);
        form.reset();
      })
      .catch((error) => {
        handleApiError(error);
      });
  }
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon />
          Create service
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add extra service</SheetTitle>
          <SheetDescription className="sr-only" />
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (required)</FormLabel>
                    <FormDescription>
                      Name of the extra service, visible to customers.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <NumericInput
                        value={(field.value / 100).toString()}
                        min={0}
                        max={10000}
                        step={0.01}
                        allowDecimals={true}
                        onChange={(value) => {
                          field.onChange(Number(value) * 100);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </SheetClose>
          <LoadingButton
            type="button"
            loading={isCreating}
            disabled={isCreating}
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
          >
            Add service
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
