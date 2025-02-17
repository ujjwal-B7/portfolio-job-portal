import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const technologyApi = createApi({
  reducerPath: "technologyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Technologies"],
  endpoints: (builder) => ({
    getAllTechnologies: builder.query({
      query: () => "/technologies",
      providesTags: ["Technologies"],
    }),
    getSingleTechnologyDetails: builder.query({
      query: (technologyId) => `/technologies/${technologyId}`,
      providesTags: ["Technologies"],
    }),
    createTechnology: builder.mutation({
      query: (technologyDetailsWithCreatorId) => ({
        url: "/technologies",
        method: "POST",
        body: technologyDetailsWithCreatorId,
      }),
      invalidatesTags: ["Technologies"],
    }),
    updateTechnology: builder.mutation({
      query: ({ technologyId, technologyDetailsWithCreatorId }) => ({
        url: `/technologies/${technologyId}`,
        method: "PUT",
        body: technologyDetailsWithCreatorId,
      }),
      invalidatesTags: ["Technologies"],
    }),
    deleteTechnology: builder.mutation({
      query: (technologyId) => ({
        url: `/technologies/${technologyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Technologies"],
    }),
  }),
});
export const {
  useGetAllTechnologiesQuery,
  useGetSingleTechnologyDetailsQuery,
  useCreateTechnologyMutation,
  useUpdateTechnologyMutation,
  useDeleteTechnologyMutation,
} = technologyApi;
