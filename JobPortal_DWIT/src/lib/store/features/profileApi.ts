import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getSingleProfileDetailsByProfileId: builder.query({
      query: (profileId) => `/profile/${profileId}`,
      providesTags: ["Profile"],
    }),
    getSingleProfileDetailsByCreatorId: builder.query({
      query: (profileId) => `/profile/creator/${profileId}`,
      providesTags: ["Profile"],
    }),
    createProfile: builder.mutation({
      query: (formData: FormData) => ({
        url: "/profile",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    createProfileByUsers: builder.mutation({
      query: (formData: FormData) => ({
        url: "/profile/users",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateProfileByUsers: builder.mutation({
      query: ({ formData, profileId }) => ({
        url: `/profile/users/${profileId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: ({ formData, profileId }) => ({
        url: `/profile/${profileId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});
export const {
  useGetSingleProfileDetailsByProfileIdQuery,
  useGetSingleProfileDetailsByCreatorIdQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useCreateProfileByUsersMutation,
  useUpdateProfileByUsersMutation,
} = profileApi;
