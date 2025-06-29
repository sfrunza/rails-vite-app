
import { createApi } from '@reduxjs/toolkit/query/react';
import type { User } from '@/types/user';
import { baseQuery } from './base-service';
import type { CustomerRequest, Request, RequestExtraService, TableRequest } from '@/types/request';
import type { Filter } from '@/slices/requests-slice';

interface GetRequestsResponse {
  requests: TableRequest[],
  pagination: {
    total_pages: number,
    current_page: number,
    total_count: number,
  }
}

interface GetCustomerRequestsResponse {
  requests: CustomerRequest[],
}

type StatusCounts = Record<Filter, number>;

export const requestsApi = createApi({
  reducerPath: 'requestsApi',
  baseQuery: baseQuery,
  tagTypes: ['Request', 'StatusCounts', 'CustomerRequest'],
  endpoints: (builder) => ({
    getRequests: builder.query<GetRequestsResponse, { filter?: string, page?: number }>({
      query: ({ filter, page }) => {
        if (filter && page) {
          return `/requests?filter=${filter}&page=${page}`
        }
        return `/requests`
      },
      providesTags(result) {
        if (result) {
          return [
            ...result.requests.map(({ id }) => ({ type: 'Request' as const, id })),
            { type: 'Request', id: 'LIST' },
          ]
        }
        return [{ type: 'Request', id: 'LIST' }]
      },
    }),
    getCustomerRequests: builder.query<GetCustomerRequestsResponse, void>({
      query: () => '/requests',
      providesTags: () => [{ type: 'CustomerRequest' }],
      // forceRefetch: () => true,
    }),
    getStatusCounts: builder.query<StatusCounts, void>({
      query: () => `/requests/status_counts`,
      providesTags: () => [{ type: 'StatusCounts' }],
      // Add 1 second delay
      // transformResponse: (response: User) => {
      //   return new Promise((resolve) => {
      //     setTimeout(() => resolve(response), 1000);
      //   });
      // },
    }),
    getRequestById: builder.query<Request, { id: number }>({
      query: ({ id }) => `/requests/${id}`,
      providesTags: (_, error, { id }) => error ? [] : [{ type: 'Request', id }],
    }),
    updateRequest: builder.mutation<Request, { id: number, data: Partial<Request> }>({
      query: ({ id, data }) => {
        const { id: requestId, extra_services_total, image_urls, customer, ...rest } = data;
        return {
          url: `/requests/${id}`,
          method: 'PUT',
          body: { request: rest },
        };
      },
      // query: ({ id, data }) => ({
      //   url: `/requests/${id}`,
      //   method: 'PUT',
      //   body: { request: data },
      // }),
      // invalidatesTags: (_, error, { id }) => error ? [] : [{ type: 'Request', id: 'LIST' }, { type: 'StatusCounts' }, { type: 'Request', id }]
    }),
    createRequest: builder.mutation<Request, Partial<Request>>({
      query: (request) => ({
        url: `/requests`,
        method: 'POST',
        body: request,
      }),
      // invalidatesTags: (_, error) => error ? [] : [{ type: 'Request', id: 'LIST' }, { type: 'StatusCounts' }]
    }),
    pairRequest: builder.mutation<Request, { id: number, pairedRequestId: number }>({
      query: ({ id, pairedRequestId }) => ({
        url: `/requests/${id}/pair`,
        method: 'POST',
        body: { paired_request_id: pairedRequestId },
      }),
      // invalidatesTags: (_, error, { id, pairedRequestId }) => error ? [] : [
      //   { type: 'Request', id: id },
      //   { type: 'Request', id: pairedRequestId },
      //   { type: 'Request', id: 'LIST' }
      // ]
    }),
    unpairRequests: builder.mutation<any, { requestId: number, pairedRequestId: number }>({
      query: ({ requestId, pairedRequestId }) => ({
        url: `requests/${requestId}/unpair`,
        method: 'POST',
        body: { paired_request_id: pairedRequestId, request_id: requestId }
      }),
      // invalidatesTags: (_, error, { requestId, pairedRequestId }) => error ? [] : [
      //   { type: 'Request', id: requestId },
      //   { type: 'Request', id: pairedRequestId },
      //   { type: 'Request', id: 'LIST' }
      // ]
    }),
    cloneRequest: builder.mutation<Request, { id: number }>({
      query: ({ id }) => ({
        url: `/requests/${id}/clone`,
        method: 'POST',
      }),
      // invalidatesTags: (_, error, __) => error ? [] : [{ type: 'Request', id: 'LIST' }, { type: 'StatusCounts' }]
    }),
    updateExtraServices: builder.mutation<RequestExtraService[], { requestId: number, extra_services: Partial<RequestExtraService>[] }>({
      query: ({ requestId, extra_services }) => ({
        url: `/requests/${requestId}/update_extra_services`,
        method: 'POST',
        body: { extra_services },
      }),
    }),
    createCustomer: builder.mutation<User, Partial<User>>({
      query: (customer) => ({
        url: `/users`,
        method: 'POST',
        body: { user: { ...customer, password: window.crypto.randomUUID() } },
      }),
    }),
    updateCustomer: builder.mutation<User, { id: number, data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: { user: data },
      }),
    }),
  }),
})

export const { useGetRequestsQuery, useGetStatusCountsQuery, usePairRequestMutation, useUnpairRequestsMutation, useCloneRequestMutation, useUpdateExtraServicesMutation, useGetRequestByIdQuery, useUpdateRequestMutation, useCreateRequestMutation, useUpdateCustomerMutation, useCreateCustomerMutation, useGetCustomerRequestsQuery } = requestsApi