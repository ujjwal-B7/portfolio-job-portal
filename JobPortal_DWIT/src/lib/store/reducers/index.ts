import { combineReducers } from "@reduxjs/toolkit";

import authenticatedReducer from "@/lib/store/slice/authenticatedSlice";

import { authenticationApi } from "../features/authenticationApi";

//api's
import { jobsApi } from "../features/jobsApi";
import { titleApi } from "../features/titleApi";
import { companyApi } from "../features/companyApi";
import { domainApi } from "../features/domainApi";
import { technologyApi } from "../features/technologyApi";
import { roleApi } from "../features/roleApi";
import { salaryApi } from "../features/salaryApi";
import { typeApi } from "../features/typeApi";
import { profileApi } from "../features/profileApi";
import { registeredCompaniesApi } from "../features/registeredCompaniesApi";
import { jobApplicationApi } from "../features/jobApplicationApi";
import { applicantApi } from "../features/applicantApi";
import { openToWorkApi } from "../features/openToWorkApi";

export const rootReducer = combineReducers({
  //reducer to keep the state
  authenticated: authenticatedReducer,

  //authentication api's
  [authenticationApi.reducerPath]: authenticationApi.reducer,

  //other api's
  [jobsApi.reducerPath]: jobsApi.reducer,
  [titleApi.reducerPath]: titleApi.reducer,
  [companyApi.reducerPath]: companyApi.reducer,
  [domainApi.reducerPath]: domainApi.reducer,
  [technologyApi.reducerPath]: technologyApi.reducer,
  [roleApi.reducerPath]: roleApi.reducer,
  [salaryApi.reducerPath]: salaryApi.reducer,
  [typeApi.reducerPath]: typeApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [registeredCompaniesApi.reducerPath]: registeredCompaniesApi.reducer,
  [jobApplicationApi.reducerPath]: jobApplicationApi.reducer,
  [applicantApi.reducerPath]: applicantApi.reducer,
  [openToWorkApi.reducerPath]: openToWorkApi.reducer,
});
