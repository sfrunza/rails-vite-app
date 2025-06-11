import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useUpdateLogoMutation, type Setting } from '@/services/settings-api';
import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  image: z.instanceof(File).nullable(),
});

type Inputs = z.infer<typeof formSchema>;

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files && event.target.files[0];
  const displayUrl = file ? URL.createObjectURL(file) : '';

  return { file, displayUrl };
}

export default function BrandingCard({ data }: { data: Setting }) {
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
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Branding</CardTitle>
      </CardHeader>
      <CardContent>
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-end border-t">
        <div
          className={cn('flex transition-opacity gap-3 duration-500', {
            'invisible opacity-0': !form.formState.isDirty,
            'visible opacity-100': form.formState.isDirty,
          })}
        >
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
            type="button"
            disabled={isUpdating}
            loading={isUpdating}
            onClick={() => {
              form.handleSubmit(onSubmit)();
            }}
          >
            Save changes
          </LoadingButton>
        </div>
      </CardFooter>
    </Card>
  );
}
