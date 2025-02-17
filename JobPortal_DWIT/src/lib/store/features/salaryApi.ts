import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const salaryApi = createApi({
  reducerPath: "salaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Salaries"],
  endpoints: (builder) => ({
    getAllSalaries: builder.query({
      query: () => "/salaries",
      providesTags: ["Salaries"],
    }),
    getSingleSalaryDetails: builder.query({
      query: (salaryId) => `/salaries/${salaryId}`,
      providesTags: ["Salaries"],
    }),
    createSalary: builder.mutation({
      query: (salaryDetailsWithCreatorId) => ({
        url: "/salaries",
        method: "POST",
        body: salaryDetailsWithCreatorId,
      }),
      invalidatesTags: ["Salaries"],
    }),
    updateSalary: builder.mutation({
      query: ({ salaryId, salaryDetailsWithCreatorId }) => ({
        url: `/salaries/${salaryId}`,
        method: "PUT",
        body: salaryDetailsWithCreatorId,
      }),
      invalidatesTags: ["Salaries"],
    }),
    deleteSalary: builder.mutation({
      query: (salaryId) => ({
        url: `/salaries/${salaryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Salaries"],
    }),
  }),
});
export const {
  useGetAllSalariesQuery,
  useGetSingleSalaryDetailsQuery,
  useCreateSalaryMutation,
  useUpdateSalaryMutation,
  useDeleteSalaryMutation,
} = salaryApi;
