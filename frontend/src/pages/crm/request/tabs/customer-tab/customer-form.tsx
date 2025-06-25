import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import { PasswordInput } from '@/components/password-input';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { api } from '@/lib/api';
import { debounce } from '@/lib/helpers';
import { formatPhone, handleApiError } from '@/lib/utils';
import {
  requestsApi,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useUpdateRequestMutation,
} from '@/services/requests-api';
import { useAppDispatch, useAppSelector } from '@/store';
import type { Customer } from '@/types/request';
import { toast } from 'sonner';

export const formSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email_address: z.string().min(1, 'required').email('Invalid email address'),
  additional_email: z
    .string()
    .optional()
    .refine(
      (email) =>
        !email || email === '' || z.string().email().safeParse(email).success,
      {
        message: 'Invalid email address',
      }
    ),
  phone: z
    .string()
    .refine((phoneNumber) => isValidPhoneNumber(phoneNumber, 'US'), {
      message: 'Invalid phone number',
    }),
  additional_phone: z
    .string()
    .optional()
    .refine(
      (phoneNumber) =>
        !phoneNumber ||
        phoneNumber === '' ||
        isValidPhoneNumber(phoneNumber, 'US'),
      {
        message: 'Invalid phone number',
      }
    ),
  password: z.string().optional(),
});

type Inputs = z.infer<typeof formSchema>;

export default function CustomerForm() {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.request.request);

  const [updateRequest, { isLoading: isRequestUpdating }] =
    useUpdateRequestMutation();

  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();
  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();

  if (!request) return null;

  const { customer, id: requestId } = request;
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    values: {
      first_name: customer?.first_name ?? '',
      last_name: customer?.last_name ?? '',
      email_address: customer?.email_address ?? '',
      additional_email: customer?.additional_email ?? '',
      phone: customer?.phone ?? '',
      additional_phone: customer?.additional_phone ?? '',
    },
    defaultValues: {
      first_name: '',
      last_name: '',
      email_address: '',
      additional_email: '',
      phone: '',
      additional_phone: '',
      password: '',
    },
  });

  function handleSaveChanges(newData: Inputs) {
    if (!customer?.id) {
      handleCreate(newData);
    } else {
      handleUpdate(newData);
    }
  }

  const findCustomerByEmail = debounce(async (value: string) => {
    const isValid = form.getFieldState('email_address').error ? false : true;
    if (!isValid || !value) return null;

    console.log('value', value);

    try {
      const response = await api.get(
        `/users/check_email?email_address=${value}`
      );
      const user = response.data;

      console.log('User', user);
      if (!user) {
        return null;
      }
      setExistingCustomer(user);
      setOpen(true);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  }, 1000);

  async function handleCreate(newProfileData: Partial<Customer>) {
    const data = await createCustomer(newProfileData).unwrap();
    await updateRequest({
      id: requestId,
      data: { customer_id: data.id },
    });
    dispatch(
      requestsApi.util.invalidateTags([{ type: 'Request', id: requestId }])
    );
    toast.success('Customer created successfully');
    form.reset(data);
  }

  async function handleUpdate(newProfileData: Partial<Customer>) {
    if (!request?.customer?.id) return;

    await updateCustomer({
      id: request?.customer?.id,
      data: newProfileData,
    }).unwrap();

    dispatch(
      requestsApi.util.invalidateTags([{ type: 'Request', id: requestId }])
    );
    toast.success('Customer updated successfully');
    form.reset(newProfileData);
  }

  return (
    <>
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              autoComplete="off"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        title="Please enter your First Name"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        title="Please enter your Last Name"
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          findCustomerByEmail(e.target.value);
                        }}
                        title="Please enter your Email"
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additional_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional email (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        title="Please enter Additional email"
                        autoComplete="off"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        value={formatPhone(field.value ?? '')}
                        handleValueChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additional_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional phone (optional)</FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        value={formatPhone(field.value ?? '')}
                        handleValueChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        autoComplete="off"
                        className="col-span-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-end border-t gap-3">
          <Button
            type="button"
            onClick={() => {
              form.reset();
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <LoadingButton
            disabled={isUpdating || isCreating || !form.formState.isDirty}
            loading={isUpdating || isCreating}
            onClick={form.handleSubmit(handleSaveChanges)}
          >
            Save changes
          </LoadingButton>
        </CardFooter>
      </Card>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              User with this email already exists
            </AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to merge this request with the existing profile?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, cancel</AlertDialogCancel>
            <LoadingButton
              loading={isRequestUpdating}
              disabled={isRequestUpdating}
              onClick={() => {
                updateRequest({
                  id: requestId,
                  data: { customer_id: existingCustomer?.id },
                })
                  .unwrap()
                  .then(() => {
                    form.reset(existingCustomer!);
                    setOpen(false);
                  })
                  .catch((error) => {
                    handleApiError(error);
                  });
              }}
            >
              Yes
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// function RemoveFieldButton({ onClick }: { onClick: () => void }) {
//   return (
//     <Button variant="secondary" size="sm" onClick={onClick}>
//       <Trash2Icon />
//       Remove
//     </Button>
//   );
// }

/* <div className="mt-12">
        <Table className="min-w-[750px]">
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Service type</TableHead>
              <TableHead>Move date</TableHead>
              <TableHead>Move szie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerRequests?.map((r: TFullRequest) => {
              return (
                <TableRow key={r.id} className="text-xs font-medium">
                  <TableCell className="font-medium">
                    <Button
                      size="sm"
                      onClick={() => {
                        setActiveTab("request");
                        navigate(`/crm/requests/${r.id}`);
                      }}
                    >
                      {`# ${r.id}`}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "w-fit rounded px-3 py-1 tracking-wide",
                        statusTextBgColors[r.status],
                      )}
                    >
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell>{r.service.name}</TableCell>
                  <TableCell>{formatDate(r.moving_date)}</TableCell>
                  <TableCell>{r.size}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div> */
