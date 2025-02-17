import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authenticationApi = createApi({
  reducerPath: "authenticationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    employeeAuthThroughGoogle: builder.mutation({
      query: (userFormData) => ({
        url: "/google",
        method: "POST",
        body: userFormData,
      }),
    }),
    userRegister: builder.mutation({
      query: (userFormData) => ({
        url: "/register",
        method: "POST",
        body: userFormData,
      }),
    }),
    companyRegister: builder.mutation({
      query: (userFormData) => ({
        url: "/register/company",
        method: "POST",
        body: userFormData,
      }),
    }),
    userLogin: builder.mutation({
      query: (userFormData) => ({
        url: "/login",
        method: "POST",
        body: userFormData,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: email,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ passwords, token }) => ({
        url: `/reset-password/${token}`,
        method: "PUT",
        body: passwords,
      }),
    }),
    updatePassword: builder.mutation({
      query: (passwords) => ({
        url: "/update-password",
        method: "PUT",
        body: passwords,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ data, _id }) => ({
        url: `/verify-otp/${_id}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useEmployeeAuthThroughGoogleMutation,
  useUserRegisterMutation,
  useCompanyRegisterMutation,
  useUserLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useVerifyOtpMutation,
} = authenticationApi;
