import { type ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import {
  useGetSettingsQuery,
  useUpdateLogoMutation,
} from '@/services/settings-api';

const formSchema = z.object({
  image: z.instanceof(File).nullable(),
});

type Inputs = z.infer<typeof formSchema>;

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files && event.target.files[0];
  const displayUrl = file ? URL.createObjectURL(file) : '';

  return { file, displayUrl };
}

export default function CompanyForm() {
  const { data } = useGetSettingsQuery();
  const [updateLogo, { isLoading: isUpdating }] = useUpdateLogoMutation();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<Inputs>({
    defaultValues: {
      image: null,
    },
  });

  async function onSubmit(values: Inputs) {
    await updateLogo({ image: values.image! }).unwrap();
    toast.success('Changes saved');
    form.reset();
  }

  useEffect(() => {
    if (data) {
      setPreview(data.company_logo);
    }
  }, [data]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  placeholder="Image"
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple={false}
                  onChange={(event) => {
                    const { file, displayUrl } = getImageData(event);
                    setPreview(displayUrl);
                    onChange(file);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-center items-center">
          {preview && (
            <div className="relative size-40 p-1 rounded-md border-2 border-dashed">
              <img
                src={preview}
                alt="Company logo"
                className="h-full w-full rounded-md object-contain"
              />
            </div>
          )}
        </div>
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
              onClick={() => {
                setPreview(data?.company_logo || null);
                form.reset();
              }}
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
