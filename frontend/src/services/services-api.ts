import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base-service'
import type { Service } from '@/types/service'

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: baseQuery,
  tagTypes: ['Service'],
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => `/services`,
      providesTags(result) {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'Service' as const, id })),
            { type: 'Service', id: 'LIST' },
          ]
        }
        return [{ type: 'Service', id: 'LIST' }]
      },
    }),
    createService: builder.mutation<Service, Partial<Service>>({
      query: (service) => ({
        url: `/services`,
        method: 'POST',
        body: {
          service: service,
        },
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'Service', id: 'LIST' }],
    }),
    bulkUpdateServices: builder.mutation<Service[], { services: Service[] }>({
      query: (payload) => ({
        url: `/services/bulk_update`,
        method: 'POST',
        body: {
          services: payload.services,
        },
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'Service', id: 'LIST' }],
    }),
    deleteService: builder.mutation<Service, Pick<Service, 'id'>>({
      query: ({ id }) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'Service', id: 'LIST' }],
    }),
  }),
})

export const { useGetServicesQuery, useCreateServiceMutation, useBulkUpdateServicesMutation, useDeleteServiceMutation } = servicesApi