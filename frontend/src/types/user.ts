export type UserRole = 'admin' | 'manager' | 'customer' | 'foreman' | 'driver' | 'helper';

export interface User extends SessionUser {
  phone: string;
  active: boolean;
  additional_email: string;
  additional_phone: string;
  created_at: string;
  updated_at: string;
}

export interface SessionUser {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  role: UserRole;
}

export interface SessionResponse {
  token: string;
  user: SessionUser;
}

export interface SessionRequest {
  email_address: string;
  password: string;
}
