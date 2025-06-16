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
  // SheetScrollArea,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import { handleApiError } from '@/lib/utils';
import { useCreateServiceMutation } from '@/services/services-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required.' }).min(5, {
    message: 'Name must be at least 5 characters long.',
  }),
});

type Inputs = z.infer<typeof formSchema>;

export default function ServiceSheetForm() {
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
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
    createService(values)
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

  function onClose() {
    form.reset();
    setIsOpen((prev) => !prev);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon />
          Create service
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add moving service</SheetTitle>
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
                      Name of the moving service, visible to customers.
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
            Add service
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
