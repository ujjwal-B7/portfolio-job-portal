"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface AuthenticatedState {
  loggedInUserId: string | null;
  name: string | null;
  email: string | null;
  contact_number: string | null;
  address: string | null;
  role: string | null;
  loggedInUserToken: string | null;
  // companyActiveStatus?: string | null;
}

const initialState: AuthenticatedState = {
  loggedInUserId: null,
  name: null,
  email: null,
  contact_number: null,
  address: null,
  role: null,
  loggedInUserToken: null,
  // companyActiveStatus: null,
};

export const authenticatedSlice = createSlice({
  name: "authenticated",
  initialState,
  reducers: {
    setLoggedInUserId: (state, action) => {
      state.loggedInUserId = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setContactNumber: (state, action) => {
      state.contact_number = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;

      // Reset companyActiveStatus when the role changes
      // if (action.payload !== "company") {
      //   state.companyActiveStatus = undefined;
      // }
    },
    setLoggedInUserToken: (state, action) => {
      state.loggedInUserToken = action.payload;
    },
    // setCompanyActiveStatus: (state, action) => {
    //   if (state.role === "company") state.companyActiveStatus = action.payload;
    // },

    //logout
    logout: () => initialState,
  },
});

export const {
  setLoggedInUserId,
  setName,
  setEmail,
  setAddress,
  setContactNumber,
  setRole,
  setLoggedInUserToken,
  // setCompanyActiveStatus,
  logout,
} = authenticatedSlice.actions;

export default authenticatedSlice.reducer;
