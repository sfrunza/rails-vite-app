import { format } from 'date-fns';
// import useSWR from 'swr';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
// import { TFullRequest } from '@/types/request';
import { useAppSelector } from '@/store';
// import {
//   setOpen,
//   setSelectedDate,
//   setSelectedRequest,
// } from '@/slices/parklot-slice';

// import { type Truck } from"@/types/truck";
// import ParklotRequest from './parklot-request';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useGetTrucksQuery } from '@/services/trucks-api';
// import type { Request } from '@/types/request';
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { useState } from 'react';
// import { DatePicker } from '@/pages/crm/settings/calendar-rates/date-picker';

const startTime = new Date();
startTime.setHours(7, 0); // Start at 7:00 AM
const endTime = new Date();
endTime.setHours(21, 0); // End at 9:00 PM
const interval = 60;

const timeSlots = generateTimeSlots(startTime, endTime, interval);

export default function Parklot() {
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  // const isMobile = useIsMobile();
  const request = useAppSelector((state) => state.request.request);
  // const { selectedDate, selectedRequest } = useAppSelector(
  //   (state) => state.parklot
  // );
  // const { data: trucks } = useSWR<Truck[]>("/trucks?is_active=true");
  const { data: trucks } = useGetTrucksQuery();
  const activeTrucks = trucks?.filter((truck) => truck.is_active);
  // const { data: requests, isLoading } = useSWR<Record<string, TFullRequest[]>>(
  //   selectedDate
  //     ? `/requests_by_date?moving_date=${format(
  //         selectedDate,
  //         "yyyy-MM-dd'T'05:00:00.000'Z'"
  //       )}`
  //     : null
  // );

  // const truckIds = changes?.truck_ids ?? request?.truck_ids ?? [];

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  // function handleRequestClick(request: Partial<Request>) {
  // if (selectedRequest?.id === request.id) {
  //   navigate(`/dashboard/requests/${request.id}`);
  //   dispatch(setSelectedRequest(null));
  // } else {
  //   dispatch(setSelectedRequest(request));
  //   if (isMobile) {
  //     dispatch(setOpen(true));
  //   }
  // }
  // }

  return (
    <>
      <div className="border-b bg-background py-2">
        <div className="flex flex-col lg:flex-row gap-2 lg:items-center lg:justify-center lg:relative">
          <Tabs
            defaultValue="account"
            className="mb-2 lg:mb-0 px-4 lg:absolute lg:left-0"
          >
            <TabsList className="h-auto">
              <TabsTrigger
                value="account"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex flex-col gap-0 px-6"
              >
                <span className="text-[12px] font-semibold">Pickup</span>
                <span className="text-[10px]">
                  {format(request?.moving_date ?? new Date(), 'LLL dd, yyyy')}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex flex-col gap-0 px-6"
              >
                <span className="text-[12px] font-semibold">Delivery</span>
                <span className="text-[10px]">
                  {format(
                    request?.delivery_date_window_start ?? new Date(),
                    'LLL dd, yyyy'
                  )}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="lg:mx-auto flex flex-1 lg:max-w-lg items-center justify-between bg-background px-4">
            <Button
              size="icon"
              variant="ghost"
              // onClick={() => {
              //   const currentDate = new Date(selectedDate);
              //   const prevDate = new Date(
              //     currentDate.setDate(currentDate.getDate() - 1)
              //   );
              //   dispatch(setSelectedDate(prevDate.toISOString()));
              // }}
            >
              <ChevronLeftIcon />
            </Button>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium sm:space-x-1">
                <span className="block sm:inline-block">
                  {format(new Date(), 'eeee,')}
                </span>
                <span className="block sm:inline-block">
                  {format(new Date(), 'MMMM do, yyyy')}
                </span>
              </p>
              {/* <DatePicker /> */}
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <CalendarDaysIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date()}
                    defaultMonth={new Date()}
                    showOutsideDays={false}
                    // onSelect={(selectedDay) => {
                    //   dispatch(
                    //     setSelectedDate(new Date(selectedDay!).toISOString())
                    //   );
                    //   setIsCalendarOpen(false);
                    // }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              size="icon"
              variant="ghost"
              // onClick={() => {
              //   const currentDate = new Date();
              //   const nextDate = new Date(
              //     currentDate.setDate(currentDate.getDate() + 1)
              //   );
              //   // dispatch(setSelectedDate(nextDate.toISOString()));
              // }}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="relative h-fit w-full bg-background">
        <div className="grid grid-cols-[100px_auto] grid-rows-[45px_auto] lg:grid-cols-[140px_auto]">
          <div className="flex items-center justify-center border-b">
            {/* {isLoading && <Spinner className="size-4" />} */}
          </div>
          <div className="row-span-2 grid grid-rows-[45px_auto]">
            <div className="grid grid-cols-[repeat(15,70px)] border-b">
              {timeSlots.map((time, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[8px] bottom-0 flex items-center gap-1 pb-2">
                    <div className="text-xs font-semibold">{time.digit}</div>
                    <div className="text-xs text-muted-foreground">
                      {time.suffix}
                    </div>
                  </div>
                  <div className="absolute -left-[1px] bottom-0 h-1 border-l"></div>
                </div>
              ))}
            </div>
            <div className="">
              {activeTrucks?.map((_, index) => {
                // const truckRequests = requests?.[truck.id] ?? [];
                return (
                  <div
                    className="relative grid grid-cols-[repeat(15,70px)]"
                    key={index}
                  >
                    {/* paint empty boxes start */}
                    {Array(15)
                      .fill('')
                      .map((_, i) => (
                        <div
                          key={i}
                          className="h-14 w-full border-b border-r"
                        ></div>
                      ))}{' '}
                    {/* end */}
                    {/* {truckRequests.map((request, index) => (
                      <ParklotRequest
                        key={index}
                        request={request}
                        selectedRequest={selectedRequest}
                        handleRequestClick={handleRequestClick}
                      />
                    ))} */}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className={`sticky left-0 z-20 grid border-r [&_*]:h-14 [&_*]:border-b`}
          >
            {activeTrucks?.map((truck, index) => (
              <div
                // className="flex items-center justify-center bg-muted text-sm font-semibold"
                className={cn(
                  'flex h-14 cursor-pointer items-center justify-center bg-muted text-sm font-semibold'
                  // truckIds.includes(truck.id) && 'bg-primary text-white'
                )}
                key={index}
                // onClick={(e) => {
                //   e.stopPropagation();
                //   const newSelectedTrucks = truckIds.includes(truck.id)
                //     ? truckIds.filter((id) => id !== truck.id)
                //     : [...truckIds, truck.id];

                //   console.log('newSelectedTrucks', newSelectedTrucks);
                //   dispatch(
                //     updateField({
                //       truck_ids: newSelectedTrucks,
                //     })
                //   );
                // }}
              >
                {truck.name}
              </div>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}

type TimeSlot = {
  digit: string;
  suffix: string;
};

function generateTimeSlots(
  startTime: Date,
  endTime: Date,
  interval: number
): TimeSlot[] {
  const times: TimeSlot[] = [];
  let current = startTime;

  while (current <= endTime) {
    const formattedTime = current.toLocaleString('en-US', {
      hour: '2-digit',
      hour12: true,
    });

    const [digit, suffix] = formattedTime.split(' ');
    times.push({ digit, suffix });
    current.setMinutes(current.getMinutes() + interval);
  }
  return times;
}
