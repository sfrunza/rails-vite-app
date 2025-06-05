export interface Rate {
  id: number;
  extra_mover_rate: number;
  extra_truck_rate: number;
  enable: boolean;
  name: string;
  color: string;
  movers_rates: {
    [key: string]: {
      hourly_rate: number;
    };
  };
};


export interface CalendarRate {
  id: number;
  enable_automation: boolean;
  enable_auto_booking: boolean;
  is_blocked: boolean;
  formatted_date: string
  rate_id: number | null;
  rate: Rate;
};


export type CalendarRateMap = Record<string, CalendarRate>;