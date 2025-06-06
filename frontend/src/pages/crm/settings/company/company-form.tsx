import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormControl,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Separator } from '@/components/ui/separator';
import { cn, formatPhone } from '@/lib/utils';
import {
  type Setting,
  useBulkUpdateSettingsMutation,
} from '@/services/settings-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  company_name: z.string(),
  company_address: z.string(),
  company_phone: z
    .string()
    .refine((phoneNumber) => isValidPhoneNumber(phoneNumber, 'US'), {
      message: 'Invalid phone number',
    }),
  company_email: z.string().email(),
  company_website: z.string(),
});

type Inputs = z.infer<typeof formSchema>;

export default function CompanyForm({ data }: { data: Setting }) {
  const [bulkUpdateSettings, { isLoading: isUpdating }] =
    useBulkUpdateSettingsMutation();

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: data.company_name ?? '',
      company_address: data.company_address ?? '',
      company_phone: data.company_phone ?? '',
      company_email: data.company_email ?? '',
      company_website: data.company_website ?? '',
    },
  });

  async function onSubmit(values: Inputs) {
    const newData = await bulkUpdateSettings({ data: values }).unwrap();

    if (newData) {
      toast.success('Changes saved');
      form.reset({ ...newData });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company address</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company phone</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  value={formatPhone(field.value ?? '')}
                  handleValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company email</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company_website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company website</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <div
          className={cn('flex transition-opacity duration-500', {
            'invisible opacity-0': !form.formState.isDirty,
            'visible opacity-100': form.formState.isDirty,
          })}
        >
          <div className="flex min-h-9 w-full gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              disabled={isUpdating}
              loading={isUpdating}
            >
              Save changes
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
