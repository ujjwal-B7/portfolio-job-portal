import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const titleApi = createApi({
  reducerPath: "titleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Titles"],
  endpoints: (builder) => ({
    getAllTitles: builder.query({
      query: () => "/titles",
      providesTags: ["Titles"],
    }),
    getSingleTitleDetails: builder.query({
      query: (titleId) => `/titles/${titleId}`,
      providesTags: ["Titles"],
    }),
    createTitle: builder.mutation({
      query: (titleDetailsWithCreatorId) => ({
        url: "/titles",
        method: "POST",
        body: titleDetailsWithCreatorId,
      }),
      invalidatesTags: ["Titles"],
    }),
    updateTitle: builder.mutation({
      query: ({ titleId, titleDetailsWithCreatorId }) => ({
        url: `/titles/${titleId}`,
        method: "PUT",
        body: titleDetailsWithCreatorId,
      }),
      invalidatesTags: ["Titles"],
    }),
    deleteTitle: builder.mutation({
      query: (titleId) => ({
        url: `/titles/${titleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Titles"],
    }),
  }),
});
export const {
  useGetAllTitlesQuery,
  useGetSingleTitleDetailsQuery,
  useCreateTitleMutation,
  useUpdateTitleMutation,
  useDeleteTitleMutation,
} = titleApi;
