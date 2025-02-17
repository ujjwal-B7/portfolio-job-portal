import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Roles"],
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: () => "/roles",
      providesTags: ["Roles"],
    }),
    getSingleRoleDetails: builder.query({
      query: (roleId) => `/roles/${roleId}`,
      providesTags: ["Roles"],
    }),
    createRole: builder.mutation({
      query: (roleDetailsWithCreatorId) => ({
        url: "/roles",
        method: "POST",
        body: roleDetailsWithCreatorId,
      }),
      invalidatesTags: ["Roles"],
    }),
    updateRole: builder.mutation({
      query: ({ roleId, roleDetailsWithCreatorId }) => ({
        url: `/roles/${roleId}`,
        method: "PUT",
        body: roleDetailsWithCreatorId,
      }),
      invalidatesTags: ["Roles"],
    }),
    deleteRole: builder.mutation({
      query: (roleId) => ({
        url: `/roles/${roleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});
export const {
  useGetAllRolesQuery,
  useGetSingleRoleDetailsQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
