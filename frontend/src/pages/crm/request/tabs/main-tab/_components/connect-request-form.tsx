import { CableIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePairRequestMutation } from '@/services/requests-api';
import { selectHasChanges } from '@/slices/request-slice';
import { useAppSelector } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

export const formSchema = z.object({
  pairedRequestId: z.string().min(1),
});

export type Inputs = z.infer<typeof formSchema>;

export default function ConnectRequestForm() {
  const request = useAppSelector((state) => state.request.request);
  const hasChanges = useAppSelector(selectHasChanges);

  const [pairRequest, { isLoading: isPairing }] = usePairRequestMutation();

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { pairedRequestId: '' },
  });

  async function _onSubmit(data: Inputs) {
    if (!request) return;

    await pairRequest({
      id: request?.id,
      pairedRequestId: Number(data.pairedRequestId),
    })
      .unwrap()
      .catch((err) => {
        toast.error('Error', {
          description: err.data.error,
        });
      });
  }

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(_onSubmit)}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="pairedRequestId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request ID</FormLabel>
              <FormControl>
                <Input {...field} title="Please enter Request ID" />
              </FormControl>
              <FormDescription>
                Enter the ID of the request you want to connect to this request.
              </FormDescription>
            </FormItem>
          )}
        />
        <LoadingButton
          disabled={isPairing || hasChanges}
          loading={isPairing}
          variant="outline"
          type="submit"
          className="w-full"
        >
          <span className="flex items-center">
            <CableIcon className="mr-2 size-4" />
            Connect delivery request
          </span>
        </LoadingButton>
      </form>
    </Form>
  );
}
