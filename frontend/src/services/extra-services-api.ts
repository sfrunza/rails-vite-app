import type { ExtraService } from '@/types/extra-service'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base-service'

export const extraServicesApi = createApi({
  reducerPath: 'extraServicesApi',
  baseQuery: baseQuery,
  tagTypes: ['ExtraService'],
  endpoints: (builder) => ({
    getExtraServices: builder.query<ExtraService[], void>({
      query: () => `/extra_services`,
      providesTags(result) {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'ExtraService' as const, id })),
            { type: 'ExtraService', id: 'LIST' },
          ]
        }
        return [{ type: 'ExtraService', id: 'LIST' }]
      },
    }),

    createExtraService: builder.mutation<ExtraService, Partial<ExtraService>>({
      query: (service) => ({
        url: `/extra_services`,
        method: 'POST',
        body: {
          extra_service: service,
        },
      }),
      invalidatesTags: [{ type: 'ExtraService', id: 'LIST' }],
    }),
    bulkUpdateExtraServices: builder.mutation<ExtraService[], { extra_services: ExtraService[] }>({
      query: (payload) => ({
        url: `/extra_services/bulk_update`,
        method: 'POST',
        body: {
          extra_services: payload.extra_services,
        },
      }),
      invalidatesTags: [{ type: 'ExtraService', id: 'LIST' }],
    }),
    deleteExtraService: builder.mutation<ExtraService, Pick<ExtraService, 'id'>>({
      query: ({ id }) => ({
        url: `/extra_services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ExtraService', id: 'LIST' }],
    }),
  }),
})

export const { useGetExtraServicesQuery, useCreateExtraServiceMutation, useBulkUpdateExtraServicesMutation, useDeleteExtraServiceMutation } = extraServicesApi