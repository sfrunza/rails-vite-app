import type { Rate } from '@/types/rate'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base-service'
import { calendarRatesApi } from './calendar-rates-api'


export const ratesApi = createApi({
  reducerPath: 'ratesApi',
  baseQuery: baseQuery,
  tagTypes: ['Rate', 'CalendarRate'],
  endpoints: (builder) => ({
    getRates: builder.query<Rate[], void>({
      query: () => `/rates`,
      providesTags(result) {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'Rate' as const, id })),
            { type: 'Rate', id: 'LIST' },
          ]
        }
        return [{ type: 'Rate', id: 'LIST' }]
      },
    }),
    bulkUpdateRates: builder.mutation<Rate[], { rates: Rate[] }>({
      query: (payload) => ({
        url: `/rates/bulk_update`,
        method: 'POST',
        body: {
          rates: payload.rates,
        },
      }),

      invalidatesTags: (_, error) => error ? [] : [
        { type: 'Rate', id: 'LIST' }
      ],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(calendarRatesApi.util.invalidateTags([{ type: 'CalendarRate', id: 'LIST' }]));
        } catch (error) {
          console.log("error", error);
        }
      },
    }),
  }),
})

export const { useGetRatesQuery, useBulkUpdateRatesMutation } = ratesApi