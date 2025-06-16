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
import { useCreateEntranceTypeMutation } from '@/services/entrance-types-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string({ required_error: 'Name is required.' }).min(5, {
    message: 'Name must be at least 5 characters long.',
  }),
  form_name: z.string({ required_error: 'Form name is required.' }).min(1, {
    message: 'Form name must be at least 1 character long.',
  }),
});

type Inputs = z.infer<typeof formSchema>;

export default function EntranceTypeFormSheet() {
  const [createEntranceType, { isLoading: isCreating }] =
    useCreateEntranceTypeMutation();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<Inputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      form_name: '',
    },
  });

  function onSubmit(values: Inputs) {
    createEntranceType(values)
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

  function onClose() {
    form.reset();
    setIsOpen((prev) => !prev);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon />
          Create stairs
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add entrance type</SheetTitle>
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
                      Name of the entrance type shown on quote/contract.
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
                name="form_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form name (required)</FormLabel>
                    <FormDescription>
                      Name of the entrance type shown on the Book form.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
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
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <LoadingButton
            type="button"
            loading={isCreating}
            disabled={isCreating}
            onClick={form.handleSubmit(onSubmit)}
          >
            Add stairs
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
