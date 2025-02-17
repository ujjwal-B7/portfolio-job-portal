import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const companyApi = createApi({
  reducerPath: "companyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Companies"],
  endpoints: (builder) => ({
    isAdmin: builder.query({
      query: () => "/companies/isAdmin",
    }),
    getAllCompanies: builder.query({
      query: () => "/companies",
      providesTags: ["Companies"],
    }),
    getSingleCompanyDetails: builder.query({
      query: (companyId) => `/companies/${companyId}`,
      providesTags: ["Companies"],
    }),
    createCompany: builder.mutation({
      query: (formData: FormData) => ({
        url: "/companies",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Companies"],
    }),
    updateCompany: builder.mutation({
      query: ({ formData, companyId }) => ({
        url: `/companies/${companyId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Companies"],
    }),
    deleteCompany: builder.mutation({
      query: (companyId) => ({
        url: `/companies/${companyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Companies"],
    }),
  }),
});
export const {
  useGetAllCompaniesQuery,
  useGetSingleCompanyDetailsQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useIsAdminQuery,
} = companyApi;
