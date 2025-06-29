// import { type User } from  "./user";

export type Request = {
  id: number;
  status: Status;
  moving_date: string | null;
  delivery_date_window_start: string | null;
  delivery_date_window_end: string | null;
  schedule_date_window_start: string | null;
  schedule_date_window_end: string | null;
  is_same_day_delivery: boolean;
  is_delivery_now: boolean;
  is_calculator_disabled: boolean;
  service_id: number;
  packing_id: number;
  service?: {
    id: number;
    name: string;
  };
  packing?: {
    id: number;
    name: string;
  };
  work_time: {
    min: number;
    max: number;
  };
  total_time: {
    min: number;
    max: number;
  };
  total_price: {
    min: number;
    max: number;
  };
  min_total_time: number;
  details: {
    delicate_items_question_answer: string;
    bulky_items_question_answer: string;
    disassemble_items_question_answer: string;
    comments: string;
    is_touched?: boolean;
  };
  move_size_id: number;
  start_time_window: number | null;
  end_time_window: number | null;
  start_time_window_delivery: number | null;
  end_time_window_delivery: number | null;
  start_time_window_schedule: number | null;
  end_time_window_schedule: number | null;
  travel_time: number;
  crew_size: number;
  crew_size_delivery: number;
  rate: number;
  paired_request_id: number | null;
  paired_request: Request | null;
  is_moving_from_storage: boolean;
  customer: Customer | null;
  customer_id: number;
  foreman_id: number | null,
  mover_ids: number[]
  origin: Address;
  destination: Address;
  stops: Stop[];
  sales_notes: string;
  driver_notes: string;
  customer_notes: string;
  dispatch_notes: string;
  deposit: number;
  can_edit_request: boolean;
  truck_ids: number[];
  image_urls: {
    id: number;
    url: string;
    thumb: string;
  }[];
  extra_services: RequestExtraService[] | [];
  extra_services_total: number;
  unread_messages_count: number;
  booked_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerRequest = Pick<Request, 'id' | 'moving_date' | 'start_time_window' | 'end_time_window' | 'service_id' | 'status' | 'move_size_id' | 'crew_size' | 'origin' | 'destination'>;

export type Status = "pending" | "pending_info" | "pending_date" | "hold" | "not_confirmed" | "confirmed" | "not_available" | "completed" | "spam" | "canceled" | "refused" | "closed" | "expired" | "archived";

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  floor: number;
  apt?: string | undefined;
  location: {
    lat: number;
    lng: number;
  };
}

export type Stop = Partial<Address> & {
  type: 'pick_up' | 'drop_off';
};

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  phone: string;
  additional_phone?: string | undefined;
  additional_email?: string | undefined;
};

export type MenuRequest = {
  id: number;
  status: Status;
  origin: Address;
  destination: Address;
};


export type TableRequest = {
  id: number;
  moving_date: string | null;
  service_id: number;
  move_size_id: number;
  status: Status;
  customer: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  created_at: string;
  booked_at: string | null;
  total_price: {
    max: number;
    min: number;
  };
  crew_size: number | null;
  is_moving_from_storage: boolean;
  has_paired_request: boolean;
  origin: {
    city: string;
    state: string;
    zip: string;
  };
  destination: {
    city: '';
    state: '';
    zip: '';
  };
};

export type RequestExtraService = {
  quantity: number;
  price: number;
  name: string;
  total: number;
};