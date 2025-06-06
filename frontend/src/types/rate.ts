export interface Rate {
  id: number;
  name: string;
  extra_mover_rate: number;
  extra_truck_rate: number;
  enable: boolean;
  color: string;
  movers_rates: {
    [key: string]: {
      hourly_rate: number;
    };
  };
};


export interface CalendarRate {
  id: number;
  formatted_date: string
  rate_id: number | null;
  enable_automation: boolean;
  enable_auto_booking: boolean;
  is_blocked: boolean;
};


export type CalendarRateMap = Record<string, CalendarRate>;