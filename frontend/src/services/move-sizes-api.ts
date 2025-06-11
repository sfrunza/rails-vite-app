import type { MoveSize } from '@/types/move-size'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from './base-service'

export const moveSizesApi = createApi({
  reducerPath: 'moveSizesApi',
  baseQuery: baseQuery,
  tagTypes: ['MoveSize'],
  endpoints: (builder) => ({
    getMoveSizes: builder.query<MoveSize[], void>({
      query: () => `/move_sizes`,
      providesTags(result) {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'MoveSize' as const, id })),
            { type: 'MoveSize', id: 'LIST' },
          ]
        }
        return [{ type: 'MoveSize', id: 'LIST' }]
      },
      // This is a hack to simulate a slow response
      // transformResponse: (response: MoveSize[]) => {
      //   return new Promise((resolve) => {
      //     setTimeout(() => resolve(response), 2000);
      //   });
      // },
    }),
    createMoveSize: builder.mutation<MoveSize, Partial<MoveSize & { image: File | null }>>({
      query: (moveSize) => {
        console.log('moveSize', moveSize)
        const formData = new FormData();
        formData.append('move_size[name]', moveSize.name ?? "");
        formData.append('move_size[description]', moveSize.description ?? "");
        formData.append('move_size[dispersion]', moveSize.dispersion?.toString() ?? "");
        formData.append('move_size[truck_count]', moveSize.truck_count?.toString() ?? "");
        formData.append('move_size[volume]', moveSize.volume?.toString() ?? "");
        formData.append('move_size[weight]', moveSize.weight?.toString() ?? "");
        formData.append('move_size[crew_size_settings]', JSON.stringify(moveSize.crew_size_settings));
        if (moveSize.image) {
          formData.append('move_size[image]', moveSize.image);
        }
        return {
          url: `/move_sizes`,
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: (_, error) => error ? [] : [{ type: 'MoveSize', id: 'LIST' }],
    }),
    updateMoveSize: builder.mutation<MoveSize, Partial<MoveSize & { image: File | null }>>({
      query: ({ id, ...moveSize }) => {
        console.log('moveSize', moveSize)
        const formData = new FormData();
        formData.append('move_size[name]', moveSize.name ?? "");
        formData.append('move_size[description]', moveSize.description ?? "");
        formData.append('move_size[dispersion]', moveSize.dispersion?.toString() ?? "");
        formData.append('move_size[truck_count]', moveSize.truck_count?.toString() ?? "");
        formData.append('move_size[volume]', moveSize.volume?.toString() ?? "");
        formData.append('move_size[weight]', moveSize.weight?.toString() ?? "");
        formData.append('move_size[crew_size_settings]', JSON.stringify(moveSize.crew_size_settings));
        if (moveSize.image) {
          formData.append('move_size[image]', moveSize.image);
        }
        return {
          url: `/move_sizes/${id}`,
          method: 'PATCH',
          body: formData,
        }
      },
      invalidatesTags: (_, error) => error ? [] : [{ type: 'MoveSize', id: 'LIST' }],
    }),
    bulkUpdateMoveSizes: builder.mutation<MoveSize[], { moveSizes: Partial<MoveSize>[] }>({
      query: (payload) => ({
        url: `/move_sizes/bulk_update`,
        method: 'POST',
        body: {
          move_sizes: payload.moveSizes,
        },
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'MoveSize', id: 'LIST' }],

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
    deleteMoveSize: builder.mutation<MoveSize, Pick<MoveSize, 'id'>>({
      query: ({ id }) => ({
        url: `/move_sizes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'MoveSize', id: 'LIST' }],
    }),
  }),
})

export const { useGetMoveSizesQuery, useCreateMoveSizeMutation, useUpdateMoveSizeMutation, useBulkUpdateMoveSizesMutation, useDeleteMoveSizeMutation } = moveSizesApi