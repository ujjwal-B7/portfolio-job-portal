import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const typeApi = createApi({
  reducerPath: "typeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Types"],
  endpoints: (builder) => ({
    getAllTypes: builder.query({
      query: () => "/types",
      providesTags: ["Types"],
    }),
    getSingleTypeDetails: builder.query({
      query: (typeId) => `/types/${typeId}`,
      providesTags: ["Types"],
    }),
    createType: builder.mutation({
      query: (typeDetailsWithCreatorId) => ({
        url: "/types",
        method: "POST",
        body: typeDetailsWithCreatorId,
      }),
      invalidatesTags: ["Types"],
    }),
    updateType: builder.mutation({
      query: ({ typeId, typeDetailsWithCreatorId }) => ({
        url: `/types/${typeId}`,
        method: "PUT",
        body: typeDetailsWithCreatorId,
      }),
      invalidatesTags: ["Types"],
    }),
    deleteType: builder.mutation({
      query: (typeId) => ({
        url: `/types/${typeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Types"],
    }),
  }),
});
export const {
  useGetAllTypesQuery,
  useGetSingleTypeDetailsQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
} = typeApi;
