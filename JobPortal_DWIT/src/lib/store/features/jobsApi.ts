import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Jobs"],
  endpoints: (builder) => ({
    searchJobsByUser: builder.query({
      query: (keyword) => `/jobs/user/search?q=${keyword}`,
    }),
    searchJobsByAdminAndCompany: builder.query({
      query: (keyword) => `/jobs/adminAndCompany/search?q=${keyword}`,
    }),
    getAllJobsByAdminAndCompany: builder.query({
      query: (activePage) => `/jobs/adminAndCompany?page=${activePage}`,
      providesTags: ["Jobs"],
    }),
    getAllJobsByUser: builder.query({
      query: () => "/jobs/users",
      providesTags: ["Jobs"],
    }),
    // getAllJobsByUser: builder.query({
    //   query: (activePage) => `/jobs/users?page=${activePage}`,
    //   providesTags: ["Jobs"],
    // }),
    getSingleJobDetails: builder.query({
      query: (jobId) => `/jobs/${jobId}`,
      providesTags: ["Jobs"],
    }),
    getCoffee: builder.query({
      query: (jobId) => `/jobs/${jobId}`,
      providesTags: ["Jobs"],
    }),
    createJob: builder.mutation({
      query: (jobDetailsWithCreatorId) => ({
        url: "/jobs",
        method: "POST",
        body: jobDetailsWithCreatorId,
      }),
      invalidatesTags: ["Jobs"],
    }),
    updateJobDetails: builder.mutation({
      query: ({ jobId, jobDetailsWithCreatorId }) => ({
        url: `/jobs/${jobId}`,
        method: "PUT",
        body: jobDetailsWithCreatorId,
      }),
      invalidatesTags: ["Jobs"],
    }),
    deleteJob: builder.mutation({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),
    bulkJobUpload: builder.mutation({
      query: (file) => ({
        url: "/jobs/bulk-upload",
        method: "POST",
        body: file,
      }),
      invalidatesTags: ["Jobs"],
    }),
  }),
});
export const {
  useSearchJobsByUserQuery,
  useSearchJobsByAdminAndCompanyQuery,
  useGetAllJobsByAdminAndCompanyQuery,
  useGetAllJobsByUserQuery,
  useGetSingleJobDetailsQuery,
  useBulkJobUploadMutation,
  useCreateJobMutation,
  useUpdateJobDetailsMutation,
  useDeleteJobMutation,
} = jobsApi;
