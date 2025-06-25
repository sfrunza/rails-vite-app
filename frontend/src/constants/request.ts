import type { Status } from "@/types/request";

export type StatusExtended = {
  [key in Partial<Status | "all">]: number
}

type StatusOptions = {
  [key in Status]: "Pending" | "Pending Info" | "Pending Date" | "Hold" | "Not Confirmed" | "Confirmed" | "Not Available" | "Completed" | "Spam" | "Canceled" | "Refused" | "Closed" | "Expired" | "Archived";
};

const STATUS_OPTIONS: StatusOptions = {
  pending: "Pending",
  pending_info: "Pending Info",
  pending_date: "Pending Date",
  hold: "Hold",
  not_confirmed: "Not Confirmed",
  confirmed: "Confirmed",
  not_available: "Not Available",
  completed: "Completed",
  spam: "Spam",
  canceled: "Canceled",
  refused: "Refused",
  closed: "Closed",
  expired: "Expired",
  archived: "Archived",
};

type StatusOption = {
  label: keyof StatusOptions;
  value: Status;
};


export const statusOptions: StatusOption[] = Object.entries(STATUS_OPTIONS).map(
  ([value, label]) => ({
    label: label as keyof StatusOptions,
    value: value as Status,
  })
);

// Ttabs --------------------------------------

type Tab =
  | "All Requests"
  | "Pending"
  | "Not Confirmed"
  | "Confirmed"
  | "Not Available"
  | "Completed"
  | "Spam"
  | "Canceled"
  | "Refused"
  | "Closed"
  | "Expired"
  | "Archived";

type TabOptions = {
  [key in
  | "all"
  | "pending"
  | "not_confirmed"
  | "confirmed"
  | "not_available"
  | "completed"
  | "spam"
  | "canceled"
  | "refused"
  | "closed"
  | "expired"
  | "archived"]: Tab;
};

const TAB_OPTIONS: TabOptions = {
  all: "All Requests",
  pending: "Pending",
  not_confirmed: "Not Confirmed",
  confirmed: "Confirmed",
  not_available: "Not Available",
  completed: "Completed",
  spam: "Spam",
  canceled: "Canceled",
  refused: "Refused",
  closed: "Closed",
  expired: "Expired",
  archived: "Archived",
};

type TabOption = {
  label: Tab;
  value: keyof TabOptions;
};

export const tabOptions: TabOption[] = Object.entries(TAB_OPTIONS).map(
  ([value, label]) => ({
    label: label as Tab,
    value: value as keyof TabOptions,
  })
);

export const statusTextColors: Record<Status | "all", string> = {
  "all": "text-foreground",
  "pending": "text-amber-500",
  "pending_info": "text-red-500",
  "pending_date": "text-red-500",
  "hold": "text-amber-500",
  "not_confirmed": "text-indigo-500",
  "confirmed": "text-[#00a455]",
  "not_available": "text-foreground",
  "completed": "text-[#26a9f4]",
  "spam": "text-foreground",
  "canceled": "text-red-500",
  "refused": "text-foreground",
  "closed": "text-foreground",
  "expired": "text-foreground",
  "archived": "text-foreground",
};

export const statusBgColors: Record<Status | "all", string> = {
  "all": "bg-muted-foreground",
  "pending": "bg-amber-500",
  "pending_info": "bg-red-500",
  "pending_date": "bg-red-500",
  "hold": "bg-amber-500",
  "not_confirmed": "bg-indigo-500",
  "confirmed": "bg-[#00a455]",
  "not_available": "bg-foreground",
  "completed": "bg-[#26a9f4]",
  "spam": "bg-foreground",
  "canceled": "bg-red-500",
  "refused": "bg-foreground",
  "closed": "bg-foreground",
  "expired": "bg-foreground",
  "archived": "bg-foreground",
};

function generateWorkTimeOptions() {
  const options: { value: number; label: string }[] = [];
  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const timeInMinutes = hours * 60 + minutes;
      options.push({
        value: timeInMinutes,
        label: `${hours.toString()}:${minutes.toString().padStart(2, "0")}`,
      });
    }
  }
  return options;
}

const generateTimeOptions = (options?: { withMeridiem?: boolean | null }) => {
  const withMeridiem = options?.withMeridiem ?? false;
  const timeOptions: { value: number; label: string }[] = [];
  for (let i = 0; i < 24 * 60; i += 15) {
    const hours = Math.floor(i / 60);
    const minutes = i % 60;

    // Format time based on `withMeridiem` parameter
    const timeString = withMeridiem
      ? new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      : `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    timeOptions.push({ label: timeString, value: i });
  }
  return timeOptions;
};

export const TIME_OPTIONS_WITH_MERIDIEM = generateTimeOptions({ withMeridiem: true });
export const TIME_OPTIONS = generateWorkTimeOptions();
