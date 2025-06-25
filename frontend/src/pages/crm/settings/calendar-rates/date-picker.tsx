// import { ChevronDownIcon } from 'lucide-react';
// import * as React from 'react';

// import { CalendarWithRates } from '@/components/calendar-with-rates';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';

// export function DatePicker() {
//   const [open, setOpen] = React.useState(false);
//   const [date, setDate] = React.useState<Date | undefined>(undefined);

//   return (
//     <div className="flex flex-col gap-3">
//       <Label htmlFor="date" className="px-1">
//         Date of birth
//       </Label>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             id="date"
//             className="w-48 justify-between font-normal"
//           >
//             {date ? date.toLocaleDateString() : 'Select date'}
//             <ChevronDownIcon />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto overflow-hidden p-0" align="start">
//           <CalendarWithRates
//             showFooter
//             onSelectDate={() => {}}
//             calendarProps={{
//               startMonth: date ? new Date(date) : new Date(),
//               required: true,
//               mode: 'single',
//               selected: date,
//               showOutsideDays: false,
//               onSelect: (date: Date) => {
//                 setDate(date);
//                 setOpen(false);
//               },
//             }}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
