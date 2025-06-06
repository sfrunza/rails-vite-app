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
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import { handleApiError } from '@/lib/utils';
import { useCreateTruckMutation } from '@/services/trucks-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required.' }).min(1, {
    message: 'Name must be at least 1 character long.',
  }),
});

type Inputs = z.infer<typeof formSchema>;

export default function TruckFormSheet() {
  const [createTruck, { isLoading: isCreating }] = useCreateTruckMutation();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<Inputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: Inputs) {
    createTruck(values)
      .unwrap()
      .then(() => {
        toast.success('Truck created');
        form.reset();
        setIsOpen(false);
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
          Create truck
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add truck</SheetTitle>
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
                      Name of the truck for internal use.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
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
            Add truck
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
