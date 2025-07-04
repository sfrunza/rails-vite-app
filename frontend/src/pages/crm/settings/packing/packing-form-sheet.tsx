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
import type { Packing } from '@/types/packing';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import { NumericInput } from '@/components/numeric-input';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreatePackingMutation,
  useUpdatePackingMutation,
} from '@/services/packings-api';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { PenLineIcon, PlusIcon } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().optional(),
  labor_increase: z.coerce.number().min(0).max(100),
});

type Inputs = z.infer<typeof formSchema>;

type PackingFormSheetProps = {
  data?: Packing;
};

export default function PackingFormSheet({ data }: PackingFormSheetProps) {
  const [createPacking, { isLoading: isCreating }] = useCreatePackingMutation();
  const [updatePacking, { isLoading: isUpdating }] = useUpdatePackingMutation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isEditing = !!data;

  const form = useForm<Inputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(formSchema),
    values: data ?? undefined,
    defaultValues: {
      name: '',
      description: '',
      labor_increase: 0,
    },
  });

  async function onSubmit(values: Inputs) {
    const result = isEditing
      ? await updatePacking({ id: data.id, ...values })
      : await createPacking(values);

    if ('error' in result) {
      const error = result.error as FetchBaseQueryError;
      if (error.status === 422) {
        const serverErrors = error.data as Record<string, string | string[]>;

        for (const [field, messages] of Object.entries(serverErrors)) {
          if (Array.isArray(messages)) {
            form.setError(field as keyof Inputs, {
              type: 'server',
              message: messages.join(', '),
            });
          }
        }
      }
      return;
    }
    toast.success(`Packing ${isEditing ? 'updated' : 'added'}`);
    setIsOpen(false);
  }

  function onClose() {
    form.reset();
    setIsOpen((prev) => !prev);
  }
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon">
            <PenLineIcon />
          </Button>
        ) : (
          <Button>
            <PlusIcon />
            Create packing
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEditing ? 'Update' : 'Add'} packing service
          </SheetTitle>
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
                      Name of the packing service, visible to customers.
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormDescription>
                      Appears on the customer portal, and in quotes.
                    </FormDescription>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="labor_increase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Labor increse (%)</FormLabel>
                    <FormControl>
                      <NumericInput
                        value={field.value.toString()}
                        min={0}
                        max={100}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
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
            loading={isCreating || isUpdating}
            disabled={isCreating || isUpdating}
            onClick={form.handleSubmit(onSubmit)}
          >
            {`${isEditing ? 'Update' : 'Add'} packing`}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
