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
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { LoadingButton } from '@/components/loading-button';
import { PasswordInput } from '@/components/password-input';
import { Spinner } from '@/components/spinner';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { formatPhone, handleApiError } from '@/lib/utils';
import {
  useCreateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
} from '@/services/employees-api';
import type { UserRole } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { isValidPhoneNumber } from 'libphonenumber-js';

const userRoles = [
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'Manager',
    value: 'manager',
  },
  {
    label: 'Foreman',
    value: 'foreman',
  },
  {
    label: 'Driver',
    value: 'driver',
  },
  {
    label: 'Helper',
    value: 'helper',
  },
] as const;

const formSchema = z.object({
  first_name: z.string().min(1, {
    message: 'First name is required.',
  }),
  last_name: z.string().min(1, {
    message: 'Last name is required.',
  }),
  email_address: z.string().email({
    message: 'Invalid email address.',
  }),
  phone: z
    .string()
    .refine((phoneNumber) => isValidPhoneNumber(phoneNumber, 'US'), {
      message: 'Invalid phone number',
    }),
  role: z.enum(
    userRoles.map((role) => role.value) as [UserRole, ...UserRole[]]
  ),
  active: z.boolean().optional(),
  password: z.string().optional(),
});

type Inputs = z.infer<typeof formSchema>;

type UserFormSheetProps = {
  userId?: number;
  closeSheet: () => void;
};

export default function UserFormSheet({
  userId,
  closeSheet,
}: UserFormSheetProps) {
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  const { data: values, isLoading } = useGetEmployeeByIdQuery(
    {
      id: Number(userId),
    },
    { skip: !userId }
  );

  const form = useForm<Inputs>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email_address: '',
      phone: '',
      role: 'helper',
      active: true,
      password: '',
    },
    values,
  });

  function onSubmit(values: Inputs) {
    if (userId) {
      updateEmployee({ id: Number(userId), data: values })
        .unwrap()
        .then(() => {
          toast.success('User updated.');
          closeSheet();
        })
        .catch((error) => {
          handleApiError(error);
        });
    } else {
      createEmployee({ data: values })
        .unwrap()
        .then(() => {
          toast.success('User created.');
          closeSheet();
        })
        .catch((error) => {
          handleApiError(error);
        });
    }
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>{userId ? 'Update' : 'Add'} user</SheetTitle>
        <SheetDescription className="flex flex-row items-center gap-2">
          <span>
            Employee ID:
            {values?.id ?? ''}
          </span>
          <span>
            Creation Date:{' '}
            {values?.created_at
              ? format(values?.created_at, 'dd MMM, yyyy')
              : ''}
          </span>
        </SheetDescription>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && userId ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name (required)</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name (required)</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (required)</FormLabel>
                    <FormDescription>
                      Email address used to login to the system.
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (required)</FormLabel>
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select {...field}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userRoles?.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormDescription>
                      Required only when creating a new user.
                    </FormDescription>
                    <FormControl>
                      <PasswordInput {...field} autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Employee is active
                      </FormLabel>
                      <FormDescription>
                        If the employee is active, they will be able to login to
                        the system.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        name={field.name}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
      </div>
      <SheetFooter>
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
          {userId ? 'Update user' : 'Add user'}
        </LoadingButton>
      </SheetFooter>
    </>
  );
}
