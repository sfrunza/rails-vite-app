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
import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { LoadingButton } from '@/components/loading-button';
import { Textarea } from '@/components/ui/textarea';
import { handleApiError } from '@/lib/utils';
import { useGetEntranceTypesQuery } from '@/services/entrance-types-api';
import {
  useCreateMoveSizeMutation,
  useDeleteMoveSizeMutation,
  useUpdateMoveSizeMutation,
} from '@/services/move-sizes-api';
import type { MoveSize } from '@/types/move-size';
import { zodResolver } from '@hookform/resolvers/zod';
import { PenLineIcon, PlusIcon } from 'lucide-react';
import { MoversMatrix } from './movers-matrix';
import { NumericInput } from '@/components/numeric-input';

const DEFAULT_MATRIX = [
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 3, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
];

function mergeMatrices(matrix1: number[][], matrix2: number[][]): number[][] {
  const rows1 = matrix1.length;
  const cols1 = matrix1[0].length;
  const rows2 = matrix2.length;
  const cols2 = matrix2[0].length;

  const mergedMatrix: number[][] = [];

  for (let i = 0; i < rows2; i++) {
    mergedMatrix[i] = [];
    for (let j = 0; j < cols2; j++) {
      if (i < rows1 && j < cols1) {
        mergedMatrix[i][j] = matrix1[i][j];
      } else {
        mergedMatrix[i][j] = 2;
      }
    }
  }

  return mergedMatrix;
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string(),
  dispersion: z.coerce
    .number()
    .min(0, { message: 'Dispersion must be greater than 0' })
    .max(100, { message: 'Dispersion must be less than 100' }),
  truck_count: z.coerce
    .number()
    .min(1, { message: 'Truck count must be at least 1' }),
  volume: z.coerce
    .number()
    .min(0, { message: 'Volume must be greater than 0' }),
  weight: z.coerce
    .number()
    .min(0, { message: 'Weight must be greater than 0' }),
  crew_size_settings: z.array(z.array(z.number())),
  image: z.instanceof(File).optional(),
});

type Inputs = z.infer<typeof formSchema>;

type MoveSizeFormProps = {
  data?: MoveSize;
};

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files && event.target.files[0];
  const displayUrl = file ? URL.createObjectURL(file) : '';

  return { file, displayUrl };
}

export default function MoveSizeFormSheet({ data }: MoveSizeFormProps) {
  const { data: floorOptions } = useGetEntranceTypesQuery();
  const [createMoveSize, { isLoading: isCreating }] =
    useCreateMoveSizeMutation();
  const [updateMoveSize, { isLoading: isUpdating }] =
    useUpdateMoveSizeMutation();
  const [deleteMoveSize, { isLoading: isDeleting }] =
    useDeleteMoveSizeMutation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      dispersion: 0,
      truck_count: 1,
      volume: 0,
      weight: 0,
      crew_size_settings: DEFAULT_MATRIX,
      image: undefined,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        description: data.description,
        dispersion: data.dispersion,
        truck_count: data.truck_count,
        volume: data.volume,
        weight: data.weight,
        crew_size_settings:
          data.crew_size_settings.length > 0
            ? data.crew_size_settings
            : DEFAULT_MATRIX,
      });
      setPreview(data.image_url);
    }
  }, [data]);

  async function onSubmit(values: Inputs) {
    if (data) {
      updateMoveSize({ id: data.id, ...values })
        .unwrap()
        .then(() => {
          toast.success('Changes successfully saved');
          form.reset();
          onClose();
        })
        .catch((error) => {
          handleApiError(error);
        });
    } else {
      createMoveSize(values)
        .unwrap()
        .then(() => {
          toast.success('Move size successfully added');
          form.reset();
          onClose();
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  }

  function onClose() {
    form.reset();
    setIsOpen((prev) => !prev);
  }
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        {data ? (
          <Button variant="outline" size="icon">
            <PenLineIcon />
          </Button>
        ) : (
          <Button>
            <PlusIcon />
            Create move size
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{data ? 'Edit' : 'Create'} move size</SheetTitle>
          <SheetDescription className="sr-only" />
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
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
                    <FormMessage />
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormDescription>
                      Name of the move size, visible to customers.
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
                      Description of the move size, visible to customers.
                    </FormDescription>
                    <FormControl>
                      <Textarea {...field} rows={2} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dispersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispersion %</FormLabel>
                    <FormDescription>
                      Dispersion of the move size.
                    </FormDescription>
                    <FormControl>
                      <NumericInput
                        defaultValue={field.value.toString()}
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
              <FormField
                control={form.control}
                name="truck_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trucks count for this size</FormLabel>
                    <FormControl>
                      <NumericInput
                        defaultValue={field.value.toString()}
                        min={1}
                        max={10}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volume</FormLabel>
                    <FormControl>
                      <NumericInput
                        defaultValue={field.value.toString()}
                        min={0}
                        max={100000}
                        allowDecimals={true}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <NumericInput
                        defaultValue={field.value.toString()}
                        min={0}
                        max={100000}
                        allowDecimals={true}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="crew_size_settings"
                render={({ field }) => (
                  <FormItem>
                    <p className="text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                      Crew size settings
                    </p>
                    <FormControl>
                      <MoversMatrix
                        value={mergeMatrices(
                          field.value,
                          Array(floorOptions?.length ?? 0)
                            .fill(null)
                            .map(() => Array(floorOptions?.length ?? 0).fill(2))
                        )}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <SheetFooter>
          <div>
            {data && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-2 sm:mt-0 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete move size?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete <b>{data.name}</b>. Move sizes that have
                      already been used cannot be deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <LoadingButton
                      type="button"
                      loading={isDeleting}
                      disabled={isDeleting}
                      className="mt-2 sm:mt-0"
                      onClick={async () => {
                        deleteMoveSize({ id: data?.id! })
                          .unwrap()
                          .then(() => {
                            toast.success('Move size deleted');
                            onClose();
                          })
                          .catch((error) => {
                            handleApiError(error);
                          });
                      }}
                      variant="destructive"
                    >
                      Delete
                    </LoadingButton>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <SheetClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </SheetClose>
          <LoadingButton
            type="button"
            loading={isCreating || isUpdating}
            disabled={isCreating || isUpdating}
            onClick={form.handleSubmit(onSubmit)}
            className="w-full"
          >
            {data ? 'Save changes' : 'Add move size'}
          </LoadingButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
