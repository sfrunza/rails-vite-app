import type { Truck } from '@/types/truck'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base-service'

export const trucksApi = createApi({
  reducerPath: 'trucksApi',
  baseQuery: baseQuery,
  tagTypes: ['Truck'],
  endpoints: (builder) => ({
    getTrucks: builder.query<Truck[], void>({
      query: () => `/trucks`,
      providesTags(result) {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'Truck' as const, id })),
            { type: 'Truck', id: 'LIST' },
          ]
        }
        return [{ type: 'Truck', id: 'LIST' }]
      },
    }),
    createTruck: builder.mutation<Truck, Partial<Truck>>({
      query: (truck) => ({
        url: `/trucks`,
        method: 'POST',
        body: {
          truck: truck,
        },
      }),
      invalidatesTags: [{ type: 'Truck', id: 'LIST' }],
    }),
    bulkUpdateTrucks: builder.mutation<Truck[], { trucks: Truck[] }>({
      query: (payload) => ({
        url: `/trucks/bulk_update`,
        method: 'POST',
        body: {
          trucks: payload.trucks,
        },
      }),
      invalidatesTags: [{ type: 'Truck', id: 'LIST' }],
    }),
    deleteTruck: builder.mutation<Truck, Pick<Truck, 'id'>>({
      query: ({ id }) => ({
        url: `/trucks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Truck', id: 'LIST' }],
    }),
  }),
})

export const { useGetTrucksQuery, useCreateTruckMutation, useBulkUpdateTrucksMutation, useDeleteTruckMutation } = trucksApi