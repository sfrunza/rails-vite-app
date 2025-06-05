import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";

export function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircleIcon
      className={cn("size-5 animate-spin text-inherit", className)}
    />
  );
}
