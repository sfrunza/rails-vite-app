import type { Packing } from '@/types/packing'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base-service'

export const packingsApi = createApi({
  reducerPath: 'packingsApi',
  baseQuery: baseQuery,
  tagTypes: ['Packing'],
  endpoints: (builder) => ({
    getPackings: builder.query<Packing[], void>({
      query: () => `/packings`,
      providesTags(result) {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'Packing' as const, id })),
            { type: 'Packing', id: 'LIST' },
          ]
        }
        return [{ type: 'Packing', id: 'LIST' }]
      },
    }),
    updatePacking: builder.mutation<Packing, Pick<Packing, 'id'> & Partial<Packing>>({
      query: ({ id, ...patch }) => ({
        url: `/packings/${id}`,
        method: 'PATCH',
        body: { packing: patch },
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'Packing', id: "LIST" }],
    }),
    createPacking: builder.mutation<Packing, Partial<Packing>>({
      query: (packing) => ({
        url: `/packings`,
        method: 'POST',
        body: {
          packing: packing,
        },
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'Packing', id: 'LIST' }],
    }),
    bulkUpdatePackings: builder.mutation<Packing[], { packings: Packing[] }>({
      query: (payload) => {
        const packingsPayload = payload.packings.map((packing) => {
          return {
            id: packing.id,
            index: packing.index,
          }
        })
        return {
          url: `/packings/bulk_update`,
          method: 'POST',
          body: { packings: packingsPayload }

        }
      },
      invalidatesTags: (_, error) => error ? [] : [{ type: 'Packing', id: 'LIST' }],
    }),
    deletePacking: builder.mutation<Packing, Pick<Packing, 'id'>>({
      query: ({ id }) => ({
        url: `/packings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'Packing', id: 'LIST' }],
    }),
  }),
})

export const { useGetPackingsQuery, useCreatePackingMutation, useUpdatePackingMutation, useBulkUpdatePackingsMutation, useDeletePackingMutation } = packingsApi