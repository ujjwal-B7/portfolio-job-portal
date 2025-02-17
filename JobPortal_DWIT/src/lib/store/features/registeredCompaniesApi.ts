import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const registeredCompaniesApi = createApi({
  reducerPath: "registeredCompaniesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`,
    credentials: "include",
  }),
  tagTypes: ["RegisteredCompanies"],
  endpoints: (builder) => ({
    getAllRegisteredCompaniesForVerification: builder.query({
      query: (companyStatus) =>
        `/all-registered-companies?companyStatus=${companyStatus}`,
      providesTags: ["RegisteredCompanies"],
    }),
    verifySingleCompany: builder.mutation({
      query: ({ companyId, companyDetails }) => ({
        url: `/verify-registered-company/${companyId}`,
        method: "PUT",
        body: companyDetails,
      }),
      invalidatesTags: ["RegisteredCompanies"],
    }),
    getSingleRegisteredCompanyDetails: builder.query({
      query: (companyId) => `/single-registered-company/${companyId}`,
    }),
  }),
});
export const {
  useGetAllRegisteredCompaniesForVerificationQuery,
  useVerifySingleCompanyMutation,
  useGetSingleRegisteredCompanyDetailsQuery,
} = registeredCompaniesApi;
