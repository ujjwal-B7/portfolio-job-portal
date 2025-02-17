import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const domainApi = createApi({
  reducerPath: "domainApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Domains"],
  endpoints: (builder) => ({
    getAllDomains: builder.query({
      query: () => "/domains",
      providesTags: ["Domains"],
    }),
    getSingleDomainDetails: builder.query({
      query: (domainId) => `/domains/${domainId}`,
      providesTags: ["Domains"],
    }),
    createDomain: builder.mutation({
      query: (domainDetailsWithCreatorId) => ({
        url: "/domains",
        method: "POST",
        body: domainDetailsWithCreatorId,
      }),
      invalidatesTags: ["Domains"],
    }),
    updateDomain: builder.mutation({
      query: ({ domainId, domainDetailsWithCreatorId }) => ({
        url: `/domains/${domainId}`,
        method: "PUT",
        body: domainDetailsWithCreatorId,
      }),
      invalidatesTags: ["Domains"],
    }),
    deleteDomain: builder.mutation({
      query: (domainId) => ({
        url: `/domains/${domainId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Domains"],
    }),
  }),
});
export const {
  useGetAllDomainsQuery,
  useGetSingleDomainDetailsQuery,
  useCreateDomainMutation,
  useUpdateDomainMutation,
  useDeleteDomainMutation,
} = domainApi;
