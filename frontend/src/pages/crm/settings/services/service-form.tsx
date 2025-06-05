// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { toast } from 'sonner';
// import { zodResolver } from '@hookform/resolvers/zod';

// import { Input } from '@/components/ui/input';
// import { useCreateServiceMutation } from '@/services/services-api';
// import { LoadingButton } from '@/components/loading-button';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { handleApiError } from '@/lib/utils';

// const formSchema = z.object({
//   name: z
//     .string()
//     .min(5, { message: 'Service name must be at least 5 characters' }),
// });

// type Inputs = z.infer<typeof formSchema>;

// export default function ServiceForm() {
//   const [createService, { isLoading: isCreating }] = useCreateServiceMutation();

//   const form = useForm<Inputs>({
//     resolver: zodResolver(formSchema),
//     reValidateMode: 'onChange',
//     defaultValues: {
//       name: '',
//     },
//   });

//   function onSubmit(values: Inputs) {
//     createService(values)
//       .unwrap()
//       .then(() => {
//         toast.success(`${values.name} successfully added`);
//         form.reset();
//       })
//       .catch((error) => {
//         handleApiError(error);
//       });
//   }

//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
//           <div className="flex-1">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name (required)</FormLabel>
//                   <FormDescription>
//                     Name of the service, visible to customers.
//                   </FormDescription>
//                   <div className="flex gap-4 items-end">
//                     <FormControl>
//                       <Input {...field} autoComplete="off" />
//                     </FormControl>
//                     <LoadingButton loading={isCreating} disabled={isCreating}>
//                       Add service
//                     </LoadingButton>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }
