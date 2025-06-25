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
import { Form, FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useGetPackingsQuery } from '@/services/packings-api';
import { updateField } from '@/slices/request-slice';
import { useAppDispatch, useAppSelector } from '@/store';
import { useModal } from '@/components/modal-provider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  packing_id: z.string(),
});

export type Inputs = z.infer<typeof formSchema>;

export function EditPackingModal() {
  const { close } = useModal();
  const dispatch = useAppDispatch();
  const { data: packingOptions } = useGetPackingsQuery();
  const packing_id = useAppSelector(
    (state) => state.request.request?.packing_id
  );

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      packing_id: packing_id?.toString(),
    },
  });

  async function onSubmit(values: Inputs) {
    dispatch(updateField({ packing_id: Number(values.packing_id) }));
    form.reset();
    close('editPacking');
  }

  return (
    <DialogContent className="p-0 max-h-[calc(100vh-1rem)] flex flex-col">
      {/* Fixed header */}
      <DialogHeader className="px-6 pt-6">
        <DialogTitle>Edit packing</DialogTitle>
        <DialogDescription className="hidden" />
      </DialogHeader>

      {/* Scrollable middle */}
      <ScrollArea className="flex-1 overflow-y-scroll px-4">
        <Form {...form}>
          <FormField
            control={form.control}
            name="packing_id"
            render={({ field }) => {
              return (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="space-y-2 p-2"
                >
                  {packingOptions?.map((packing) => {
                    const isSelected =
                      form.watch('packing_id') === packing.id.toString();
                    return (
                      <Label
                        htmlFor={packing.id.toString()}
                        key={packing.id}
                        className={cn(
                          'relative flex cursor-pointer gap-4 rounded-md border p-4 transition-colors hover:bg-secondary',
                          {
                            'border-primary bg-secondary ring-1 ring-primary':
                              isSelected,
                          }
                        )}
                      >
                        <RadioGroupItem
                          value={packing.id.toString()}
                          id={packing.id.toString()}
                          className="absolute right-4 top-4"
                        />

                        <div className="space-y-4">
                          <p
                            className={cn('text-base font-bold', {
                              'text-primary': isSelected,
                            })}
                          >
                            {packing.name}
                          </p>
                          <p className="whitespace-pre-line text-sm">
                            {packing.description}
                          </p>
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>
              );
            }}
          />
        </Form>
      </ScrollArea>

      {/* Fixed footer */}
      <DialogFooter className="px-6 pb-6">
        <DialogClose>Cancel</DialogClose>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
