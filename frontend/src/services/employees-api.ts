import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-service";
import type { User } from "@/types/user";



export const employeesApi = createApi({
  reducerPath: 'employeesApi',
  baseQuery: baseQuery,
  tagTypes: ['Employee'],
  endpoints: (builder) => ({
    getEmployees: builder.query<User[], void>({
      query: () => "/employees",
      providesTags(result) {
        if (result) {
          return [
            ...result.map(({ id }) => ({ type: 'Employee' as const, id })),
            { type: 'Employee', id: 'LIST' },
          ]
        }
        return [{ type: 'Employee', id: 'LIST' }]
      },
    }),
    getEmployeeById: builder.query<User, { id: number }>({
      query: ({ id }) => `/employees/${id}`,
      providesTags: (result, _, { id }) => {
        if (result) {
          return [{ type: 'Employee', id }]
        }
        return [{ type: 'Employee', id: 'LIST' }]
      },
      // Add 1 second delay
      // transformResponse: (response: User) => {
      //   return new Promise((resolve) => {
      //     setTimeout(() => resolve(response), 1000);
      //   });
      // },

    }),
    updateEmployee: builder.mutation<User, { id: number; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body: { employee: data },
      }),
      invalidatesTags: (_, error, { id }) => error ? [] : [{ type: 'Employee', id }, { type: 'Employee', id: 'LIST' }]
    }),
    createEmployee: builder.mutation<User, { data: Partial<User> }>({
      query: ({ data }) => ({
        url: `/employees`,
        method: "POST",
        body: { employee: data },
      }),
      invalidatesTags: (_, error) => error ? [] : [{ type: 'Employee', id: 'LIST' }],
    }),
  }),
})

export const { useGetEmployeesQuery, useGetEmployeeByIdQuery, useUpdateEmployeeMutation, useCreateEmployeeMutation } = employeesApi