import { format } from "date-fns";
import { CalendarDaysIcon, SquareArrowOutUpRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";
import { useAppSelector } from "@/store";

export default function PageFooter() {
  const request = useAppSelector((state) => state.request.request);

  return (
    <div className="mt-6 grid grid-cols-12 gap-4 divide-y bg-background p-4 md:divide-y-0 md:p-6">
      <div
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "col-span-12 flex h-full flex-col gap-2 p-4 hover:cursor-pointer md:col-span-3",
        )}
      >
        <div className="flex items-center gap-4 text-muted-foreground">
          <SquareArrowOutUpRightIcon className="size-4" />
          <p>Source</p>
        </div>
        <p>{"--"}</p>
      </div>
      <div className="col-span-12 flex flex-col items-center justify-center gap-2 p-4 text-sm md:col-span-3">
        <div className="flex items-center gap-4 text-muted-foreground">
          <CalendarDaysIcon className="size-4" />
          <p>Created at</p>
        </div>
        <p>{format(request?.created_at || new Date(), "Pp")}</p>
      </div>
      <div className="col-span-12 flex flex-col items-center justify-center gap-2 p-4 text-sm md:col-span-3">
        <div className="flex items-center gap-4 text-muted-foreground">
          <CalendarDaysIcon className="size-4" />
          <p>Updated at</p>
        </div>
        <p>{format(request?.updated_at || new Date(), "Pp")}</p>
      </div>
    </div>
  );
}
