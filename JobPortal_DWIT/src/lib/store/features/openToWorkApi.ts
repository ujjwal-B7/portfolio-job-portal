import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const openToWorkApi = createApi({
  reducerPath: "openToWorkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["OpenToWork"],
  endpoints: (builder) => ({
    getAllOpenToWorkRequest: builder.query({
      query: (status) => `/open-to-work?is_responded=${status}`,
      providesTags: ["OpenToWork"],
    }),

    createOpenToWork: builder.mutation({
      query: (details) => ({
        url: "/open-to-work",
        method: "POST",
        body: details,
      }),
      invalidatesTags: ["OpenToWork"],
    }),
    markEmployeeAsResponded: builder.mutation({
      query: (employeeId) => ({
        url: `/open-to-work/${employeeId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["OpenToWork"],
    }),
  }),
});
export const {
  useCreateOpenToWorkMutation,
  useGetAllOpenToWorkRequestQuery,
  useMarkEmployeeAsRespondedMutation,
} = openToWorkApi;
