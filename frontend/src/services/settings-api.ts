import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-service";

export type Setting = {
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  company_logo: string;
};

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: baseQuery,
  tagTypes: ["Setting"],
  endpoints: (builder) => ({
    getSettings: builder.query<Setting, void>({
      query: () => `/settings`,
      providesTags: ["Setting"],
    }),
    bulkUpdateSettings: builder.mutation<Setting, { data: Partial<Setting> }>({
      query: ({ data }) => ({
        url: `/settings/bulk_update`,
        method: "POST",
        body: { setting: data }
      }),
      invalidatesTags: (_, error) => error ? [] : ["Setting"],
    }),
    updateLogo: builder.mutation<Setting, { image: File }>({
      query: ({ image }) => {
        const formData = new FormData();
        formData.append('setting[company_logo]', image);
        return {
          url: `/settings/bulk_update`,
          method: "POST",
          body: formData,
        }
      },
      invalidatesTags: ["Setting"],
    }),
  }),

});

export const { useGetSettingsQuery, useBulkUpdateSettingsMutation, useUpdateLogoMutation } = settingsApi;
