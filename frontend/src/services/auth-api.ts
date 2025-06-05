import { createApi } from '@reduxjs/toolkit/query/react'
import { setUser } from '@/slices/auth-slice'
import { baseQuery } from './base-service'
import Cookies from 'js-cookie';
import type { SessionRequest, SessionResponse, SessionUser } from '@/types/user';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<SessionResponse, SessionRequest>({
      query: (credentials) => ({
        url: '/session',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          dispatch(setUser(response.data.user));
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/session',
        method: 'DELETE',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          Cookies.remove("session_id");
          dispatch(setUser(null));
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
    forgotPassword: builder.mutation<{
      message: string;
    }, { email_address: string }>({
      query: (credentials) => ({
        url: '/passwords',
        method: 'POST',
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation<{
      message: string;
    }, { password: string, token: string }>({
      query: (credentials) => ({
        url: `/passwords/${credentials.token}`,
        method: 'PUT',
        body: credentials,
      }),
    }),
    verify: builder.mutation<{ error: string } | { user: SessionUser }, void>({
      query: () => ({
        url: '/session',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          if ('error' in response.data) {
            Cookies.remove("session_id");
            dispatch(setUser(null));
          } else {
            dispatch(setUser(response.data.user));
          }
        } catch (error) {
          Cookies.remove("session_id");
          dispatch(setUser(null));
          console.log("error", error);
        }
      },
    }),
  }),
})

export const { useLoginMutation, useVerifyMutation, useForgotPasswordMutation, useResetPasswordMutation, useLogoutMutation } = authApi
