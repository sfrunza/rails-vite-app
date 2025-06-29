import { createApi } from "@reduxjs/toolkit/query/react";
import type { CalendarRate, CalendarRateMap } from "@/types/rate";
import { baseQuery } from "./base-service";

type CalendarRatesResponse = {
  calendar_rates: CalendarRateMap;
}

export const calendarRatesApi = createApi({
  reducerPath: "calendarRatesApi",
  baseQuery: baseQuery,
  tagTypes: ['CalendarRate'],
  endpoints: (builder) => ({
    getCalendarRates: builder.query<CalendarRateMap, void>({
      query: () => "/calendar_rates",
      providesTags: (result) => {
        if (result) {
          return [
            ...Object.values(result).map(value => ({ type: 'CalendarRate' as const, id: value.id })),
            { type: 'CalendarRate', id: 'LIST' },
          ]
        }
        return [{ type: 'CalendarRate', id: 'LIST' }]
      },
      transformResponse: (response: CalendarRatesResponse) => {
        return response.calendar_rates;
      },
    }),
    updateCalendarRate: builder.mutation<CalendarRate, { id: number, newData: Partial<CalendarRate> }>({
      query: ({ id, newData }) => ({
        url: `/calendar_rates/${id}`,
        method: 'PUT',
        body: { calendar_rate: newData },
      }),
      invalidatesTags: (_, error, { id }) => error ? [] : [{ type: 'CalendarRate', id }],
    }),
  }),
});

export const { useGetCalendarRatesQuery, useUpdateCalendarRateMutation } = calendarRatesApi;
