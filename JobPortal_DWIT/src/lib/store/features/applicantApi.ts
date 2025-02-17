import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const applicantApi = createApi({
  reducerPath: "applicantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/job-application`,
    credentials: "include",
  }),
  tagTypes: ["Application"],
  endpoints: (builder) => ({
    acceptApplicantApplication: builder.mutation({
      query: ({ applicationId, applicantDetails }) => ({
        url: `/accept-applicant-application/${applicationId}`,
        method: "PUT",
        body: applicantDetails,
      }),
      invalidatesTags: ["Application"],
    }),
  }),
});
export const { useAcceptApplicantApplicationMutation } = applicantApi;
