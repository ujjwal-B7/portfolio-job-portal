import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobApplicationApi = createApi({
  reducerPath: "jobApplicationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["JobApplication"],
  endpoints: (builder) => ({
    applyToJob: builder.mutation({
      query: (formData: FormData) => ({
        url: "/job-application",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["JobApplication"],
    }),
    getAllJobApplicationsByApplicant: builder.query({
      query: (id) => `/job-application/applicant/${id}`,
      providesTags: ["JobApplication"],
    }),
    getAllJobApplicationsByCompanyAndAdmin: builder.query({
      query: ({ loggedInUserId, status }) =>
        `/job-application/company/${loggedInUserId}?applicationStatus=${status}`,
      providesTags: ["JobApplication"],
    }),
    acceptApplicantApplication: builder.mutation({
      query: ({ applicationId, applicantDetails }) => ({
        url: `/job-application/accept-applicant-application/${applicationId}`,
        method: "PUT",
        body: applicantDetails,
      }),
      invalidatesTags: ["JobApplication"],
    }),
  }),
});
export const {
  useApplyToJobMutation,
  useGetAllJobApplicationsByApplicantQuery,
  useGetAllJobApplicationsByCompanyAndAdminQuery,
  useAcceptApplicantApplicationMutation,
} = jobApplicationApi;
