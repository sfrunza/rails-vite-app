import { isRejectedWithValue, type Middleware } from "@reduxjs/toolkit";
import { type BaseQueryFn, type FetchArgs, type FetchBaseQueryError, type FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { toast } from "sonner";

export type QueryFn = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>


export const baseQuery: QueryFn = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1`,
  credentials: 'include',
});

export interface ApiError {
  status: number | string;
  error?: string;
  data?: {
    error?: string;
    errors?: Record<string, string | string[]>;
    message?: string;
  };
}

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as ApiError;

    if (error?.status === 'FETCH_ERROR') {
      toast.error('Network error: Please check your internet connection.');
    } else if (error?.status === 401) {
      // toast.error('Error', {
      //   description: error.data?.error,
      // });
    } else if (error?.status === 403) {
      // toast.error(error.data?.error);
      // return null
    } else if (error?.status === 500) {
      // toast.error('Internal Server Error');
    }
  }
  return next(action);
};