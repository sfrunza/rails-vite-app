import type { EntranceType } from '@/types/entrance-type'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base-service'

export const entranceTypesApi = createApi({
  reducerPath: 'entranceTypesApi',
  baseQuery: baseQuery,
  tagTypes: ['EntranceType'],
  endpoints: (builder) => ({
    getEntranceTypes: builder.query<EntranceType[], void>({
      query: () => `/entrance_types`,
      providesTags(result) {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'EntranceType' as const, id })),
            { type: 'EntranceType', id: 'LIST' },
          ]
        }
        return [{ type: 'EntranceType', id: 'LIST' }]
      },
    }),
    createEntranceType: builder.mutation<EntranceType, Partial<EntranceType>>({
      query: (entranceType) => ({
        url: `/entrance_types`,
        method: 'POST',
        body: {
          entrance_type: entranceType,
        },
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'EntranceType', id: 'LIST' }],
    }),
    bulkUpdateEntranceTypes: builder.mutation<EntranceType[], { entranceTypes: EntranceType[] }>({
      query: (payload) => ({
        url: `/entrance_types/bulk_update`,
        method: 'POST',
        body: {
          entrance_types: payload.entranceTypes,
        },
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'EntranceType', id: 'LIST' }],

      // This is the correct way to update the cache manually
      // async onQueryStarted(_, { dispatch, queryFulfilled }) {
      //   const { data: updatedServices } = await queryFulfilled
      //   try {
      //     dispatch(
      //       servicesApi.util.updateQueryData("getServices", {}, () => {
      //         return updatedServices;
      //       })
      //     );
      //   } catch (error) {
      //     console.error("Error updating cache:", error);
      //   }
      // },
    }),
    deleteEntranceType: builder.mutation<EntranceType, Pick<EntranceType, 'id'>>({
      query: ({ id }) => ({
        url: `/entrance_types/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'EntranceType', id: 'LIST' }],
    }),
  }),
})

export const { useGetEntranceTypesQuery, useCreateEntranceTypeMutation, useBulkUpdateEntranceTypesMutation, useDeleteEntranceTypeMutation } = entranceTypesApi